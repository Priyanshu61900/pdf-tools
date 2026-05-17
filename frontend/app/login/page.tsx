import Link from "next/link"

export const metadata = {
  title: "Login",
  description:
    "Log in to Free PDF Tools Online with Google to manage PDF tools, API access and paid plans.",
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

const errorMessages: Record<string, string> = {
  google_not_configured:
    "Google login is not configured yet. Add the Google OAuth environment variables in Vercel.",
  invalid_google_state:
    "Google login expired. Please try again.",
  google_login_failed:
    "Google login failed. Please try again.",
  google_profile_failed:
    "We could not read your Google profile. Please try again.",
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">Log In</h1>

        <p className="text-zinc-400 leading-8 mt-4">
          Use your Google account to access saved settings, premium tools and
          developer API access.
        </p>

        {error && (
          <p className="border border-red-900 bg-red-950 text-red-200 rounded-lg p-4 mt-6">
            {errorMessages[error] || "Login failed. Please try again."}
          </p>
        )}

        <a
          href="/api/auth/google"
          className="block bg-white text-black text-center font-semibold rounded-lg px-6 py-4 mt-8"
        >
          Continue With Google
        </a>

        <p className="text-zinc-500 text-sm leading-7 mt-6">
          New here?{" "}
          <Link href="/register" className="text-white underline">
            Create an account
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
