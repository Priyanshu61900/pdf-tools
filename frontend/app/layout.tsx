import "./globals.css"

export const metadata = {
  title: {
    default: "Free PDF Tools Online",
    template: "%s | Free PDF Tools Online",
  },

  description:
    "Free online PDF tools to search text in PDFs, highlight text, extract pages and convert PDF to Word instantly.",

  keywords: [
    "pdf tools",
    "search pdf",
    "highlight pdf",
    "extract pdf pages",
    "pdf to word",
    "free pdf tools",
  ],

  openGraph: {
    title: "Free PDF Tools Online",
    description:
      "Search, highlight, extract and convert PDFs online for free.",
    siteName: "Free PDF Tools Online",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  )
}