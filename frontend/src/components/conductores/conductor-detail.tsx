"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Phone, Mail, MapPin, CreditCard,
  FileText, Car, Pencil, AlertCircle,
  IdCard, CalendarClock, Building2,
} from "lucide-react"
import { useConductor, useUpdateConductor } from "@/hooks/use-conductores"
import { useContratos } from "@/hooks/use-contratos"
import { usePagos } from "@/hooks/use-pagos"
import type { ConductorDto, EEstatusConductor, EEstatusPago, PagoContratoDto } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { ConductorForm } from "./conductor-form"
import { ConductorReferencias } from "./conductor-referencias"
import { ConductorConfigPagos } from "./conductor-config-pagos"
import { ConductorFacturacion } from "./conductor-facturacion"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

const estatusBadge: Record<EEstatusConductor, React.ReactNode> = {
  Activo:     <Badge variant="success">Activo</Badge>,
  Inactivo:   <Badge variant="secondary">Inactivo</Badge>,
  Suspendido: <Badge variant="warning">Suspendido</Badge>,
}

const pagoEstatusBadge: Record<EEstatusPago, React.ReactNode> = {
  Pendiente:     <Badge variant="secondary">Pendiente</Badge>,
  PagadoParcial: <Badge variant="warning">Pago parcial</Badge>,
  Pagado:        <Badge variant="success">Pagado</Badge>,
  Vencido:       <Badge variant="destructive">Vencido</Badge>,
  Cancelado:     <Badge variant="outline">Cancelado</Badge>,
}

const pagoColumns: ColumnDef<PagoContratoDto, unknown>[] = [
  { accessorKey: "periodoInicio", header: "Periodo",
    cell: ({ row }) => `${formatDate(row.original.periodoInicio)} → ${formatDate(row.original.periodoFin)}` },
  { accessorKey: "montoTotal",    header: "Total",    cell: ({ getValue }) => formatCurrency(getValue() as number) },
  { accessorKey: "montoPagado",   header: "Pagado",   cell: ({ getValue }) => formatCurrency(getValue() as number) },
  { accessorKey: "saldoPendiente", header: "Pendiente",
    cell: ({ getValue }) => {
      const v = getValue() as number
      return <span className={v > 0 ? "text-red-600 font-medium" : "text-slate-400"}>{formatCurrency(v)}</span>
    },
  },
  { accessorKey: "fechaVencimiento", header: "Vencimiento", cell: ({ getValue }) => formatDate(getValue() as string | null) },
  { accessorKey: "estatus", header: "Estatus", cell: ({ getValue }) => pagoEstatusBadge[getValue() as EEstatusPago] },
]

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value ?? "—"}</p>
      </div>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
  return (
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
      <span className="text-xl font-bold text-blue-600">{initials}</span>
    </div>
  )
}

