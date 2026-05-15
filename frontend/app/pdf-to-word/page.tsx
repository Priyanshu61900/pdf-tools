import PdfToWordTool from "@/components/PdfToWordTool"

export const metadata = {
  title: "PDF to Word Converter Online Free",
  description:
    "Convert PDF files into editable Word DOCX documents online for free.",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          PDF to Word Converter
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <PdfToWordTool />
      </section>

    </main>
  )
}