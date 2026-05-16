"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function SearchPdfTool() {

  const [file, setFile] = useState<File | null>(null)

  const [text, setText] = useState("")

  const [fullPdfUrl, setFullPdfUrl] = useState("")

  const [loading, setLoading] = useState(false)

  const handle = async () => {

    if (!file || !text) return

    setLoading(true)

    const form = new FormData()

    form.append("file", file)

    form.append("search_text", text)

    // ALWAYS FIXED YELLOW
    form.append("highlight_color", "yellow")

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: form,
    })

    const data = await res.json()

    setFullPdfUrl(data.full_pdf_url)

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
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800 text-white"
        placeholder="Search text, number or keyword"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handle}
        className="w-full bg-white text-black mt-4 p-4 rounded-2xl font-bold"
      >
        {loading ? "Processing..." : "Search PDF"}
      </button>

      <p className="text-zinc-400 text-sm mt-4 text-center">
        Want only highlighted pages or custom colors?
        Use the Highlight PDF Tool.
      </p>

      {fullPdfUrl && (
        <div className="mt-6">

          <a
            href={fullPdfUrl}
            target="_blank"
            className="block bg-yellow-500 text-black p-4 rounded-2xl text-center font-bold"
          >
            Download Full Highlighted PDF
          </a>

        </div>
      )}

    </div>
  )
}