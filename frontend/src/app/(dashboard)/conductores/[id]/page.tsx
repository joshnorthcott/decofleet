import type { Metadata } from "next"
import { ConductorDetail } from "@/components/conductores/conductor-detail"

export const metadata: Metadata = { title: "Detalle de conductor" }

export default async function ConductorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ConductorDetail id={id} />
}