export function ConductorDetail({ id }: { id: string }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const { data: conductor, isLoading } = useConductor(id)
  const { data: contratosData }        = useContratos({ conductorId: id, pageSize: 10 })
  const updateMutation                 = useUpdateConductor(id)

  const contratoActivo = contratosData?.items.find(c => c.estatus === "Activo")
  const { data: pagosData } = usePagos({
    contratoId: contratoActivo?.id,
    pageSize: 20,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded" />
        <div className="h-40 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    )
  }

  if (!conductor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <AlertCircle className="h-10 w-10" />
        <p>Conductor no encontrado.</p>
        <Link href="/conductores"><Button variant="outline">Volver</Button></Link>
      </div>
    )
  }

  const totalPagado   = pagosData?.items.reduce((s, p) => s + p.montoPagado, 0)   ?? 0
  const totalPendiente = pagosData?.items.reduce((s, p) => s + p.saldoPendiente, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/conductores" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Conductores
        </Link>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar conductor
        </Button>
      </div>

      {/* Hero header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <Avatar name={conductor.nombreCompleto} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{conductor.nombreCompleto}</h1>
              {estatusBadge[conductor.estatus]}
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-slate-500">
              {conductor.telefono && (
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{conductor.telefono}</span>
              )}
              {conductor.email && (
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{conductor.email}</span>
              )}
              {conductor.curp && (
                <span className="font-mono text-xs">{conductor.curp}</span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex gap-6 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total pagado</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(totalPagado)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Saldo pendiente</p>
              <p className={`text-lg font-bold ${totalPendiente > 0 ? "text-red-600" : "text-slate-400"}`}>
                {formatCurrency(totalPendiente)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Contrato grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal info */}
        <Card>
          <CardHeader><CardTitle>Información personal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={MapPin}     label="Dirección"     value={conductor.direccion} />
            <InfoRow icon={MapPin}     label="Código postal" value={conductor.codigoPostal} />
            <InfoRow icon={CreditCard} label="CURP"          value={conductor.curp} />
            <InfoRow icon={Mail}       label="Correo"        value={conductor.email} />
            <InfoRow icon={Phone}      label="Teléfono"      value={conductor.telefono} />
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
              Registro: {formatDate(conductor.createdAt)} · Actualizado: {formatDate(conductor.updatedAt)}
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
                  <Car className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Vehículo</p>
                    <p className="text-sm font-medium text-slate-800">{contratoActivo.descripcionVehiculo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Renta</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(contratoActivo.montoRenta)}</p>
                    <p className="text-xs text-slate-400">{contratoActivo.periodicidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Forma de pago</p>
                    <p className="text-sm font-medium text-slate-800">{contratoActivo.formaPago}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Inicio</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(contratoActivo.fechaInicio)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Fin</p>
                    <p className="text-sm font-medium text-slate-800">{contratoActivo.fechaFin ? formatDate(contratoActivo.fechaFin) : "Indefinido"}</p>
                  </div>
                </div>
                {contratoActivo.observaciones && (
                  <p className="text-xs text-slate-500 border-t pt-3">{contratoActivo.observaciones}</p>
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

      {/* Licencia de conducir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-slate-400" />
            Licencia de conducir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conductor.licenciaNumero || conductor.licenciaTipo ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-400">Número</p>
                <p className="text-sm font-mono font-medium text-slate-800 mt-0.5">
                  {conductor.licenciaNumero ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Tipo</p>
                {conductor.licenciaTipo ? (
                  <span className="inline-flex items-center mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {conductor.licenciaTipo}
                  </span>
                ) : <p className="text-sm text-slate-400 mt-0.5">—</p>}
              </div>
              <div className="flex items-start gap-2">
                <CalendarClock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Vencimiento</p>
                  <p className={`text-sm font-medium mt-0.5 ${
                    conductor.licenciaVencimiento && new Date(conductor.licenciaVencimiento) < new Date()
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}>
                    {formatDate(conductor.licenciaVencimiento)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Estado emisor</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {conductor.licenciaEstadoEmisor ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-3 text-slate-300">
              <IdCard className="h-7 w-7" />
              <p className="text-sm">Sin datos de licencia registrados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referencias personales */}
      <ConductorReferencias conductorId={id} />

      {/* Configuración de pagos */}
      <ConductorConfigPagos conductorId={id} />

      {/* Facturación */}
      <ConductorFacturacion conductorId={id} />

      {/* Payment history */}
      {contratoActivo && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={pagoColumns}
              data={pagosData?.items ?? []}
              paged={pagosData}
              onPageChange={() => {}}
              isLoading={false}
              emptyMessage="Sin historial de pagos."
            />
          </CardContent>
        </Card>
      )}

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Editar conductor">
        <ConductorForm
          initial={conductor}
          isEditing
          onSubmit={async (data) => {
            await updateMutation.mutateAsync({
              ...data,
              estatus: (data.estatus ?? conductor.estatus) as EEstatusConductor,
            })
            setEditOpen(false)
          }}
          onCancel={() => setEditOpen(false)}
        />
      </Dialog>
    </div>
  )
}
