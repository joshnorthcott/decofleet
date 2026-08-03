"use client"

import { useState, useEffect } from "react"
import { Banknote, Save, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { useConductor, usePatchConductor } from "@/hooks/use-conductores"
import type { EDestinoPago } from "@/types/api"

const DESTINOS: { value: EDestinoPago; label: string }[] = [
  { value: "Moral",        label: "Moral" },
  { value: "Fisica Derek", label: "Física Derek" },
  { value: "Fisica Gene",  label: "Física Gene" },
]

const TIPOS = [
  { key: "pagoContratos" as const, label: "Contratos" },
  { key: "pagoTaller"    as const, label: "Taller" },
  { key: "pagoExtras"    as const, label: "Extras" },
]

interface PagoState {
  pagoContratos: EDestinoPago | ""
  pagoTaller:    EDestinoPago | ""
  pagoExtras:    EDestinoPago | ""
}

export function ConductorConfigPagos({ conductorId }: { conductorId: string }) {
  const { data: conductor } = useConductor(conductorId)
  const patchMutation = usePatchConductor(conductorId)

  const [values, setValues] = useState<PagoState>({
    pagoContratos: "",
    pagoTaller:    "",
    pagoExtras:    "",
  })
  const [dirty, setDirty] = useState(false)

  // Sync when conductor loads
  useEffect(() => {
    if (!conductor) return
    setValues({
      pagoContratos: conductor.pagoContratos ?? "",
      pagoTaller:    conductor.pagoTaller    ?? "",
      pagoExtras:    conductor.pagoExtras    ?? "",
    })
    setDirty(false)
  }, [conductor])

  const handleChange = (key: keyof PagoState, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  const handleSave = async () => {
    await patchMutation.mutateAsync({
      pagoContratos: (values.pagoContratos || undefined) as EDestinoPago | undefined,
      pagoTaller:    (values.pagoTaller    || undefined) as EDestinoPago | undefined,
      pagoExtras:    (values.pagoExtras    || undefined) as EDestinoPago | undefined,
    })
    setDirty(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-slate-400" />
            Configuración de pagos
          </CardTitle>
          {dirty && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={patchMutation.isPending}
            >
              {patchMutation.isPending
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Save className="h-3.5 w-3.5" />
              }
              Guardar cambios
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIPOS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <Select
                value={values[key]}
                onChange={e => handleChange(key, e.target.value)}
              >
                <option value="">— Sin asignar —</option>
                {DESTINOS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </Select>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Define la entidad receptora de cada tipo de pago generado por este conductor.
        </p>
      </CardContent>
    </Card>
  )
}
