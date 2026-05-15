@app.get("/download/{file_id}")
def download_report(file_id: str):
    path = os.path.join(OUTPUT_DIR, f"report-{file_id}.pdf")
    return FileResponse(path, media_type="application/pdf")