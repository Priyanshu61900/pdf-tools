import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { guides } from "@/lib/guides"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  title: "PDF Guides - Search, Highlight, Extract And Convert PDFs",
  description:
    "Read practical PDF guides for searching text, highlighting matches, extracting pages by keyword and converting PDFs to Word.",
  keywords: [
    "PDF guides",
    "PDF tutorials",
    "search PDF guide",
    "highlight PDF guide",
    "extract PDF pages guide",
    "PDF to Word guide",
  ],
  alternates: {
    canonical: "/guides",
  },
}

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "PDF Guides",
          url: absoluteUrl("/guides"),
          description:
            "Practical guides for working with PDF files online.",
          hasPart: guides.map((guide) => ({
            "@type": "Article",
            headline: guide.title,
            url: absoluteUrl(`/guides/${guide.slug}`),
            description: guide.description,
          })),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", schemaHref: "/guides" },
        ]}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          PDF Guides
        </h1>

        <p className="text-zinc-400 leading-8 mt-6 max-w-3xl mx-auto">
          Learn how to search, highlight, extract and convert PDF files with
          practical guides written for everyday document tasks.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-6 hover:border-zinc-600 transition"
            >
              <h2 className="text-2xl font-bold">{guide.title}</h2>
              <p className="text-zinc-400 leading-8 mt-4">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
