"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Users, Phone, Mail, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog } from "@/components/ui/dialog"
import { useReferencias, useUpsertReferencia, useDeleteReferencia } from "@/hooks/use-referencias-conductor"
import type { ReferenciaPersonalDto } from "@/types/api"

// ── Form schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  nombreCompleto: z.string().min(1, "Requerido").max(150),
  relacion:       z.string().min(1, "Requerido").max(100),
  telefono:       z.string().max(20).optional(),
  email:          z.string().email("Correo inválido").max(200).or(z.literal("")).optional(),
})

type FormData = z.infer<typeof schema>

// ── Reference form (inside dialog) ───────────────────────────────────────────

function ReferenciaForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: ReferenciaPersonalDto
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nombreCompleto: initial.nombreCompleto,
          relacion:       initial.relacion,
          telefono:       initial.telefono ?? "",
          email:          initial.email ?? "",
        }
      : {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombreCompleto">Nombre completo *</Label>
        <Input id="nombreCompleto" {...register("nombreCompleto")} />
        {errors.nombreCompleto && <p className="text-xs text-red-600">{errors.nombreCompleto.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="relacion">Relación / Parentesco *</Label>
        <Input id="relacion" placeholder="Madre, Hermano, Colega…" {...register("relacion")} />
        {errors.relacion && <p className="text-xs text-red-600">{errors.relacion.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" type="tel" {...register("telefono")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Correo</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar referencia"}
        </Button>
      </div>
    </form>
  )
}

// ── Single reference card ─────────────────────────────────────────────────────

function ReferenciaCard({
  orden,
  referencia,
  onEdit,
  onDelete,
  deleting,
}: {
  orden: 1 | 2 | 3
  referencia?: ReferenciaPersonalDto
  onEdit: () => void
  onDelete: () => void
  deleting: boolean
}) {
  if (!referencia) {
    return (
      <button
        onClick={onEdit}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors w-full min-h-[140px]"
      >
        <Plus className="h-5 w-5 text-slate-300" />
        <span className="text-xs text-slate-400 font-medium">Agregar referencia {orden}</span>
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{referencia.nombreCompleto}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
            {referencia.relacion}
          </span>
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

      {/* Contact info */}
      <div className="space-y-1.5">
        {referencia.telefono && (
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {referencia.telefono}
          </p>
        )}
        {referencia.email && (
          <p className="flex items-center gap-2 text-xs text-slate-600 truncate">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {referencia.email}
          </p>
        )}
        {!referencia.telefono && !referencia.email && (
          <p className="text-xs text-slate-300">Sin datos de contacto</p>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const ORDENES = [1, 2, 3] as const

export function ConductorReferencias({ conductorId }: { conductorId: string }) {
  const { data: referencias = [] } = useReferencias(conductorId)
  const upsertMutation  = useUpsertReferencia(conductorId)
  const deleteMutation  = useDeleteReferencia(conductorId)

  const [editOrden, setEditOrden]   = useState<1 | 2 | 3 | null>(null)
  const [deletingOrden, setDeletingOrden] = useState<1 | 2 | 3 | null>(null)

  const getRef = (orden: 1 | 2 | 3) =>
    referencias.find(r => r.orden === orden)

  const handleDelete = async (orden: 1 | 2 | 3) => {
    setDeletingOrden(orden)
    try { await deleteMutation.mutateAsync(orden) }
    finally { setDeletingOrden(null) }
  }

  const editing = editOrden !== null ? getRef(editOrden) : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          Referencias personales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ORDENES.map(orden => (
            <div key={orden}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Referencia {orden}
              </p>
              <ReferenciaCard
                orden={orden}
                referencia={getRef(orden)}
                onEdit={() => setEditOrden(orden)}
                onDelete={() => handleDelete(orden)}
                deleting={deletingOrden === orden}
              />
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit / create dialog */}
      <Dialog
        open={editOrden !== null}
        onClose={() => setEditOrden(null)}
        title={editing ? `Editar referencia ${editOrden}` : `Agregar referencia ${editOrden}`}
      >
        {editOrden !== null && (
          <ReferenciaForm
            initial={editing}
            onSubmit={async (data) => {
              await upsertMutation.mutateAsync({ orden: editOrden, data })
              setEditOrden(null)
            }}
            onCancel={() => setEditOrden(null)}
          />
        )}
      </Dialog>
    </Card>
  )
}
