"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function ExtractPagesTool() {
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
    form.append("pages", "")
    form.append("download_mode", "matching_pages")

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: form,
    })

    const data = await res.json()
    setDownloadUrl(data.download_url)

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
        placeholder="Enter keyword to extract pages"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handle}
        disabled={loading}
        className="w-full bg-white text-black px-6 py-3 mt-4 rounded-xl font-bold"
      >
        {loading ? "Processing..." : "Extract Pages"}
      </button>

      {downloadUrl && (
        <a
          className="block mt-6 text-green-400 text-center underline"
          href={`${API_URL}${downloadUrl}`}
          target="_blank"
        >
          Download Result
        </a>
      )}
    </div>
  )
}