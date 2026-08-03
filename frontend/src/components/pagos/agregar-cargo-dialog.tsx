"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { PagoListItemDto } from "@/types/api"
import { useAgregarCargo } from "@/hooks/use-pagos"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  concepto: z.string().min(1, "Requerido").max(200),
  monto:    z.coerce.number().positive("Debe ser mayor a 0"),
  fecha:    z.string().min(1, "Requerido"),
})

type FormData = z.infer<typeof schema>

interface Props {
  pago: PagoListItemDto | null
  onClose: () => void
}

export function AgregarCargoDialog({ pago, onClose }: Props) {
  const cargoMutation = useAgregarCargo()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fecha: new Date().toISOString().slice(0, 10) },
  })

  async function onSubmit(data: FormData) {
    if (!pago) return
    await cargoMutation.mutateAsync({
      pagoContratoId: pago.id,
      concepto:       data.concepto,
      monto:          data.monto,
      fecha:          data.fecha,
    })
    reset()
    onClose()
  }

  return (
    <Dialog open={!!pago} onClose={onClose} title="Agregar cargo">
      {pago && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current balance */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total actual del periodo</span>
              <span className="font-semibold text-slate-900">{formatCurrency(pago.montoTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Saldo pendiente</span>
              <span className={pago.saldoPendiente > 0 ? "font-medium text-red-600" : "text-slate-400"}>
                {formatCurrency(pago.saldoPendiente)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="concepto">Concepto del cargo *</Label>
            <Input id="concepto" placeholder="Ej. Multa de tráfico, daño a vehículo…" {...register("concepto")} />
            {errors.concepto && <p className="text-xs text-red-600">{errors.concepto.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="monto">Monto del cargo *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <Input id="monto" type="number" step="0.01" min={0} className="pl-7" {...register("monto")} />
              </div>
              {errors.monto && <p className="text-xs text-red-600">{errors.monto.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input id="fecha" type="date" {...register("fecha")} />
              {errors.fecha && <p className="text-xs text-red-600">{errors.fecha.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Aplicando…" : "Agregar cargo"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
