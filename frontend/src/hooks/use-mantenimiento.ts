import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  MantenimientoDto,
  TipoMantenimientoDto,
  CreateMantenimientoRequest,
  UpdateMantenimientoRequest,
  EEstatusMantenimiento,
  PagedResult,
} from "@/types/api"

export const mantenimientoKeys = {
  all:   ["mantenimiento"] as const,
  list:  (params: object) => ["mantenimiento", "list", params] as const,
  tipos: ["tipos-mantenimiento"] as const,
}

interface UseMantenimientoParams {
  page?: number
  pageSize?: number
  estatus?: EEstatusMantenimiento
  vehiculoId?: string
  esSiniestro?: boolean
}

export function useMantenimiento(params: UseMantenimientoParams = {}) {
  const { page = 1, pageSize = 20, ...filters } = params
  return useQuery({
    queryKey: mantenimientoKeys.list({ page, pageSize, ...filters }),
    queryFn: () =>
      browserFetch<PagedResult<MantenimientoDto>>(
        `/api/mantenimiento${buildQuery({ page, pageSize, ...filters })}`,
      ),
    placeholderData: keepPreviousData,
  })
}

export function useTiposMantenimiento() {
  return useQuery({
    queryKey: mantenimientoKeys.tipos,
    queryFn: () => browserFetch<TipoMantenimientoDto[]>("/api/tipos-mantenimiento"),
    staleTime: Infinity, // rarely changes
  })
}

export function useCreateMantenimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMantenimientoRequest) =>
      browserFetch<MantenimientoDto>("/api/mantenimiento", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mantenimientoKeys.all }),
  })
}

export function useUpdateMantenimiento(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateMantenimientoRequest) =>
      browserFetch<MantenimientoDto>(`/api/mantenimiento/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mantenimientoKeys.all }),
  })
}

export function useActualizarEstatusMantenimiento(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nuevoEstatus: EEstatusMantenimiento) =>
      browserFetch(`/api/mantenimiento/${id}/estatus`, {
        method: "PATCH",
        body: JSON.stringify({ nuevoEstatus }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mantenimientoKeys.all }),
  })
}

export function useDeleteMantenimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      browserFetch(`/api/mantenimiento/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mantenimientoKeys.all }),
  })
}
