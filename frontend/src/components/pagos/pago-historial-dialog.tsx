"use client"

import { History, CreditCard, Loader2 } from "lucide-react"
import type { PagoListItemDto } from "@/types/api"
import { usePagoDetalle } from "@/hooks/use-pagos"
import { Dialog } from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Props {
  pago: PagoListItemDto | null
  onClose: () => void
}

export function PagoHistorialDialog({ pago, onClose }: Props) {
  const { data, isLoading } = usePagoDetalle(pago?.id ?? "")
  // historial now contains ALL emitidos for the contract, enriched with period dates
  const historial = data?.historial ?? []
  const totalAbonado = historial.reduce((sum, pe) => sum + pe.monto, 0)

  return (
    <Dialog
      open={!!pago}
      onClose={onClose}
      title={`Historial de pagos${pago ? ` — ${pago.nombreConductor}` : ""}`}
    >
      {pago && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex gap-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm flex-wrap">
            <div>
              <p className="text-xs text-slate-400">Contrato</p>
              <p className="font-mono text-xs font-semibold text-slate-700">
                #{pago.contratoId.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total pagado</p>
              <p className="font-semibold text-green-700">{formatCurrency(totalAbonado)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Saldo pendiente</p>
              <p className={`font-semibold ${pago.saldoPendiente > 0 ? "text-red-600" : "text-slate-400"}`}>
                {formatCurrency(pago.saldoPendiente)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Registros</p>
              <p className="font-semibold text-slate-700">{historial.length}</p>
            </div>
          </div>

          {/* Payments list */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : historial.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-300">
              <History className="h-8 w-8" />
              <p className="text-sm">Sin pagos registrados en este contrato.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto -mx-6 px-6">
              {historial.map(pe => (
                <div key={pe.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CreditCard className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{formatCurrency(pe.monto)}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {pe.formaPago}
                        {pe.periodoInicio && (
                          <span className="ml-1.5 text-slate-300">
                            · periodo {formatDate(pe.periodoInicio)} – {formatDate(pe.periodoFin!)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">{formatDate(pe.fechaPago)}</p>
                    {pe.referencia && (
                      <p className="text-xs font-mono text-slate-400">{pe.referencia}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Dialog>
  )
}
