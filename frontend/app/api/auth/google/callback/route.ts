import { NextResponse } from "next/server"
import {
  authStateCookieName,
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
    return redirectWithError(request, "invalid_google_state")
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return redirectWithError(request, "google_not_configured")
  }

  const redirectUri = new URL(
    "/api/auth/google/callback",
    process.env.NEXT_PUBLIC_SITE_URL || request.url
  ).toString()

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
      redirect_uri: redirectUri,
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
