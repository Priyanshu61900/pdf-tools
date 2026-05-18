import { NextResponse } from "next/server"

const GOOGLE_CALLBACK_PATH = "/api/auth/google/callback"

function getGoogleRedirectUri(request: Request) {
  return (
    process.env.GOOGLE_REDIRECT_URI ||
    new URL(GOOGLE_CALLBACK_PATH, request.url).toString()
  )
}

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    )
  }

  const redirectUri = getGoogleRedirectUri(request)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
