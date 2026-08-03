"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Car, Hash, Palette, Phone, User,
  FileText, Wrench, Pencil, AlertCircle, AlertTriangle,
  Smartphone, Shield, CalendarClock, MessageSquare,
} from "lucide-react"
import { useVehiculo, useUpdateVehiculo } from "@/hooks/use-vehiculos"
import { useContratos } from "@/hooks/use-contratos"
import { useMantenimiento } from "@/hooks/use-mantenimiento"
import type {
  VehiculoDto, EEstatusVehiculo, EEstatusMantenimiento, MantenimientoDto,
} from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { VehiculoForm } from "./vehiculo-form"
import { VehiculoDocumentos } from "./vehiculo-documentos"
import { VehiculoFotos } from "./vehiculo-fotos"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

// ── Badges ────────────────────────────────────────────────────────────────────

const estatusBadge: Record<EEstatusVehiculo, React.ReactNode> = {
  Disponible:    <Badge variant="success">Disponible</Badge>,
  Arrendado:     <Badge variant="default">Arrendado</Badge>,
  Mantenimiento: <Badge variant="warning">Mantenimiento</Badge>,
  Baja:          <Badge variant="secondary">Baja</Badge>,
}

const mantEstatusBadge: Record<EEstatusMantenimiento, React.ReactNode> = {
  Programado: <Badge variant="secondary">Programado</Badge>,
  EnProceso:  <Badge variant="warning">En proceso</Badge>,
  Completado: <Badge variant="success">Completado</Badge>,
  Cancelado:  <Badge variant="outline">Cancelado</Badge>,
}

// ── Maintenance columns ───────────────────────────────────────────────────────

