"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { ConductorDto, EEstatusConductor, ETipoLicencia } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const schema = z.object({
  nombre:          z.string().min(1, "Requerido").max(100),
  apellidoPaterno: z.string().min(1, "Requerido").max(100),
  apellidoMaterno: z.string().max(100).optional(),
  curp:            z.string().max(18).optional(),
  telefono:        z.string().max(20).optional(),
  email:           z.string().email("Correo inválido").max(200).or(z.literal("")).optional(),
  direccion:       z.string().max(500).optional(),
  codigoPostal:    z.string().max(10).optional(),
  estatus:         z.enum(["Activo", "Inactivo", "Suspendido"]).optional(),
  // Licencia
  licenciaNumero:       z.string().max(50).optional(),
  licenciaTipo:         z.enum(["A", "B", "C", "D", "E"]).optional().or(z.literal("")),
  licenciaVencimiento:  z.string().optional(),
  licenciaEstadoEmisor: z.string().max(100).optional(),
})

type FormData = z.infer<typeof schema>

interface ConductorFormProps {
  initial?: ConductorDto
  isEditing?: boolean
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
}

export function ConductorForm({ initial, isEditing, onSubmit, onCancel }: ConductorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nombre:          initial.nombre,
          apellidoPaterno: initial.apellidoPaterno,
          apellidoMaterno: initial.apellidoMaterno ?? "",
          curp:            initial.curp ?? "",
          telefono:        initial.telefono ?? "",
          email:           initial.email ?? "",
          direccion:       initial.direccion ?? "",
          codigoPostal:    initial.codigoPostal ?? "",
          estatus:         initial.estatus,
          licenciaNumero:       initial.licenciaNumero ?? "",
          licenciaTipo:         (initial.licenciaTipo ?? "") as ETipoLicencia | "",
          licenciaVencimiento:  initial.licenciaVencimiento ?? "",
          licenciaEstadoEmisor: initial.licenciaEstadoEmisor ?? "",
        }
      : { estatus: "Activo" },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input id="nombre" {...register("nombre")} />
          {errors.nombre && <p className="text-xs text-red-600">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="apellidoPaterno">Apellido paterno *</Label>
          <Input id="apellidoPaterno" {...register("apellidoPaterno")} />
          {errors.apellidoPaterno && <p className="text-xs text-red-600">{errors.apellidoPaterno.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="apellidoMaterno">Apellido materno</Label>
          <Input id="apellidoMaterno" {...register("apellidoMaterno")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="curp">CURP</Label>
          <Input id="curp" {...register("curp")} className="uppercase" />
          {errors.curp && <p className="text-xs text-red-600">{errors.curp.message}</p>}
        </div>
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

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" {...register("direccion")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="codigoPostal">C.P.</Label>
          <Input id="codigoPostal" {...register("codigoPostal")} />
        </div>
      </div>

      {isEditing && (
        <div className="space-y-1">
          <Label htmlFor="estatus">Estatus</Label>
          <Select id="estatus" {...register("estatus")}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Suspendido">Suspendido</option>
          </Select>
        </div>
      )}

      {/* ── Licencia de conducir ── */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Licencia de conducir</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="licenciaNumero">Número de licencia</Label>
            <Input id="licenciaNumero" placeholder="CDMX-E-2024-001234" className="font-mono" {...register("licenciaNumero")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="licenciaTipo">Tipo</Label>
            <Select id="licenciaTipo" {...register("licenciaTipo")}>
              <option value="">— Seleccionar —</option>
              <option value="A">A — Motocicletas</option>
              <option value="B">B — Automóviles particulares</option>
              <option value="C">C — Carga / camiones</option>
              <option value="D">D — Autobuses</option>
              <option value="E">E — Servicio de pasajeros (taxi/STCM)</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="licenciaVencimiento">Fecha de vencimiento</Label>
            <Input id="licenciaVencimiento" type="date" {...register("licenciaVencimiento")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="licenciaEstadoEmisor">Estado / Ciudad emisora</Label>
            <Input id="licenciaEstadoEmisor" placeholder="Ciudad de México" {...register("licenciaEstadoEmisor")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear conductor"}
        </Button>
      </div>
    </form>
  )
}
