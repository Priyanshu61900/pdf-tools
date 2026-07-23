# OmniToolbox / pdf-tools

Full-stack PDF and document utility platform powering OmniToolbox.

![OmniToolbox homepage](frontend/public/screenshots/omnitoolbox-home.png)

## Live Product

- Live URL: https://omnitoolbox.in
- GitHub repo: https://github.com/Priyanshu61900/pdf-tools

## What This Project Does

OmniToolbox provides practical browser and server-backed utilities for everyday
document work. The current product includes PDF search, highlighting, page
extraction, PDF-to-Word conversion, compression/protection pages, image resizing
and public guides.

## Architecture

```text
Browser
  -> Next.js frontend
  -> same-origin API routes
  -> FastAPI backend
  -> PDF processing libraries
```

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, PyMuPDF, pypdf, pdf2docx
- Deployment: Vercel frontend and Render-style backend deployment
- Product: auth pages, pricing, API access, SEO guides and legal pages

## Local Development

Frontend:

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Notes

Keep all production secrets in the hosting dashboard:

- `AUTH_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_SECRET`
- `BACKEND_APP_SECRET`
- `PDF_TOOLS_APP_SECRET`
- `PDF_TOOLS_API_KEYS`
- `RESEND_API_KEY`

Do not commit `.env`, `.env.local`, database files, generated output files or
API keys.
