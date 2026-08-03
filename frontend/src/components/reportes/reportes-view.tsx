"use client"

import { useState } from "react"
import { Truck, Users, CreditCard, Receipt, Wrench, BarChart3, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useConductores } from "@/hooks/use-conductores"
import { usePagos } from "@/hooks/use-pagos"
import { useMantenimiento } from "@/hooks/use-mantenimiento"
import { formatCurrency } from "@/lib/utils"
import { ReporteDialog, type ReporteTipo } from "./reporte-dialog"

// ── Report card config ────────────────────────────────────────────────────────

interface ReporteCard {
  tipo:        ReporteTipo
  titulo:      string
  descripcion: string
  icon:        React.ComponentType<{ className?: string }>
  color:       string
  iconBg:      string
}

const CARDS: ReporteCard[] = [
  {
    tipo:        "vehiculos",
    titulo:      "Flota de vehículos",
    descripcion: "Estado de la flota, utilización, vencimientos de seguro y asignaciones activas.",
    icon:        Truck,
    color:       "border-blue-200",
    iconBg:      "bg-blue-100 text-blue-600",
  },
  {
    tipo:        "conductores",
    titulo:      "Conductores",
    descripcion: "Estado, vencimientos de licencia, configuración de pago y datos fiscales.",
    icon:        Users,
    color:       "border-violet-200",
    iconBg:      "bg-violet-100 text-violet-600",
  },
  {
    tipo:        "pagos",
    titulo:      "Pagos",
    descripcion: "Tasa de cobranza, saldos pendientes, vencidos y desglose por período.",
    icon:        CreditCard,
    color:       "border-green-200",
    iconBg:      "bg-green-100 text-green-600",
  },
  {
    tipo:        "facturacion",
    titulo:      "Facturación",
    descripcion: "Conductores con CFDI activo, datos fiscales y destinos de pago configurados.",
    icon:        Receipt,
    color:       "border-amber-200",
    iconBg:      "bg-amber-100 text-amber-600",
  },
  {
    tipo:        "mantenimiento",
    titulo:      "Mantenimiento",
    descripcion: "Costo real vs estimado, siniestros, histórico por vehículo y pendientes.",
    icon:        Wrench,
    color:       "border-red-200",
    iconBg:      "bg-red-100 text-red-600",
  },
]

// ── Stat hooks (for card previews) ────────────────────────────────────────────

function useReportesStats() {
  const { data: vData } = useVehiculos({ pageSize: 100 })
  const { data: cData } = useConductores({ pageSize: 100 })
  const { data: pData } = usePagos({ pageSize: 100 })
  const { data: mData } = useMantenimiento({ pageSize: 100 })

  const vehiculos   = vData?.items ?? []
  const conductores = cData?.items ?? []
  const pagos       = pData?.items ?? []
  const mantenimientos = mData?.items ?? []

  const totalEsperado  = pagos.reduce((s, p) => s + p.montoTotal, 0)
  const totalCobrado   = pagos.reduce((s, p) => s + p.montoPagado, 0)
  const tasa           = totalEsperado > 0 ? Math.round(totalCobrado / totalEsperado * 100) : 0
  const vencidos       = pagos.filter(p => p.estatus === "Vencido").length

  const licVencidas    = conductores.filter(c => {
    if (!c.licenciaVencimiento) return false
    return new Date(c.licenciaVencimiento) < new Date()
  }).length

  const segVenciendo   = vehiculos.filter(v => {
    if (!v.seguroFechaVencimiento) return false
    const days = Math.ceil((new Date(v.seguroFechaVencimiento).getTime() - Date.now()) / 86_400_000)
    return days <= 30
  }).length

  const costoReal     = mantenimientos.reduce((s, m) => s + (m.costoReal ?? 0), 0)
  const conFactura    = conductores.filter(c => c.requiereFactura).length

  return {
    vehiculos:     { total: vehiculos.length, arrendados: vehiculos.filter(v => v.estatus === "Arrendado").length, segVenciendo },
    conductores:   { total: conductores.length, activos: conductores.filter(c => c.estatus === "Activo").length, licVencidas },
    pagos:         { tasa, vencidos, totalCobrado, totalEsperado },
    facturacion:   { conFactura, total: conductores.length },
    mantenimiento: { total: mantenimientos.length, costoReal, pendientes: mantenimientos.filter(m => m.estatus === "Programado" || m.estatus === "EnProceso").length },
  }
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function Stat({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <div>
      <p className={cn("text-lg font-bold", alert ? "text-red-600" : "text-slate-900")}>{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function ReportesView() {
  const [open, setOpen] = useState<ReporteTipo | null>(null)
  const stats = useReportesStats()

  const PREVIEW_STATS: Record<ReporteTipo, React.ReactNode> = {
    vehiculos: (
      <>
        <Stat label="Total"       value={stats.vehiculos.total} />
        <Stat label="Arrendados"  value={stats.vehiculos.arrendados} />
        <Stat label="Seg. ≤30d"   value={stats.vehiculos.segVenciendo} alert={stats.vehiculos.segVenciendo > 0} />
      </>
    ),
    conductores: (
      <>
        <Stat label="Activos"      value={stats.conductores.activos} />
        <Stat label="Total"        value={stats.conductores.total} />
        <Stat label="Lic. vencidas" value={stats.conductores.licVencidas} alert={stats.conductores.licVencidas > 0} />
      </>
    ),
    pagos: (
      <>
        <Stat label="Cobrado"    value={formatCurrency(stats.pagos.totalCobrado)} />
        <Stat label="Tasa cobro" value={`${stats.pagos.tasa}%`} alert={stats.pagos.tasa < 70} />
        <Stat label="Vencidos"   value={stats.pagos.vencidos} alert={stats.pagos.vencidos > 0} />
      </>
    ),
    facturacion: (
      <>
        <Stat label="Con CFDI"   value={stats.facturacion.conFactura} />
        <Stat label="Total cond." value={stats.facturacion.total} />
      </>
    ),
    mantenimiento: (
      <>
        <Stat label="Registros"   value={stats.mantenimiento.total} />
        <Stat label="Costo real"  value={formatCurrency(stats.mantenimiento.costoReal)} />
        <Stat label="Pendientes"  value={stats.mantenimiento.pendientes} alert={stats.mantenimiento.pendientes > 0} />
      </>
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Consulta y descarga reportes clave de tu operación en formato Excel.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(card => {
          const Icon = card.icon
          return (
            <div
              key={card.tipo}
              className={cn(
                "bg-white rounded-xl border-2 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow",
                card.color,
              )}
            >
              {/* Card header */}
              <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", card.iconBg)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{card.titulo}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{card.descripcion}</p>
                </div>
              </div>

              {/* Preview stats */}
              <div className="flex gap-5 pl-1">
                {PREVIEW_STATS[card.tipo]}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setOpen(card.tipo)}
                >
                  <Eye className="h-3.5 w-3.5" /> Ver reporte
                </Button>
              </div>
            </div>
          )
        })}

        {/* Coming soon card */}
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2 text-center min-h-[180px]">
          <BarChart3 className="h-7 w-7 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">Comparativa por período</p>
          <p className="text-xs text-slate-300">Próximamente en el Dashboard revisado</p>
        </div>
      </div>

      {/* Report dialog */}
      <ReporteDialog tipo={open} onClose={() => setOpen(null)} />
    </div>
  )
}
