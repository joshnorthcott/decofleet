"use client"

import type { ApiValidationError } from "@/types/api"

/** Client-side fetch wrapper for use in React client components. */
export class BrowserApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`)
  }

  get validationErrors(): Record<string, string[]> | null {
    if (this.status === 422) return (this.body as ApiValidationError).errors
    return null
  }
}

export async function browserFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  // In the browser, the access token comes from the session cookie managed
  // by Auth.js — we call our own Next.js API route instead of the .NET API directly.
  const res = await fetch(`/backend${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new BrowserApiError(res.status, body)
  }

  return res.json() as Promise<T>
}

export function buildQuery(params: Record<string, unknown>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&")
  return qs ? `?${qs}` : ""
}
