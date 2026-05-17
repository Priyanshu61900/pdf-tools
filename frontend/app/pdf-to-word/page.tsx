import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import PdfToWordTool from "@/components/PdfToWordTool"
import RelatedTools from "@/components/RelatedTools"
import ToolSeoContent from "@/components/ToolSeoContent"
import { absoluteUrl, siteName } from "@/lib/site"

export const metadata = {
  title: "PDF to Word Converter Online Free - Convert PDF to DOCX",
  description:
    "Convert PDF files to editable Word DOCX documents online. Upload a PDF and download a Word file for editing.",
  keywords: [
    "PDF to Word",
    "convert PDF to Word",
    "PDF to DOCX",
    "editable Word document",
    "PDF converter online",
  ],
  alternates: {
    canonical: "/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter Online Free",
    description:
      "Convert PDF files to editable Word DOCX documents online.",
    url: absoluteUrl("/pdf-to-word"),
    siteName,
    type: "website",
  },
}

const faqs = [
  {
    question: "Can I convert a PDF to an editable Word document?",
    answer:
      "Yes. Upload a PDF and the tool creates a DOCX file that can be opened in Microsoft Word or compatible editors.",
  },
  {
    question: "Will the Word file look exactly like the PDF?",
    answer:
      "The converter tries to preserve layout, text and structure, but complex PDFs may need small manual adjustments after conversion.",
  },
  {
    question: "Does this work with scanned PDFs?",
    answer:
      "Image-only scanned PDFs may not convert into editable text unless OCR has already been applied.",
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "PDF to Word Converter",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description:
            "Convert PDF files into editable Word DOCX documents online.",
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
            label: "PDF to Word Converter",
            schemaHref: "/pdf-to-word",
          },
        ]}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          PDF to Word Converter
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <PdfToWordTool />
      </section>

      <ToolSeoContent
        title="Convert PDF Files To Word Documents"
        intro="Use this PDF to Word converter when you need to edit text, reuse document content, update forms or move PDF information into a DOCX workflow."
        steps={[
          "Upload the PDF file you want to convert.",
          "Start the conversion and wait for the DOCX file to be created.",
          "Download the Word document.",
          "Open the DOCX file in Microsoft Word, Google Docs or another compatible editor.",
        ]}
        uses={[
          "Edit text from reports, letters, forms and business documents.",
          "Reuse PDF content in Word templates or collaborative documents.",
          "Convert study notes, drafts and reference files into editable DOCX format.",
          "Make quick changes to PDF content without rebuilding the document from scratch.",
        ]}
        tips={[
          "After conversion, review formatting carefully because tables, columns and complex layouts may need adjustment.",
          "For scanned PDFs, use OCR first if you need editable text rather than images.",
        ]}
        faqs={faqs}
      />

      <RelatedTools currentHref="/pdf-to-word" />

    </main>
  )
}