const mantColumns: ColumnDef<MantenimientoDto, unknown>[] = [
  {
    accessorKey: "nombreTipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.esSiniestro && (
          <AlertTriangle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
        )}
        <span className="text-sm">{row.original.nombreTipo}</span>
      </div>
    ),
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ getValue }) => mantEstatusBadge[getValue() as EEstatusMantenimiento],
  },
  {
    accessorKey: "fechaProgramada",
    header: "Programado",
    cell: ({ getValue }) => formatDate(getValue() as string | null),
  },
  {
    accessorKey: "costoEstimado",
    header: "Estimado",
    cell: ({ getValue }) => {
      const v = getValue() as number | null
      return v != null ? formatCurrency(v) : "—"
    },
  },
  {
    accessorKey: "costoReal",
    header: "Real",
    cell: ({ row }) => {
      const real = row.original.costoReal
      const est  = row.original.costoEstimado
      if (real == null) return <span className="text-slate-400">—</span>
      const over = est != null && real > est
      return (
        <span className={over ? "text-red-600 font-medium" : ""}>
          {formatCurrency(real)}
        </span>
      )
    },
  },
  {
    accessorKey: "proveedor",
    header: "Proveedor",
    cell: ({ getValue }) => (getValue() as string | null) ?? "—",
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function VehicleAvatar({ marca }: { marca: string }) {
  const initial = marca.charAt(0).toUpperCase()
  return (
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
      <span className="text-xl font-bold text-slate-500">{initial}</span>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType
  label: string
  value?: string | number | null
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`text-sm text-slate-800 font-medium ${mono ? "font-mono" : ""}`}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function VehiculoDetail({ id }: { id: string }) {
  const [editOpen, setEditOpen] = useState(false)

  const { data: vehiculo, isLoading } = useVehiculo(id)
  const { data: contratosData }       = useContratos({ vehiculoId: id, pageSize: 10 })
  const { data: mantData }            = useMantenimiento({ vehiculoId: id, pageSize: 50 })
  const updateMutation                = useUpdateVehiculo(id)

  const contratoActivo = contratosData?.items.find(c => c.estatus === "Activo")

  // Derived stats from maintenance records
  const mantItems      = mantData?.items ?? []
  const costoTotal     = mantItems.reduce((s, m) => s + (m.costoReal ?? 0), 0)
  const mantPendientes = mantItems.filter(m => m.estatus === "Programado" || m.estatus === "EnProceso").length
  const siniestros     = mantItems.filter(m => m.esSiniestro).length

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded" />
        <div className="h-40 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    )
  }

  if (!vehiculo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <AlertCircle className="h-10 w-10" />
        <p>Vehículo no encontrado.</p>
        <Link href="/vehiculos"><Button variant="outline">Volver</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/vehiculos"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vehículos
        </Link>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar vehículo
        </Button>
      </div>

      {/* Hero header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <VehicleAvatar marca={vehiculo.marca} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {vehiculo.marca} {vehiculo.modelo}
              </h1>
              <span className="text-slate-400 font-medium">{vehiculo.anio}</span>
              {estatusBadge[vehiculo.estatus]}
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-slate-500">
              {vehiculo.placas && (
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                  {vehiculo.placas}
                </span>
              )}
              {vehiculo.color && (
                <span className="flex items-center gap-1">
                  <Palette className="h-3.5 w-3.5" />{vehiculo.color}
                </span>
              )}
              {vehiculo.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />{vehiculo.telefono}
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex gap-6 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-400">Costo mantenimiento</p>
              <p className="text-lg font-bold text-slate-800">{formatCurrency(costoTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Mantenimientos activos</p>
              <p className={`text-lg font-bold ${mantPendientes > 0 ? "text-amber-600" : "text-slate-400"}`}>
                {mantPendientes}
              </p>
            </div>
            {siniestros > 0 && (
              <div className="text-right">
                <p className="text-xs text-slate-400">Siniestros</p>
                <p className="text-lg font-bold text-red-600">{siniestros}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info + Contrato grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vehicle info */}
        <Card>
          <CardHeader><CardTitle>Ficha técnica</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Car}   label="Marca"  value={vehiculo.marca} />
            <InfoRow icon={Car}   label="Modelo" value={vehiculo.modelo} />
            <InfoRow icon={Hash}  label="Año"    value={vehiculo.anio} />
            <InfoRow icon={Hash}  label="Placas" value={vehiculo.placas} mono />
            <InfoRow icon={Hash}  label="VIN"    value={vehiculo.vin}   mono />
            <InfoRow icon={Palette} label="Color" value={vehiculo.color} />
            {vehiculo.telefono && (
              <InfoRow icon={Phone} label="Teléfono GPS / rastreo" value={vehiculo.telefono} />
            )}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
              Registro: {formatDate(vehiculo.createdAt)} · Actualizado: {formatDate(vehiculo.updatedAt)}
            </div>
          </CardContent>
        </Card>

        {/* Contrato activo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              Contrato activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contratoActivo ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Conductor</p>
                    <p className="text-sm font-medium text-slate-800">
                      {contratoActivo.nombreConductor}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Renta</p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(contratoActivo.montoRenta)}
                    </p>
                    <p className="text-xs text-slate-400">{contratoActivo.periodicidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Forma de pago</p>
                    <p className="text-sm font-medium text-slate-800">{contratoActivo.formaPago}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Inicio</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(contratoActivo.fechaInicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Fin</p>
                    <p className="text-sm font-medium text-slate-800">
                      {contratoActivo.fechaFin ? formatDate(contratoActivo.fechaFin) : "Indefinido"}
                    </p>
                  </div>
                </div>
                {contratoActivo.observaciones && (
                  <p className="text-xs text-slate-500 border-t pt-3">
                    {contratoActivo.observaciones}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-300 gap-2">
                <FileText className="h-8 w-8" />
                <p className="text-sm">Sin contrato activo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SMS + Seguro grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SMS Host */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-slate-400" />
              SMS Host
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehiculo.smsProveedor ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    vehiculo.smsProveedor === "Emnify"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {vehiculo.smsProveedor}
                  </span>
                </div>
                {vehiculo.smsId && (
                  <InfoRow
                    icon={Hash}
                    label={`ID de ${vehiculo.smsProveedor}`}
                    value={vehiculo.smsId}
                    mono
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-300 gap-2">
                <MessageSquare className="h-7 w-7" />
                <p className="text-sm">Sin proveedor SMS configurado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seguro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-400" />
              Seguro
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehiculo.seguroEmpresa ? (
              <div className="space-y-3">
                <InfoRow icon={Shield}        label="Aseguradora"      value={vehiculo.seguroEmpresa} />
                <InfoRow icon={Hash}          label="Número de póliza" value={vehiculo.seguroNumeroPoliza} mono />
                <InfoRow icon={FileText}      label="Tipo de póliza"   value={vehiculo.seguroTipoPoliza} />
                <InfoRow icon={CalendarClock} label="Vencimiento"      value={
                  vehiculo.seguroFechaVencimiento
                    ? formatDate(vehiculo.seguroFechaVencimiento)
                    : null
                } />
                <InfoRow icon={Phone}         label="Tel. siniestros"  value={vehiculo.seguroTelefono} />
                {vehiculo.seguroComentarios && (
                  <p className="text-xs text-slate-500 border-t pt-3">{vehiculo.seguroComentarios}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-300 gap-2">
                <Shield className="h-7 w-7" />
                <p className="text-sm">Sin datos de seguro registrados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Maintenance history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-slate-400" />
            Historial de mantenimiento
            {mantItems.length > 0 && (
              <span className="ml-auto text-xs font-normal text-slate-400">
                {mantItems.length} registro{mantItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={mantColumns}
            data={mantItems}
            paged={mantData}
            onPageChange={() => {}}
            isLoading={false}
            emptyMessage="Sin registros de mantenimiento."
          />
        </CardContent>
      </Card>

      {/* Photos */}
      <VehiculoFotos vehiculoId={id} />

      {/* Documents */}
      <VehiculoDocumentos vehiculoId={id} />

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Editar vehículo">
        <VehiculoForm
          initial={vehiculo}
          isEditing
          onSubmit={async (data) => {
            await updateMutation.mutateAsync({
              ...data,
              estatus: (data.estatus ?? vehiculo.estatus) as EEstatusVehiculo,
            })
            setEditOpen(false)
          }}
          onCancel={() => setEditOpen(false)}
        />
      </Dialog>
    </div>
  )
}
