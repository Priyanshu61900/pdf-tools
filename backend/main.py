import os
import uuid
import shutil
import tempfile

import fitz
from fastapi import FastAPI, UploadFile, File, Form
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

                        matches.extend(
                            page.search_for(term)
                        )

            # ---------------------------------------------
            # HIGHLIGHT
            # ---------------------------------------------

            for rect in matches:

                found_on_page = True

                annot = page.add_highlight_annot(rect)

                annot.set_colors(
                    stroke=selected_color
                )

                annot.set_opacity(0.5)

                annot.update()

            # ---------------------------------------------
            # SAVE MATCHED PAGE NUMBER
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
        # CREATE MATCHED PAGES PDF
        # =================================================

        saved_pdf = fitz.open(full_pdf_path)

        matched_pdf = fitz.open()

        # ONLY INSERT MATCHED PAGES
        for page_num in matched_pages:

            matched_pdf.insert_pdf(
                saved_pdf,
                from_page=page_num,
                to_page=page_num
            )

        # IF NOTHING FOUND
        if len(matched_pages) == 0:

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