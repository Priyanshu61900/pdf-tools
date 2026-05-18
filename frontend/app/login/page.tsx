import AuthPanel from "@/components/AuthPanel"
import { sessionCookieName, verifySessionCookie } from "@/lib/auth"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Login",
  description:
    "Log in to Free PDF Tools Online with Google or email to use PDF tools, API access and paid plans.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
}

type PageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  const cookieStore = await cookies()
  const session = verifySessionCookie(
    cookieStore.get(sessionCookieName)?.value
  )

  if (session) {
    redirect("/account")
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="animate-rise">
          <h1 className="text-4xl md:text-5xl font-bold">
            Log In To Process PDFs
          </h1>

          <p className="text-zinc-400 leading-8 mt-6">
            Tools and guides are public, but file processing requires an
            account. Log in to use your free 5-page limit or upgrade for larger
            PDFs.
          </p>

          <p className="text-zinc-500 text-sm leading-7 mt-6">
            New here?{" "}
            <Link href="/register" className="text-white underline">
              Create an account
            </Link>
            .
          </p>
        </div>

        <AuthPanel mode="login" error={error} />
      </section>
    </main>
  )
}
