import { cookies } from "next/headers"
import Link from "next/link"
import { sessionCookieName, verifySessionCookie } from "@/lib/auth"
import { tools } from "@/lib/site"

const navLinks = [
  { href: "/tools", label: "All Tools" },
  ...tools.map((tool) => ({
    href: tool.href,
    label: tool.shortTitle,
  })),
  { href: "/pricing", label: "Pricing" },
  { href: "/api-access", label: "API" },
  { href: "/resources", label: "Resources" },
  { href: "/guides", label: "Guides" },
]

function getDisplayName(name: string) {
  return name.trim().split(/\s+/)[0] || "Account"
}

export default async function SiteHeader() {
  const cookieStore = await cookies()
  const session = verifySessionCookie(
    cookieStore.get(sessionCookieName)?.value
  )

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold transition hover:text-zinc-300">
          OmniToolbox
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:-translate-y-0.5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={session ? "/account" : "/login"}
            className="rounded-lg border border-zinc-700 px-3 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:border-zinc-500"
          >
            {session ? getDisplayName(session.name) : "Login"}
          </Link>
        </nav>
      </div>
    </header>
  )
}
