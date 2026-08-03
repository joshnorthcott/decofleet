"use client"

import Link from "next/link"
import {
  ArrowLeft, Car, Users, User, Phone, Mail,
  IdCard, CalendarClock, Building2, CreditCard,
  FileText, AlertCircle, Calendar,
} from "lucide-react"
import { useContrato } from "@/hooks/use-contratos"
import { usePagos } from "@/hooks/use-pagos"
import type {
  ContratoConductorDto, EEstatusContrato, EEstatusConductor, EEstatusPago, PagoContratoDto,
} from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"

// ── Badge maps ────────────────────────────────────────────────────────────────

const contratoBadge: Record<EEstatusContrato, React.ReactNode> = {
  Activo:     <Badge variant="success">Activo</Badge>,
  Pausado:    <Badge variant="warning">Pausado</Badge>,
  Cancelado:  <Badge variant="destructive">Cancelado</Badge>,
  Finalizado: <Badge variant="secondary">Finalizado</Badge>,
}

const conductorBadge: Record<EEstatusConductor, React.ReactNode> = {
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
  { accessorKey: "fechaVencimiento", header: "Vencimiento",
    cell: ({ getValue }) => formatDate(getValue() as string | null) },
  { accessorKey: "estatus", header: "Estatus",
    cell: ({ getValue }) => pagoEstatusBadge[getValue() as EEstatusPago] },
]

// ── Conductor card ────────────────────────────────────────────────────────────

function ConductorCard({ conductor }: { conductor: ContratoConductorDto }) {
  const initials = conductor.nombreCompleto
    .split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()

  const licExpired = conductor.licenciaVencimiento
    ? new Date(conductor.licenciaVencimiento) < new Date()
    : false

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-blue-600">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/conductores/${conductor.conductorId}`}
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block"
          >
            {conductor.nombreCompleto}
          </Link>
          <div className="mt-0.5">{conductorBadge[conductor.estatus]}</div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-1.5">
        {conductor.telefono && (
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {conductor.telefono}
          </p>
        )}
        {conductor.email && (
          <p className="flex items-center gap-2 text-xs text-slate-600 truncate">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {conductor.email}
          </p>
        )}
      </div>

      {/* License */}
      {(conductor.licenciaNumero || conductor.licenciaTipo) ? (
        <div className="border-t border-slate-100 pt-3 space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <IdCard className="h-3.5 w-3.5" />
            Licencia
          </p>
          <div className="flex flex-wrap gap-3">
            {conductor.licenciaTipo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                Tipo {conductor.licenciaTipo}
              </span>
            )}
            {conductor.licenciaNumero && (
              <span className="text-xs font-mono text-slate-600 truncate">
                {conductor.licenciaNumero}
              </span>
            )}
          </div>
          {conductor.licenciaVencimiento && (
            <p className={`flex items-center gap-1.5 text-xs ${licExpired ? "text-red-600 font-medium" : "text-slate-500"}`}>
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              Vence {formatDate(conductor.licenciaVencimiento)}
              {licExpired && " — Vencida"}
            </p>
          )}
          {conductor.licenciaEstadoEmisor && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              {conductor.licenciaEstadoEmisor}
            </p>
          )}
        </div>
      ) : (
        <div className="border-t border-slate-100 pt-3 flex items-center gap-2 text-slate-300">
          <IdCard className="h-4 w-4" />
          <p className="text-xs">Sin datos de licencia</p>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContratoDetail({ id }: { id: string }) {
  const { data: contrato, isLoading } = useContrato(id)
  const { data: pagosData } = usePagos({ contratoId: id, pageSize: 50 })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded" />
        <div className="h-36 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    )
  }

  if (!contrato) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <AlertCircle className="h-10 w-10" />
        <p>Contrato no encontrado.</p>
        <Link href="/contratos"><button className="text-sm underline">Volver</button></Link>
      </div>
    )
  }

  const conductores = contrato.conductores ?? []
  const totalPagado   = pagosData?.items.reduce((s, p) => s + p.montoPagado,    0) ?? 0
  const totalPendiente = pagosData?.items.reduce((s, p) => s + p.saldoPendiente, 0) ?? 0
  const folio = `#${id.slice(-8).toUpperCase()}`

  return (
    <div className="space-y-6">

      {/* Back */}
      <Link
        href="/contratos"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Contratos
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start gap-5">
          {/* Icon + title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <FileText className="h-7 w-7 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 font-mono">{folio}</h1>
                {contratoBadge[contrato.estatus]}
                {conductores.length > 1 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
                    <Users className="h-3.5 w-3.5" />
                    Contrato colectivo · {conductores.length} conductores
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5" />
                {contrato.descripcionVehiculo}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-400">Renta</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(contrato.montoRenta)}</p>
              <p className="text-xs text-slate-400">{contrato.periodicidad}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Cobrado</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(totalPagado)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Pendiente</p>
              <p className={`text-lg font-bold ${totalPendiente > 0 ? "text-red-600" : "text-slate-400"}`}>
                {formatCurrency(totalPendiente)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract details */}
      <Card>
        <CardHeader><CardTitle>Detalles del contrato</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400">Forma de pago</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{contrato.formaPago}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tarifa</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{contrato.nombreTarifa}</p>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Inicio</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{formatDate(contrato.fechaInicio)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Fin</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {contrato.fechaFin ? formatDate(contrato.fechaFin) : "Indefinido"}
                </p>
              </div>
            </div>
          </div>
          {contrato.observaciones && (
            <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
              {contrato.observaciones}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Conductores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {conductores.length === 1
              ? <><User className="h-4 w-4 text-slate-400" />Conductor</>
              : <><Users className="h-4 w-4 text-slate-400" />{conductores.length} conductores</>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conductores.length === 0 ? (
            <div className="flex items-center gap-3 py-4 text-slate-300">
              <Users className="h-7 w-7" />
              <p className="text-sm">Sin conductores asignados.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              conductores.length === 1
                ? "grid-cols-1 max-w-sm"
                : conductores.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {conductores.map((c, i) => (
                <div key={c.conductorId} className="relative">
                  {conductores.length > 1 && (
                    <div className="absolute -top-2 -left-2 z-10 w-5 h-5 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                  )}
                  <ConductorCard conductor={c} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card>
        <CardHeader><CardTitle>Historial de pagos</CardTitle></CardHeader>
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

    </div>
  )
}
