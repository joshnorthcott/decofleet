"use client"

import { Download, Loader2 } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatDate, formatCurrency } from "@/lib/utils"
import { downloadExcel } from "@/lib/excel-export"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { useConductores } from "@/hooks/use-conductores"
import { useContratos } from "@/hooks/use-contratos"
import { usePagos } from "@/hooks/use-pagos"
import { useMantenimiento } from "@/hooks/use-mantenimiento"
import type {
  VehiculoDto, ConductorDto, ContratoDto, PagoListItemDto, MantenimientoDto, EEstatusPago,
} from "@/types/api"

export type ReporteTipo = "vehiculos" | "conductores" | "pagos" | "facturacion" | "mantenimiento"

interface Props {
  tipo: ReporteTipo | null
  onClose: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const LABELS: Record<ReporteTipo, string> = {
  vehiculos:     "Vehículos",
  conductores:   "Conductores",
  pagos:         "Pagos",
  facturacion:   "Facturación",
  mantenimiento: "Mantenimiento",
}

function KpiBox({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-center min-w-[110px]">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className={cn("text-xl font-bold", color ?? "text-slate-900")}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={cn("px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap", right ? "text-right" : "text-left")}>
      {children}
    </th>
  )
}
function Td({ children, right, className }: { children: React.ReactNode; right?: boolean; className?: string }) {
  return (
    <td className={cn("px-3 py-2.5 text-sm", right ? "text-right" : "", className)}>
      {children}
    </td>
  )
}

const PAGO_STATUS_COLOR: Record<EEstatusPago, string> = {
  Pagado:        "text-green-700 bg-green-50",
  PagadoParcial: "text-amber-700 bg-amber-50",
  Pendiente:     "text-slate-600 bg-slate-100",
  Vencido:       "text-red-700 bg-red-50",
  Cancelado:     "text-slate-400 bg-slate-50",
}

function daysFromNow(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
}

// ── Report: Vehículos ─────────────────────────────────────────────────────────

function ReporteVehiculos() {
  const { data: vData } = useVehiculos({ pageSize: 100 })
  const { data: cData } = useContratos({ estatus: "Activo", pageSize: 100 })

  const vehiculos = vData?.items ?? []
  const contratos = cData?.items ?? []

  const activeMap: Record<string, ContratoDto> = {}
  contratos.forEach(c => { activeMap[c.vehiculoId] = c })

  const arrendados   = vehiculos.filter(v => v.estatus === "Arrendado").length
  const disponibles  = vehiculos.filter(v => v.estatus === "Disponible").length
  const mant         = vehiculos.filter(v => v.estatus === "Mantenimiento").length
  const segVencidos  = vehiculos.filter(v => {
    const d = daysFromNow(v.seguroFechaVencimiento)
    return d !== null && d <= 30
  }).length

  function exportar() {
    downloadExcel(
      vehiculos.map(v => {
        const ct = activeMap[v.id]
        const days = daysFromNow(v.seguroFechaVencimiento)
        return {
          placa:      v.placas,
          vehiculo:   `${v.marca} ${v.modelo} ${v.anio}`,
          color:      v.color,
          estatus:    v.estatus,
          conductor:  ct?.nombreConductor ?? "—",
          seguro:     v.seguroEmpresa ?? "—",
          poliza:     v.seguroNumeroPoliza ?? "—",
          venc_seguro: v.seguroFechaVencimiento ?? "—",
          alerta_seguro: days !== null && days <= 30 ? `Vence en ${days}d` : "",
          sms:        v.smsProveedor ?? "—",
        }
      }),
      "reporte_vehiculos",
      "Vehículos",
      {
        placa: "Placa", vehiculo: "Vehículo", color: "Color", estatus: "Estatus",
        conductor: "Conductor asignado", seguro: "Aseguradora", poliza: "Póliza",
        venc_seguro: "Vencimiento seguro", alerta_seguro: "Alerta", sms: "SMS proveedor",
      },
    )
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="flex flex-wrap gap-3">
        <KpiBox label="Total flota"    value={vehiculos.length} />
        <KpiBox label="Arrendados"     value={arrendados}  sub={`${Math.round(arrendados/vehiculos.length*100)}%`} color="text-blue-600" />
        <KpiBox label="Disponibles"    value={disponibles} color="text-green-600" />
        <KpiBox label="Mantenimiento"  value={mant}        color="text-amber-600" />
        <KpiBox label="Seguros ≤30 días" value={segVencidos} color={segVencidos > 0 ? "text-red-600" : "text-slate-900"} />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={exportar} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Placa</Th><Th>Vehículo</Th><Th>Estatus</Th><Th>Conductor</Th><Th>Seguro</Th><Th>SMS</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {vehiculos.map(v => {
              const ct   = activeMap[v.id]
              const days = daysFromNow(v.seguroFechaVencimiento)
              const segAlert = days !== null && days <= 30
              return (
                <tr key={v.id} className="hover:bg-slate-50">
                  <Td><span className="font-mono text-xs">{v.placas}</span></Td>
                  <Td>{v.marca} {v.modelo} {v.anio}</Td>
                  <Td>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-blue-100 text-blue-700":   v.estatus === "Arrendado",
                      "bg-green-100 text-green-700": v.estatus === "Disponible",
                      "bg-amber-100 text-amber-700": v.estatus === "Mantenimiento",
                      "bg-slate-100 text-slate-500": v.estatus === "Baja",
                    })}>
                      {v.estatus}
                    </span>
                  </Td>
                  <Td>{ct?.nombreConductor ?? <span className="text-slate-300">—</span>}</Td>
                  <Td>
                    {v.seguroFechaVencimiento ? (
                      <span className={cn("text-xs", segAlert ? "text-red-600 font-semibold" : "text-slate-600")}>
                        {v.seguroEmpresa} · {formatDate(v.seguroFechaVencimiento)}
                        {segAlert && <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded">vence en {days}d</span>}
                      </span>
                    ) : <span className="text-slate-300 text-xs">Sin seguro</span>}
                  </Td>
                  <Td>{v.smsProveedor ?? <span className="text-slate-300 text-xs">—</span>}</Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Report: Conductores ───────────────────────────────────────────────────────

function ReporteConductores() {
  const { data } = useConductores({ pageSize: 100 })
  const conductores = data?.items ?? []

  const activos       = conductores.filter(c => c.estatus === "Activo").length
  const inactivos     = conductores.filter(c => c.estatus !== "Activo").length
  const licVencidas   = conductores.filter(c => {
    const d = daysFromNow(c.licenciaVencimiento)
    return d !== null && d < 0
  }).length
  const licPorVencer  = conductores.filter(c => {
    const d = daysFromNow(c.licenciaVencimiento)
    return d !== null && d >= 0 && d <= 60
  }).length
  const sinConfigPago = conductores.filter(c => !c.pagoContratos && !c.pagoTaller && !c.pagoExtras).length

  function exportar() {
    downloadExcel(
      conductores.map(c => ({
        nombre:        c.nombreCompleto,
        estatus:       c.estatus,
        lic_tipo:      c.licenciaTipo ?? "—",
        lic_numero:    c.licenciaNumero ?? "—",
        lic_vencimiento: c.licenciaVencimiento ?? "—",
        lic_estado:    c.licenciaEstadoEmisor ?? "—",
        pago_contratos: c.pagoContratos ?? "—",
        pago_taller:   c.pagoTaller ?? "—",
        pago_extras:   c.pagoExtras ?? "—",
        factura:       c.requiereFactura ? "Sí" : "No",
        rfc:           c.factRfc ?? "—",
      })),
      "reporte_conductores",
      "Conductores",
      {
        nombre: "Nombre", estatus: "Estatus", lic_tipo: "Tipo lic.", lic_numero: "Nº licencia",
        lic_vencimiento: "Vencimiento lic.", lic_estado: "Estado emisor",
        pago_contratos: "Pago contratos", pago_taller: "Pago taller", pago_extras: "Pago extras",
        factura: "Requiere factura", rfc: "RFC",
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <KpiBox label="Activos"         value={activos}       color="text-green-600" />
        <KpiBox label="Inactivos/Susp." value={inactivos}     color={inactivos > 0 ? "text-amber-600" : undefined} />
        <KpiBox label="Lic. vencidas"   value={licVencidas}   color={licVencidas > 0 ? "text-red-600" : undefined} />
        <KpiBox label="Vencen ≤60d"     value={licPorVencer}  color={licPorVencer > 0 ? "text-amber-600" : undefined} />
        <KpiBox label="Sin config pago" value={sinConfigPago} color={sinConfigPago > 0 ? "text-slate-500" : undefined} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={exportar} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Conductor</Th><Th>Estatus</Th><Th>Licencia</Th><Th>Config. pago</Th><Th>Factura</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {conductores.map(c => {
              const days = daysFromNow(c.licenciaVencimiento)
              const expired  = days !== null && days < 0
              const nearExp  = days !== null && days >= 0 && days <= 60
              const hasPago  = c.pagoContratos || c.pagoTaller || c.pagoExtras
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{c.nombreCompleto}</Td>
                  <Td>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-green-100 text-green-700":  c.estatus === "Activo",
                      "bg-slate-100 text-slate-500":  c.estatus === "Inactivo",
                      "bg-amber-100 text-amber-700":  c.estatus === "Suspendido",
                    })}>
                      {c.estatus}
                    </span>
                  </Td>
                  <Td>
                    {c.licenciaVencimiento ? (
                      <span className={cn("text-xs", expired ? "text-red-600 font-semibold" : nearExp ? "text-amber-600 font-medium" : "text-slate-600")}>
                        {c.licenciaTipo} · {formatDate(c.licenciaVencimiento)}
                        {expired  && <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1 rounded">VENCIDA</span>}
                        {nearExp  && !expired && <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1 rounded">{days}d</span>}
                      </span>
                    ) : <span className="text-slate-300 text-xs">Sin datos</span>}
                  </Td>
                  <Td>
                    {hasPago
                      ? <span className="text-xs text-slate-600">{[c.pagoContratos, c.pagoTaller, c.pagoExtras].filter(Boolean).join(" / ")}</span>
                      : <span className="text-xs text-slate-300">Sin configurar</span>}
                  </Td>
                  <Td>
                    {c.requiereFactura
                      ? <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{c.factRfc ?? "RFC pendiente"}</span>
                      : <span className="text-xs text-slate-300">No</span>}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Report: Pagos ─────────────────────────────────────────────────────────────

function ReportePagos() {
  const { data } = usePagos({ pageSize: 100 })
  const pagos = data?.items ?? []

  const totalEsperado = pagos.reduce((s, p) => s + p.montoTotal, 0)
  const totalCobrado  = pagos.reduce((s, p) => s + p.montoPagado, 0)
  const totalPendiente = pagos.reduce((s, p) => s + p.saldoPendiente, 0)
  const vencidos       = pagos.filter(p => p.estatus === "Vencido")
  const tasa           = totalEsperado > 0 ? Math.round(totalCobrado / totalEsperado * 100) : 0

  function exportar() {
    downloadExcel(
      pagos.map(p => ({
        folio:       `#${p.id.slice(-8).toUpperCase()}`,
        conductor:   p.nombreConductor,
        vehiculo:    p.descripcionVehiculo,
        tarifa:      p.nombreTarifa,
        forma_pago:  p.formaPago,
        periodo:     `${formatDate(p.periodoInicio)} – ${formatDate(p.periodoFin)}`,
        vencimiento: formatDate(p.fechaVencimiento ?? ""),
        total:       p.montoTotal,
        pagado:      p.montoPagado,
        pendiente:   p.saldoPendiente,
        estatus:     p.estatus,
      })),
      "reporte_pagos",
      "Pagos",
      {
        folio: "Folio", conductor: "Conductor", vehiculo: "Vehículo", tarifa: "Tarifa",
        forma_pago: "Forma de pago", periodo: "Período", vencimiento: "Vencimiento",
        total: "Total ($)", pagado: "Pagado ($)", pendiente: "Pendiente ($)", estatus: "Estatus",
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <KpiBox label="Total esperado"  value={formatCurrency(totalEsperado)} />
        <KpiBox label="Cobrado"         value={formatCurrency(totalCobrado)}  color="text-green-600" />
        <KpiBox label="Pendiente"       value={formatCurrency(totalPendiente)} color={totalPendiente > 0 ? "text-red-600" : undefined} />
        <KpiBox label="Tasa cobro"      value={`${tasa}%`} color={tasa >= 80 ? "text-green-600" : tasa >= 50 ? "text-amber-600" : "text-red-600"} />
        <KpiBox label="Vencidos"        value={vencidos.length} sub={formatCurrency(vencidos.reduce((s,p)=>s+p.saldoPendiente,0))} color={vencidos.length > 0 ? "text-red-600" : undefined} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={exportar} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Conductor</Th><Th>Vehículo</Th><Th>Tarifa</Th><Th>Período</Th><Th>Vencimiento</Th><Th right>Total</Th><Th right>Pagado</Th><Th right>Pendiente</Th><Th>Estatus</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {pagos.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td className="font-medium text-slate-900">{p.nombreConductor}</Td>
                <Td className="max-w-[140px] truncate text-slate-600">{p.descripcionVehiculo}</Td>
                <Td>{p.nombreTarifa}</Td>
                <Td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(p.periodoInicio)} – {formatDate(p.periodoFin)}</Td>
                <Td className={cn("text-xs whitespace-nowrap", p.estatus === "Vencido" ? "text-red-600 font-semibold" : "text-slate-500")}>
                  {p.fechaVencimiento ? formatDate(p.fechaVencimiento) : "—"}
                </Td>
                <Td right className="font-medium">{formatCurrency(p.montoTotal)}</Td>
                <Td right className="text-green-700">{formatCurrency(p.montoPagado)}</Td>
                <Td right className={p.saldoPendiente > 0 ? "text-red-600 font-medium" : "text-slate-300"}>{formatCurrency(p.saldoPendiente)}</Td>
                <Td>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PAGO_STATUS_COLOR[p.estatus])}>
                    {p.estatus}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Report: Facturación ───────────────────────────────────────────────────────

function ReporteFacturacion() {
  const { data } = useConductores({ pageSize: 100 })
  const todos = data?.items ?? []

  // Show conductors who require invoice OR have any payment destination configured
  const conductores = todos.filter(c =>
    c.requiereFactura || c.pagoContratos || c.pagoTaller || c.pagoExtras
  )

  const conFactura   = conductores.filter(c => c.requiereFactura).length
  const sinFactura   = conductores.filter(c => !c.requiereFactura).length
  const countMoral   = conductores.filter(c => [c.pagoContratos, c.pagoTaller, c.pagoExtras].includes("Moral")).length
  const countDerek   = conductores.filter(c => [c.pagoContratos, c.pagoTaller, c.pagoExtras].includes("Fisica Derek")).length
  const countGene    = conductores.filter(c => [c.pagoContratos, c.pagoTaller, c.pagoExtras].includes("Fisica Gene")).length

  function exportar() {
    downloadExcel(
      conductores.map(c => ({
        nombre:         c.nombreCompleto,
        requiere_fact:  c.requiereFactura ? "Sí" : "No",
        rfc:            c.factRfc ?? "—",
        razon_social:   c.factRazonSocial ?? "—",
        regimen_fiscal: c.factRegimenFiscal ?? "—",
        uso_cfdi:       c.factUsoCfdi ?? "—",
        email_fiscal:   c.factEmail ?? "—",
        cp_fiscal:      c.factCodigoPostal ?? "—",
        pago_contratos: c.pagoContratos ?? "—",
        pago_taller:    c.pagoTaller ?? "—",
        pago_extras:    c.pagoExtras ?? "—",
      })),
      "reporte_facturacion",
      "Facturación",
      {
        nombre: "Conductor", requiere_fact: "Requiere factura", rfc: "RFC",
        razon_social: "Razón Social", regimen_fiscal: "Régimen fiscal", uso_cfdi: "Uso CFDI",
        email_fiscal: "Email fiscal", cp_fiscal: "CP fiscal",
        pago_contratos: "Pago contratos", pago_taller: "Pago taller", pago_extras: "Pago extras",
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <KpiBox label="Requieren factura" value={conFactura} color="text-blue-600" />
        <KpiBox label="Solo config pago"  value={sinFactura} />
        <KpiBox label="Destino Moral"      value={countMoral} />
        <KpiBox label="Destino Derek"      value={countDerek} />
        <KpiBox label="Destino Gene"       value={countGene} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={exportar} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Conductor</Th><Th>RFC / Razón social</Th><Th>Régimen · CFDI</Th><Th>Contratos</Th><Th>Taller</Th><Th>Extras</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {conductores.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <Td className="font-medium text-slate-900">
                  {c.nombreCompleto}
                  {c.requiereFactura && (
                    <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded font-semibold">CFDI</span>
                  )}
                </Td>
                <Td>
                  {c.factRfc
                    ? <><span className="font-mono text-xs text-slate-700">{c.factRfc}</span><br/><span className="text-xs text-slate-400">{c.factRazonSocial}</span></>
                    : <span className="text-slate-300 text-xs">—</span>}
                </Td>
                <Td>
                  {c.factRegimenFiscal
                    ? <span className="text-xs text-slate-600">{c.factRegimenFiscal} · {c.factUsoCfdi}</span>
                    : <span className="text-slate-300 text-xs">—</span>}
                </Td>
                <Td><span className="text-xs text-slate-600">{c.pagoContratos ?? <span className="text-slate-300">—</span>}</span></Td>
                <Td><span className="text-xs text-slate-600">{c.pagoTaller    ?? <span className="text-slate-300">—</span>}</span></Td>
                <Td><span className="text-xs text-slate-600">{c.pagoExtras    ?? <span className="text-slate-300">—</span>}</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Report: Mantenimiento ─────────────────────────────────────────────────────

function ReporteMantenimiento() {
  const { data } = useMantenimiento({ pageSize: 100 })
  const registros = data?.items ?? []

  const completados  = registros.filter(m => m.estatus === "Completado").length
  const pendientes   = registros.filter(m => m.estatus === "Programado" || m.estatus === "EnProceso").length
  const siniestros   = registros.filter(m => m.esSiniestro).length
  const costoReal    = registros.reduce((s, m) => s + (m.costoReal ?? 0), 0)
  const costoEst     = registros.reduce((s, m) => s + (m.costoEstimado ?? 0), 0)
  const variacion    = costoReal - costoEst

  function exportar() {
    downloadExcel(
      registros.map(m => ({
        vehiculo:     m.descripcionVehiculo,
        tipo:         m.nombreTipo,
        siniestro:    m.esSiniestro ? "Sí" : "No",
        estatus:      m.estatus,
        f_programada: m.fechaProgramada,
        f_real:       m.fechaReal ?? "—",
        proveedor:    m.proveedor ?? "—",
        costo_est:    m.costoEstimado ?? 0,
        costo_real:   m.costoReal ?? 0,
        variacion:    (m.costoReal ?? 0) - (m.costoEstimado ?? 0),
      })),
      "reporte_mantenimiento",
      "Mantenimiento",
      {
        vehiculo: "Vehículo", tipo: "Tipo", siniestro: "Siniestro", estatus: "Estatus",
        f_programada: "Fecha programada", f_real: "Fecha real", proveedor: "Proveedor",
        costo_est: "Costo estimado ($)", costo_real: "Costo real ($)", variacion: "Variación ($)",
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <KpiBox label="Total registros"  value={registros.length} />
        <KpiBox label="Completados"      value={completados} color="text-green-600" />
        <KpiBox label="Pendientes"       value={pendientes}  color={pendientes > 0 ? "text-amber-600" : undefined} />
        <KpiBox label="Siniestros"       value={siniestros}  color={siniestros > 0 ? "text-red-600" : undefined} />
        <KpiBox label="Costo real"       value={formatCurrency(costoReal)} />
        <KpiBox label="Variación"        value={formatCurrency(Math.abs(variacion))} sub={variacion >= 0 ? "sobre presupuesto" : "bajo presupuesto"} color={variacion > 0 ? "text-red-600" : "text-green-600"} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={exportar} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar Excel
        </Button>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Vehículo</Th><Th>Tipo</Th><Th>Estatus</Th><Th>F. programada</Th><Th>F. real</Th><Th>Proveedor</Th><Th right>Estimado</Th><Th right>Real</Th><Th right>Variación</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {registros.map(m => {
              const overrun = (m.costoReal ?? 0) - (m.costoEstimado ?? 0)
              return (
                <tr key={m.id} className="hover:bg-slate-50">
                  <Td className="text-slate-700 max-w-[160px] truncate">{m.descripcionVehiculo}</Td>
                  <Td>
                    <span className={cn("text-xs", m.esSiniestro && "font-semibold text-red-600")}>
                      {m.esSiniestro && <span className="mr-1 text-[10px] bg-red-100 px-1 py-0.5 rounded">SIN.</span>}
                      {m.nombreTipo}
                    </span>
                  </Td>
                  <Td>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-green-100 text-green-700":  m.estatus === "Completado",
                      "bg-blue-100 text-blue-700":    m.estatus === "EnProceso",
                      "bg-amber-100 text-amber-700":  m.estatus === "Programado",
                      "bg-slate-100 text-slate-500":  m.estatus === "Cancelado",
                    })}>
                      {m.estatus}
                    </span>
                  </Td>
                  <Td className="text-xs text-slate-500 whitespace-nowrap">{formatDate(m.fechaProgramada)}</Td>
                  <Td className="text-xs text-slate-500 whitespace-nowrap">{m.fechaReal ? formatDate(m.fechaReal) : <span className="text-slate-300">—</span>}</Td>
                  <Td className="text-xs text-slate-500">{m.proveedor ?? <span className="text-slate-300">—</span>}</Td>
                  <Td right className="text-slate-600">{m.costoEstimado ? formatCurrency(m.costoEstimado) : "—"}</Td>
                  <Td right className="font-medium">{m.costoReal ? formatCurrency(m.costoReal) : "—"}</Td>
                  <Td right className={cn("text-xs font-medium", overrun > 0 ? "text-red-600" : overrun < 0 ? "text-green-600" : "text-slate-400")}>
                    {m.costoReal ? (overrun >= 0 ? "+" : "") + formatCurrency(overrun) : "—"}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Dialog wrapper ────────────────────────────────────────────────────────────

const REPORT_COMPONENTS: Record<ReporteTipo, React.ComponentType> = {
  vehiculos:     ReporteVehiculos,
  conductores:   ReporteConductores,
  pagos:         ReportePagos,
  facturacion:   ReporteFacturacion,
  mantenimiento: ReporteMantenimiento,
}

export function ReporteDialog({ tipo, onClose }: Props) {
  if (!tipo) return null
  const Componente = REPORT_COMPONENTS[tipo]

  return (
    <Dialog
      open={!!tipo}
      onClose={onClose}
      title={`Reporte — ${LABELS[tipo]}`}
      className="max-w-5xl"
    >
      <Componente />
    </Dialog>
  )
}
