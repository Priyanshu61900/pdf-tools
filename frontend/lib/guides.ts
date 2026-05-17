export type Guide = {
  slug: string
  title: string
  description: string
  keywords: string[]
  relatedToolHref: string
  sections: {
    title: string
    paragraphs: string[]
  }[]
}

export const guides: Guide[] = [
  {
    slug: "how-to-search-text-in-pdf",
    title: "How To Search Text In A PDF Online",
    description:
      "Learn how to search for words, names, numbers and phrases inside PDF documents, plus what to do when a PDF is scanned.",
    keywords: [
      "search text in PDF",
      "find words in PDF",
      "PDF keyword search",
      "search PDF online",
    ],
    relatedToolHref: "/search-text-in-pdf",
    sections: [
      {
        title: "Why PDF Search Matters",
        paragraphs: [
          "PDF files are often used for invoices, contracts, manuals, forms, reports and study material. These documents can be long, and manually scanning every page takes time. A PDF search tool helps you locate the exact word, phrase, number or name you need.",
          "Searching a PDF is especially useful when the document has repeated sections or dense formatting. Instead of reading page by page, you can search for a unique term and review only the matching results.",
        ],
      },
      {
        title: "How To Search A PDF",
        paragraphs: [
          "Start by uploading a PDF that contains selectable text. Enter the word, phrase, email, name, invoice number or reference code you want to find. The tool searches the document and creates a highlighted result so the matching text is easy to review.",
          "For best results, search for the most specific part of the information. A unique invoice number, exact surname, email domain or project code usually works better than a common word that appears on many pages.",
        ],
      },
      {
        title: "What If The PDF Is Scanned?",
        paragraphs: [
          "Some PDFs are made from scanned images. These files may look like normal documents, but the text is not selectable. If the search tool cannot find text that is visibly on the page, the file may need OCR before normal PDF text search can work.",
          "OCR stands for optical character recognition. It converts text in images into selectable text. After OCR is applied, the document becomes easier to search, highlight and convert.",
        ],
      },
    ],
  },
  {
    slug: "how-to-highlight-pdf-text",
    title: "How To Highlight Text In A PDF Online",
    description:
      "A practical guide to highlighting matching words and phrases in PDF files, choosing readable colors and downloading highlighted results.",
    keywords: [
      "highlight PDF text",
      "PDF highlighter online",
      "highlight words in PDF",
      "mark PDF text",
    ],
    relatedToolHref: "/highlight-pdf",
    sections: [
      {
        title: "When Highlighting Helps",
        paragraphs: [
          "Highlighting a PDF is useful when you need to review important terms, mark repeated keywords, prepare study notes or call attention to specific clauses in a document. It turns a large file into something easier to scan.",
          "Online PDF highlighting is also helpful when you want a copy of the file with visible marks. You can keep the original document untouched and download a new highlighted PDF for review or sharing.",
        ],
      },
      {
        title: "Choosing A Highlight Color",
        paragraphs: [
          "Choose a color that contrasts with the PDF background. Yellow is a common default because it is easy to read on white pages. Red and orange can help urgent terms stand out, while green, blue or pink can be useful for categorizing different types of matches.",
          "Avoid using colors that make the original text hard to read. The purpose of highlighting is to guide attention while keeping the document readable.",
        ],
      },
      {
        title: "Highlighting Matching Text",
        paragraphs: [
          "Upload the PDF, enter the text you want to highlight, select a color and process the file. The tool searches for matches and adds visible highlight annotations to a downloadable PDF copy.",
          "If the phrase does not match, try searching for one unique word from the phrase. PDFs can store line breaks and spacing in ways that make exact phrase matching harder.",
        ],
      },
    ],
  },
  {
    slug: "extract-pages-from-pdf-by-keyword",
    title: "How To Extract PDF Pages By Keyword",
    description:
      "Learn how to create a smaller PDF by extracting only pages that contain a searched keyword, name, number or phrase.",
    keywords: [
      "extract PDF pages by keyword",
      "extract matching PDF pages",
      "PDF page extractor",
      "extract pages containing text",
    ],
    relatedToolHref: "/extract-pages",
    sections: [
      {
        title: "Why Extract Matching Pages?",
        paragraphs: [
          "Large PDFs often contain only a few pages that matter for a specific task. Extracting pages by keyword helps you create a smaller, focused document without manually checking every page.",
          "This is useful for reports, case files, invoices, manuals and policy documents. You can search for a customer name, invoice number, project code, legal term or topic and keep only the pages where that term appears.",
        ],
      },
      {
        title: "How Keyword Extraction Works",
        paragraphs: [
          "The tool searches the PDF for the text you enter. When it finds a page with matching text, it highlights the match and adds that page to a new PDF file. Pages without the searched text are left out.",
          "The result is a smaller PDF that is easier to review, send or archive. Because matches are highlighted, the reason each page was included is visible in the output.",
        ],
      },
      {
        title: "Tips For Better Extraction",
        paragraphs: [
          "Use specific search terms. A unique ID, email address, invoice number or full name usually gives a cleaner result than a broad word.",
          "If too many pages are extracted, make the search term more specific. If no pages are extracted, check spelling and confirm the PDF contains selectable text.",
        ],
      },
    ],
  },
  {
    slug: "convert-pdf-to-word-online",
    title: "How To Convert PDF To Word Online",
    description:
      "Understand how PDF to Word conversion works, when DOCX output is useful and why complex PDFs may need formatting review.",
    keywords: [
      "convert PDF to Word",
      "PDF to DOCX",
      "editable Word document",
      "PDF converter online",
    ],
    relatedToolHref: "/pdf-to-word",
    sections: [
      {
        title: "Why Convert PDF To Word?",
        paragraphs: [
          "PDF is a reliable format for sharing and printing, but it is not always convenient for editing. Converting a PDF to Word creates a DOCX file that can be opened in Microsoft Word, Google Docs and other compatible editors.",
          "This is helpful when you need to update text, reuse document content, edit drafts, copy sections into another file or prepare a document for collaboration.",
        ],
      },
      {
        title: "What To Expect From Conversion",
        paragraphs: [
          "A PDF to Word converter attempts to preserve text, layout and structure. Simple documents usually convert more cleanly than files with complex tables, columns, custom fonts or scanned images.",
          "After downloading the DOCX file, review the formatting before sending or publishing it. Some documents may need small manual adjustments because PDF and Word store layout differently.",
        ],
      },
      {
        title: "Scanned PDFs And OCR",
        paragraphs: [
          "If a PDF is made from scanned images, conversion may produce images instead of editable text. OCR is needed when you want scanned text to become selectable and editable.",
          "For best results, use PDFs that already contain selectable text or run OCR before converting scanned files to Word.",
        ],
      },
    ],
  },
]

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}
