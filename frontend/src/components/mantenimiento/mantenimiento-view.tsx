"use client"

import { useState, useCallback } from "react"
import { Plus, Wrench, AlertTriangle } from "lucide-react"
import {
  useMantenimiento,
  useCreateMantenimiento,
  useUpdateMantenimiento,
  useDeleteMantenimiento,
  useTiposMantenimiento,
} from "@/hooks/use-mantenimiento"
import { browserFetch } from "@/lib/api-client-browser"
import { useQueryClient } from "@tanstack/react-query"
import { mantenimientoKeys } from "@/hooks/use-mantenimiento"
import type { MantenimientoDto, EEstatusMantenimiento, UpdateMantenimientoRequest } from "@/types/api"
import { DataTable } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { MantenimientoForm } from "./mantenimiento-form"
import { getMantenimientoColumns } from "./mantenimiento-columns"

type Tab = "mantenimiento" | "siniestros"
type DialogState = { mode: "create" } | { mode: "edit"; record: MantenimientoDto } | null

export function MantenimientoView() {
  const [page, setPage]               = useState(1)
  const [tab, setTab]                 = useState<Tab>("mantenimiento")
  const [estatus, setEstatus]         = useState<EEstatusMantenimiento | undefined>()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const qc          = useQueryClient()
  const esSiniestro = tab === "siniestros"

  const { data, isLoading } = useMantenimiento({ page, pageSize: 20, estatus, esSiniestro })
  const createMutation      = useCreateMantenimiento()
  const updateMutation      = useUpdateMantenimiento(
    dialogState?.mode === "edit" ? dialogState.record.id : "",
  )
  const deleteMutation = useDeleteMantenimiento()

  const handleChangeEstatus = useCallback(
    async (record: MantenimientoDto, nuevoEstatus: EEstatusMantenimiento) => {
      const labels: Record<EEstatusMantenimiento, string> = {
        Programado: "reprogramar", EnProceso: "iniciar",
        Completado: "marcar como completado", Cancelado: "cancelar",
      }
      if (!confirm(`¿Deseas ${labels[nuevoEstatus]} este servicio?`)) return
      await browserFetch(`/api/mantenimiento/${record.id}/estatus`, {
        method: "PATCH",
        body: JSON.stringify({ nuevoEstatus }),
      })
      qc.invalidateQueries({ queryKey: mantenimientoKeys.all })
    },
    [qc],
  )

  const columns = getMantenimientoColumns({
    onEdit:   (r) => setDialogState({ mode: "edit", record: r }),
    onDelete: async (r) => {
      if (confirm(`¿Eliminar este registro de ${r.nombreTipo}?`))
        await deleteMutation.mutateAsync(r.id)
    },
    onChangeEstatus: handleChangeEstatus,
  })

  async function handleSubmit(formData: Record<string, unknown>) {
    if (dialogState?.mode === "create") {
      await createMutation.mutateAsync(formData as Parameters<typeof createMutation.mutateAsync>[0])
    } else if (dialogState?.mode === "edit") {
      await updateMutation.mutateAsync(formData as UpdateMantenimientoRequest)
    }
    setDialogState(null)
  }

  const enProceso   = data?.items.filter(m => m.estatus === "EnProceso").length  ?? 0
  const programados = data?.items.filter(m => m.estatus === "Programado").length ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mantenimiento</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data?.totalCount ?? 0} registro{data?.totalCount !== 1 ? "s" : ""}
            {enProceso   > 0 && <span className="ml-2 text-blue-600 font-medium">· {enProceso} en proceso</span>}
            {programados > 0 && <span className="ml-2 text-amber-600 font-medium">· {programados} programado{programados !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="h-4 w-4" />
          Programar servicio
        </Button>
      </div>

      {/* Tabs: Mantenimiento vs Siniestros */}
      <div className="flex gap-1 border-b border-slate-200">
        {(["mantenimiento", "siniestros"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); setEstatus(undefined) }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? t === "siniestros" ? "border-amber-500 text-amber-600" : "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "mantenimiento" ? <Wrench className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {t === "mantenimiento" ? "Mantenimiento" : "Siniestros"}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Select
          value={estatus ?? ""}
          onChange={(e) => { setEstatus(e.target.value as EEstatusMantenimiento || undefined); setPage(1) }}
          className="w-44"
        >
          <option value="">Todos los estatus</option>
          <option value="Programado">Programado</option>
          <option value="EnProceso">En proceso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          paged={data}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage={
            tab === "siniestros"
              ? "No hay siniestros registrados."
              : "No hay servicios registrados."
          }
        />
      </div>

      <Dialog
        open={!!dialogState}
        onClose={() => setDialogState(null)}
        title={dialogState?.mode === "create" ? "Programar servicio" : "Editar servicio"}
      >
        <MantenimientoForm
          initial={dialogState?.mode === "edit" ? dialogState.record : undefined}
          isEditing={dialogState?.mode === "edit"}
          onSubmit={handleSubmit}
          onCancel={() => setDialogState(null)}
        />
      </Dialog>
    </div>
  )
}
