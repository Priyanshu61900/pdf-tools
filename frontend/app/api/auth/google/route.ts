import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { authStateCookieName } from "@/lib/auth"

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    )
  }

  const state = randomBytes(24).toString("base64url")
  const redirectUri = new URL(
    "/api/auth/google/callback",
    process.env.NEXT_PUBLIC_SITE_URL || request.url
  ).toString()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  })

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )

  response.cookies.set(authStateCookieName, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
