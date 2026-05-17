import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import HighlightPdfTool from "@/components/HighlightPdfTool"
import RelatedTools from "@/components/RelatedTools"
import ToolSeoContent from "@/components/ToolSeoContent"
import { absoluteUrl, siteName } from "@/lib/site"

export const metadata = {
  title: "Highlight Text in PDF Online Free - Mark PDF Matches",
  description:
    "Highlight words, names, keywords and phrases inside a PDF online. Choose a highlight color and download the highlighted PDF.",
  keywords: [
    "highlight PDF text",
    "PDF highlighter online",
    "highlight words in PDF",
    "mark PDF matches",
    "highlight PDF online",
  ],
  alternates: {
    canonical: "/highlight-pdf",
  },
  openGraph: {
    title: "Highlight Text in PDF Online Free",
    description:
      "Highlight words, keywords and phrases inside PDF files online.",
    url: absoluteUrl("/highlight-pdf"),
    siteName,
    type: "website",
  },
}

const faqs = [
  {
    question: "Can I choose the highlight color?",
    answer:
      "Yes. You can choose from several highlight colors before processing the PDF.",
  },
  {
    question: "Can I download only the pages with matches?",
    answer:
      "Yes. The tool provides a full highlighted PDF and a matched-pages-only PDF.",
  },
  {
    question: "Will the original PDF be changed?",
    answer:
      "No. The tool creates a new downloadable highlighted copy and does not edit the file on your device.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Highlight Text in PDF",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Highlight matching text in PDF files and download a marked PDF copy.",
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
            label: "Highlight PDF Text",
            schemaHref: "/highlight-pdf",
          },
        ]}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          Highlight Text in PDF
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <HighlightPdfTool />
      </section>

      <ToolSeoContent
        title="Highlight Matching Text In A PDF"
        intro="This tool helps you mark matching words and phrases in a PDF so important information is easier to review, share and reference."
        steps={[
          "Upload the PDF file you want to highlight.",
          "Enter the text, keyword, name or phrase you want to mark.",
          "Choose a highlight color that makes the result easy to read.",
          "Download the full highlighted PDF or only the highlighted matching pages.",
        ]}
        uses={[
          "Highlight contract clauses, policy terms or report sections.",
          "Mark names, dates, addresses and reference numbers in long documents.",
          "Prepare study material by highlighting repeated keywords or definitions.",
          "Create a focused PDF containing only pages where the searched text appears.",
        ]}
        tips={[
          "Use a color with strong contrast against your PDF background so highlights stay readable.",
          "If a phrase does not match, try searching for one unique word from the phrase.",
        ]}
        faqs={faqs}
      />

      <RelatedTools currentHref="/highlight-pdf" />

    </main>
  )
}
