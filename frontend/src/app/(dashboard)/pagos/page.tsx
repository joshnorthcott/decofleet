import type { Metadata } from "next"
import { PagosView } from "@/components/pagos/pagos-view"

export const metadata: Metadata = { title: "Facturación" }

export default function PagosPage() {
  return <PagosView />
}
