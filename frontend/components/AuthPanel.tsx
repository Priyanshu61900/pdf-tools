"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type AuthPanelProps = {
  mode?: "login" | "register"
  error?: string
}

const errorMessages: Record<string, string> = {
  google_not_configured:
    "Google login is not configured yet. Add Google OAuth environment variables in Vercel.",
  github_not_configured:
    "GitHub login is not configured yet. Add GitHub OAuth environment variables in Vercel.",
  invalid_google_state: "Google sign in could not be completed. Please start again from the Google button.",
  invalid_github_state: "GitHub login expired. Please try again.",
  google_login_failed: "Google login failed. Please try again.",
  github_login_failed: "GitHub login failed. Please try again.",
  google_profile_failed:
    "We could not read your Google profile. Please try again.",
  github_profile_failed:
    "We could not read your GitHub profile. Please try again.",
  github_email_missing:
    "Your GitHub account did not return a verified email address.",
}

export default function AuthPanel({ mode = "register", error }: AuthPanelProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setEmailError("")

      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setEmailError(data.error || "Email sign in failed.")
        return
      }

      router.push("/account")
      router.refresh()
    } catch {
      setEmailError("Email sign in failed.")
    } finally {
      setLoading(false)
    }
  }

  const title = mode === "login" ? "Log In" : "Create Your Free Account"
  const submitLabel = mode === "login" ? "Continue With Email" : "Sign Up With Email"

  return (
    <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 rounded-lg p-6">
      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="text-zinc-400 leading-7 mt-3">
        Sign up to use the PDF tools. Free accounts can process PDFs up to 5
        pages, and Premium unlocks larger files for Rs. 99.
      </p>

      {error && (
        <p className="border border-red-900 bg-red-950 text-red-200 rounded-lg p-4 mt-5">
          {errorMessages[error] || "Sign in failed. Please try again."}
        </p>
      )}

      <div className="grid gap-3 mt-6">
        <a
          href="/api/auth/google"
          className="block bg-white text-black text-center font-semibold rounded-lg px-5 py-3"
        >
          Continue With Google
        </a>

        <a
          href="/api/auth/github"
          className="block border border-zinc-700 text-center font-semibold rounded-lg px-5 py-3"
        >
          Continue With GitHub
        </a>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-zinc-800 flex-1" />
        <span className="text-zinc-500 text-sm">or</span>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      <form onSubmit={submitEmail} className="grid gap-3">
        <input
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black rounded-lg p-3 font-semibold"
        >
          {loading ? "Signing in..." : submitLabel}
        </button>
      </form>

      {emailError && (
        <p className="text-red-400 text-sm mt-4">
          {emailError}
        </p>
      )}
    </div>
  )
}
