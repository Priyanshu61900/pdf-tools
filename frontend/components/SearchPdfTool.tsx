"use client"

import { useState } from "react"
import ToolGateMessage from "@/components/ToolGateMessage"

export default function SearchPdfTool() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [fullPdfUrl, setFullPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [actionCode, setActionCode] = useState("")

  const handle = async () => {
    if (!file) {
      setError("Please upload a PDF")
      return
    }

    if (!text.trim()) {
      setError("Please enter text")
      return
    }

    try {
      setLoading(true)
      setError("")
      setActionCode("")
      setFullPdfUrl("")

      const form = new FormData()

      form.append("file", file)
      form.append("search_text", text)
      form.append("highlight_color", "yellow")

      const res = await fetch("/api/tools/search-highlight", {
        method: "POST",
        body: form,
      })

      const data = await res.json()

      console.log(data)

      if (!data.success) {
        setError(data.error || "Backend error")
        setActionCode(data.code || "")
        return
      }

      setFullPdfUrl(data.full_pdf_url)

    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
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
        disabled={loading}
        className="w-full bg-white text-black mt-4 p-4 rounded-2xl font-bold"
      >
        {loading ? "Processing..." : "Search PDF"}
      </button>

      <p className="text-zinc-400 text-sm mt-4 text-center">
        Want custom colors or only highlighted pages?
        Use the Highlight PDF Tool.
      </p>

      {error && (
        <p className="text-red-500 mt-4 text-center">
          {error}
        </p>
      )}

      <ToolGateMessage code={actionCode} />

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
