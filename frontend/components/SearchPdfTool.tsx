"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function SearchPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!file || !text) return

    setLoading(true)

    const form = new FormData()
    form.append("file", file)
    form.append("search_text", text)
    form.append("page_mode", "all")
    form.append("download_mode", "highlighted")

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: form,
    })

    const data = await res.json()
    setDownloadUrl(data.download_url)

    setLoading(false)
  }

  return (
    <div className="w-full max-w-xl bg-zinc-950 p-8 rounded-3xl border border-zinc-800">

      <div className="border-2 border-dashed border-zinc-600 p-8 rounded-2xl text-center bg-zinc-900">
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label htmlFor="file" className="cursor-pointer">
          {file ? file.name : "Upload PDF"}
        </label>
      </div>

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

      {downloadUrl && (
        <a
          href={`${API_URL}${downloadUrl}`}
          className="block mt-4 text-green-400 text-center"
        >
          Download Result
        </a>
      )}
    </div>
  )
}