"use client"

import { useState } from "react"
import {
  Eye, History, CreditCard, PlusCircle, X,
} from "lucide-react"
import { usePagos } from "@/hooks/use-pagos"
import type { PagoListItemDto, EEstatusPago } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { RegistrarPagoDialog } from "./registrar-pago-dialog"
import { PagoDetailDialog }    from "./pago-detail-dialog"
import { PagoHistorialDialog } from "./pago-historial-dialog"
import { AgregarCargoDialog }  from "./agregar-cargo-dialog"

// ── Status badge ──────────────────────────────────────────────────────────────

const estatusBadge: Record<EEstatusPago, React.ReactNode> = {
  Pendiente:     <Badge variant="secondary">Pendiente</Badge>,
  PagadoParcial: <Badge variant="warning">Pago parcial</Badge>,
  Pagado:        <Badge variant="success">Pagado</Badge>,
  Vencido:       <Badge variant="destructive">Vencido</Badge>,
  Cancelado:     <Badge variant="outline">Cancelado</Badge>,
}

// ── Filters ───────────────────────────────────────────────────────────────────

const EMPTY_FILTERS = {
  conductorNombre:       "",
  vehiculoDesc:          "",
  contratoFolio:         "",
  fechaVencimientoDesde: "",
  fechaVencimientoHasta: "",
  montoMin:              "",
  montoMax:              "",
  estatus:               "" as EEstatusPago | "",
}

type Filters = typeof EMPTY_FILTERS

// ── Columns ───────────────────────────────────────────────────────────────────

