import type { Metadata } from "next"
import { MantenimientoView } from "@/components/mantenimiento/mantenimiento-view"

export const metadata: Metadata = { title: "Mantenimiento" }

export default function MantenimientoPage() {
  return <MantenimientoView />
}
