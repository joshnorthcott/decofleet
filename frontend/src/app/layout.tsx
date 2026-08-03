import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { AuthSessionProvider } from "@/providers/session-provider"

export const metadata: Metadata = {
  title: {
    default: "Decofleet",
    template: "%s | Decofleet",
  },
  description: "Plataforma de gestión de flota vehicular",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <AuthSessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
