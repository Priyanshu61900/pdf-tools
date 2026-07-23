import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import { NextResponse } from "next/server"
import {
  createSignedValue,
  createSessionCookie,
  emailAccountCookieName,
  sessionCookieName,
  verifyEmailAccountCookie,
  verifySignedValue,
  type EmailAccount,
  type UserSession,
} from "@/lib/auth"

type EmailLoginBody = {
  action?: "login" | "register"
  email?: string
  name?: string
  password?: string
}

type PendingEmailAccount = Omit<EmailAccount, "verified"> & {
  verified: false
}

function hashPassword(password: string, salt = randomBytes(16).toString("base64url")) {
  return {
    salt,
    passwordHash: scryptSync(password, salt, 64).toString("base64url"),
  }
}

function passwordMatches(password: string, account: EmailAccount) {
  const hash = scryptSync(password, account.salt, 64)
  const storedHash = Buffer.from(account.passwordHash, "base64url")

  return hash.length === storedHash.length && timingSafeEqual(hash, storedHash)
}

function createSession(account: EmailAccount): UserSession {
  return {
    email: account.email,
    name: account.name,
    provider: "email",
    plan: account.plan,
  }
}

function getBaseUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin
  )
}

async function sendConfirmationEmail(email: string, name: string, confirmationUrl: string) {
  if (!process.env.RESEND_API_KEY || !process.env.AUTH_EMAIL_FROM) {
    return false
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.AUTH_EMAIL_FROM,
      to: email,
      subject: "Confirm your OmniToolbox PDF Tools account",
      html: `
        <p>Hi ${name},</p>
        <p>Confirm your OmniToolbox account to finish signing in.</p>
        <p><a href="${confirmationUrl}">Confirm my account</a></p>
      `,
    }),
  })

  return response.ok
}

export async function POST(request: Request) {
  const body = (await request.json()) as EmailLoginBody
  const action = body.action || "login"
  const email = body.email?.trim().toLowerCase()
  const password = body.password || ""

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      {
        success: false,
        error: "Please enter a valid email address.",
      },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        success: false,
        error: "Password must be at least 8 characters.",
      },
      { status: 400 }
    )
  }

  if (action === "register") {
    const { passwordHash, salt } = hashPassword(password)
    const pendingAccount: PendingEmailAccount = {
      email,
      name: body.name?.trim() || email.split("@")[0],
      passwordHash,
      salt,
      verified: false,
      plan: "Free",
    }
    const token = createSignedValue(pendingAccount)
    const confirmationUrl = `${getBaseUrl(request)}/api/auth/email/confirm?token=${encodeURIComponent(token)}`
    const emailSent = await sendConfirmationEmail(
      pendingAccount.email,
      pendingAccount.name,
      confirmationUrl
    )

    return NextResponse.json({
      success: true,
      needsConfirmation: true,
      emailSent,
      message: emailSent
        ? "Check your email to confirm your account."
        : "Email delivery is not configured yet. Add RESEND_API_KEY and AUTH_EMAIL_FROM in Vercel.",
      confirmationUrl: emailSent ? undefined : confirmationUrl,
    })
  }

  const account = verifyEmailAccountCookie(
    request.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith(`${emailAccountCookieName}=`))
      ?.split("=")[1]
  )

  if (!account || account.email !== email) {
    return NextResponse.json(
      {
        success: false,
        error: "Create and confirm an account on this device before logging in with email.",
      },
      { status: 401 }
    )
  }

  if (!passwordMatches(password, account)) {
    return NextResponse.json(
      {
        success: false,
        error: "Incorrect email or password.",
      },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set(sessionCookieName, createSessionCookie(createSession(account)), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const pendingAccount = verifySignedValue<PendingEmailAccount>(token || undefined)

  if (!pendingAccount) {
    return NextResponse.redirect(new URL("/login?error=email_confirmation_failed", request.url))
  }

  const account: EmailAccount = {
    ...pendingAccount,
    verified: true,
  }
  const response = NextResponse.redirect(new URL("/account", request.url))

  response.cookies.set(emailAccountCookieName, createSignedValue(account), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  response.cookies.set(sessionCookieName, createSessionCookie(createSession(account)), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}
