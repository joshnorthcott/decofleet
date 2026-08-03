"use client"

import type { PagoListItemDto, EEstatusPago } from "@/types/api"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

const estatusBadge: Record<EEstatusPago, React.ReactNode> = {
  Pendiente:     <Badge variant="secondary">Pendiente</Badge>,
  PagadoParcial: <Badge variant="warning">Pago parcial</Badge>,
  Pagado:        <Badge variant="success">Pagado</Badge>,
  Vencido:       <Badge variant="destructive">Vencido</Badge>,
  Cancelado:     <Badge variant="outline">Cancelado</Badge>,
}

interface Props {
  pago: PagoListItemDto | null
  onClose: () => void
}

export function PagoDetailDialog({ pago, onClose }: Props) {
  return (
    <Dialog open={!!pago} onClose={onClose} title="Detalle del pago">
      {pago && (
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Estatus</span>
            {estatusBadge[pago.estatus]}
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Total</p>
              <p className="text-base font-bold text-slate-900">{formatCurrency(pago.montoTotal)}</p>
            </div>
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Pagado</p>
              <p className="text-base font-bold text-green-700">{formatCurrency(pago.montoPagado)}</p>
            </div>
            <div className={`rounded-lg border p-3 text-center ${pago.saldoPendiente > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
              <p className="text-xs text-slate-400 mb-1">Pendiente</p>
              <p className={`text-base font-bold ${pago.saldoPendiente > 0 ? "text-red-600" : "text-slate-400"}`}>
                {formatCurrency(pago.saldoPendiente)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Contrato</span>
              <span className="font-mono text-xs text-slate-600">#{pago.contratoId.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Conductor</span>
              <span className="font-medium text-slate-800">{pago.nombreConductor}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Vehículo</span>
              <span className="text-slate-700 text-right max-w-[200px]">{pago.descripcionVehiculo}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Tarifa</span>
              <span className="text-slate-700">{pago.nombreTarifa}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Periodo</span>
              <span className="text-slate-700">
                {formatDate(pago.periodoInicio)} → {formatDate(pago.periodoFin)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Vencimiento</span>
              <span className={pago.estatus === "Vencido" ? "text-red-600 font-medium" : "text-slate-700"}>
                {formatDate(pago.fechaVencimiento)}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Forma de pago</span>
              <span className="text-slate-700">{pago.formaPago}</span>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}
