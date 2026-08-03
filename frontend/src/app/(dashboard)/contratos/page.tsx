import type { Metadata } from "next"
import { ContratosView } from "@/components/contratos/contratos-view"

export const metadata: Metadata = { title: "Contratos" }

export default function ContratosPage() {
  return <ContratosView />
}
