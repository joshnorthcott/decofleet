"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { PagoContratoDto, EFormaPago } from "@/types/api"
import { useRegistrarPago } from "@/hooks/use-pagos"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  monto:     z.coerce.number().positive("El monto debe ser mayor a 0"),
  formaPago: z.enum(["Efectivo", "Transferencia", "Tarjeta", "Cheque"]),
  fechaPago: z.string().min(1, "Requerido"),
  referencia: z.string().max(100).optional(),
})

type FormData = z.infer<typeof schema>

interface RegistrarPagoDialogProps {
  pago: PagoContratoDto | null
  onClose: () => void
}

export function RegistrarPagoDialog({ pago, onClose }: RegistrarPagoDialogProps) {
  const registrarMutation = useRegistrarPago()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      monto: pago?.saldoPendiente ?? 0,
      formaPago: "Efectivo",
      fechaPago: new Date().toISOString().slice(0, 10),
    },
  })

  async function onSubmit(data: FormData) {
    if (!pago) return
    await registrarMutation.mutateAsync({
      pagoContratoId: pago.id,
      monto: data.monto,
      formaPago: data.formaPago as EFormaPago,
      fechaPago: data.fechaPago,
      referencia: data.referencia,
    })
    reset()
    onClose()
  }

  return (
    <Dialog open={!!pago} onClose={onClose} title="Registrar pago">
      {pago && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Info del periodo */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Saldo pendiente</span>
              <span className="font-semibold text-slate-900">{formatCurrency(pago.saldoPendiente)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total del periodo</span>
              <span className="text-slate-700">{formatCurrency(pago.montoTotal)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="monto">Monto a registrar *</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              {...register("monto")}
            />
            {errors.monto && <p className="text-xs text-red-600">{errors.monto.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="formaPago">Forma de pago</Label>
              <Select id="formaPago" {...register("formaPago")}>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Cheque">Cheque</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="fechaPago">Fecha de pago *</Label>
              <Input id="fechaPago" type="date" {...register("fechaPago")} />
              {errors.fechaPago && <p className="text-xs text-red-600">{errors.fechaPago.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="referencia">Referencia / Número de operación</Label>
            <Input id="referencia" placeholder="Opcional" {...register("referencia")} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar pago"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
