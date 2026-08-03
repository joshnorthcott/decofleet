import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  PagoListItemDto,
  PagoContratoDto,
  PagoEmitidoDto,
  RegistrarPagoRequest,
  AgregarCargoRequest,
  EEstatusPago,
  PagedResult,
} from "@/types/api"

export const pagosKeys = {
  all:     ["pagos"] as const,
  list:    (params: object) => ["pagos", "list", params] as const,
  detail:  (id: string)     => ["pagos", "detail", id]   as const,
}

interface UsePagosParams {
  page?: number
  pageSize?: number
  contratoId?: string
  estatus?: EEstatusPago
  conductorNombre?: string
  vehiculoDesc?: string
  contratoFolio?: string
  fechaVencimientoDesde?: string
  fechaVencimientoHasta?: string
  montoMin?: number
  montoMax?: number
}

export function usePagos(params: UsePagosParams = {}) {
  const { page = 1, pageSize = 20, ...filters } = params
  return useQuery({
    queryKey: pagosKeys.list({ page, pageSize, ...filters }),
    queryFn: () =>
      browserFetch<PagedResult<PagoListItemDto>>(
        `/api/facturacion/pagos-contrato${buildQuery({ page, pageSize, ...filters })}`,
      ),
    placeholderData: keepPreviousData,
    enabled: params.contratoId !== undefined ? !!params.contratoId : true,
  })
}

export function usePagoDetalle(id: string) {
  return useQuery({
    queryKey: pagosKeys.detail(id),
    queryFn:  () =>
      browserFetch<PagoContratoDto & { historial: PagoEmitidoDto[] }>(
        `/api/facturacion/pagos-contrato/${id}`,
      ),
    enabled: !!id,
  })
}

export function useRegistrarPago() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegistrarPagoRequest) =>
      browserFetch<PagoEmitidoDto>("/api/facturacion/registrar-pago", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pagosKeys.all }),
  })
}

export function useAgregarCargo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AgregarCargoRequest) =>
      browserFetch("/api/facturacion/cargos", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pagosKeys.all }),
  })
}
