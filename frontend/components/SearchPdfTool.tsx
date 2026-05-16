"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function SearchPdfTool() {

  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [txtUrl, setTxtUrl] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = async () => {

    if (!file || !text) return

    setLoading(true)

    const form = new FormData()

    form.append("file", file)
    form.append("search_text", text)

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: form,
    })

    const data = await res.json()

    setTxtUrl(data.txt_download_url)
    setPdfUrl(data.pdf_download_url)

    setLoading(false)
  }

  return (
    <div className="w-full max-w-xl bg-zinc-950 p-8 rounded-3xl border border-zinc-800">

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800"
        placeholder="Enter keyword"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handle}
        className="w-full bg-white text-black mt-4 p-4 rounded-2xl font-bold"
      >
        {loading ? "Processing..." : "Search"}
      </button>

      {(txtUrl || pdfUrl) && (
        <div className="mt-6 flex flex-col gap-4">

          <a
            href={txtUrl}
            target="_blank"
            className="bg-green-500 text-black p-4 rounded-2xl text-center font-bold"
          >
            Download TXT
          </a>

          <a
            href={pdfUrl}
            target="_blank"
            className="bg-blue-500 text-white p-4 rounded-2xl text-center font-bold"
          >
            Download PDF
          </a>

        </div>
      )}

    </div>
  )
}