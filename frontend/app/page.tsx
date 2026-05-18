import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { guides } from "@/lib/guides"
import { absoluteUrl, tools } from "@/lib/site"

export const metadata = {
  title: "Free PDF Tools Online - Search, Highlight, Extract & Convert",
  description:
    "Free online PDF tools to search text in PDFs, highlight matches, extract matching pages and convert PDF files to Word documents.",
  keywords: [
    "free PDF tools online",
    "PDF tools",
    "search PDF text",
    "highlight PDF",
    "extract PDF pages",
    "PDF to Word converter",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free PDF Tools Online",
    description:
      "Search PDF text, highlight matches, extract pages and convert PDFs to Word.",
    url: absoluteUrl("/"),
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Free PDF Tools Online",
          url: absoluteUrl("/"),
          description:
            "Free browser-based PDF tools for searching, highlighting, extracting matching pages and converting PDF documents.",
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Free PDF Tools Online",
          url: absoluteUrl("/"),
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Free PDF Tools",
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.title,
            url: absoluteUrl(tool.href),
          })),
        }}
      />

      {/* HERO */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="animate-rise max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Free PDF Tools Online
            </h1>

            <p className="text-zinc-400 mt-6 text-xl max-w-3xl leading-8">
              Browse the PDF tools freely. Sign up to process files with a free
              5-page limit, or upgrade to Premium for larger PDFs and repeated
              processing.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/tools"
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
              >
                Browse PDF Tools
              </Link>

              <Link
                href="/login"
                className="border border-zinc-700 px-8 py-4 rounded-2xl transition hover:-translate-y-0.5 hover:border-zinc-500"
              >
                Sign In
              </Link>

            </div>
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
              className="hover-lift bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6"
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

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold mb-8">
          PDF Guides And Tutorials
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="hover-lift bg-zinc-900/90 border border-zinc-800 rounded-lg p-6"
            >
              <h3 className="text-2xl font-bold">
                {guide.title}
              </h3>

              <p className="text-zinc-400 leading-8 mt-4">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold mb-6">
          Free Tools With Optional Pro Features
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          Small PDF tasks stay free. Paid plans are designed for users who need
          larger files, batch processing, OCR for scanned PDFs, watermark
          removal, unlimited usage or developer API access.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/pricing"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold transition hover:-translate-y-0.5"
          >
            View Pricing
          </Link>
          <Link
            href="/api-access"
            className="border border-zinc-700 px-6 py-3 rounded-lg transition hover:-translate-y-0.5 hover:border-zinc-500"
          >
            PDF API Access
          </Link>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-5xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold mb-8">
          Practical PDF Tools For Everyday Documents
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          Free PDF Tools Online is built for quick document tasks that
          people handle every day: finding text in long PDFs, marking
          important phrases, pulling out only relevant pages, and converting
          PDF files into editable Word documents.
        </p>

        <p className="text-zinc-400 leading-8 mb-6">
          The tools are designed for reports, forms, invoices, notes,
          contracts, manuals and other documents where speed matters.
          Each tool has a focused workflow so you can upload a file, choose
          the action you need, and download the result.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">
          Why Use These PDF Tools?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Tools are visible to everyone, and file processing requires a free account.",
            "Free accounts can process PDFs up to 5 pages.",
            "Premium unlocks larger PDFs and repeated processing.",
            "Each tool has a simple single-purpose workflow.",
          ].map((item) => (
            <p
              key={item}
              className="hover-lift border border-zinc-800 bg-zinc-950/90 rounded-lg p-5 text-zinc-300 leading-7"
            >
              {item}
            </p>
          ))}
        </div>

      </section>

    </main>
  )
}
