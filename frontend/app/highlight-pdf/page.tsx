import HighlightPdfTool from "@/components/HighlightPdfTool"

export const metadata = {
  title: "Highlight Text in PDF Online Free",
  description:
    "Highlight matching text, keywords and phrases inside PDF files online for free.",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          Highlight Text in PDF
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <HighlightPdfTool />
      </section>

    </main>
  )
}