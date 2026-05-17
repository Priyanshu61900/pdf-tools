export const siteName = "Free PDF Tools Online"

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://freepdftoolsonline.com"

export const tools = [
  {
    title: "Search Text in PDF",
    shortTitle: "Search",
    href: "/search-text-in-pdf",
    description:
      "Find words, names, numbers, emails and phrases inside PDF files.",
  },
  {
    title: "Highlight PDF Text",
    shortTitle: "Highlight",
    href: "/highlight-pdf",
    description:
      "Highlight matching text in a PDF and download a marked copy.",
  },
  {
    title: "Extract Matching PDF Pages",
    shortTitle: "Extract",
    href: "/extract-pages",
    description:
      "Extract only PDF pages that contain a searched keyword or phrase.",
  },
  {
    title: "PDF to Word Converter",
    shortTitle: "Convert",
    href: "/pdf-to-word",
    description:
      "Convert PDF files into editable Word DOCX documents online.",
  },
]

export const companyLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/api-access", label: "API Access" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
]

export function absoluteUrl(path: string) {
  if (!path) {
    return siteUrl
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}
