"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Receipt, Save, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useConductor, usePatchConductor } from "@/hooks/use-conductores"

// ── SAT catalogue data ────────────────────────────────────────────────────────

const REGIMENES_FISCALES = [
  { value: "601", label: "601 — General de Ley Personas Morales" },
  { value: "603", label: "603 — Personas Morales con Fines no Lucrativos" },
  { value: "605", label: "605 — Sueldos y Salarios e Ingresos Asimilados" },
  { value: "606", label: "606 — Arrendamiento" },
  { value: "607", label: "607 — Régimen de Enajenación o Adquisición de Bienes" },
  { value: "608", label: "608 — Demás Ingresos" },
  { value: "610", label: "610 — Residentes en el Extranjero sin Establecimiento Permanente" },
  { value: "611", label: "611 — Ingresos por Dividendos" },
  { value: "612", label: "612 — Personas Físicas con Actividades Empresariales y Profesionales" },
  { value: "614", label: "614 — Ingresos por Intereses" },
  { value: "615", label: "615 — Régimen de los ingresos por obtención de premios" },
  { value: "616", label: "616 — Sin obligaciones fiscales" },
  { value: "620", label: "620 — Sociedades Cooperativas de Producción" },
  { value: "621", label: "621 — Incorporación Fiscal" },
  { value: "622", label: "622 — Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { value: "623", label: "623 — Opcional para Grupos de Sociedades" },
  { value: "624", label: "624 — Coordinados" },
  { value: "625", label: "625 — Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { value: "626", label: "626 — Régimen Simplificado de Confianza (RESICO)" },
]

const USOS_CFDI = [
  { value: "G01", label: "G01 — Adquisición de mercancias" },
  { value: "G02", label: "G02 — Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "G03 — Gastos en general" },
  { value: "I01", label: "I01 — Construcciones" },
  { value: "I02", label: "I02 — Mobilario y equipo de oficina por inversiones" },
  { value: "I03", label: "I03 — Equipo de transporte" },
  { value: "I04", label: "I04 — Equipo de computo y accesorios" },
  { value: "I05", label: "I05 — Dados, troqueles, moldes, matrices y herramental" },
  { value: "I06", label: "I06 — Comunicaciones telefónicas" },
  { value: "I07", label: "I07 — Comunicaciones satelitales" },
  { value: "I08", label: "I08 — Otra maquinaria y equipo" },
  { value: "D01", label: "D01 — Honorarios médicos, dentales y gastos hospitalarios" },
  { value: "D02", label: "D02 — Gastos médicos por incapacidad o discapacidad" },
  { value: "D03", label: "D03 — Gastos funerales" },
  { value: "D04", label: "D04 — Donativos" },
  { value: "D05", label: "D05 — Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
  { value: "D06", label: "D06 — Aportaciones voluntarias al SAR" },
  { value: "D07", label: "D07 — Primas por seguros de gastos médicos" },
  { value: "D08", label: "D08 — Gastos de transportación escolar obligatoria" },
  { value: "D09", label: "D09 — Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
  { value: "D10", label: "D10 — Pagos por servicios educativos (colegiaturas)" },
  { value: "S01", label: "S01 — Sin efectos fiscales" },
  { value: "CP01", label: "CP01 — Pagos" },
  { value: "CN01", label: "CN01 — Nómina" },
]

// ── Zod schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  factRfc:           z.string().min(12).max(13).regex(/^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/, "RFC inválido").optional().or(z.literal("")),
  factRazonSocial:   z.string().max(300).optional(),
  factRegimenFiscal: z.string().optional(),
  factUsoCfdi:       z.string().optional(),
  factEmail:         z.string().email("Correo inválido").max(200).or(z.literal("")).optional(),
  factCodigoPostal:  z.string().length(5, "Debe ser 5 dígitos").regex(/^\d{5}$/, "Solo dígitos").optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

// ── Component ─────────────────────────────────────────────────────────────────

export function ConductorFacturacion({ conductorId }: { conductorId: string }) {
  const { data: conductor } = useConductor(conductorId)
  const patchMutation = usePatchConductor(conductorId)

  const [requiere, setRequiere] = useState<boolean>(false)
  const [togglingTo, setTogglingTo] = useState<boolean | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Sync when conductor loads
  useEffect(() => {
    if (!conductor) return
    setRequiere(conductor.requiereFactura)
    reset({
      factRfc:           conductor.factRfc           ?? "",
      factRazonSocial:   conductor.factRazonSocial   ?? "",
      factRegimenFiscal: conductor.factRegimenFiscal ?? "",
      factUsoCfdi:       conductor.factUsoCfdi       ?? "",
      factEmail:         conductor.factEmail         ?? "",
      factCodigoPostal:  conductor.factCodigoPostal  ?? "",
    })
  }, [conductor, reset])

  const handleToggle = async (val: boolean) => {
    setTogglingTo(val)
    try {
      await patchMutation.mutateAsync({ requiereFactura: val })
      setRequiere(val)
      if (!val) {
        // Clear fiscal data when toggling off
        await patchMutation.mutateAsync({
          requiereFactura: false,
          factRfc: undefined, factRazonSocial: undefined,
          factRegimenFiscal: undefined, factUsoCfdi: undefined,
          factEmail: undefined, factCodigoPostal: undefined,
        })
      }
    } finally {
      setTogglingTo(null)
    }
  }

  const onSubmit = async (data: FormData) => {
    await patchMutation.mutateAsync({
      requiereFactura:   true,
      factRfc:           data.factRfc           || undefined,
      factRazonSocial:   data.factRazonSocial   || undefined,
      factRegimenFiscal: data.factRegimenFiscal || undefined,
      factUsoCfdi:       data.factUsoCfdi       || undefined,
      factEmail:         data.factEmail         || undefined,
      factCodigoPostal:  data.factCodigoPostal  || undefined,
    })
    reset(data)  // mark form clean after save
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-slate-400" />
          Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* YES / NO toggle */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            ¿Requiere factura?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => !requiere && handleToggle(true)}
              disabled={!!togglingTo}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-medium transition-colors
                ${requiere
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-green-400 hover:text-green-600"
                }
              `}
            >
              {togglingTo === true && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Sí
            </button>
            <button
              type="button"
              onClick={() => requiere && handleToggle(false)}
              disabled={!!togglingTo}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-medium transition-colors
                ${!requiere
                  ? "bg-slate-700 border-slate-700 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                }
              `}
            >
              {togglingTo === false && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              No
            </button>
          </div>
        </div>

        {/* Fiscal fields — only shown when requiere = true */}
        {requiere && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Datos fiscales (CFDI 4.0)</p>

            {/* RFC + Razón Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="factRfc">RFC</Label>
                <Input
                  id="factRfc"
                  placeholder="RATA850312ABC"
                  className="uppercase font-mono tracking-wider"
                  {...register("factRfc")}
                  onChange={e => { e.target.value = e.target.value.toUpperCase(); register("factRfc").onChange(e) }}
                />
                {errors.factRfc && <p className="text-xs text-red-600">{errors.factRfc.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="factRazonSocial">Razón social</Label>
                <Input id="factRazonSocial" placeholder="Nombre o razón social fiscal" {...register("factRazonSocial")} />
              </div>
            </div>

            {/* Régimen + Uso CFDI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="factRegimenFiscal">Régimen fiscal</Label>
                <Select id="factRegimenFiscal" {...register("factRegimenFiscal")}>
                  <option value="">— Seleccionar —</option>
                  {REGIMENES_FISCALES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="factUsoCfdi">Uso CFDI</Label>
                <Select id="factUsoCfdi" {...register("factUsoCfdi")}>
                  <option value="">— Seleccionar —</option>
                  {USOS_CFDI.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Email + C.P. fiscal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="factEmail">Correo electrónico fiscal</Label>
                <Input id="factEmail" type="email" placeholder="facturacion@empresa.mx" {...register("factEmail")} />
                {errors.factEmail && <p className="text-xs text-red-600">{errors.factEmail.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="factCodigoPostal">C.P. fiscal</Label>
                <Input id="factCodigoPostal" placeholder="06600" maxLength={5} className="font-mono" {...register("factCodigoPostal")} />
                {errors.factCodigoPostal && <p className="text-xs text-red-600">{errors.factCodigoPostal.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Save className="h-4 w-4" />
                }
                Guardar datos fiscales
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
