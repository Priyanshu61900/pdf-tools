import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    app: "free-pdf-tools-online",
    marker: "deploy-check-2026-05-18",
    expectedRoutes: ["/login", "/api/auth/google", "/api/auth/google/callback"],
  })
}
