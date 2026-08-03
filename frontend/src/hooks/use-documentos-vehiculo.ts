import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { browserFetch } from "@/lib/api-client-browser"
import type { DocumentoVehiculoDto } from "@/types/api"

export const documentosKeys = {
  all:  ["documentos-vehiculo"] as const,
  list: (vehiculoId: string) => ["documentos-vehiculo", vehiculoId] as const,
}

export function useDocumentosVehiculo(vehiculoId: string) {
  return useQuery({
    queryKey: documentosKeys.list(vehiculoId),
    queryFn:  () => browserFetch<DocumentoVehiculoDto[]>(`/api/vehiculos/${vehiculoId}/documentos`),
    enabled:  !!vehiculoId,
  })
}

export function useDeleteDocumentoVehiculo(vehiculoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (docId: string) =>
      browserFetch(`/api/vehiculos/${vehiculoId}/documentos/${docId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentosKeys.list(vehiculoId) }),
  })
}
