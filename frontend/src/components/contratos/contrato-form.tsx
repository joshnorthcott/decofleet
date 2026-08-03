"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useConductores } from "@/hooks/use-conductores"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useTarifas } from "@/hooks/use-tarifas"
import type { CreateContratoRequest } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  conductorId:  z.string().min(1, "Selecciona un conductor"),
  vehiculoId:   z.string().min(1, "Selecciona un vehículo"),
  tarifaId:     z.string().min(1, "Selecciona una tarifa"),
  periodicidad: z.enum(["Semanal", "Quincenal", "Mensual", "Bimestral"]),
  fechaInicio:  z.string().min(1, "Requerido"),
  fechaFin:     z.string().optional(),
  formaPago:    z.enum(["Efectivo", "Transferencia", "Tarjeta", "Cheque"]),
  observaciones: z.string().max(500).optional(),
})

type FormData = z.infer<typeof schema>

interface ContratoFormProps {
  onSubmit: (data: CreateContratoRequest) => Promise<void>
  onCancel: () => void
}

export function ContratoForm({ onSubmit, onCancel }: ContratoFormProps) {
  const { data: conductoresData } = useConductores({ pageSize: 100, estatus: "Activo" })
  const { data: vehiculosData }   = useVehiculos({ pageSize: 100, estatus: "Disponible" })
  const { data: tarifas = [] }    = useTarifas(true) // soloActivas = true

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      periodicidad: "Mensual",
      formaPago: "Transferencia",
      fechaInicio: new Date().toISOString().slice(0, 10),
    },
  })

  const handleFormSubmit = async (data: FormData) => {
    const { periodicidad, ...rest } = data
    await onSubmit(rest as CreateContratoRequest)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="conductorId">Conductor *</Label>
        <Select id="conductorId" {...register("conductorId")}>
          <option value="">— Seleccionar conductor —</option>
          {conductoresData?.items.map((c) => (
            <option key={c.id} value={c.id}>{c.nombreCompleto}</option>
          ))}
        </Select>
        {errors.conductorId && <p className="text-xs text-red-600">{errors.conductorId.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="vehiculoId">Vehículo *</Label>
        <Select id="vehiculoId" {...register("vehiculoId")}>
          <option value="">— Seleccionar vehículo —</option>
          {vehiculosData?.items.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} {v.anio} — {v.placas ?? "Sin placas"}
            </option>
          ))}
        </Select>
        {errors.vehiculoId && <p className="text-xs text-red-600">{errors.vehiculoId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tarifaId">Tarifa *</Label>
          <Select id="tarifaId" {...register("tarifaId")}>
            <option value="">— Seleccionar —</option>
            {tarifas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} — {formatCurrency(t.monto)}/{t.periodicidad.toLowerCase()}
              </option>
            ))}
          </Select>
          {errors.tarifaId && <p className="text-xs text-red-600">{errors.tarifaId.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="periodicidad">Periodicidad</Label>
          <Select id="periodicidad" {...register("periodicidad")}>
            <option value="Semanal">Semanal</option>
            <option value="Quincenal">Quincenal</option>
            <option value="Mensual">Mensual</option>
            <option value="Bimestral">Bimestral</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="fechaInicio">Fecha inicio *</Label>
          <Input id="fechaInicio" type="date" {...register("fechaInicio")} />
          {errors.fechaInicio && <p className="text-xs text-red-600">{errors.fechaInicio.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="fechaFin">Fecha fin (opcional)</Label>
          <Input id="fechaFin" type="date" {...register("fechaFin")} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="formaPago">Forma de pago</Label>
        <Select id="formaPago" {...register("formaPago")}>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Cheque">Cheque</option>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="observaciones">Observaciones</Label>
        <textarea
          id="observaciones"
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Notas adicionales..."
          {...register("observaciones")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear contrato"}
        </Button>
      </div>
    </form>
  )
}