function getPagosColumns(
  onView:      (p: PagoListItemDto) => void,
  onHistorial: (p: PagoListItemDto) => void,
  onRegistrar: (p: PagoListItemDto) => void,
  onCargo:     (p: PagoListItemDto) => void,
): ColumnDef<PagoListItemDto, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: "Folio",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500 select-all">
          #{String(getValue()).slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "nombreConductor",
      header: "Conductor",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.nombreConductor}</span>
      ),
    },
    {
      accessorKey: "nombreTarifa",
      header: "Tarifa",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "descripcionVehiculo",
      header: "Vehículo",
      cell: ({ getValue }) => (
        <span
          className="text-sm text-slate-600 block max-w-[160px] truncate"
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "montoTotal",
      header: "Monto",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <span className="font-medium text-slate-900">{formatCurrency(row.original.montoTotal)}</span>
          {row.original.saldoPendiente > 0 && (
            <span className="block text-xs text-red-500">
              {formatCurrency(row.original.saldoPendiente)} pendiente
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "formaPago",
      header: "Forma de pago",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600 whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "fechaVencimiento",
      header: "Vencimiento",
      enableSorting: true,
      cell: ({ row }) => {
        const fecha = row.original.fechaVencimiento
        const vencido = row.original.estatus === "Vencido"
        return (
          <span className={`text-sm whitespace-nowrap ${vencido ? "text-red-600 font-medium" : "text-slate-700"}`}>
            {formatDate(fecha)}
          </span>
        )
      },
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ getValue }) => estatusBadge[getValue() as EEstatusPago],
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const p = row.original
        const terminal = p.estatus === "Cancelado"
        const pagado   = p.estatus === "Pagado"
        return (
          <div className="flex items-center gap-0.5 justify-end">
            {/* View detail */}
            <Button variant="ghost" size="icon-sm" onClick={() => onView(p)} title="Ver detalle">
              <Eye className="h-4 w-4 text-slate-400" />
            </Button>
            {/* Payment history */}
            <Button variant="ghost" size="icon-sm" onClick={() => onHistorial(p)} title="Historial de abonos">
              <History className="h-4 w-4 text-slate-400" />
            </Button>
            {/* Register payment — disabled when paid or cancelled */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRegistrar(p)}
              disabled={pagado || terminal}
              title="Registrar pago"
            >
              <CreditCard className={`h-4 w-4 ${pagado || terminal ? "text-slate-200" : "text-green-500"}`} />
            </Button>
            {/* Add charge — disabled when cancelled */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onCargo(p)}
              disabled={terminal}
              title="Agregar cargo"
            >
              <PlusCircle className={`h-4 w-4 ${terminal ? "text-slate-200" : "text-amber-500"}`} />
            </Button>
          </div>
        )
      },
    },
  ]
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function PagosView() {
  const [page, setPage]       = useState(1)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const [viewPago,      setViewPago]      = useState<PagoListItemDto | null>(null)
  const [historialPago, setHistorialPago] = useState<PagoListItemDto | null>(null)
  const [registrarPago, setRegistrarPago] = useState<PagoListItemDto | null>(null)
  const [cargoPago,     setCargoPago]     = useState<PagoListItemDto | null>(null)

  const { data, isLoading } = usePagos({
    page,
    estatus:               filters.estatus               || undefined,
    conductorNombre:       filters.conductorNombre       || undefined,
    vehiculoDesc:          filters.vehiculoDesc          || undefined,
    contratoFolio:         filters.contratoFolio         || undefined,
    fechaVencimientoDesde: filters.fechaVencimientoDesde || undefined,
    fechaVencimientoHasta: filters.fechaVencimientoHasta || undefined,
    montoMin:              filters.montoMin ? parseFloat(filters.montoMin) : undefined,
    montoMax:              filters.montoMax ? parseFloat(filters.montoMax) : undefined,
  })

  function setFilter<K extends keyof Filters>(key: K, val: Filters[K]) {
    setFilters(prev => ({ ...prev, [key]: val }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  const active = Object.values(filters).some(v => v !== "")
  const vencidos = data?.items.filter(p => p.estatus === "Vencido").length ?? 0

  const columns = getPagosColumns(setViewPago, setHistorialPago, setRegistrarPago, setCargoPago)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pagos</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data?.totalCount ?? 0} periodo{(data?.totalCount ?? 0) !== 1 ? "s" : ""} en total
            {vencidos > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                · {vencidos} vencido{vencidos !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {/* Conductor */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Conductor</label>
            <Input
              placeholder="Nombre…"
              value={filters.conductorNombre}
              onChange={e => setFilter("conductorNombre", e.target.value)}
            />
          </div>

          {/* Vehículo */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vehículo</label>
            <Input
              placeholder="Marca, placas…"
              value={filters.vehiculoDesc}
              onChange={e => setFilter("vehiculoDesc", e.target.value)}
            />
          </div>

          {/* Contrato */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contrato</label>
            <Input
              placeholder="Folio…"
              value={filters.contratoFolio}
              onChange={e => setFilter("contratoFolio", e.target.value)}
              className="font-mono"
            />
          </div>

          {/* Fecha venc desde */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vence desde</label>
            <Input
              type="date"
              value={filters.fechaVencimientoDesde}
              onChange={e => setFilter("fechaVencimientoDesde", e.target.value)}
            />
          </div>

          {/* Fecha venc hasta */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vence hasta</label>
            <Input
              type="date"
              value={filters.fechaVencimientoHasta}
              onChange={e => setFilter("fechaVencimientoHasta", e.target.value)}
            />
          </div>

          {/* Monto mín */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monto mín</label>
            <Input
              type="number"
              placeholder="0"
              min={0}
              value={filters.montoMin}
              onChange={e => setFilter("montoMin", e.target.value)}
            />
          </div>

          {/* Monto máx */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monto máx</label>
            <Input
              type="number"
              placeholder="∞"
              min={0}
              value={filters.montoMax}
              onChange={e => setFilter("montoMax", e.target.value)}
            />
          </div>

          {/* Estatus */}
          <div className="space-y-1 col-span-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estatus</label>
            <Select
              value={filters.estatus}
              onChange={e => setFilter("estatus", e.target.value as EEstatusPago | "")}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="PagadoParcial">Pago parcial</option>
              <option value="Pagado">Pagado</option>
              <option value="Vencido">Vencido</option>
              <option value="Cancelado">Cancelado</option>
            </Select>
          </div>
        </div>

        {active && (
          <div className="flex justify-end pt-1 border-t border-slate-100">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          paged={data}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage="No se encontraron periodos de pago."
          enableSorting
        />
      </div>

      {/* Dialogs */}
      <PagoDetailDialog    pago={viewPago}      onClose={() => setViewPago(null)} />
      <PagoHistorialDialog pago={historialPago} onClose={() => setHistorialPago(null)} />
      <RegistrarPagoDialog pago={registrarPago} onClose={() => setRegistrarPago(null)} />
      <AgregarCargoDialog  pago={cargoPago}     onClose={() => setCargoPago(null)} />
    </div>
  )
}
