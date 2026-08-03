"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useTiposMantenimiento } from "@/hooks/use-mantenimiento"
import type { MantenimientoDto, EEstatusMantenimiento } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const schema = z.object({
  vehiculoId:           z.string().min(1, "Selecciona un vehículo"),
  tipoMantenimientoId:  z.string().min(1, "Selecciona el tipo"),
  fechaProgramada:      z.string().optional(),
  proveedor:            z.string().max(200).optional(),
  costoEstimado:        z.coerce.number().positive().optional().or(z.literal("")),
  // Edit-only fields
  estatus:              z.enum(["Programado", "EnProceso", "Completado", "Cancelado"]).optional(),
  fechaReal:            z.string().optional(),
  costoReal:            z.coerce.number().positive().optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

interface MantenimientoFormProps {
  initial?: MantenimientoDto
  isEditing?: boolean
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}

export function MantenimientoForm({ initial, isEditing, onSubmit, onCancel }: MantenimientoFormProps) {
  const { data: vehiculosData } = useVehiculos({ pageSize: 100 })
  const { data: tipos } = useTiposMantenimiento()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          vehiculoId:          initial.vehiculoId,
          tipoMantenimientoId: initial.tipoMantenimientoId,
          fechaProgramada:     initial.fechaProgramada?.slice(0, 10) ?? "",
          proveedor:           initial.proveedor ?? "",
          costoEstimado:       initial.costoEstimado ?? "",
          estatus:             initial.estatus,
          fechaReal:           initial.fechaReal?.slice(0, 10) ?? "",
          costoReal:           initial.costoReal ?? "",
        }
      : { fechaProgramada: new Date().toISOString().slice(0, 10) },
  })

  const mantenimientoTipos = tipos?.filter(t => !t.esSiniestro) ?? []
  const siniestroTipos     = tipos?.filter(t => t.esSiniestro)  ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="vehiculoId">Vehículo *</Label>
        <Select id="vehiculoId" {...register("vehiculoId")} disabled={isEditing}>
          <option value="">— Seleccionar vehículo —</option>
          {vehiculosData?.items.map(v => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} {v.anio} — {v.placas ?? "Sin placas"}
            </option>
          ))}
        </Select>
        {errors.vehiculoId && <p className="text-xs text-red-600">{errors.vehiculoId.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tipoMantenimientoId">Tipo de servicio *</Label>
        <Select id="tipoMantenimientoId" {...register("tipoMantenimientoId")}>
          <option value="">— Seleccionar tipo —</option>
          {mantenimientoTipos.length > 0 && (
            <optgroup label="Mantenimiento">
              {mantenimientoTipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </optgroup>
          )}
          {siniestroTipos.length > 0 && (
            <optgroup label="Siniestros">
              {siniestroTipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </optgroup>
          )}
        </Select>
        {errors.tipoMantenimientoId && <p className="text-xs text-red-600">{errors.tipoMantenimientoId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="fechaProgramada">Fecha programada</Label>
          <Input id="fechaProgramada" type="date" {...register("fechaProgramada")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="proveedor">Proveedor / Taller</Label>
          <Input id="proveedor" placeholder="Nombre del taller" {...register("proveedor")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="costoEstimado">Costo estimado</Label>
          <Input id="costoEstimado" type="number" step="0.01" placeholder="0.00" {...register("costoEstimado")} />
        </div>
        {isEditing && (
          <div className="space-y-1">
            <Label htmlFor="costoReal">Costo real</Label>
            <Input id="costoReal" type="number" step="0.01" placeholder="0.00" {...register("costoReal")} />
          </div>
        )}
      </div>

      {isEditing && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="estatus">Estatus</Label>
            <Select id="estatus" {...register("estatus")}>
              <option value="Programado">Programado</option>
              <option value="EnProceso">En proceso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fechaReal">Fecha real de servicio</Label>
            <Input id="fechaReal" type="date" {...register("fechaReal")} />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Programar servicio"}
        </Button>
      </div>
    </form>
  )
}
