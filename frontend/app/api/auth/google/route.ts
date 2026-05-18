import { NextResponse } from "next/server"

const GOOGLE_SITE_ORIGIN =
  "https://pdf-tools-8i25dqrmt-priyanshu61900s-projects.vercel.app"
const GOOGLE_REDIRECT_URI = `${GOOGLE_SITE_ORIGIN}/api/auth/google/callback`

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    )
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== GOOGLE_SITE_ORIGIN) {
    return NextResponse.redirect(new URL("/api/auth/google", GOOGLE_SITE_ORIGIN))
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
