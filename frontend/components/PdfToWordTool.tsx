"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState("")
  const [error, setError] = useState("")

  const handle = async () => {
    if (!file) return setError("Upload a PDF first")

    setLoading(true)
    setError("")
    setDownloadUrl("")

    try {
      const form = new FormData()
      form.append("file", file)

      const res = await fetch(`${API_URL}/api/pdf-to-word`, {
        method: "POST",
        body: form,
      })

      const data = await res.json()
      setDownloadUrl(data.download_url)
    } catch {
      setError("Conversion failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handle}
        className="w-full bg-white text-black mt-6 p-4 rounded-2xl font-bold"
      >
        {loading ? "Processing..." : "Convert"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {downloadUrl && (
        <a
          className="block mt-6 text-center bg-green-500 text-black p-4 rounded-2xl font-bold"
          href={`${API_URL}${downloadUrl}`}
        >
          Download File
        </a>
      )}
    </div>
  )
}