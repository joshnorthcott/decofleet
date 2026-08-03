import type { Metadata } from "next"
import { ConductoresView } from "@/components/conductores/conductores-view"

export const metadata: Metadata = { title: "Conductores" }

export default function ConductoresPage() {
  return <ConductoresView />
}
