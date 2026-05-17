import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  title: "PDF API Access - Search And Highlight PDF API",
  description:
    "Developer API access for PDF search, PDF highlighting and extracting matching pages. API access starts at ₹99 per month.",
  keywords: [
    "PDF API",
    "PDF Search API",
    "PDF Highlight API",
    "extract PDF pages API",
    "PDF developer API",
  ],
  alternates: {
    canonical: "/api-access",
  },
}

const endpoints = [
  {
    name: "PDF Search API",
    method: "POST",
    path: "/api/v1/search",
    description:
      "Search a PDF for words, names, numbers or phrases and return matched page information.",
  },
  {
    name: "PDF Highlight API",
    method: "POST",
    path: "/api/v1/highlight",
    description:
      "Highlight matching PDF text with a selected color and return a downloadable PDF.",
  },
  {
    name: "Extract Matching Pages API",
    method: "POST",
    path: "/api/v1/extract-matching-pages",
    description:
      "Create a smaller PDF containing only pages that match the searched text.",
  },
]

export default function ApiAccessPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "PDF Search API and PDF Highlight API",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "99",
            priceCurrency: "INR",
            url: absoluteUrl("/api-access"),
          },
          description:
            "Developer API access for PDF search, PDF highlighting and extracting matching PDF pages.",
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          PDF API Access
        </h1>

        <p className="text-zinc-400 leading-8 mt-6 max-w-3xl mx-auto">
          Turn the backend into a paid developer API for PDF search, PDF
          highlighting and extracting matching pages. API access starts at
          ₹99/month.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            href="/register"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            Create Developer Account
          </Link>
          <Link
            href="/contact"
            className="border border-zinc-700 px-6 py-3 rounded-lg"
          >
            Contact Sales
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid gap-6">
        {endpoints.map((endpoint) => (
          <article
            key={endpoint.path}
            className="border border-zinc-800 bg-zinc-950 rounded-lg p-6"
          >
            <p className="text-zinc-500 text-sm">
              {endpoint.method} {endpoint.path}
            </p>
            <h2 className="text-2xl font-bold mt-2">{endpoint.name}</h2>
            <p className="text-zinc-400 leading-8 mt-4">
              {endpoint.description}
            </p>
          </article>
        ))}

        <article className="border border-zinc-800 bg-zinc-950 rounded-lg p-6">
          <h2 className="text-2xl font-bold">Example Request</h2>
          <pre className="overflow-x-auto bg-black border border-zinc-800 rounded-lg p-4 mt-5 text-sm text-zinc-300">
            <code>{`curl -X POST https://api.your-domain.com/api/v1/highlight \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "search_text=invoice" \\
  -F "highlight_color=yellow"`}</code>
          </pre>
        </article>
      </section>
    </main>
  )
}
