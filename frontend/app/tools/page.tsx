import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { absoluteUrl, tools } from "@/lib/site"

export const metadata = {
  title: "All OmniToolbox",
  description:
    "Browse free online PDF tools to search PDF text, highlight matches, extract matching pages and convert PDF files to Word.",
  keywords: [
    "free PDF tools",
    "online PDF tools",
    "search PDF",
    "highlight PDF",
    "extract PDF pages",
    "PDF to Word",
  ],
  alternates: {
    canonical: "/tools",
  },
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All OmniToolbox",
          url: absoluteUrl("/tools"),
          description:
            "A collection of free browser-based PDF tools for searching, highlighting, extracting and converting PDF files.",
          hasPart: tools.map((tool) => ({
            "@type": "SoftwareApplication",
            name: tool.title,
            url: absoluteUrl(tool.href),
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
          })),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", schemaHref: "/tools" },
        ]}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          All OmniToolbox
        </h1>

        <p className="text-zinc-400 leading-8 mt-6 max-w-3xl mx-auto">
          Browse PDF tools for searching text, highlighting matches,
          extracting pages by keyword and converting PDF documents to Word.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-6 hover:border-zinc-600 transition"
            >
              <h2 className="text-2xl font-bold">{tool.title}</h2>
              <p className="text-zinc-400 leading-8 mt-4">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
