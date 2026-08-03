"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ToggleLeft, ToggleRight } from "lucide-react"
import type { NotificacionPlantillaDto, ENotificacionTipo } from "@/types/api"
import { useCreatePlantilla, useUpdatePlantilla } from "@/hooks/use-notificaciones"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const TIPOS: ENotificacionTipo[] = ["Informativa", "Recordatorio", "Urgente", "Promocional"]

const schema = z.object({
  titulo:  z.string().min(1, "Requerido").max(120),
  cuerpo:  z.string().min(1, "Requerido").max(2000),
  tipo:    z.enum(["Informativa", "Urgente", "Recordatorio", "Promocional"]),
  activa:  z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
  plantilla: NotificacionPlantillaDto | null  // null = create mode
  open: boolean
  onClose: () => void
}

export function PlantillaFormDialog({ plantilla, open, onClose }: Props) {
  const isEdit = !!plantilla
  const create = useCreatePlantilla()
  const update = useUpdatePlantilla(plantilla?.id ?? "")

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { tipo: "Informativa", activa: true },
    })

  useEffect(() => {
    if (open) {
      reset(plantilla
        ? { titulo: plantilla.titulo, cuerpo: plantilla.cuerpo, tipo: plantilla.tipo, activa: plantilla.activa }
        : { tipo: "Informativa", activa: true, titulo: "", cuerpo: "" }
      )
    }
  }, [open, plantilla, reset])

  const activa = watch("activa")

  async function onSubmit(data: FormData) {
    if (isEdit) {
      await update.mutateAsync(data)
    } else {
      await create.mutateAsync(data)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Editar plantilla" : "Nueva plantilla"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Título */}
        <div className="space-y-1">
          <Label htmlFor="titulo">Título *</Label>
          <Input id="titulo" placeholder="Ej. Recordatorio de pago" {...register("titulo")} />
          {errors.titulo && <p className="text-xs text-red-600">{errors.titulo.message}</p>}
        </div>

        {/* Tipo */}
        <div className="space-y-1">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select id="tipo" {...register("tipo")}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>

        {/* Cuerpo */}
        <div className="space-y-1">
          <Label htmlFor="cuerpo">Cuerpo del mensaje *</Label>
          <textarea
            id="cuerpo"
            rows={6}
            placeholder="Escribe el contenido del mensaje. Puedes usar {{nombre}}, {{periodo}}, {{monto}} como variables."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            {...register("cuerpo")}
          />
          <p className="text-xs text-slate-400">Variables disponibles: {"{{nombre}}, {{periodo}}, {{monto}}, {{fechaVencimiento}}, {{vehiculo}}"}</p>
          {errors.cuerpo && <p className="text-xs text-red-600">{errors.cuerpo.message}</p>}
        </div>

        {/* Activa toggle */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Plantilla activa</p>
            <p className="text-xs text-slate-400">Las plantillas inactivas no aparecen al enviar mensajes</p>
          </div>
          <button
            type="button"
            onClick={() => setValue("activa", !activa, { shouldDirty: true })}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {activa
              ? <ToggleRight className="h-8 w-8 text-blue-500" />
              : <ToggleLeft  className="h-8 w-8" />}
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear plantilla"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
