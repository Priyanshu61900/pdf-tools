import { NextResponse } from "next/server"

function getGoogleRedirectUri(request: Request) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI
  }

  if (process.env.NODE_ENV !== "production") {
    return new URL("/api/auth/google/callback", request.url).toString()
  }

  return null
}

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  const redirectUri = getGoogleRedirectUri(request)

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    )
  }

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
