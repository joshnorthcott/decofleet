"use client"

import { useDashboard, useRevenueChart, useFlotaChart, useDashboardResumen } from "@/hooks/use-dashboard"
import { formatCurrency, cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import {
  Users,
  Car,
  FileText,
  AlertCircle,
  TrendingUp,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  CreditCard,
  Clock,
  ChevronRight,
  Shield,
} from "lucide-react"
import Link from "next/link"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatYAxis(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return `$${value}`
}

function formatRelativeDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86_400_000)
  if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Mañana"
  return `En ${diffDays} días`
}

function daysUntil(dateStr?: string) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

// ── KPI Hero Card ─────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  trend,
  trendLabel,
  alert,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconColor: string
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  alert?: boolean
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3",
      alert ? "border-red-200 bg-red-50/30" : "border-slate-200",
    )}>
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend && trendLabel && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
            trend === "up"      ? "bg-green-100 text-green-700" :
            trend === "down"    ? "bg-red-100 text-red-700" :
                                  "bg-slate-100 text-slate-600",
          )}>
            {trend === "up"   && <ArrowUpRight   className="h-3 w-3" />}
            {trend === "down" && <ArrowDownRight  className="h-3 w-3" />}
            {trendLabel}
          </div>
        )}
      </div>
      <div>
        <p className={cn("text-2xl font-bold", alert ? "text-red-700" : "text-slate-900")}>{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Panel({ title, linkHref, linkLabel, children, className }: {
  title: string
  linkHref?: string
  linkLabel?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {linkHref && (
          <Link href={linkHref} className="flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
            {linkLabel ?? "Ver todo"} <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

// ── Alert banner ──────────────────────────────────────────────────────────────

function AlertBanner({
  pagosVencidos,
  pagosVencidosImporte,
  conductoresAlertaCount,
  segurosPorVencer,
}: {
  pagosVencidos: number
  pagosVencidosImporte: number
  conductoresAlertaCount: number
  segurosPorVencer: number
}) {
  const alerts: string[] = []
  if (pagosVencidos > 0)        alerts.push(`${pagosVencidos} pago${pagosVencidos > 1 ? "s" : ""} vencido${pagosVencidos > 1 ? "s" : ""} (${formatCurrency(pagosVencidosImporte)})`)
  if (conductoresAlertaCount > 0) alerts.push(`${conductoresAlertaCount} conductor${conductoresAlertaCount > 1 ? "es" : ""} con alertas`)
  if (segurosPorVencer > 0)     alerts.push(`${segurosPorVencer} seguro${segurosPorVencer > 1 ? "s" : ""} vence${segurosPorVencer > 1 ? "n" : ""} en ≤30 días`)
  if (alerts.length === 0) return null

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800">
        <span className="font-semibold">Atención: </span>
        {alerts.join(" · ")}
      </p>
    </div>
  )
}

// ── Status colour helpers ─────────────────────────────────────────────────────

const ESTATUS_COLORS: Record<string, string> = {
  Pagado:        "bg-green-100 text-green-700",
  PagadoParcial: "bg-blue-100 text-blue-700",
  Pendiente:     "bg-amber-100 text-amber-700",
  Vencido:       "bg-red-100 text-red-700",
}

const ESTATUS_LABELS: Record<string, string> = {
  Pagado:        "Pagado",
  PagadoParcial: "Parcial",
  Pendiente:     "Pendiente",
  Vencido:       "Vencido",
}

const FORMA_PAGO_COLORS: Record<string, string> = {
  Transferencia: "#3b82f6",
  Efectivo:      "#10b981",
  Tarjeta:       "#8b5cf6",
  Cheque:        "#f59e0b",
}

const MNT_ESTATUS_COLORS: Record<string, string> = {
  Programado: "bg-amber-100 text-amber-700",
  EnProceso:  "bg-blue-100 text-blue-700",
  Completado: "bg-green-100 text-green-700",
  Cancelado:  "bg-slate-100 text-slate-500",
}

// ── Dashboard skeleton ────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-xl bg-slate-100 animate-pulse", className)} />
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function DashboardView() {
  const { data: summary, isLoading }    = useDashboard()
  const { data: revenue }               = useRevenueChart()
  const { data: flota }                 = useFlotaChart()
  const { data: resumen }               = useDashboardResumen()

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    )
  }

  const s  = summary
  const r  = resumen

  // Recharts formatter callbacks — cast to avoid overly strict Formatter intersection type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const revenueFmt  = ((v: any, n: string) => [formatCurrency(Number(v)), n === "esperado" ? "Esperado" : "Cobrado"]) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flotaFmt    = ((v: any, n: string) => [v, n]) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methodFmt   = ((v: any) => [formatCurrency(Number(v)), "Monto"]) as any

  // Payment status bar chart data
  const estatusBar = (r?.pagosPorEstatus ?? []).map(e => ({
    name:  ESTATUS_LABELS[e.estatus] ?? e.estatus,
    monto: e.monto,
    count: e.count,
    fill:  e.estatus === "Pagado"        ? "#22c55e"
         : e.estatus === "PagadoParcial" ? "#3b82f6"
         : e.estatus === "Pendiente"     ? "#f59e0b"
         : "#ef4444",
  }))

  return (
    <div className="space-y-5">

      {/* Alert banner */}
      <AlertBanner
        pagosVencidos={s?.pagosVencidos ?? 0}
        pagosVencidosImporte={s?.pagosVencidosImporte ?? 0}
        conductoresAlertaCount={r?.conductoresAlerta?.length ?? 0}
        segurosPorVencer={r?.segurosPorVencer?.length ?? 0}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos cobrados (mes)"
          value={formatCurrency(s?.totalCobrado ?? 0)}
          sub={`de ${formatCurrency(s?.totalEsperado ?? 0)} esperados`}
          icon={TrendingUp}
          iconColor="bg-green-500"
          trend="up"
          trendLabel={`${s?.tasaCobranza ?? 0}% cobrado`}
        />
        <KpiCard
          label="Tasa de cobranza"
          value={`${s?.tasaCobranza ?? 0}%`}
          sub={`${s?.pagosPendientes ?? 0} pagos pendientes`}
          icon={Percent}
          iconColor={s && s.tasaCobranza < 70 ? "bg-red-500" : "bg-blue-500"}
          alert={s ? s.tasaCobranza < 70 : false}
        />
        <KpiCard
          label="Flota operativa"
          value={`${s?.vehiculosArrendados ?? 0} / ${s?.vehiculosTotal ?? 0}`}
          sub={`${s?.vehiculosDisponibles ?? 0} vehículos disponibles`}
          icon={Car}
          iconColor="bg-violet-500"
          trend="neutral"
          trendLabel={`${s?.ocupacion ?? 0}% ocupación`}
        />
        <KpiCard
          label="Saldo vencido"
          value={formatCurrency(s?.pagosVencidosImporte ?? 0)}
          sub={`${s?.pagosVencidos ?? 0} contratos vencidos`}
          icon={AlertCircle}
          iconColor="bg-red-500"
          alert={(s?.pagosVencidos ?? 0) > 0}
        />
      </div>

      {/* Row 2: area chart + flota donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Dual-series area chart */}
        <Panel title="Ingresos mensuales — esperado vs cobrado" linkHref="/reportes" linkLabel="Reportes" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue ?? []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradEsperado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCobrado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip
                formatter={revenueFmt}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />
              <Legend
                iconType="circle" iconSize={8}
                formatter={(v) => v === "esperado" ? "Esperado" : "Cobrado"}
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              />
              <Area type="monotone" dataKey="esperado" stroke="#94a3b8" strokeWidth={2} fill="url(#gradEsperado)" dot={false} />
              <Area type="monotone" dataKey="cobrado"  stroke="#3b82f6" strokeWidth={2} fill="url(#gradCobrado)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Fleet status donut */}
        <Panel title="Estado de la flota" linkHref="/vehiculos">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={flota ?? []}
                cx="50%" cy="42%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {(flota ?? []).map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={flotaFmt}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Row 3: payment status bar + method breakdown + KPI secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Payment status horizontal bars */}
        <Panel title="Pagos por estatus" linkHref="/pagos" className="lg:col-span-1">
          <div className="space-y-3">
            {estatusBar.map(e => {
              const maxMonto = Math.max(...estatusBar.map(x => x.monto), 1)
              const pct = Math.round(e.monto / maxMonto * 100)
              return (
                <div key={e.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{e.name}</span>
                    <span className="text-slate-400">{e.count} · {formatCurrency(e.monto)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: e.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Payment method breakdown */}
        <Panel title="Forma de pago (cobrado)" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={(r?.paymentMethods ?? []).map(m => ({
                name: m.formaPago,
                monto: m.monto,
                fill: FORMA_PAGO_COLORS[m.formaPago] ?? "#64748b",
              }))}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                formatter={methodFmt}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />
              <Bar dataKey="monto" radius={[0, 4, 4, 0]}>
                {(r?.paymentMethods ?? []).map((m, i) => (
                  <Cell key={i} fill={FORMA_PAGO_COLORS[m.formaPago] ?? "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Quick stats column */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{s?.conductoresActivos ?? 0}</p>
              <p className="text-xs text-slate-500">Conductores activos</p>
            </div>
            <Link href="/conductores"><ChevronRight className="h-4 w-4 text-slate-300 hover:text-slate-500" /></Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{s?.contratosActivos ?? 0}</p>
              <p className="text-xs text-slate-500">Contratos activos</p>
            </div>
            <Link href="/contratos"><ChevronRight className="h-4 w-4 text-slate-300 hover:text-slate-500" /></Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{s?.pagosPendientes ?? 0}</p>
              <p className="text-xs text-slate-500">Pagos pendientes</p>
              <p className="text-xs text-slate-400">{formatCurrency(s?.pagosPendientesImporte ?? 0)}</p>
            </div>
            <Link href="/pagos"><ChevronRight className="h-4 w-4 text-slate-300 hover:text-slate-500" /></Link>
          </div>
        </div>
      </div>

      {/* Row 4: recent activity + upcoming maintenance + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent payment activity */}
        <Panel title="Actividad reciente de cobros" linkHref="/pagos" className="lg:col-span-1">
          <div className="space-y-3">
            {(r?.actividadReciente ?? []).slice(0, 5).map(act => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CreditCard className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{act.nombreConductor}</p>
                  <p className="text-xs text-slate-400 truncate">{act.vehiculo} · {act.formaPago}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-green-700">{formatCurrency(act.monto)}</p>
                  <p className="text-xs text-slate-400">{new Date(act.fechaPago).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</p>
                </div>
              </div>
            ))}
            {(r?.actividadReciente ?? []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Sin actividad reciente</p>
            )}
          </div>
        </Panel>

        {/* Upcoming maintenance */}
        <Panel title="Próximo mantenimiento" linkHref="/mantenimiento" className="lg:col-span-1">
          <div className="space-y-3">
            {(r?.proximoMantenimiento ?? []).map(m => (
              <div key={m.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Wrench className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{m.nombreTipo}</p>
                  <p className="text-xs text-slate-400 truncate">{m.descripcionVehiculo ?? m.vehiculoId}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", MNT_ESTATUS_COLORS[m.estatus] ?? "bg-slate-100 text-slate-500")}>
                    {m.estatus}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeDate(m.fechaProgramada)}</p>
                </div>
              </div>
            ))}
            {(r?.proximoMantenimiento ?? []).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Sin mantenimientos programados</p>
            )}
          </div>
        </Panel>

        {/* Conductores en alerta + seguros */}
        <div className="flex flex-col gap-4">
          {/* Conductores en alerta */}
          <Panel title="Conductores en alerta" linkHref="/conductores" className="flex-1">
            <div className="space-y-2.5">
              {(r?.conductoresAlerta ?? []).map(c => {
                const licDays  = c.licDaysLeft
                const licAlert = licDays !== null && licDays < 60
                return (
                  <div key={c.id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Users className="h-3 w-3 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{c.nombre}</p>
                      <div className="flex gap-2 mt-0.5 flex-wrap">
                        {licAlert && (
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            licDays !== null && licDays < 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
                          )}>
                            {licDays !== null && licDays < 0
                              ? `Lic. VENCIDA`
                              : `Lic. vence en ${licDays}d`}
                          </span>
                        )}
                        {c.pagoVencido !== null && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                            Pago vencido {formatCurrency(c.pagoVencido)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {(r?.conductoresAlerta ?? []).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">Sin alertas</p>
              )}
            </div>
          </Panel>

          {/* Seguros por vencer */}
          {(r?.segurosPorVencer ?? []).length > 0 && (
            <Panel title="Seguros por vencer" linkHref="/vehiculos">
              <div className="space-y-2">
                {(r?.segurosPorVencer ?? []).map(v => {
                  const days = daysUntil(v.vencimiento)
                  return (
                    <div key={v.id} className="flex items-center gap-2.5">
                      <Shield className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{v.descripcion}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0",
                        days !== null && days <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
                      )}>
                        {days !== null && days <= 0 ? "Vencido" : `${days}d`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Panel>
          )}

          {/* Notification quick link */}
          <Link href="/notificaciones"
            className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Enviar notificación</p>
              <p className="text-xs text-blue-100 mt-0.5">Mensajes a conductores</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

    </div>
  )
}
