import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { authStateCookieName } from "@/lib/auth"

export function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=github_not_configured", request.url)
    )
  }

  const state = randomBytes(24).toString("base64url")
  const redirectUri = new URL(
    "/api/auth/github/callback",
    process.env.NEXT_PUBLIC_SITE_URL || request.url
  ).toString()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  })

  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
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
