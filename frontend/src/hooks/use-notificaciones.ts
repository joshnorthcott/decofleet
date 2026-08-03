import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { browserFetch, buildQuery } from "@/lib/api-client-browser"
import type {
  NotificacionPlantillaDto,
  NotificacionEnviadaDto,
  CreatePlantillaRequest,
  UpdatePlantillaRequest,
  EnviarNotificacionRequest,
  PagedResult,
} from "@/types/api"

export const notifKeys = {
  all:      ["notificaciones"] as const,
  plantillas: (params?: object) => ["notificaciones", "plantillas", params ?? {}] as const,
  enviadas:   (params?: object) => ["notificaciones", "enviadas",   params ?? {}] as const,
}

export function usePlantillas(soloActivas = false) {
  return useQuery({
    queryKey: notifKeys.plantillas({ soloActivas }),
    queryFn:  () =>
      browserFetch<PagedResult<NotificacionPlantillaDto>>(
        `/api/notificaciones/plantillas${buildQuery({ soloActivas: soloActivas || undefined, pageSize: 100 })}`,
      ),
  })
}

export function useCreatePlantilla() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePlantillaRequest) =>
      browserFetch<NotificacionPlantillaDto>("/api/notificaciones/plantillas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all }),
  })
}

export function useUpdatePlantilla(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePlantillaRequest) =>
      browserFetch<NotificacionPlantillaDto>(`/api/notificaciones/plantillas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all }),
  })
}

export function useDeletePlantilla() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      browserFetch(`/api/notificaciones/plantillas/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all }),
  })
}

export function useNotificacionesEnviadas() {
  return useQuery({
    queryKey: notifKeys.enviadas(),
    queryFn:  () =>
      browserFetch<PagedResult<NotificacionEnviadaDto>>(
        `/api/notificaciones/enviadas${buildQuery({ pageSize: 50 })}`,
      ),
  })
}

export function useEnviarNotificacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EnviarNotificacionRequest) =>
      browserFetch<NotificacionEnviadaDto>("/api/notificaciones/enviar", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.enviadas() }),
  })
}
