import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { browserFetch } from "@/lib/api-client-browser"
import type { TarifaDto, CreateTarifaRequest, UpdateTarifaRequest } from "@/types/api"

export const tarifasKeys = {
  all:    ["tarifas"] as const,
  list:   (params: object) => ["tarifas", "list", params] as const,
  active: ["tarifas", "active"] as const,
}

export function useTarifas(soloActivas = false) {
  return useQuery({
    queryKey: soloActivas ? tarifasKeys.active : tarifasKeys.list({}),
    queryFn:  () =>
      browserFetch<TarifaDto[]>(`/api/tarifas${soloActivas ? "?soloActivas=true" : ""}`),
  })
}

export function useCreateTarifa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTarifaRequest) =>
      browserFetch<TarifaDto>("/api/tarifas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tarifasKeys.all }),
  })
}

export function useUpdateTarifa(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTarifaRequest) =>
      browserFetch<TarifaDto>(`/api/tarifas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tarifasKeys.all }),
  })
}

export function useDeleteTarifa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      browserFetch(`/api/tarifas/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tarifasKeys.all }),
  })
}
