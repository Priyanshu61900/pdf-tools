import Link from "next/link"

export const metadata = {
  title: "Create Account",
  description:
    "Register for Free PDF Tools Online with Google to use premium PDF tools and API access.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">Create Account</h1>

        <p className="text-zinc-400 leading-8 mt-4">
          Register with Google to prepare for premium features like larger PDF
          files, batch processing, OCR, watermark removal and API access.
        </p>

        <a
          href="/api/auth/google"
          className="block bg-white text-black text-center font-semibold rounded-lg px-6 py-4 mt-8"
        >
          Register With Google
        </a>

        <p className="text-zinc-500 text-sm leading-7 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline">
            Log in
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
