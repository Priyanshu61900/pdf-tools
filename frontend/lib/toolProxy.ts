import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"
import {
  createUserKey,
  sessionCookieName,
  verifySessionCookie,
} from "@/lib/auth"

export async function proxyToolRequest(request: Request, backendPath: string) {
  const cookieStore = await cookies()
  const session = verifySessionCookie(
    cookieStore.get(sessionCookieName)?.value
  )

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        code: "SIGNUP_REQUIRED",
        error: "Please sign up or log in to use this tool.",
      },
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const response = await fetch(`${API_URL}${backendPath}`, {
    method: "POST",
    body: formData,
    headers: {
      "X-App-Secret": process.env.BACKEND_APP_SECRET || "",
      "X-User-Id": createUserKey(session),
      "X-User-Plan": session.plan,
    },
  })

  const data = await response.json()

  return NextResponse.json(data, {
    status: response.status,
  })
}
