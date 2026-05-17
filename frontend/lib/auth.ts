import { createHmac, timingSafeEqual } from "crypto"

export const authStateCookieName = "pdf_tools_auth_state"
export const sessionCookieName = "pdf_tools_session"

export type UserSession = {
  email: string
  name: string
  picture?: string
  provider: "google"
  plan: "Free" | "Pro" | "API"
}

function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    "local-development-secret"
  )
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url")
}

export function createSessionCookie(session: UserSession) {
  const payload = base64UrlEncode(JSON.stringify(session))
  const signature = sign(payload)

  return `${payload}.${signature}`
}

export function verifySessionCookie(value?: string): UserSession | null {
  if (!value) {
    return null
  }

  const [payload, signature] = value.split(".")

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as UserSession
  } catch {
    return null
  }
}
