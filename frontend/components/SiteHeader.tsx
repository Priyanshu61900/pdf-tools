import Link from "next/link"
import { tools } from "@/lib/site"

const navLinks = [
  { href: "/tools", label: "All Tools" },
  ...tools.map((tool) => ({
    href: tool.href,
    label: tool.shortTitle,
  })),
  { href: "/guides", label: "Guides" },
]

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold">
          Free PDF Tools Online
        </Link>

        <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
