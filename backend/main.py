import os
import uuid
import shutil
import tempfile
import hashlib
import re
import time
from typing import Optional

import fitz
from fastapi import Depends, FastAPI, Header, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# =====================================================
# APP
# =====================================================

app = FastAPI()

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# OUTPUT FOLDER
# =====================================================

OUTPUT_DIR = "outputs"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# =====================================================
# BASE URL
# =====================================================

BASE_URL = "https://pdf-tools-backend-rvzt.onrender.com"
FREE_PAGE_LIMIT = 5
RECENT_FREE_WINDOW_SECONDS = 60 * 60 * 24
RECENT_FREE_DOCUMENTS = {}

# =====================================================
# PAID API KEYS
# =====================================================

def get_configured_api_keys():
    return {
        key.strip()
        for key in os.getenv("PDF_TOOLS_API_KEYS", "").split(",")
        if key.strip()
    }

def extract_api_key(
    authorization: Optional[str] = None,
    x_api_key: Optional[str] = None,
):
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()

    return x_api_key

def is_trusted_app_request(x_app_secret: Optional[str] = None):
    configured_secret = os.getenv("PDF_TOOLS_APP_SECRET")

    if not configured_secret:
        return True

    return bool(x_app_secret and x_app_secret == configured_secret)

def normalize_search_text(value: str):
    return re.sub(r"\s+", " ", value.strip().lower())

def page_contains_all_terms(page_text: str, search_text: str):
    normalized_page_text = normalize_search_text(page_text)
    normalized_search_text = normalize_search_text(search_text)

    if not normalized_search_text:
        return False

    if normalized_search_text in normalized_page_text:
        return True

    return all(
        term in normalized_page_text
        for term in normalized_search_text.split()
    )

def is_premium_request(
    user_plan: Optional[str] = None,
    authorization: Optional[str] = None,
    x_api_key: Optional[str] = None,
    x_app_secret: Optional[str] = None,
):
    if (
        user_plan
        and user_plan.lower() in {"pro", "api", "premium"}
        and is_trusted_app_request(x_app_secret)
    ):
        return True

    configured_keys = get_configured_api_keys()
    provided_key = extract_api_key(authorization, x_api_key)

    return bool(provided_key and provided_key in configured_keys)

def hash_value(value: str):
    return hashlib.sha256(value.encode("utf-8", errors="ignore")).hexdigest()

def normalize_text(value: str):
    return re.sub(r"\s+", " ", value.lower()).strip()

def normalize_filename(filename: Optional[str]):
    if not filename:
        return ""

    name = os.path.splitext(os.path.basename(filename))[0].lower()
    name = re.sub(r"(highlighted|matched|pages?|part|chunk|split|copy|final)", "", name)
    name = re.sub(r"[^a-z0-9]+", " ", name)
    name = re.sub(r"\b\d+\b", "", name)

    return normalize_text(name)

def file_hash(path: str):
    digest = hashlib.sha256()

    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)

    return digest.hexdigest()

def build_pdf_fingerprint(pdf, input_path: str, filename: Optional[str]):
    metadata = pdf.metadata or {}
    metadata_text = normalize_text(
        " ".join(
            str(metadata.get(key) or "")
            for key in [
                "title",
                "author",
                "subject",
                "keywords",
                "creator",
                "producer",
            ]
        )
    )
    filename_text = normalize_filename(filename)
    page_hashes = set()
    token_features = set()

    for page in pdf:
        page_text = normalize_text(page.get_text("text"))

        if len(page_text) > 30:
            page_hashes.add(hash_value(page_text[:4000]))

        tokens = re.findall(r"[a-z0-9]{5,}", page_text)
        token_features.update(tokens[:250])

    family_parts = [
        part
        for part in [filename_text, metadata_text]
        if len(part) >= 6
    ]

    return {
        "file_hash": file_hash(input_path),
        "family_key": hash_value("|".join(family_parts)) if family_parts else "",
        "metadata_key": hash_value(metadata_text) if len(metadata_text) >= 10 else "",
        "filename_key": hash_value(filename_text) if len(filename_text) >= 8 else "",
        "page_hashes": page_hashes,
        "token_features": set(sorted(token_features)[:200]),
    }

