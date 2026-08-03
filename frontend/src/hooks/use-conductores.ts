import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  ConductorDto,
  CreateConductorRequest,
  UpdateConductorRequest,
  EEstatusConductor,
  PagedResult,
} from "@/types/api"

export const conductoresKeys = {
  all: ["conductores"] as const,
  list: (params: object) => ["conductores", "list", params] as const,
  detail: (id: string) => ["conductores", "detail", id] as const,
}

interface UseConductoresParams {
  page?: number
  pageSize?: number
  search?: string
  estatus?: EEstatusConductor
}

export function useConductores(params: UseConductoresParams = {}) {
  const { page = 1, pageSize = 20, search, estatus } = params
  return useQuery({
    queryKey: conductoresKeys.list({ page, pageSize, search, estatus }),
    queryFn: () =>
      browserFetch<PagedResult<ConductorDto>>(
        `/api/conductores${buildQuery({ page, pageSize, search, estatus })}`,
      ),
    placeholderData: keepPreviousData,
  })
}

export function useConductor(id: string) {
  return useQuery({
    queryKey: conductoresKeys.detail(id),
    queryFn: () => browserFetch<ConductorDto>(`/api/conductores/${id}`),
    enabled: !!id,
  })
}

export function useCreateConductor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateConductorRequest) =>
      browserFetch<ConductorDto>("/api/conductores", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: conductoresKeys.all }),
  })
}

export function useUpdateConductor(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateConductorRequest) =>
      browserFetch<ConductorDto>(`/api/conductores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conductoresKeys.all })
      qc.invalidateQueries({ queryKey: conductoresKeys.detail(id) })
    },
  })
}

export function usePatchConductor(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<UpdateConductorRequest>) =>
      browserFetch<ConductorDto>(`/api/conductores/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conductoresKeys.all })
      qc.invalidateQueries({ queryKey: conductoresKeys.detail(id) })
    },
  })
}

export function useDeleteConductor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      browserFetch(`/api/conductores/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: conductoresKeys.all }),
  })
}
