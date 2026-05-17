import { NextResponse } from "next/server"
import { sessionCookieName } from "@/lib/auth"

export function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url))

  response.cookies.set(sessionCookieName, "", {
    maxAge: 0,
    path: "/",
  })

  return response
}
