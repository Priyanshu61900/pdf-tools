import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import RelatedTools from "@/components/RelatedTools"
import SearchPdfTool from "@/components/SearchPdfTool"
import ToolSeoContent from "@/components/ToolSeoContent"
import { absoluteUrl, siteName } from "@/lib/site"

export const metadata = {
  title: "Search Text in PDF Online Free - Find Words In PDF",
  description:
    "Search text inside PDF files online. Find keywords, names, numbers, emails and phrases in a PDF, then download a highlighted PDF copy.",
  keywords: [
    "search text in PDF",
    "find words in PDF",
    "PDF text search",
    "search PDF online",
    "find keyword in PDF",
  ],
  alternates: {
    canonical: "/search-text-in-pdf",
  },
  openGraph: {
    title: "Search Text in PDF Online Free",
    description:
      "Find keywords, names, numbers, emails and phrases in PDF files online.",
    url: absoluteUrl("/search-text-in-pdf"),
    siteName,
    type: "website",
  },
}

const faqs = [
  {
    question: "Can I search for a phrase inside a PDF?",
    answer:
      "Yes. Upload your PDF, enter a word or phrase, and the tool searches the document for matching text.",
  },
  {
    question: "Will the result show where the text was found?",
    answer:
      "Yes. The matching text is highlighted in the downloadable PDF so you can review the results quickly.",
  },
  {
    question: "Does this work with scanned PDFs?",
    answer:
      "This tool works best with PDFs that contain selectable text. Scanned image-only PDFs may need OCR before text can be searched.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Search Text in PDF",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Search text, keywords and phrases inside PDF files and download a highlighted result.",
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          {
            label: "Search Text in PDF",
            schemaHref: "/search-text-in-pdf",
          },
        ]}
      />

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

      <ToolSeoContent
        title="Search Keywords Inside PDF Files"
        intro="Use this PDF search tool when you need to find a specific word, name, invoice number, email address or phrase in a document without manually scanning every page."
        steps={[
          "Upload a PDF file that contains selectable text.",
          "Enter the keyword, number, name or phrase you want to find.",
          "Run the search and wait for the highlighted PDF result.",
          "Download the highlighted PDF and review the matched text.",
        ]}
        uses={[
          "Find invoice numbers, order IDs and reference codes in business documents.",
          "Search contracts, reports, forms and study notes for important terms.",
          "Locate names, dates, addresses or email addresses inside long PDF files.",
          "Review documents faster by jumping straight to highlighted matches.",
        ]}
        tips={[
          "For the best results, search for the most unique part of the phrase rather than a very common word.",
          "If no match is found, check whether the PDF text is selectable. Image-only scans usually need OCR first.",
        ]}
        faqs={faqs}
      />

      <RelatedTools currentHref="/search-text-in-pdf" />

    </main>
  )
}
