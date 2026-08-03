import type { Metadata } from "next"
import { VehiculoDetail } from "@/components/vehiculos/vehiculo-detail"

export const metadata: Metadata = { title: "Detalle de vehículo" }

export default async function VehiculoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <VehiculoDetail id={id} />
}
