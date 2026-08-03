import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { browserFetch } from "@/lib/api-client-browser"
import type { FotoVehiculoDto } from "@/types/api"

export const fotosKeys = {
  all:  ["fotos-vehiculo"] as const,
  list: (vehiculoId: string) => ["fotos-vehiculo", vehiculoId] as const,
}

export function useFotosVehiculo(vehiculoId: string) {
  return useQuery({
    queryKey: fotosKeys.list(vehiculoId),
    queryFn:  () => browserFetch<FotoVehiculoDto[]>(`/api/vehiculos/${vehiculoId}/fotos`),
    enabled:  !!vehiculoId,
  })
}

export function useDeleteFotoVehiculo(vehiculoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fotoId: string) =>
      browserFetch(`/api/vehiculos/${vehiculoId}/fotos/${fotoId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fotosKeys.list(vehiculoId) }),
  })
}
