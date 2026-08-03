"use client"

import { useState } from "react"
import {
  Bell, Plus, Pencil, Trash2, Send, ToggleLeft, ToggleRight,
  Users, Clock, Loader2,
} from "lucide-react"
import { usePlantillas, useDeletePlantilla, useNotificacionesEnviadas } from "@/hooks/use-notificaciones"
import type { NotificacionPlantillaDto, ENotificacionTipo } from "@/types/api"
import { Button } from "@/components/ui/button"
import { cn, formatDate } from "@/lib/utils"
import { PlantillaFormDialog }      from "./plantilla-form-dialog"
import { EnviarNotificacionDialog } from "./enviar-notificacion-dialog"

// ── Tipo badges ───────────────────────────────────────────────────────────────

const TIPO_STYLES: Record<ENotificacionTipo, { card: string; badge: string }> = {
  Informativa:  { card: "border-blue-200  bg-blue-50",  badge: "bg-blue-100  text-blue-700" },
  Recordatorio: { card: "border-amber-200 bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  Urgente:      { card: "border-red-200   bg-red-50",   badge: "bg-red-100   text-red-700" },
  Promocional:  { card: "border-green-200 bg-green-50", badge: "bg-green-100 text-green-700" },
}

// ── Tab component ─────────────────────────────────────────────────────────────

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function NotificacionesView() {
  const [tab, setTab]                             = useState<"plantillas" | "enviadas">("plantillas")
  const [editPlantilla, setEditPlantilla]         = useState<NotificacionPlantillaDto | null>(null)
  const [crearOpen, setCrearOpen]                 = useState(false)
  const [enviarOpen, setEnviarOpen]               = useState(false)
  const [confirmarBorrar, setConfirmarBorrar]     = useState<string | null>(null)

  const { data: plantillasData, isLoading: loadingPlantillas } = usePlantillas()
  const { data: enviadasData,   isLoading: loadingEnviadas }   = useNotificacionesEnviadas()
  const deleteMutation = useDeletePlantilla()

  const plantillas = plantillasData?.items ?? []
  const enviadas   = enviadasData?.items   ?? []

  const activas   = plantillas.filter(p => p.activa)
  const inactivas = plantillas.filter(p => !p.activa)

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id)
    setConfirmarBorrar(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {activas.length} plantilla{activas.length !== 1 ? "s" : ""} activa{activas.length !== 1 ? "s" : ""}
            {enviadas.length > 0 && ` · ${enviadas.length} mensaje${enviadas.length !== 1 ? "s" : ""} enviado${enviadas.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCrearOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Nueva plantilla
          </Button>
          <Button onClick={() => setEnviarOpen(true)} className="gap-2">
            <Send className="h-4 w-4" /> Enviar mensaje
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-1">
        <Tab active={tab === "plantillas"} onClick={() => setTab("plantillas")}>
          Plantillas ({plantillas.length})
        </Tab>
        <Tab active={tab === "enviadas"} onClick={() => setTab("enviadas")}>
          Enviados ({enviadas.length})
        </Tab>
      </div>

      {/* ── Plantillas tab ── */}
      {tab === "plantillas" && (
        <div className="space-y-6">
          {loadingPlantillas ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : plantillas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-300">
              <Bell className="h-10 w-10" />
              <p className="text-sm">Sin plantillas. Crea la primera.</p>
              <Button variant="outline" size="sm" onClick={() => setCrearOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Crear plantilla
              </Button>
            </div>
          ) : (
            <>
              {/* Active */}
              {activas.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Activas</h2>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {activas.map(p => (
                      <PlantillaCard
                        key={p.id}
                        plantilla={p}
                        onEdit={() => setEditPlantilla(p)}
                        onDelete={() => setConfirmarBorrar(p.id)}
                        confirmDelete={confirmarBorrar === p.id}
                        onConfirmDelete={() => handleDelete(p.id)}
                        onCancelDelete={() => setConfirmarBorrar(null)}
                        deleting={deleteMutation.isPending && confirmarBorrar === p.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Inactive */}
              {inactivas.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Inactivas</h2>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {inactivas.map(p => (
                      <PlantillaCard
                        key={p.id}
                        plantilla={p}
                        onEdit={() => setEditPlantilla(p)}
                        onDelete={() => setConfirmarBorrar(p.id)}
                        confirmDelete={confirmarBorrar === p.id}
                        onConfirmDelete={() => handleDelete(p.id)}
                        onCancelDelete={() => setConfirmarBorrar(null)}
                        deleting={deleteMutation.isPending && confirmarBorrar === p.id}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Enviadas tab ── */}
      {tab === "enviadas" && (
        <div className="space-y-3">
          {loadingEnviadas ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : enviadas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-300">
              <Send className="h-10 w-10" />
              <p className="text-sm">Aún no se han enviado mensajes.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {enviadas.map(env => {
                const styles = TIPO_STYLES[env.tipo]
                return (
                  <div key={env.id} className="flex items-start gap-4 px-5 py-4">
                    {/* Tipo dot */}
                    <span className={cn("mt-1 w-2 h-2 rounded-full shrink-0", {
                      "bg-blue-500":   env.tipo === "Informativa",
                      "bg-amber-500":  env.tipo === "Recordatorio",
                      "bg-red-500":    env.tipo === "Urgente",
                      "bg-green-500":  env.tipo === "Promocional",
                    })} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{env.titulo}</p>
                        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", styles.badge)}>
                          {env.tipo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{env.cuerpo}</p>

                      {/* Recipients preview */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <Users className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">{env.totalDestinatarios}</span>
                        <span className="text-xs text-slate-400">
                          {env.nombresDestinatarios.slice(0, 3).join(", ")}
                          {env.nombresDestinatarios.length > 3 && ` +${env.nombresDestinatarios.length - 3} más`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatDate(env.fechaEnvio)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <PlantillaFormDialog
        plantilla={null}
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
      />
      <PlantillaFormDialog
        plantilla={editPlantilla}
        open={!!editPlantilla}
        onClose={() => setEditPlantilla(null)}
      />
      <EnviarNotificacionDialog
        open={enviarOpen}
        onClose={() => setEnviarOpen(false)}
      />
    </div>
  )
}

// ── Plantilla card ────────────────────────────────────────────────────────────

function PlantillaCard({
  plantilla, onEdit, onDelete,
  confirmDelete, onConfirmDelete, onCancelDelete, deleting,
}: {
  plantilla: NotificacionPlantillaDto
  onEdit: () => void
  onDelete: () => void
  confirmDelete: boolean
  onConfirmDelete: () => void
  onCancelDelete: () => void
  deleting: boolean
}) {
  const styles = TIPO_STYLES[plantilla.tipo]

  return (
    <div className={cn(
      "rounded-xl border p-4 flex flex-col gap-3 transition-opacity",
      styles.card,
      !plantilla.activa && "opacity-60",
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={cn("inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mb-1", styles.badge)}>
            {plantilla.tipo}
          </span>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{plantilla.titulo}</p>
        </div>
        {plantilla.activa
          ? <ToggleRight className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          : <ToggleLeft  className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />}
      </div>

      {/* Body preview */}
      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">{plantilla.cuerpo}</p>

      {/* Actions */}
      {confirmDelete ? (
        <div className="flex items-center gap-2 pt-1 border-t border-black/10">
          <p className="text-xs text-slate-600 flex-1">¿Eliminar esta plantilla?</p>
          <Button size="sm" variant="destructive" onClick={onConfirmDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Sí, eliminar"}
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelDelete}>Cancelar</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-1 border-t border-black/10">
          <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
            <Pencil className="h-3 w-3 mr-1" /> Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
