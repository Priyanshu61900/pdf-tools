import { NextResponse } from "next/server"
import {
  createSessionCookie,
  sessionCookieName,
  type UserSession,
} from "@/lib/auth"

type GoogleTokenResponse = {
  access_token?: string
  error?: string
}

type GoogleUserInfo = {
  email?: string
  name?: string
  picture?: string
}

const GOOGLE_SITE_ORIGIN =
  "https://pdf-tools-8i25dqrmt-priyanshu61900s-projects.vercel.app"
const GOOGLE_REDIRECT_URI = `${GOOGLE_SITE_ORIGIN}/api/auth/google/callback`

function redirectWithError(request: Request, error: string) {
  return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error || !code) {
    return redirectWithError(request, error || "google_login_failed")
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return redirectWithError(request, "google_not_configured")
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: GOOGLE_REDIRECT_URI,
    }),
  })

  const tokenData = (await tokenRes.json()) as GoogleTokenResponse

  if (!tokenRes.ok || !tokenData.access_token) {
    return redirectWithError(request, tokenData.error || "google_login_failed")
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const userInfo = (await userRes.json()) as GoogleUserInfo

  if (!userRes.ok || !userInfo.email) {
    return redirectWithError(request, "google_profile_failed")
  }

  const session: UserSession = {
    email: userInfo.email,
    name: userInfo.name || userInfo.email,
    picture: userInfo.picture,
    provider: "google",
    plan: "Free",
  }

  const response = NextResponse.redirect(new URL("/account", GOOGLE_SITE_ORIGIN))

  response.cookies.set(sessionCookieName, createSessionCookie(session), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return response
}
