import Link from "next/link"

export const metadata = {
  title: "About",
  description:
    "Learn about OmniToolbox and the PDF tools available on the website.",
  alternates: {
    canonical: "/about",
  },
}

const tools = [
  "Search text inside PDF files",
  "Highlight matching PDF text",
  "Extract only pages that contain matching text",
  "Convert PDF files to editable Word documents",
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          About OmniToolbox
        </h1>

        <p className="text-zinc-400 leading-8 mt-6">
          OmniToolbox is a simple set of browser-based PDF utilities
          made for quick document tasks without installing desktop software.
          The site focuses on practical tools that help people find, highlight,
          extract and convert PDF content.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold">What You Can Do</h2>

        <div className="grid gap-4 mt-6">
          {tools.map((tool) => (
            <p
              key={tool}
              className="border border-zinc-800 bg-zinc-950 p-4 rounded-lg text-zinc-300"
            >
              {tool}
            </p>
          ))}
        </div>

        <p className="text-zinc-400 leading-8 mt-8">
          We aim to keep the tools easy to use, fast and accessible from modern
          browsers. For questions, feedback or privacy requests, visit the{" "}
          <Link href="/contact" className="text-white underline">
            Contact page
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
