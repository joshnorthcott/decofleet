import { useQuery } from "@tanstack/react-query"
import { browserFetch } from "@/lib/api-client-browser"

export interface DashboardSummary {
  conductoresActivos: number
  vehiculosDisponibles: number
  vehiculosArrendados: number
  vehiculosTotal: number
  contratosActivos: number
  ingresosMes: number
  pagosPendientes: number
  pagosPendientesImporte: number
  pagosVencidos: number
  pagosVencidosImporte: number
  totalEsperado: number
  totalCobrado: number
  tasaCobranza: number
  ocupacion: number
}

export interface RevenuePoint {
  mes: string
  esperado: number
  cobrado: number
}

export interface FlotaPoint {
  name: string
  value: number
  fill: string
}

// ── Enriched resumen ────────────────────────────────────────────────────────

export interface ActividadItem {
  id: string
  pagoContratoId: string
  monto: number
  formaPago: string
  fechaPago: string
  referencia?: string
  nombreConductor: string
  vehiculo: string
}

export interface PaymentMethodItem {
  formaPago: string
  monto: number
}

export interface PagosPorEstatus {
  estatus: string
  count: number
  monto: number
}

export interface ProximoMantenimiento {
  id: string
  vehiculoId: string
  descripcionVehiculo?: string
  nombreTipo: string
  estatus: string
  fechaProgramada: string
  costoEstimado?: number
}

export interface ConductorAlerta {
  id: string
  nombre: string
  licVencimiento?: string
  licDaysLeft: number | null
  pagoVencido: number | null
}

export interface SeguroAlerta {
  id: string
  descripcion: string
  vencimiento: string
}

export interface DashboardResumen {
  actividadReciente: ActividadItem[]
  paymentMethods: PaymentMethodItem[]
  pagosPorEstatus: PagosPorEstatus[]
  proximoMantenimiento: ProximoMantenimiento[]
  conductoresAlerta: ConductorAlerta[]
  segurosPorVencer: SeguroAlerta[]
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => browserFetch<DashboardSummary>("/api/dashboard"),
  })
}

export function useRevenueChart() {
  return useQuery({
    queryKey: ["dashboard", "revenue-chart"],
    queryFn: () => browserFetch<RevenuePoint[]>("/api/dashboard/revenue-chart"),
  })
}

export function useFlotaChart() {
  return useQuery({
    queryKey: ["dashboard", "flota-chart"],
    queryFn: () => browserFetch<FlotaPoint[]>("/api/dashboard/flota-chart"),
  })
}

export function useDashboardResumen() {
  return useQuery({
    queryKey: ["dashboard", "resumen"],
    queryFn: () => browserFetch<DashboardResumen>("/api/dashboard/resumen"),
  })
}