def cleanup_recent_documents(now: float):
    for user_id in list(RECENT_FREE_DOCUMENTS.keys()):
        RECENT_FREE_DOCUMENTS[user_id] = [
            record
            for record in RECENT_FREE_DOCUMENTS[user_id]
            if now - record["created_at"] <= RECENT_FREE_WINDOW_SECONDS
        ]

        if not RECENT_FREE_DOCUMENTS[user_id]:
            del RECENT_FREE_DOCUMENTS[user_id]

def recent_pdf_repeat_reason(user_id: Optional[str], fingerprint):
    if not user_id:
        return None

    now = time.time()
    cleanup_recent_documents(now)

    for record in RECENT_FREE_DOCUMENTS.get(user_id, []):
        if record["file_hash"] == fingerprint["file_hash"]:
            return "exact"

        if fingerprint["family_key"] and record["family_key"] == fingerprint["family_key"]:
            return "same-family"

        if fingerprint["metadata_key"] and record["metadata_key"] == fingerprint["metadata_key"]:
            return "same-metadata"

        if fingerprint["filename_key"] and record["filename_key"] == fingerprint["filename_key"]:
            return "same-filename"

        if fingerprint["page_hashes"] & record["page_hashes"]:
            return "same-page"

        shared_tokens = fingerprint["token_features"] & record["token_features"]
        smallest_feature_set = min(
            len(fingerprint["token_features"]),
            len(record["token_features"])
        )

        if smallest_feature_set >= 25 and len(shared_tokens) / smallest_feature_set >= 0.45:
            return "similar-text"

    return None

def remember_free_pdf(user_id: Optional[str], fingerprint):
    if not user_id or not fingerprint:
        return

    now = time.time()
    cleanup_recent_documents(now)
    RECENT_FREE_DOCUMENTS.setdefault(user_id, []).append({
        "created_at": now,
        **fingerprint,
    })

def free_access_error(
    pdf,
    input_path: str,
    filename: Optional[str],
    page_count: int,
    user_id: Optional[str],
    user_plan: Optional[str],
    authorization: Optional[str],
    x_api_key: Optional[str],
    x_app_secret: Optional[str],
):
    if is_premium_request(user_plan, authorization, x_api_key, x_app_secret):
        return None, None

    if not is_trusted_app_request(x_app_secret):
        return {
            "success": False,
            "code": "SIGNUP_REQUIRED",
            "error": "Please sign up or log in to use this PDF tool.",
        }, None

    if page_count > FREE_PAGE_LIMIT:
        return {
            "success": False,
            "code": "UPGRADE_REQUIRED",
            "error": (
                "Free plan supports PDFs up to "
                f"{FREE_PAGE_LIMIT} pages. Upgrade to Premium for larger files."
            ),
            "page_count": page_count,
            "free_page_limit": FREE_PAGE_LIMIT,
        }, None

    fingerprint = build_pdf_fingerprint(pdf, input_path, filename)
    repeat_reason = recent_pdf_repeat_reason(user_id, fingerprint)

    if repeat_reason:
        return {
            "success": False,
            "code": "REPEAT_DOCUMENT",
            "error": (
                "This PDF was recently highlighted or appears to be part of "
                "the same document. Free accounts cannot process the same PDF "
                "in 5-page chunks. Upgrade to Premium for Rs. 99 to process "
                "larger PDFs."
            ),
            "reason": repeat_reason,
            "free_page_limit": FREE_PAGE_LIMIT,
        }, None

    return None, fingerprint

def verify_api_key(
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
):
    configured_keys = get_configured_api_keys()

    if not configured_keys:
        raise HTTPException(
            status_code=503,
            detail="Paid API access is not configured yet"
        )

    provided_key = extract_api_key(authorization, x_api_key)

    if not provided_key or provided_key not in configured_keys:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key"
        )

    return provided_key

# =====================================================
# HOME
# =====================================================

