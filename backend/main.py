from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import os
import uuid
import tempfile
import shutil
import threading

import fitz
from docx import Document

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


@app.get("/")
def home():
    return {"status": "Backend running"}


# ==============================
# BACKGROUND WORKER
# ==============================
def process_pdf_job(input_path, search_text, highlight_color, output_id):

    try:
        pdf = fitz.open(input_path)

        color_map = {
            "yellow": (1, 1, 0),
            "red": (1, 0, 0),
            "green": (0, 1, 0),
            "blue": (0, 0, 1),
            "pink": (1, 0.4, 0.7),
            "orange": (1, 0.5, 0),
        }

        selected_color = color_map.get(highlight_color.lower(), (1, 1, 0))

        matched_pages = []

        for page_num in range(len(pdf)):
            page = pdf[page_num]

            if search_text.strip():
                matches = page.search_for(search_text)

                if matches:
                    matched_pages.append(page_num)

                for inst in matches:
                    highlight = page.add_highlight_annot(inst)
                    highlight.set_colors({"stroke": selected_color})
                    highlight.set_opacity(0.5)
                    highlight.update()

        # FULL PDF
        full_pdf_path = os.path.join(OUTPUT_DIR, f"full-{output_id}.pdf")
        pdf.save(full_pdf_path)

        # MATCHED PDF
        matched_pdf = fitz.open()

        if matched_pages:
            for p in matched_pages:
                matched_pdf.insert_pdf(pdf, from_page=p, to_page=p)
        else:
            matched_pdf.new_page()

        matched_pdf_path = os.path.join(OUTPUT_DIR, f"matched-{output_id}.pdf")
        matched_pdf.save(matched_pdf_path)

        matched_pdf.close()
        pdf.close()

    except Exception as e:
        print("BACKGROUND ERROR:", e)


# ==============================
# SEARCH + HIGHLIGHT (FIXED)
# ==============================
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

        output_id = str(uuid.uuid4())

        # RUN IN BACKGROUND (THIS FIXES HANG)
        thread = threading.Thread(
            target=process_pdf_job,
            args=(input_path, search_text, highlight_color, output_id),
        )
        thread.start()

        return {
            "success": True,
            "status": "processing",
            "full_pdf_url": f"{BASE_URL}/download-full-pdf/{output_id}",
            "matched_pdf_url": f"{BASE_URL}/download-matched-pdf/{output_id}"
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


# ==============================
# PDF TO WORD (FIXED)
# ==============================
@app.post("/api/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):

    temp_dir = tempfile.mkdtemp()

    try:
        input_path = os.path.join(temp_dir, file.filename)

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        pdf = fitz.open(input_path)

        text = ""
        for page in pdf:
            text += page.get_text("text") + "\n"

        pdf.close()

        output_id = str(uuid.uuid4())
        output_path = os.path.join(OUTPUT_DIR, f"converted-{output_id}.docx")

        word = Document()
        word.add_heading("Converted PDF", level=1)

        if text.strip():
            for line in text.split("\n"):
                line = line.strip()
                if line:
                    word.add_paragraph(line)
        else:
            word.add_paragraph("No extractable text found")

        word.save(output_path)

        return {
            "success": True,
            "download_url": f"{BASE_URL}/download-docx/{output_id}"
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


# ==============================
# DOWNLOADS (UNCHANGED BUT SAFE)
# ==============================
@app.get("/download-full-pdf/{file_id}")
def download_full_pdf(file_id: str):

    path = os.path.join(OUTPUT_DIR, f"full-{file_id}.pdf")

    if not os.path.exists(path):
        return {"error": "File not found"}

    return FileResponse(path, media_type="application/pdf", filename="highlighted-full.pdf")


@app.get("/download-matched-pdf/{file_id}")
def download_matched_pdf(file_id: str):

    path = os.path.join(OUTPUT_DIR, f"matched-{file_id}.pdf")

    if not os.path.exists(path):
        return {"error": "File not found"}

    return FileResponse(path, media_type="application/pdf", filename="highlighted-pages.pdf")


@app.get("/download-docx/{file_id}")
def download_docx(file_id: str):

    path = os.path.join(OUTPUT_DIR, f"converted-{file_id}.docx")

    if not os.path.exists(path):
        return {"error": "File not found"}

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )