import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { LoginResponse } from "@/types/api"

// Extend Auth.js types
declare module "next-auth" {
  interface User {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    empresaId: string
    rolId: string
  }
  interface Session {
    accessToken: string
    error?: "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    empresaId: string
    rolId: string
    error?: "RefreshAccessTokenError"
  }
}

const MOCK_API = process.env.MOCK_API === "true"

// Far-future expiry so the mock token never refreshes
const MOCK_EXPIRES = "2099-01-01T00:00:00.000Z"

async function refreshAccessToken(refreshToken: string) {
  if (MOCK_API) return { accessToken: "mock-token", refreshToken, accessTokenExpiresAt: MOCK_EXPIRES } as LoginResponse
  const res = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) throw new Error("Failed to refresh token")
  return (await res.json()) as LoginResponse
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        empresaId: { label: "Empresa ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // ── Mock mode: accept any credentials ────────────────────────────────
        if (MOCK_API) {
          return {
            id: "mock-user-id",
            email: String(credentials.email),
            name: "Admin Demo",
            accessToken: "mock-token",
            refreshToken: "mock-refresh-token",
            accessTokenExpiresAt: MOCK_EXPIRES,
            empresaId: "11111111-1111-1111-1111-111111111111",
            rolId: "admin",
          }
        }

        // ── Real backend ──────────────────────────────────────────────────────
        if (!credentials.empresaId) return null
        const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            empresaId: credentials.empresaId,
          }),
        })

        if (!res.ok) return null

        const data: LoginResponse = await res.json()

        return {
          id: data.usuario.id,
          email: data.usuario.email,
          name: `${data.usuario.nombre} ${data.usuario.apellido ?? ""}`.trim(),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiresAt: data.accessTokenExpiresAt,
          empresaId: data.usuario.empresaId,
          rolId: data.usuario.rolId,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
          empresaId: user.empresaId,
          rolId: user.rolId,
        }
      }

      if (new Date() < new Date(token.accessTokenExpiresAt)) return token

      try {
        const refreshed = await refreshAccessToken(token.refreshToken)
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
          error: undefined,
        }
      } catch {
        return { ...token, error: "RefreshAccessTokenError" as const }
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      if (token.error) session.error = token.error
      return session
    },
  },
})