@app.get("/")
async def home():
    return {
        "success": True,
        "message": "PDF Highlight API Running"
    }

# =====================================================
# SEARCH + HIGHLIGHT PDF
# =====================================================

@app.post("/api/search-highlight")
async def search_highlight(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
    x_user_plan: Optional[str] = Header(default=None),
    x_user_id: Optional[str] = Header(default=None),
    x_app_secret: Optional[str] = Header(default=None),
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
):

    temp_dir = tempfile.mkdtemp()

    try:

        # -------------------------------------------------
        # SAVE INPUT PDF
        # -------------------------------------------------

        input_path = os.path.join(
            temp_dir,
            "input.pdf"
        )

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # -------------------------------------------------
        # OPEN PDF
        # -------------------------------------------------

        pdf = fitz.open(input_path)
        page_count = len(pdf)
        access_error, fingerprint = free_access_error(
            pdf,
            input_path,
            file.filename,
            page_count,
            x_user_id,
            x_user_plan,
            authorization,
            x_api_key,
            x_app_secret
        )

        if access_error:
            pdf.close()
            return access_error

        # -------------------------------------------------
        # COLORS
        # -------------------------------------------------

        color_map = {
            "yellow": (1, 1, 0),
            "red": (1, 0, 0),
            "green": (0, 1, 0),
            "blue": (0, 0, 1),
            "pink": (1, 0.4, 0.7),
            "orange": (1, 0.5, 0),
        }

        selected_color = color_map.get(
            highlight_color.lower(),
            (1, 1, 0)
        )

        output_id = str(uuid.uuid4())

        matched_pages = []

        # =================================================
        # PROCESS PDF
        # =================================================

        for page_num in range(len(pdf)):

            page = pdf[page_num]

            found_on_page = False

            # ---------------------------------------------
            # DIRECT SEARCH
            # ---------------------------------------------

            matches = page.search_for(search_text)

            # ---------------------------------------------
            # FALLBACK PARTIAL SEARCH
            # ---------------------------------------------

            if not matches:

                page_text = page.get_text("text")

                terms = normalize_search_text(search_text).split()

                if page_contains_all_terms(page_text, search_text):

                    for term in terms:

                        term_matches = page.search_for(term)

                        if term_matches:
                            matches.extend(term_matches)

            # ---------------------------------------------
            # HIGHLIGHT MATCHES
            # ---------------------------------------------

            if matches:

                found_on_page = True

                for rect in matches:

                    annot = page.add_highlight_annot(rect)

                    annot.set_colors(
                        stroke=selected_color
                    )

                    annot.set_opacity(0.5)

                    annot.update()

            # ---------------------------------------------
            # STORE MATCHED PAGE
            # ---------------------------------------------

            if found_on_page:

                matched_pages.append(page_num)

        # =================================================
        # SAVE FULL PDF
        # =================================================

        full_pdf_path = os.path.join(
            OUTPUT_DIR,
            f"full-{output_id}.pdf"
        )

        pdf.save(
            full_pdf_path,
            garbage=4,
            deflate=True,
            clean=True
        )

        pdf.close()

        # =================================================
        # OPEN SAVED PDF
        # =================================================

        saved_pdf = fitz.open(full_pdf_path)

        # =================================================
        # CREATE MATCHED PAGES PDF
        # =================================================

        matched_pdf = fitz.open()

        # IMPORTANT FIX:
        # insert pages from SAVED PDF
        # not original closed pdf

        if matched_pages:

            for page_num in matched_pages:

                matched_pdf.insert_pdf(
                    saved_pdf,
                    from_page=page_num,
                    to_page=page_num
                )

        else:

            saved_pdf.close()
            matched_pdf.close()

            return {
                "success": False,
                "code": "no_matches",
                "error": (
                    "No pages contained that text. Check the spelling or try a "
                    "shorter keyword. Scanned PDFs need OCR before text can be found."
                )
            }

        matched_pdf_path = os.path.join(
            OUTPUT_DIR,
            f"matched-{output_id}.pdf"
        )

        matched_pdf.save(
            matched_pdf_path,
            garbage=4,
            deflate=True,
            clean=True
        )

        matched_pdf.close()

        saved_pdf.close()

        remember_free_pdf(
            x_user_id,
            fingerprint
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {
            "success": True,
            "full_pdf_url": f"{BASE_URL}/download-full-pdf/{output_id}",
            "matched_pdf_url": f"{BASE_URL}/download-matched-pdf/{output_id}"
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        shutil.rmtree(
            temp_dir,
            ignore_errors=True
        )

# =====================================================
# PDF TO WORD
# =====================================================

@app.post("/api/pdf-to-word")
async def pdf_to_word(
    file: UploadFile = File(...),
    x_user_plan: Optional[str] = Header(default=None),
    x_user_id: Optional[str] = Header(default=None),
    x_app_secret: Optional[str] = Header(default=None),
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
):
    temp_dir = tempfile.mkdtemp()

    try:
        input_path = os.path.join(temp_dir, "input.pdf")

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        pdf = fitz.open(input_path)
        page_count = len(pdf)
        access_error, fingerprint = free_access_error(
            pdf,
            input_path,
            file.filename,
            page_count,
            x_user_id,
            x_user_plan,
            authorization,
            x_api_key,
            x_app_secret
        )
        pdf.close()

        if access_error:
            return access_error

        output_id = str(uuid.uuid4())
        docx_path = os.path.join(
            OUTPUT_DIR,
            f"word-{output_id}.docx"
        )

        from pdf2docx import Converter

        converter = Converter(input_path)
        converter.convert(docx_path)
        converter.close()

        remember_free_pdf(
            x_user_id,
            fingerprint
        )

        return {
            "success": True,
            "download_url": f"{BASE_URL}/download-word/{output_id}",
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

    finally:
        shutil.rmtree(
            temp_dir,
            ignore_errors=True
        )

# =====================================================
# PAID DEVELOPER API ENDPOINTS
# =====================================================

@app.post("/api/v1/search")
async def api_search_pdf(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
    api_key: str = Depends(verify_api_key),
):
    return await search_highlight(
        file=file,
        search_text=search_text,
        highlight_color=highlight_color,
        x_user_plan="API",
        x_api_key=api_key
    )

@app.post("/api/v1/highlight")
async def api_highlight_pdf(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
    api_key: str = Depends(verify_api_key),
):
    return await search_highlight(
        file=file,
        search_text=search_text,
        highlight_color=highlight_color,
        x_user_plan="API",
        x_api_key=api_key
    )

@app.post("/api/v1/extract-matching-pages")
async def api_extract_matching_pages(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
    api_key: str = Depends(verify_api_key),
):
    return await search_highlight(
        file=file,
        search_text=search_text,
        highlight_color=highlight_color,
        x_user_plan="API",
        x_api_key=api_key
    )

# =====================================================
# DOWNLOAD FULL PDF
# =====================================================

@app.get("/download-full-pdf/{file_id}")
async def download_full_pdf(file_id: str):

    file_path = os.path.join(
        OUTPUT_DIR,
        f"full-{file_id}.pdf"
    )

    if not os.path.exists(file_path):

        return {
            "success": False,
            "error": "File not found"
        }

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="highlighted.pdf"
    )

# =====================================================
# DOWNLOAD MATCHED PDF
# =====================================================

@app.get("/download-matched-pdf/{file_id}")
async def download_matched_pdf(file_id: str):

    file_path = os.path.join(
        OUTPUT_DIR,
        f"matched-{file_id}.pdf"
    )

    if not os.path.exists(file_path):

        return {
            "success": False,
            "error": "File not found"
        }

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="matched-pages.pdf"
    )

# =====================================================
# DOWNLOAD WORD
# =====================================================

@app.get("/download-word/{file_id}")
async def download_word(file_id: str):

    file_path = os.path.join(
        OUTPUT_DIR,
        f"word-{file_id}.docx"
    )

    if not os.path.exists(file_path):

        return {
            "success": False,
            "error": "File not found"
        }

    return FileResponse(
        file_path,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        ),
        filename="converted.docx"
    )
