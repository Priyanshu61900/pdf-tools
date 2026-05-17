import "./globals.css"
import SiteFooter from "@/components/SiteFooter"
import SiteHeader from "@/components/SiteHeader"
import { siteName, siteUrl } from "@/lib/site"

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },

  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  category: "PDF Tools",

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
    title: siteName,
    description:
      "Search, highlight, extract and convert PDFs online for free.",
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: siteName,
    description:
      "Search, highlight, extract and convert PDFs online for free.",
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
