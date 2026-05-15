import SearchPdfTool from "@/components/SearchPdfTool"

export const metadata = {
  title: "Search Text in PDF Online Free",
  description:
    "Search names, keywords, emails and matching text inside PDF files online for free.",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          Search Text in PDF
        </h1>

        <p className="text-zinc-400 mt-6 text-lg max-w-3xl mx-auto leading-8">
          Upload a PDF and instantly search for keywords,
          names, invoice numbers, emails and matching text.
        </p>

      </section>

      <section className="flex justify-center px-6">
        <SearchPdfTool />
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold mb-6">
          Search Keywords Inside PDF Files
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          Our free PDF search tool helps you quickly find
          matching text inside PDF documents.
        </p>

      </section>

    </main>
  )
}