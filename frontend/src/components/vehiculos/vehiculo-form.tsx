"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { VehiculoDto, EEstatusVehiculo, ESmsProveedor } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const schema = z.object({
  marca:    z.string().min(1, "Requerido").max(100),
  modelo:   z.string().min(1, "Requerido").max(100),
  anio:     z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  placas:   z.string().max(20).optional(),
  vin:      z.string().max(17).optional(),
  color:    z.string().max(50).optional(),
  telefono: z.string().max(20).optional(),
  estatus:  z.enum(["Disponible", "Arrendado", "Mantenimiento", "Baja"]).optional(),
  // SMS
  smsProveedor: z.enum(["Emnify", "Twilio"]).optional().or(z.literal("")),
  smsId:        z.string().max(100).optional(),
  // Seguro
  seguroEmpresa:          z.string().max(100).optional(),
  seguroNumeroPoliza:     z.string().max(50).optional(),
  seguroFechaVencimiento: z.string().optional(),
  seguroTipoPoliza:       z.string().max(100).optional(),
  seguroTelefono:         z.string().max(20).optional(),
  seguroComentarios:      z.string().max(500).optional(),
})

type FormData = z.infer<typeof schema>

interface VehiculoFormProps {
  initial?: VehiculoDto
  isEditing?: boolean
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}

export function VehiculoForm({ initial, isEditing, onSubmit, onCancel }: VehiculoFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          marca:    initial.marca,
          modelo:   initial.modelo,
          anio:     initial.anio,
          placas:   initial.placas ?? "",
          vin:      initial.vin ?? "",
          color:    initial.color ?? "",
          telefono: initial.telefono ?? "",
          estatus:  initial.estatus,
          smsProveedor: (initial.smsProveedor ?? "") as ESmsProveedor | "",
          smsId:        initial.smsId ?? "",
          seguroEmpresa:          initial.seguroEmpresa ?? "",
          seguroNumeroPoliza:     initial.seguroNumeroPoliza ?? "",
          seguroFechaVencimiento: initial.seguroFechaVencimiento ?? "",
          seguroTipoPoliza:       initial.seguroTipoPoliza ?? "",
          seguroTelefono:         initial.seguroTelefono ?? "",
          seguroComentarios:      initial.seguroComentarios ?? "",
        }
      : { anio: new Date().getFullYear() },
  })

  const smsProveedor = watch("smsProveedor")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Datos generales ── */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="marca">Marca *</Label>
            <Input id="marca" placeholder="Nissan" {...register("marca")} />
            {errors.marca && <p className="text-xs text-red-600">{errors.marca.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="modelo">Modelo *</Label>
            <Input id="modelo" placeholder="Versa" {...register("modelo")} />
            {errors.modelo && <p className="text-xs text-red-600">{errors.modelo.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="anio">Año *</Label>
            <Input id="anio" type="number" {...register("anio")} />
            {errors.anio && <p className="text-xs text-red-600">{errors.anio.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="color">Color</Label>
            <Input id="color" placeholder="Blanco" {...register("color")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="placas">Placas</Label>
            <Input id="placas" placeholder="ABC-123-A" className="uppercase" {...register("placas")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="17 caracteres" className="font-mono uppercase" {...register("vin")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="telefono">Teléfono del vehículo</Label>
            <Input id="telefono" type="tel" {...register("telefono")} />
          </div>
          {isEditing && (
            <div className="space-y-1">
              <Label htmlFor="estatus">Estatus</Label>
              <Select id="estatus" {...register("estatus")}>
                <option value="Disponible">Disponible</option>
                <option value="Arrendado">Arrendado</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Baja">Baja</option>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* ── SMS Host ── */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">SMS Host</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="smsProveedor">Proveedor</Label>
            <Select id="smsProveedor" {...register("smsProveedor")}>
              <option value="">— Sin proveedor —</option>
              <option value="Emnify">Emnify</option>
              <option value="Twilio">Twilio</option>
            </Select>
          </div>
          {smsProveedor && smsProveedor !== "" && (
            <div className="space-y-1">
              <Label htmlFor="smsId">ID de {smsProveedor}</Label>
              <Input
                id="smsId"
                placeholder={smsProveedor === "Emnify" ? "EM-0000000" : "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
                className="font-mono"
                {...register("smsId")}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Seguro ── */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Seguro</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="seguroEmpresa">Empresa aseguradora</Label>
            <Input id="seguroEmpresa" placeholder="GNP Seguros" {...register("seguroEmpresa")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="seguroNumeroPoliza">Número de póliza</Label>
            <Input id="seguroNumeroPoliza" placeholder="GNP-2024-001234" className="font-mono" {...register("seguroNumeroPoliza")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="seguroTipoPoliza">Tipo de póliza</Label>
            <Input id="seguroTipoPoliza" placeholder="Amplia, Limitada…" {...register("seguroTipoPoliza")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="seguroFechaVencimiento">Fecha de vencimiento</Label>
            <Input id="seguroFechaVencimiento" type="date" {...register("seguroFechaVencimiento")} />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="seguroTelefono">Teléfono de siniestros</Label>
          <Input id="seguroTelefono" type="tel" placeholder="800 000 0000" {...register("seguroTelefono")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="seguroComentarios">Comentarios</Label>
          <textarea
            id="seguroComentarios"
            rows={2}
            placeholder="Notas adicionales sobre la póliza…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            {...register("seguroComentarios")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar vehículo"}
        </Button>
      </div>
    </form>
  )
}
