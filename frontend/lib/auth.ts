import { createHmac, timingSafeEqual } from "crypto"

export const authStateCookieName = "pdf_tools_auth_state"
export const sessionCookieName = "pdf_tools_session"
export const emailAccountCookieName = "pdf_tools_email_account"

export type UserSession = {
  email: string
  name: string
  picture?: string
  provider: "google" | "github" | "email"
  plan: "Free" | "Premium" | "Pro" | "API"
}

export type EmailAccount = {
  email: string
  name: string
  passwordHash: string
  salt: string
  verified: true
  plan: UserSession["plan"]
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

function signaturesMatch(signature: string, expectedSignature: string) {
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  )
}

export function createSessionCookie(session: UserSession) {
  const payload = base64UrlEncode(JSON.stringify(session))
  const signature = sign(payload)

  return `${payload}.${signature}`
}

export function createSignedValue(value: unknown) {
  const payload = base64UrlEncode(JSON.stringify(value))
  const signature = sign(payload)

  return `${payload}.${signature}`
}

export function createUserKey(session: UserSession) {
  return sign(`user:${session.email.toLowerCase()}`)
}

export function verifySessionCookie(value?: string): UserSession | null {
  return verifySignedValue<UserSession>(value)
}

export function verifyEmailAccountCookie(value?: string): EmailAccount | null {
  return verifySignedValue<EmailAccount>(value)
}

export function verifySignedValue<T>(value?: string): T | null {
  if (!value) {
    return null
  }

  const [payload, signature] = value.split(".")

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = sign(payload)

  if (!signaturesMatch(signature, expectedSignature)) {
    return null
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as T
  } catch {
    return null
  }
}
