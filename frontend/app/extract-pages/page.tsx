import Breadcrumbs from "@/components/Breadcrumbs"
import ExtractPagesTool from "@/components/ExtractPagesTool"
import JsonLd from "@/components/JsonLd"
import RelatedTools from "@/components/RelatedTools"
import ToolSeoContent from "@/components/ToolSeoContent"
import { absoluteUrl, siteName } from "@/lib/site"

export const metadata = {
  title: "Extract Matching PDF Pages Online Free",
  description:
    "Extract PDF pages that contain matching text, keywords or phrases. Highlight matches and download only the relevant pages as a PDF.",
  keywords: [
    "extract matching PDF pages",
    "extract PDF pages by keyword",
    "PDF page extractor",
    "extract pages containing text",
    "download matching PDF pages",
  ],
  alternates: {
    canonical: "/extract-pages",
  },
  openGraph: {
    title: "Extract Matching PDF Pages Online Free",
    description:
      "Extract PDF pages that contain searched text, keywords or phrases.",
    url: absoluteUrl("/extract-pages"),
    siteName,
    type: "website",
  },
}

const faqs = [
  {
    question: "What does extract matching PDF pages mean?",
    answer:
      "It means the tool searches your PDF for the text you enter and creates a new PDF containing only the pages where matches were found.",
  },
  {
    question: "Are the matches highlighted in the extracted PDF?",
    answer:
      "Yes. Matching text is highlighted in the selected color before the matching pages PDF is created.",
  },
  {
    question: "Can I extract pages by keyword?",
    answer:
      "Yes. Enter the keyword, name, number or phrase you want to find, and the tool extracts pages containing that text.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Extract Matching PDF Pages",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Extract pages from a PDF when they contain a searched word, keyword or phrase.",
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
            label: "Extract Matching PDF Pages",
            schemaHref: "/extract-pages",
          },
        ]}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          Extract Matching PDF Pages
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <ExtractPagesTool />
      </section>

      <ToolSeoContent
        title="Extract Only The PDF Pages That Matter"
        intro="Use this tool when a large PDF contains only a few pages you need. Search for a term, highlight the match and download a smaller PDF containing only the matching pages."
        steps={[
          "Upload the PDF file you want to search.",
          "Enter the text, keyword, phrase or number that identifies the pages you need.",
          "Choose the highlight color for matching text.",
          "Download the highlighted PDF containing only matching pages.",
        ]}
        uses={[
          "Extract pages containing a customer name, invoice number or case ID.",
          "Pull relevant sections from long reports, manuals or policy documents.",
          "Create a smaller PDF from pages that mention a specific topic.",
          "Share only pages that contain the searched term instead of sending the full document.",
        ]}
        tips={[
          "Search for unique identifiers when possible, such as an invoice number, project code or exact name.",
          "If the result is empty, confirm that your PDF has selectable text rather than scanned images.",
        ]}
        faqs={faqs}
      />

      <RelatedTools currentHref="/extract-pages" />

    </main>
  )
}
