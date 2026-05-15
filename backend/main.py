from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import os
import uuid
import tempfile
import shutil

import fitz
from docx import Document

# ---------------- APP ---------------- #
app = FastAPI()

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STORAGE ---------------- #
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ---------------- PDF → WORD ---------------- #
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
            "download_url": f"/download-docx/{output_id}"
        }

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


# ---------------- DOWNLOAD DOCX ---------------- #
@app.get("/download-docx/{file_id}")
def download_docx(file_id: str, background_tasks: BackgroundTasks):

    path = os.path.join(OUTPUT_DIR, f"converted-{file_id}.docx")

    if not os.path.exists(path):
        return {"error": "File not found"}

    # delete after download (SEO-friendly, no storage cost)
    background_tasks.add_task(lambda: os.remove(path))

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )