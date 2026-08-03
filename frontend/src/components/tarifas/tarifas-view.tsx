"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Plus, Pencil, Trash2, Tag, Loader2, ToggleLeft, ToggleRight,
} from "lucide-react"
import { useTarifas, useCreateTarifa, useUpdateTarifa, useDeleteTarifa } from "@/hooks/use-tarifas"
import type { TarifaDto, EPeriodicidad } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// ── Form ──────────────────────────────────────────────────────────────────────

const schema = z.object({
  nombre:       z.string().min(1, "Requerido").max(100),
  monto:        z.coerce.number().positive("Debe ser mayor a 0"),
  periodicidad: z.enum(["Semanal", "Quincenal", "Mensual", "Bimestral"]),
  descripcion:  z.string().max(500).optional(),
  activa:       z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

function TarifaForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: TarifaDto
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nombre:       initial.nombre,
          monto:        initial.monto,
          periodicidad: initial.periodicidad,
          descripcion:  initial.descripcion ?? "",
          activa:       initial.activa,
        }
      : { periodicidad: "Mensual", activa: true },
  })

  const activa = watch("activa") ?? true

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombre">Nombre *</Label>
        <Input id="nombre" placeholder="Ej. Tarifa Estándar" {...register("nombre")} />
        {errors.nombre && <p className="text-xs text-red-600">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="monto">Monto *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <Input id="monto" type="number" min={0} step={0.01} className="pl-7" {...register("monto")} />
          </div>
          {errors.monto && <p className="text-xs text-red-600">{errors.monto.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="periodicidad">Periodicidad *</Label>
          <Select id="periodicidad" {...register("periodicidad")}>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
            <option value="Mensual">Mensual</option>
            <option value="Bimestral">Bimestral</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input id="descripcion" placeholder="Opcional…" {...register("descripcion")} />
      </div>

      {initial && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setValue("activa", !activa)}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            {activa
              ? <ToggleRight className="h-5 w-5 text-green-500" />
              : <ToggleLeft  className="h-5 w-5 text-slate-400" />
            }
            {activa ? "Activa" : "Inactiva"}
          </button>
          <span className="text-xs text-slate-400">
            Las tarifas inactivas no aparecen al crear contratos.
          </span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {initial ? "Guardar cambios" : "Crear tarifa"}
        </Button>
      </div>
    </form>
  )
}

// ── Tarifa card ───────────────────────────────────────────────────────────────

const periodicidadLabel: Record<EPeriodicidad, string> = {
  Semanal:   "/ semana",
  Quincenal: "/ quincena",
  Mensual:   "/ mes",
  Bimestral: "/ bimestre",
}

function TarifaCard({
  tarifa,
  onEdit,
  onDelete,
  deleting,
}: {
  tarifa: TarifaDto
  onEdit: () => void
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <div className={`relative rounded-xl border bg-white p-5 shadow-sm transition-opacity ${!tarifa.activa ? "opacity-60" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Tag className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{tarifa.nombre}</p>
            {!tarifa.activa && (
              <Badge variant="secondary" className="mt-0.5 text-xs">Inactiva</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Editar">
            <Pencil className="h-3.5 w-3.5 text-slate-400" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onDelete} disabled={deleting} aria-label="Eliminar">
            {deleting
              ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-300" />
              : <Trash2 className="h-3.5 w-3.5 text-red-400" />
            }
          </Button>
        </div>
      </div>

      {/* Amount */}
      <p className="text-2xl font-bold text-slate-900">
        {formatCurrency(tarifa.monto)}
        <span className="text-sm font-normal text-slate-400 ml-1">
          {periodicidadLabel[tarifa.periodicidad]}
        </span>
      </p>

      {/* Description */}
      {tarifa.descripcion && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
          {tarifa.descripcion}
        </p>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function TarifasView() {
  const { data: tarifas = [], isLoading } = useTarifas()
  const createMutation = useCreateTarifa()
  const deleteMutation = useDeleteTarifa()

  const [editingTarifa, setEditingTarifa] = useState<TarifaDto | null>(null)
  const [createOpen, setCreateOpen]       = useState(false)
  const [deletingId, setDeletingId]       = useState<string | null>(null)

  const updateMutation = useUpdateTarifa(editingTarifa?.id ?? "")

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarifa? Los contratos existentes no se verán afectados.")) return
    setDeletingId(id)
    try { await deleteMutation.mutateAsync(id) }
    finally { setDeletingId(null) }
  }

  const activas   = tarifas.filter(t => t.activa)
  const inactivas = tarifas.filter(t => !t.activa)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tarifas</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {activas.length} tarifa{activas.length !== 1 ? "s" : ""} activa{activas.length !== 1 ? "s" : ""}
            {inactivas.length > 0 && ` · ${inactivas.length} inactiva${inactivas.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nueva tarifa
        </Button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : tarifas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-300">
          <Tag className="h-12 w-12" />
          <p className="text-sm">Sin tarifas registradas. Crea la primera.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active */}
          <div>
            {inactivas.length > 0 && (
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Activas</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activas.map(t => (
                <TarifaCard
                  key={t.id}
                  tarifa={t}
                  onEdit={() => setEditingTarifa(t)}
                  onDelete={() => handleDelete(t.id)}
                  deleting={deletingId === t.id}
                />
              ))}
            </div>
          </div>

          {/* Inactive */}
          {inactivas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Inactivas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactivas.map(t => (
                  <TarifaCard
                    key={t.id}
                    tarifa={t}
                    onEdit={() => setEditingTarifa(t)}
                    onDelete={() => handleDelete(t.id)}
                    deleting={deletingId === t.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Nueva tarifa">
        <TarifaForm
          onSubmit={async (data) => {
            await createMutation.mutateAsync({
              nombre:       data.nombre,
              monto:        data.monto,
              periodicidad: data.periodicidad,
              descripcion:  data.descripcion,
              activa:       data.activa ?? true,
            })
            setCreateOpen(false)
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editingTarifa}
        onClose={() => setEditingTarifa(null)}
        title={`Editar: ${editingTarifa?.nombre ?? ""}`}
      >
        {editingTarifa && (
          <TarifaForm
            initial={editingTarifa}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({
                nombre:       data.nombre,
                monto:        data.monto,
                periodicidad: data.periodicidad,
                descripcion:  data.descripcion,
                activa:       data.activa ?? editingTarifa.activa,
              })
              setEditingTarifa(null)
            }}
            onCancel={() => setEditingTarifa(null)}
          />
        )}
      </Dialog>
    </div>
  )
}
