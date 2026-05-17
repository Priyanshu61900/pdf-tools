import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sessionCookieName, verifySessionCookie } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const session = verifySessionCookie(
    cookieStore.get(sessionCookieName)?.value
  )

  return NextResponse.json({
    authenticated: Boolean(session),
    user: session,
  })
}
