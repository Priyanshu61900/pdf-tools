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
  invalid_google_state: "Google sign in could not be completed. Please start again from the Google button.",
  google_login_failed: "Google login failed. Please try again.",
  google_profile_failed:
    "We could not read your Google profile. Please try again.",
  email_confirmation_failed:
    "That email confirmation link is invalid. Please create your account again.",
}

export default function AuthPanel({ mode = "register", error }: AuthPanelProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [confirmationUrl, setConfirmationUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setEmailError("")
      setEmailMessage("")
      setConfirmationUrl("")

      const response = await fetch("/api/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: mode,
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setEmailError(data.error || "Email sign in failed.")
        return
      }

      if (data.needsConfirmation) {
        setEmailMessage(data.message || "Check your email to confirm your account.")
        setConfirmationUrl(data.confirmationUrl || "")
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
  const submitLabel = mode === "login" ? "Log In With Email" : "Create Email Account"

  return (
    <div className="animate-rise w-full max-w-md border border-zinc-800 bg-zinc-950/90 rounded-lg p-6 shadow-2xl shadow-black/30">
      <h2 className="text-3xl font-bold">{title}</h2>

      <p className="text-zinc-400 leading-7 mt-3">
        {mode === "login"
          ? "Log in with Google or your confirmed email account."
          : "Create a free account with Google or email. Free accounts can process PDFs up to 5 pages."}
      </p>

      {error && (
        <p className="border border-red-900 bg-red-950 text-red-200 rounded-lg p-4 mt-5">
          {errorMessages[error] || "Sign in failed. Please try again."}
        </p>
      )}

      <div className="grid gap-3 mt-6">
        <a
          href="/api/auth/google"
          className="block bg-white text-black text-center font-semibold rounded-lg px-5 py-3 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
        >
          Continue With Google
        </a>
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-zinc-800 flex-1" />
        <span className="text-zinc-500 text-sm">or</span>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      <form onSubmit={submitEmail} className="grid gap-3">
        {mode === "register" && (
          <input
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white transition focus:border-zinc-500 focus:outline-none"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}

        <input
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white transition focus:border-zinc-500 focus:outline-none"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white transition focus:border-zinc-500 focus:outline-none"
          placeholder="Password"
          type="password"
          value={password}
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-white text-black rounded-lg p-3 font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : submitLabel}
        </button>
      </form>

      {emailMessage && (
        <div className="border border-emerald-900 bg-emerald-950 text-emerald-100 rounded-lg p-4 mt-4">
          <p>{emailMessage}</p>
          {confirmationUrl && (
            <a
              href={confirmationUrl}
              className="inline-block text-sm underline mt-3"
            >
              Confirm account now
            </a>
          )}
        </div>
      )}

      {emailError && (
        <p className="text-red-400 text-sm mt-4">
          {emailError}
        </p>
      )}
    </div>
  )
}
