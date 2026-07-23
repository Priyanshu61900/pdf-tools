import Link from "next/link"
import { guides } from "@/lib/guides"
import { companyLinks, tools } from "@/lib/site"

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h2 className="text-lg font-bold">OmniToolbox</h2>
          <p className="text-zinc-400 text-sm leading-7 mt-3">
            Simple browser-based PDF tools for searching, highlighting,
            extracting matching pages, and converting PDF files.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">
            Tools
          </h2>
          <div className="grid gap-3 mt-4 text-sm">
            <Link
              href="/tools"
              className="text-zinc-300 hover:text-white transition"
            >
              All PDF Tools
            </Link>

            {tools.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-white transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">
            Guides
          </h2>
          <div className="grid gap-3 mt-4 text-sm">
            <Link
              href="/guides"
              className="text-zinc-300 hover:text-white transition"
            >
              PDF Guides
            </Link>

            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="text-zinc-300 hover:text-white transition"
              >
                {guide.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-zinc-400">
            Site
          </h2>
          <div className="grid gap-3 mt-4 text-sm">
            {companyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
