import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  VehiculoDto,
  CreateVehiculoRequest,
  UpdateVehiculoRequest,
  EEstatusVehiculo,
  PagedResult,
} from "@/types/api"

export const vehiculosKeys = {
  all: ["vehiculos"] as const,
  list: (params: object) => ["vehiculos", "list", params] as const,
  detail: (id: string) => ["vehiculos", "detail", id] as const,
}

interface UseVehiculosParams {
  page?: number
  pageSize?: number
  search?: string
  estatus?: EEstatusVehiculo
}

export function useVehiculo(id: string) {
  return useQuery({
    queryKey: vehiculosKeys.detail(id),
    queryFn: () => browserFetch<VehiculoDto>(`/api/vehiculos/${id}`),
    enabled: !!id,
  })
}

export function useVehiculos(params: UseVehiculosParams = {}) {
  const { page = 1, pageSize = 20, search, estatus } = params
  return useQuery({
    queryKey: vehiculosKeys.list({ page, pageSize, search, estatus }),
    queryFn: () =>
      browserFetch<PagedResult<VehiculoDto>>(
        `/api/vehiculos${buildQuery({ page, pageSize, search, estatus })}`,
      ),
    placeholderData: keepPreviousData,
  })
}

export function useCreateVehiculo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVehiculoRequest) =>
      browserFetch<VehiculoDto>("/api/vehiculos", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehiculosKeys.all }),
  })
}

export function useUpdateVehiculo(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateVehiculoRequest) =>
      browserFetch<VehiculoDto>(`/api/vehiculos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehiculosKeys.all }),
  })
}

export function useDeleteVehiculo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      browserFetch(`/api/vehiculos/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehiculosKeys.all }),
  })
}
