import os
import uuid
import shutil
import tempfile
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

# =====================================================
# PAID API KEYS
# =====================================================

def verify_api_key(
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
):
    configured_keys = {
        key.strip()
        for key in os.getenv("PDF_TOOLS_API_KEYS", "").split(",")
        if key.strip()
    }

    if not configured_keys:
        raise HTTPException(
            status_code=503,
            detail="Paid API access is not configured yet"
        )

    provided_key = x_api_key

    if authorization and authorization.lower().startswith("bearer "):
        provided_key = authorization[7:].strip()

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

                page_text = page.get_text("text").lower()

                terms = search_text.lower().split()

                if all(term in page_text for term in terms):

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

            # empty pdf page if no match
            matched_pdf.new_page()

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
        highlight_color=highlight_color
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
        highlight_color=highlight_color
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
        highlight_color=highlight_color
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
