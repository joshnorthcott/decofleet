import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  ContratoDto,
  ContratoDetailDto,
  CreateContratoRequest,
  EEstatusContrato,
  PagedResult,
} from "@/types/api"

export const contratosKeys = {
  all: ["contratos"] as const,
  list: (params: object) => ["contratos", "list", params] as const,
  detail: (id: string) => ["contratos", "detail", id] as const,
}

interface UseContratosParams {
  page?: number
  pageSize?: number
  estatus?: EEstatusContrato
  conductorId?: string
  vehiculoId?: string
  folio?: string
  conductorNombre?: string
  vehiculoDesc?: string
  tarifaId?: string
  montoMin?: number
  montoMax?: number
}

export function useContratos(params: UseContratosParams = {}) {
  const { page = 1, pageSize = 20, ...filters } = params
  return useQuery({
    queryKey: contratosKeys.list({ page, pageSize, ...filters }),
    queryFn: () =>
      browserFetch<PagedResult<ContratoDto>>(
        `/api/contratos${buildQuery({ page, pageSize, ...filters })}`,
      ),
    placeholderData: keepPreviousData,
  })
}

export function useContrato(id: string) {
  return useQuery({
    queryKey: contratosKeys.detail(id),
    queryFn: () => browserFetch<ContratoDetailDto>(`/api/contratos/${id}`),
    enabled: !!id,
  })
}

export function useCreateContrato() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContratoRequest) =>
      browserFetch<ContratoDto>("/api/contratos", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: contratosKeys.all }),
  })
}

export function useActualizarEstatusContrato(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nuevoEstatus: EEstatusContrato) =>
      browserFetch(`/api/contratos/${id}/estatus`, {
        method: "PATCH",
        body: JSON.stringify({ nuevoEstatus }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: contratosKeys.all }),
  })
}
