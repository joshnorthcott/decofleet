import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { browserFetch } from "@/lib/api-client-browser"
import type { ReferenciaPersonalDto, UpsertReferenciaRequest } from "@/types/api"

export const referenciasKeys = {
  list: (conductorId: string) => ["referencias", conductorId] as const,
}

export function useReferencias(conductorId: string) {
  return useQuery({
    queryKey: referenciasKeys.list(conductorId),
    queryFn:  () => browserFetch<ReferenciaPersonalDto[]>(`/api/conductores/${conductorId}/referencias`),
    enabled:  !!conductorId,
  })
}

export function useUpsertReferencia(conductorId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orden, data }: { orden: 1 | 2 | 3; data: UpsertReferenciaRequest }) =>
      browserFetch<ReferenciaPersonalDto>(
        `/api/conductores/${conductorId}/referencias/${orden}`,
        { method: "PUT", body: JSON.stringify(data) },
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: referenciasKeys.list(conductorId) }),
  })
}

export function useDeleteReferencia(conductorId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orden: 1 | 2 | 3) =>
      browserFetch(`/api/conductores/${conductorId}/referencias/${orden}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: referenciasKeys.list(conductorId) }),
  })
}
