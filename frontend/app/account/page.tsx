import Link from "next/link"
import { cookies } from "next/headers"
import { sessionCookieName, verifySessionCookie } from "@/lib/auth"

export const metadata = {
  title: "Account",
  description:
    "Manage your OmniToolbox account, plan and API access.",
  alternates: {
    canonical: "/account",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function AccountPage() {
  const cookieStore = await cookies()
  const session = verifySessionCookie(
    cookieStore.get(sessionCookieName)?.value
  )

  if (!session) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold">Account</h1>
          <p className="text-zinc-400 leading-8 mt-6">
            Log in with Google to manage premium PDF tools and API access.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-black font-semibold rounded-lg px-6 py-3 mt-8"
          >
            Log In
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="animate-rise max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome, {session.name}
        </h1>
        <p className="text-zinc-400 leading-8 mt-4">
          You are signed in with{" "}
          {session.provider === "google"
            ? "Google"
            : session.provider === "github"
              ? "GitHub"
              : "email"}.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="hover-lift border border-zinc-800 bg-zinc-950/90 rounded-lg p-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            <p className="text-zinc-400 leading-8 mt-4">
              {session.name}
            </p>
            <p className="text-zinc-500 leading-8">
              {session.email}
            </p>
          </div>

          <div className="hover-lift border border-zinc-800 bg-zinc-950/90 rounded-lg p-6">
            <h2 className="text-2xl font-bold">Current Plan</h2>
            <p className="text-zinc-400 leading-8 mt-4">
              {session.plan}
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-white text-black font-semibold rounded-lg px-5 py-3 mt-5 transition hover:-translate-y-0.5"
            >
              View Plans
            </Link>
          </div>
        </div>

        <section className="hover-lift border border-zinc-800 bg-zinc-950/90 rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold">API Access</h2>
          <p className="text-zinc-400 leading-8 mt-4">
            API keys and billing controls will be available after the paid API
            checkout is connected.
          </p>
          <Link
            href="/api-access"
            className="inline-block border border-zinc-700 rounded-lg px-5 py-3 mt-5 transition hover:-translate-y-0.5 hover:border-zinc-500"
          >
            View API Access
          </Link>
        </section>

        <a
          href="/api/auth/logout"
          className="inline-block text-zinc-400 underline mt-8"
        >
          Log out
        </a>
      </section>
    </main>
  )
}
