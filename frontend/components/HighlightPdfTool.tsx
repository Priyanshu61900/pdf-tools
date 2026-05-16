"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function HighlightPdfTool() {

  const [file, setFile] = useState<File | null>(null)

  const [searchText, setSearchText] = useState("")

  const [color, setColor] = useState("yellow")

  const [fullPdfUrl, setFullPdfUrl] = useState("")
  const [matchedPdfUrl, setMatchedPdfUrl] = useState("")

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {

    if (!file || !searchText) return

    setLoading(true)

    const formData = new FormData()

    formData.append("file", file)
    formData.append("search_text", searchText)
    formData.append("highlight_color", color)

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    setFullPdfUrl(data.full_pdf_url)
    setMatchedPdfUrl(data.matched_pdf_url)

    setLoading(false)
  }

  return (
    <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800 text-white"
        placeholder="Enter text to highlight"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800 text-white"
      >
        <option value="yellow">Yellow</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="pink">Pink</option>
        <option value="orange">Orange</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black px-6 py-3 mt-4 rounded-xl font-bold"
      >
        {loading ? "Processing..." : "Highlight PDF"}
      </button>

      {(fullPdfUrl || matchedPdfUrl) && (
        <div className="mt-6 flex flex-col gap-4">

          <a
            href={matchedPdfUrl}
            target="_blank"
            className="bg-green-500 text-black p-4 rounded-2xl text-center font-bold"
          >
            Download Highlighted Pages Only
          </a>

          <a
            href={fullPdfUrl}
            target="_blank"
            className="bg-blue-500 text-white p-4 rounded-2xl text-center font-bold"
          >
            Download Full Highlighted PDF
          </a>

        </div>
      )}

    </div>
  )
}