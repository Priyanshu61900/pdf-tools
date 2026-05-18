import { NextResponse } from "next/server"

function getConfiguredSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    return null
  }

  return new URL(siteUrl).origin
}

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    )
  }

  const requestUrl = new URL(request.url)
  const configuredOrigin = getConfiguredSiteOrigin()

  if (configuredOrigin && requestUrl.origin !== configuredOrigin) {
    return NextResponse.redirect(new URL("/api/auth/google", configuredOrigin))
  }

  const redirectOrigin = configuredOrigin || requestUrl.origin
  const redirectUri = new URL(
    "/api/auth/google/callback",
    redirectOrigin
  ).toString()

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
