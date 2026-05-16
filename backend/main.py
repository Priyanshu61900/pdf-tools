from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import os
import uuid
import tempfile
import shutil
import fitz
import re

app = FastAPI()

BASE_URL = "https://pdf-tools-backend-rvzt.onrender.com"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


# =========================
# NORMALIZER (FUZZY CORE)
# =========================
def normalize(text: str):
    return re.sub(r"\s+", "", text.lower())


def fuzzy_match(page_text, search_text):
    """
    returns True if:
    - all words exist (partial match)
    - ignores spaces + case
    """
    page_norm = normalize(page_text)
    terms = search_text.lower().split()

    return all(t in page_norm for t in terms)


# =========================
# SEARCH + HIGHLIGHT
# =========================
@app.post("/api/search-highlight")
async def search_highlight(
    file: UploadFile = File(...),
    search_text: str = "",
    highlight_color: str = "yellow",
):

    temp_dir = tempfile.mkdtemp()

    try:
        input_path = os.path.join(temp_dir, file.filename)

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        pdf = fitz.open(input_path)

        color_map = {
            "yellow": (1, 1, 0),
            "red": (1, 0, 0),
            "green": (0, 1, 0),
            "blue": (0, 0, 1),
            "pink": (1, 0.4, 0.7),
            "orange": (1, 0.5, 0),
        }

        color = color_map.get(highlight_color.lower(), (1, 1, 0))

        search_terms = search_text.lower().split()

        for page in pdf:

            page_text = page.get_text("text")

            if not page_text.strip():
                continue

            # 🔥 FUZZY FILTER (case + spacing + partial multi-word)
            if search_text.strip() and not fuzzy_match(page_text, search_text):
                continue

            words = []

            # 1. full phrase search
            if search_text.strip():
                words = page.search_for(search_text)

            # 2. fallback word-level search
            if not words:
                for t in search_terms:
                    words.extend(page.search_for(t))

            # 3. highlight
            for inst in words:
                annot = page.add_highlight_annot(inst)
                annot.set_colors(stroke=color)
                annot.set_opacity(0.5)
                annot.update()

        file_id = str(uuid.uuid4())
        output_path = os.path.join(OUTPUT_DIR, f"{file_id}.pdf")

        pdf.save(output_path, garbage=4, deflate=True, clean=True)
        pdf.close()

        return {
            "success": True,
            "download_url": f"{BASE_URL}/download/{file_id}"
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


# =========================
# DOWNLOAD (100% RELIABLE)
# =========================
@app.get("/download/{file_id}")
def download(file_id: str):

    path = os.path.join(OUTPUT_DIR, f"{file_id}.pdf")

    if not os.path.exists(path):
        return {"error": "file not ready"}

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="highlighted.pdf"
    )