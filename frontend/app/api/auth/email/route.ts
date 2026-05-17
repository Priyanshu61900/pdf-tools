import { NextResponse } from "next/server"
import {
  createSessionCookie,
  sessionCookieName,
  type UserSession,
} from "@/lib/auth"

type EmailLoginBody = {
  email?: string
  name?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as EmailLoginBody
  const email = body.email?.trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      {
        success: false,
        error: "Please enter a valid email address.",
      },
      { status: 400 }
    )
  }

  const session: UserSession = {
    email,
    name: body.name?.trim() || email,
    provider: "email",
    plan: "Free",
  }

  const response = NextResponse.json({
    success: true,
  })

  response.cookies.set(sessionCookieName, createSessionCookie(session), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
