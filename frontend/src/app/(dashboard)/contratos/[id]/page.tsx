import { ContratoDetail } from "@/components/contratos/contrato-detail"

export default async function ContratoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ContratoDetail id={id} />
}
