import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  title: "Recommended Tools For PDFs, AI, Hosting And Office Work",
  description:
    "Recommended PDF editors, hosting tools, AI tools, resume builders and office tools for people working with documents online.",
  keywords: [
    "recommended PDF tools",
    "PDF editor",
    "AI tools",
    "resume builder",
    "hosting tools",
    "office tools",
  ],
  alternates: {
    canonical: "/resources",
  },
}

const resources = [
  {
    category: "PDF Editors",
    description:
      "Tools for editing, compressing, signing, merging and organizing PDF documents.",
    examples: ["Adobe Acrobat", "Smallpdf", "iLovePDF"],
  },
  {
    category: "Hosting",
    description:
      "Developer-friendly hosting platforms for websites, APIs and document tools.",
    examples: ["Vercel", "Render", "Railway"],
  },
  {
    category: "Document Analysis Tools",
    description:
      "Reading, summarization and document-analysis tools for large files.",
    examples: ["Notebook tools", "Knowledge bases", "Document analyzers"],
  },
  {
    category: "Resume Builders",
    description:
      "Resume and CV builders for creating professional job application documents.",
    examples: ["Canva", "Novoresume", "Resume.io"],
  },
  {
    category: "Office Tools",
    description:
      "Document, spreadsheet and presentation tools for editing converted files.",
    examples: ["Microsoft 365", "Google Workspace", "LibreOffice"],
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Recommended PDF And Office Tools",
          url: absoluteUrl("/resources"),
          description:
            "Recommended PDF editors, hosting, AI, resume and office tools.",
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Recommended PDF And Office Tools
        </h1>

        <p className="text-zinc-400 leading-8 mt-6 max-w-3xl mx-auto">
          Explore helpful tools for PDF editing, web hosting, AI document work,
          resume building and office productivity.
        </p>

        <p className="text-zinc-500 text-sm leading-7 mt-6 max-w-3xl mx-auto">
          Disclosure: this page may include affiliate recommendations. We only
          recommend tools that fit the PDF, document and productivity niche.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <article
              key={resource.category}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold">{resource.category}</h2>
              <p className="text-zinc-400 leading-8 mt-4">
                {resource.description}
              </p>
              <p className="text-zinc-500 leading-8 mt-4">
                Examples: {resource.examples.join(", ")}
              </p>
            </article>
          ))}
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold">Want To Suggest A Tool?</h2>
          <p className="text-zinc-400 leading-8 mt-4">
            If you have a PDF, AI, hosting, resume or office product that fits
            this audience, contact us for review.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold mt-5"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
