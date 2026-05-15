import Link from "next/link"

export const metadata = {
  title: "Free PDF Tools Online - Search, Extract & Convert PDFs",
  description:
    "Use free online PDF tools to search text in PDFs, highlight matches, extract matching pages and convert PDF to Word instantly.",
}

const tools = [
  {
    title: "Search Text in PDF",
    description: "Find names, numbers, keywords, emails, and more.",
    href: "/search-text-in-pdf",
  },

  {
    title: "Highlight PDF Text",
    description: "Highlight matching text across the PDF.",
    href: "/highlight-pdf",
  },

  {
    title: "Extract Matching Pages",
    description: "Download only pages containing searched text.",
    href: "/extract-pages",
  },

  {
    title: "PDF to Word",
    description: "Convert PDFs into editable DOCX files.",
    href: "/pdf-to-word",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <h1 className="text-6xl font-bold leading-tight">
            Free PDF Tools Online
          </h1>

          <p className="text-zinc-400 mt-6 text-xl max-w-3xl mx-auto">
            Search, highlight, extract, and convert PDFs instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">

            <Link
              href="/search-text-in-pdf"
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold"
            >
              Start Searching PDFs
            </Link>

            <Link
              href="/pdf-to-word"
              className="border border-zinc-700 px-8 py-4 rounded-2xl"
            >
              Convert PDFs
            </Link>

          </div>

        </div>

      </section>

      {/* TOOL GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition"
            >
              <h2 className="text-2xl font-bold mb-3">
                {tool.title}
              </h2>

              <p className="text-zinc-400 text-sm leading-7">
                {tool.description}
              </p>
            </Link>
          ))}

        </div>

      </section>

      {/* SEO CONTENT */}
      <section className="max-w-5xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold mb-8">
          Free Online PDF Tools
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          Use our free PDF tools to search text inside PDF files,
          highlight matching content, extract pages containing
          keywords and convert PDF documents into editable Word files.
        </p>

        <p className="text-zinc-400 leading-8 mb-6">
          All tools work online without installation and support
          fast PDF processing directly in your browser.
        </p>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 mt-20 py-10">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-center">

          <Link href="/search-text-in-pdf">
            Search Text in PDF
          </Link>

          <Link href="/highlight-pdf">
            Highlight PDF Text
          </Link>

          <Link href="/extract-pages">
            Extract Matching Pages
          </Link>

          <Link href="/pdf-to-word">
            PDF to Word
          </Link>

        </div>

      </footer>

    </main>
  )
}