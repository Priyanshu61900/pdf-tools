from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse

import os
import uuid
import tempfile
import shutil

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


# =====================================================
# HOMEPAGE + PRIVACY POLICY
# =====================================================
@app.get("/", response_class=HTMLResponse)
def home():

    return """
    <html>
    <head>
        <title>PDF Tools - Privacy Policy</title>

        <style>
            body{
                font-family: Arial, sans-serif;
                max-width: 900px;
                margin: auto;
                padding: 40px;
                line-height: 1.7;
                color: #222;
                background:#f4f4f4;
            }

            .container{
                background:white;
                padding:40px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.1);
            }

            h1,h2{
                color:#111;
            }

            ul{
                padding-left:20px;
            }
        </style>
    </head>

    <body>

        <div class="container">

            <h1>PDF Tools - Privacy Policy</h1>

            <p>
                Welcome to PDF Tools.
                Your privacy is important to us.
            </p>

            <h2>Information We Collect</h2>

            <p>
                We may temporarily process uploaded files
                in order to provide services such as:
            </p>

            <ul>
                <li>PDF text highlighting</li>
                <li>PDF page extraction</li>
                <li>PDF to Word conversion</li>
            </ul>

            <h2>File Handling</h2>

            <p>
                Uploaded files are processed temporarily
                and automatically deleted after processing.
                We do not permanently store uploaded files.
            </p>

            <h2>Google AdSense</h2>

            <p>
                Third-party vendors, including Google,
                may use cookies to serve ads based on
                prior visits to this website.
            </p>

            <p>
                Google's use of advertising cookies enables it
                and its partners to serve ads based on your visit
                to this site and/or other sites on the Internet.
            </p>

            <p>
                Users may opt out of personalized advertising by visiting:
            </p>

            <p>
                https://www.google.com/settings/ads
            </p>

            <h2>Cookies</h2>

            <p>
                We may use cookies and similar technologies
                to improve user experience and website performance.
            </p>

            <h2>Data Security</h2>

            <p>
                We take reasonable steps to protect user information,
                but no online service can guarantee absolute security.
            </p>

            <h2>Contact</h2>

            <p>
                If you have any questions regarding this Privacy Policy,
                please contact us.
            </p>

            <hr>

            <p>
                Last updated: May 2026
            </p>

        </div>

    </body>
    </html>
    """


# =====================================================
# SEARCH + HIGHLIGHT
# =====================================================
@app.post("/api/search-highlight")
async def search_highlight(
    file: UploadFile = File(...),
    search_text: str = Form(...),
    highlight_color: str = Form("yellow"),
):

    temp_dir = tempfile.mkdtemp()

    try:

        # -----------------------------
        # SAVE INPUT PDF
        # -----------------------------
        input_path = os.path.join(
            temp_dir,
            "input.pdf"
        )

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # -----------------------------
        # OPEN PDF
        # -----------------------------
        pdf = fitz.open(input_path)

        # -----------------------------
        # COLORS
        # -----------------------------
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

            words = page.get_text("words")

            found_on_page = False

            for word in words:

                x0, y0, x1, y1, text, *_ = word

                if search_text.lower() in text.lower():

                    found_on_page = True

                    rect = fitz.Rect(x0, y0, x1, y1)

                    annot = page.add_highlight_annot(rect)

                    annot.set_colors(stroke=selected_color)

                    annot.update()

            if found_on_page:
                matched_pages.append(page_num)

        # =================================================
        # SAVE FULL PDF
        # =================================================
        full_pdf_path = os.path.join(
            OUTPUT_DIR,
            f"full-{output_id}.pdf"
        )

        pdf.save(full_pdf_path)

        pdf.close()

        # =================================================
        # CREATE MATCHED PDF
        # =================================================
        matched_pdf = fitz.open()

        # reopen highlighted pdf
        saved_pdf = fitz.open(full_pdf_path)

        for page_num in matched_pages:

            # create temp pdf for single page
            temp_doc = fitz.open()

            temp_doc.insert_pdf(
                saved_pdf,
                from_page=page_num,
                to_page=page_num
            )

            # insert that page into final matched pdf
            matched_pdf.insert_pdf(temp_doc)

            temp_doc.close()

        matched_pdf_path = os.path.join(
            OUTPUT_DIR,
            f"matched-{output_id}.pdf"
        )

        # if no match found
        if len(matched_pages) == 0:
            matched_pdf.new_page()

        matched_pdf.save(matched_pdf_path)

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

        shutil.rmtree(temp_dir, ignore_errors=True)


# =====================================================
# PDF TO WORD
# =====================================================
@app.post("/api/pdf-to-word")
async def pdf_to_word(
    file: UploadFile = File(...)
):

    temp_dir = tempfile.mkdtemp()

    try:

        input_path = os.path.join(
            temp_dir,
            "input.pdf"
        )

        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        pdf = fitz.open(input_path)

        text = ""

        for page in pdf:

            text += page.get_text("text") + "\n"

        pdf.close()

        output_id = str(uuid.uuid4())

        output_path = os.path.join(
            OUTPUT_DIR,
            f"converted-{output_id}.docx"
        )

        word = Document()

        word.add_heading(
            "Converted PDF",
            level=1
        )

        if text.strip():

            for line in text.split("\n"):

                line = line.strip()

                if line:
                    word.add_paragraph(line)

        else:

            word.add_paragraph(
                "No extractable text found"
            )

        word.save(output_path)

        return {
            "success": True,
            "download_url": f"{BASE_URL}/download-docx/{output_id}"
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        shutil.rmtree(temp_dir, ignore_errors=True)


# =====================================================
# DOWNLOAD FULL PDF
# =====================================================
@app.get("/download-full-pdf/{file_id}")
def download_full_pdf(file_id: str):

    path = os.path.join(
        OUTPUT_DIR,
        f"full-{file_id}.pdf"
    )

    if not os.path.exists(path):

        return {
            "error": "File not found"
        }

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="highlighted-full.pdf"
    )


# =====================================================
# DOWNLOAD MATCHED PAGES PDF
# =====================================================
@app.get("/download-matched-pdf/{file_id}")
def download_matched_pdf(file_id: str):

    path = os.path.join(
        OUTPUT_DIR,
        f"matched-{file_id}.pdf"
    )

    if not os.path.exists(path):

        return {
            "error": "File not found"
        }

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="highlighted-pages.pdf"
    )


# =====================================================
# DOWNLOAD DOCX
# =====================================================
@app.get("/download-docx/{file_id}")
def download_docx(file_id: str):

    path = os.path.join(
        OUTPUT_DIR,
        f"converted-{file_id}.docx"
    )

    if not os.path.exists(path):

        return {
            "error": "File not found"
        }

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )