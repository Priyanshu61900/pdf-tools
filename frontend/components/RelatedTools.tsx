import Link from "next/link"
import { tools } from "@/lib/site"

type RelatedToolsProps = {
  currentHref: string
}

export default function RelatedTools({ currentHref }: RelatedToolsProps) {
  const relatedTools = tools.filter((tool) => tool.href !== currentHref)

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <h2 className="text-3xl font-bold">Related PDF Tools</h2>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {relatedTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="border border-zinc-800 bg-zinc-950 rounded-lg p-5 hover:border-zinc-600 transition"
          >
            <h3 className="text-xl font-semibold">{tool.title}</h3>
            <p className="text-zinc-400 leading-7 mt-3">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
