/**
 * Authenticated proxy route — forwards browser requests to the .NET backend
 * with the server-side JWT from the Auth.js session.
 *
 * Browser components call /backend/api/... → this route → .NET API.
 * This keeps the access token server-side only.
 *
 * When MOCK_API=true the request is handled entirely in-process by mock-handler.
 */
import { auth } from "@/lib/auth"
import { handleMockRequest } from "@/lib/mock-handler"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL ?? "http://localhost:5000"
const MOCK_API = process.env.MOCK_API === "true"

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { path } = await params

  // ── Mock mode ──────────────────────────────────────────────────────────────
  if (MOCK_API) {
    return handleMockRequest(req, path)
  }

  // ── Real backend ───────────────────────────────────────────────────────────
  const url = `${API_URL}/${path.join("/")}${req.nextUrl.search}`

  const headers = new Headers(req.headers)
  headers.set("Authorization", `Bearer ${session.accessToken}`)
  headers.set("Content-Type", "application/json")
  headers.delete("host")

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    duplex: "half",
  } as RequestInit)

  const data = await upstream.text()
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
