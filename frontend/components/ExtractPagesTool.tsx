"use client"

import { useState } from "react"
import { API_URL } from "@/lib/api"

export default function ExtractPagesTool() {

  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [color, setColor] = useState("yellow")
  const [pdfUrl, setPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      setPdfUrl("")

      const form = new FormData()

      form.append("file", file)
      form.append("search_text", text)
      form.append("highlight_color", color)

      const res = await fetch(`${API_URL}/api/search-highlight`, {
        method: "POST",
        body: form,
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Backend error")
        return
      }

      setPdfUrl(data.matched_pdf_url)

    } catch (err) {
      console.error(err)
      setError("Something went wrong")
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

      <input
        className="w-full mt-4 p-3 rounded-xl bg-zinc-800 text-white"
        placeholder="Enter keyword"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
        onClick={handle}
        disabled={loading}
        className="w-full bg-white text-black px-6 py-3 mt-4 rounded-xl font-bold"
      >
        {loading ? "Processing..." : "Extract Pages"}
      </button>

      {error && (
        <p className="text-red-500 mt-4 text-center">
          {error}
        </p>
      )}

      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            target="_blank"
            className="block bg-green-500 text-black p-4 rounded-2xl text-center font-bold"
          >
            Download Highlighted Matching Pages PDF
          </a>
        </div>
      )}

    </div>
  )
}
