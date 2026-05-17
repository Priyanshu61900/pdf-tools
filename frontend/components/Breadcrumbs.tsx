import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import { absoluteUrl } from "@/lib/site"

type Breadcrumb = {
  label: string
  href?: string
  schemaHref?: string
}

type BreadcrumbsProps = {
  items: Breadcrumb[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-5xl mx-auto px-6 pt-8 text-sm text-zinc-400"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.schemaHref || item.href || ""),
          })),
        }}
      />

      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-200">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <span aria-hidden="true">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
