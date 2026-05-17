import type { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { getGuide, guides } from "@/lib/guides"
import { absoluteUrl, siteName } from "@/lib/site"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)

  if (!guide) {
    return {}
  }

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
      type: "article",
      siteName,
    },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = getGuide(slug)

  if (!guide) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
          author: {
            "@type": "Organization",
            name: siteName,
          },
          publisher: {
            "@type": "Organization",
            name: siteName,
          },
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          {
            label: guide.title,
            schemaHref: `/guides/${guide.slug}`,
          },
        ]}
      />

      <article className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          {guide.title}
        </h1>

        <p className="text-zinc-400 leading-8 mt-6">
          {guide.description}
        </p>

        <div className="grid gap-12 mt-14">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-bold">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-zinc-400 leading-8 mt-5"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg p-6 mt-14">
          <h2 className="text-2xl font-bold">Try The Related Tool</h2>
          <p className="text-zinc-400 leading-8 mt-4">
            Use the matching PDF tool to apply this guide directly in your
            browser.
          </p>
          <Link
            href={guide.relatedToolHref}
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold mt-5"
          >
            Open PDF Tool
          </Link>
        </div>
      </article>
    </main>
  )
}
