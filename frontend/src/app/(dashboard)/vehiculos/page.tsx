import type { Metadata } from "next"
import { VehiculosView } from "@/components/vehiculos/vehiculos-view"

export const metadata: Metadata = { title: "Vehículos" }

export default function VehiculosPage() {
  return <VehiculosView />
}
