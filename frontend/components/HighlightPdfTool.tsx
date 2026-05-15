"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function HighlightPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [searchText, setSearchText] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("search_text", searchText)
    formData.append("page_mode", "all")
    formData.append("pages", "")
    formData.append("download_mode", "highlighted")

    const res = await fetch(`${API_URL}/api/search-highlight`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setDownloadUrl(data.download_url)

    setLoading(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) setFile(droppedFile)
  }

  return (
    <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
          dragActive ? "border-white bg-zinc-900" : "border-zinc-600 bg-zinc-900"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label htmlFor="fileUpload" className="cursor-pointer block">
          <p className="text-lg font-semibold">
            {file ? file.name : "Drag & Drop PDF or Click to Upload"}
          </p>
        </label>
      </div>

      <input
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800 text-white"
        placeholder="Enter text to highlight"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black px-6 py-3 mt-4 rounded-xl font-bold"
      >
        {loading ? "Processing..." : "Process PDF"}
      </button>

      {downloadUrl && (
        <a
          className="block mt-6 text-green-400 text-center underline"
          href={`${API_URL}${downloadUrl}`}
          target="_blank"
        >
          Download Highlighted PDF
        </a>
      )}
    </div>
  )
}