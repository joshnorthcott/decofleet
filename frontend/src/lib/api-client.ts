import { auth } from "@/lib/auth"
import type { ApiValidationError } from "@/types/api"

const API_URL = process.env.API_URL ?? "http://localhost:5000"

export class ApiError extends Error {
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

/** Server-side fetch (Server Components, Server Actions, Route Handlers). */
export async function serverFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const session = await auth()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...options?.headers,
    },
    // Don't cache API responses by default
    cache: options?.cache ?? "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }

  return res.json() as Promise<T>
}

/** Build query string from an object, omitting undefined/null values. */
export function buildQuery(params: Record<string, unknown>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&")
  return qs ? `?${qs}` : ""
}
