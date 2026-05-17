import AuthPanel from "@/components/AuthPanel"
import Link from "next/link"

export const metadata = {
  title: "Create Account",
  description:
    "Register for Free PDF Tools Online with Google, GitHub or email to use PDF tools and premium features.",
  alternates: {
    canonical: "/register",
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

export default async function RegisterPage({ searchParams }: PageProps) {
  const { error } = await searchParams

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Sign Up To Use The PDF Tools
          </h1>

          <p className="text-zinc-400 leading-8 mt-6">
            You can browse every tool and guide without an account. To process
            PDF files, create a free account with Google, GitHub or email.
            Free accounts can process PDFs up to 5 pages.
          </p>

          <p className="text-zinc-400 leading-8 mt-4">
            Premium costs Rs. 99 and unlocks larger PDFs, repeated processing,
            batch workflows and API-ready access.
          </p>

          <p className="text-zinc-500 text-sm leading-7 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline">
              Log in
            </Link>
            .
          </p>
        </div>

        <AuthPanel mode="register" error={error} />
      </section>
    </main>
  )
}
