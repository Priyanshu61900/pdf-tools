from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

import os
import uuid
import tempfile
import shutil
import fitz
import re

app = FastAPI()

# =========================
# CONFIG
# =========================

BASE_URL = "https://pdf-tools-backend-rvzt.onrender.com"

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# FILE SIZE LIMIT
# =========================

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):

    content_length = request.headers.get("content-length")

    if content_length and int(content_length) > MAX_FILE_SIZE:
        return JSONResponse(
            status_code=413,
            content={
                "success": False,
                "error": "File too large. Max 20MB allowed."
            }
        )

    return await call_next(request)


# =========================
# NORMALIZER
# =========================

def normalize(text: str):
    return re.sub(r"\s+", "", text.lower())


def fuzzy_match(page_text: str, search_text: str):

    page_norm = normalize(page_text)

    terms = search_text.lower().split()

    return all(term in page_norm for term in terms)


# =========================
# HEALTH CHECK
# =========================

@app.get("/")
def home():
    return {
        "status": "running"
    }


# =========================
# SEARCH + HIGHLIGHT
# =========================

@app.post("/api/search-highlight")
async def search_highlight(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
):

    temp_dir = tempfile.mkdtemp()

    pdf = None

    try:

        # =========================
        # VALIDATION
        # =========================

        if not file.filename:
            return {
                "success": False,
                "error": "No file uploaded"
            }

        if not file.filename.lower().endswith(".pdf"):
            return {
                "success": False,
                "error": "Only PDF files are allowed"
            }

        # =========================
        # SAVE TEMP FILE
        # =========================

        safe_filename = file.filename.replace("/", "_").replace("\\", "_")

        input_path = os.path.join(temp_dir, safe_filename)

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # =========================
        # OPEN PDF
        # =========================

        pdf = fitz.open(input_path)

        # =========================
        # COLORS
        # =========================

        color_map = {
            "yellow": (1, 1, 0),
            "red": (1, 0, 0),
            "green": (0, 1, 0),
            "blue": (0, 0, 1),
            "pink": (1, 0.4, 0.7),
            "orange": (1, 0.5, 0),
        }

        color = color_map.get(
            highlight_color.lower(),
            (1, 1, 0)
        )

        search_terms = search_text.lower().split()

        total_matches = 0

        # =========================
        # PROCESS PAGES
        # =========================

        for page_number in range(len(pdf)):

            page = pdf[page_number]

            try:

                page_text = page.get_text()

                if not page_text.strip():
                    continue

                # fuzzy filter
                if search_text.strip():

                    if not fuzzy_match(page_text, search_text):
                        continue

                matches = []

                # =========================
                # FULL PHRASE SEARCH
                # =========================

                if search_text.strip():
                    matches = page.search_for(search_text)

                # =========================
                # FALLBACK WORD SEARCH
                # =========================

                if not matches:

                    for term in search_terms:

                        try:
                            word_matches = page.search_for(term)

                            if word_matches:
                                matches.extend(word_matches)

                        except Exception as e:
                            print(f"Word search error: {e}")

                # =========================
                # HIGHLIGHT
                # =========================

                for rect in matches:

                    try:

                        annot = page.add_highlight_annot(rect)

                        annot.set_colors(stroke=color)

                        annot.set_opacity(0.5)

                        annot.update()

                        total_matches += 1

                    except Exception as e:
                        print(f"Highlight error: {e}")

            except Exception as e:
                print(f"Page processing error on page {page_number}: {e}")

        # =========================
        # SAVE OUTPUT
        # =========================

        file_id = str(uuid.uuid4())

        output_path = os.path.join(
            OUTPUT_DIR,
            f"{file_id}.pdf"
        )

        # safer save for Render
        pdf.save(output_path)

        pdf.close()

        pdf = None

        # =========================
        # RESPONSE
        # =========================

        return {
            "success": True,
            "matches_found": total_matches,
            "download_url": f"{BASE_URL}/download/{file_id}"
        }

    except Exception as e:

        print("MAIN ERROR:", str(e))

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        try:
            if pdf:
                pdf.close()
        except:
            pass

        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass


# =========================
# DOWNLOAD PDF
# =========================

@app.get("/download/{file_id}")
def download(file_id: str):

    try:

        path = os.path.join(
            OUTPUT_DIR,
            f"{file_id}.pdf"
        )

        if not os.path.exists(path):

            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "error": "File not found"
                }
            )

        return FileResponse(
            path=path,
            media_type="application/pdf",
            filename="highlighted.pdf"
        )

    except Exception as e:

        print("DOWNLOAD ERROR:", str(e))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


# =========================
# START SERVER
# =========================

# Run locally:
# uvicorn main:app --reload --host 0.0.0.0 --port 8000