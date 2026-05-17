"use client"

import { useState } from "react"
import ToolGateMessage from "@/components/ToolGateMessage"

export default function PdfToWordTool() {

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [docxUrl, setDocxUrl] = useState("")
  const [error, setError] = useState("")
  const [actionCode, setActionCode] = useState("")

  const handle = async () => {

    if (!file) return setError("Upload a PDF first")

    setLoading(true)
    setError("")
    setActionCode("")
    setDocxUrl("")

    try {

      const form = new FormData()

      form.append("file", file)

      const res = await fetch("/api/tools/pdf-to-word", {
        method: "POST",
        body: form,
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Conversion failed")
        setActionCode(data.code || "")
        return
      }

      setDocxUrl(data.download_url)

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

      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}

      <ToolGateMessage code={actionCode} />

      {docxUrl && (
        <a
          className="block mt-6 text-center bg-green-500 text-black p-4 rounded-2xl font-bold"
          href={docxUrl}
          target="_blank"
        >
          Download DOCX
        </a>
      )}

    </div>
  )
}
