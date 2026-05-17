import { NextResponse } from "next/server"
import {
  authStateCookieName,
  createSessionCookie,
  sessionCookieName,
  type UserSession,
} from "@/lib/auth"

type GithubTokenResponse = {
  access_token?: string
  error?: string
}

type GithubUser = {
  email?: string | null
  login?: string
  name?: string | null
  avatar_url?: string
}

type GithubEmail = {
  email: string
  primary: boolean
  verified: boolean
}

function redirectWithError(request: Request, error: string) {
  return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${authStateCookieName}=`))
    ?.split("=")[1]

  if (!code || !state || !storedState || state !== storedState) {
    return redirectWithError(request, "invalid_github_state")
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return redirectWithError(request, "github_not_configured")
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state,
    }),
  })

  const tokenData = (await tokenRes.json()) as GithubTokenResponse

  if (!tokenRes.ok || !tokenData.access_token) {
    return redirectWithError(request, tokenData.error || "github_login_failed")
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
    },
  })

  const user = (await userRes.json()) as GithubUser

  if (!userRes.ok) {
    return redirectWithError(request, "github_profile_failed")
  }

  let email = user.email || ""

  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    })

    const emails = (await emailsRes.json()) as GithubEmail[]
    email =
      emails.find((item) => item.primary && item.verified)?.email ||
      emails.find((item) => item.verified)?.email ||
      ""
  }

  if (!email) {
    return redirectWithError(request, "github_email_missing")
  }

  const session: UserSession = {
    email,
    name: user.name || user.login || email,
    picture: user.avatar_url,
    provider: "github",
    plan: "Free",
  }

  const response = NextResponse.redirect(new URL("/account", request.url))

  response.cookies.set(sessionCookieName, createSessionCookie(session), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  response.cookies.set(authStateCookieName, "", {
    maxAge: 0,
    path: "/",
  })

  return response
}
