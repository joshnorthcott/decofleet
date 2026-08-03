"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Users, User, CheckSquare, Square, Send, ChevronRight, ChevronLeft } from "lucide-react"
import type { ENotificacionTipo } from "@/types/api"
import { usePlantillas, useEnviarNotificacion } from "@/hooks/use-notificaciones"
import { useConductores } from "@/hooks/use-conductores"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TIPOS: ENotificacionTipo[] = ["Informativa", "Recordatorio", "Urgente", "Promocional"]

const TIPO_STYLES: Record<ENotificacionTipo, string> = {
  Informativa:   "bg-blue-50 text-blue-700 border-blue-200",
  Recordatorio:  "bg-amber-50 text-amber-700 border-amber-200",
  Urgente:       "bg-red-50 text-red-700 border-red-200",
  Promocional:   "bg-green-50 text-green-700 border-green-200",
}

const msgSchema = z.object({
  titulo: z.string().min(1, "Requerido").max(120),
  cuerpo: z.string().min(1, "Requerido"),
  tipo:   z.enum(["Informativa", "Urgente", "Recordatorio", "Promocional"]),
})

type MsgForm = z.infer<typeof msgSchema>

interface Props {
  open: boolean
  onClose: () => void
}

type Paso = "contenido" | "destinatarios"
type Alcance = "todos" | "seleccion"

export function EnviarNotificacionDialog({ open, onClose }: Props) {
  const [paso, setPaso]           = useState<Paso>("contenido")
  const [alcance, setAlcance]     = useState<Alcance>("todos")
  const [seleccion, setSeleccion] = useState<string[]>([])
  const [busqueda, setBusqueda]   = useState("")

  const { data: plantillasData }  = usePlantillas(true)   // soloActivas
  const { data: conductoresData } = useConductores({ estatus: "Activo", pageSize: 100 })
  const enviar = useEnviarNotificacion()

  const plantillas  = plantillasData?.items ?? []
  const conductores = conductoresData?.items ?? []
  const conductoresFiltrados = busqueda
    ? conductores.filter(c => c.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()))
    : conductores

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<MsgForm>({
    resolver: zodResolver(msgSchema),
    defaultValues: { tipo: "Informativa" },
  })

  useEffect(() => {
    if (open) {
      reset({ tipo: "Informativa", titulo: "", cuerpo: "" })
      setPaso("contenido")
      setAlcance("todos")
      setSeleccion([])
      setBusqueda("")
    }
  }, [open, reset])

  function aplicarPlantilla(id: string) {
    const p = plantillas.find(x => x.id === id)
    if (!p) return
    setValue("titulo", p.titulo, { shouldDirty: true })
    setValue("cuerpo",  p.cuerpo,  { shouldDirty: true })
    setValue("tipo",    p.tipo,    { shouldDirty: true })
  }

  function toggleConductor(id: string) {
    setSeleccion(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleTodos() {
    setSeleccion(prev =>
      prev.length === conductores.length ? [] : conductores.map(c => c.id)
    )
  }

  async function onEnviar(data: MsgForm) {
    const destinatarios = alcance === "todos" ? "todos" : seleccion
    await enviar.mutateAsync({ ...data, destinatarios })
    onClose()
  }

  const titulo = watch("titulo")
  const cuerpo = watch("cuerpo")
  const tipo   = watch("tipo") as ENotificacionTipo

  const puedeAvanzar  = !!titulo && !!cuerpo
  const puedeEnviar   = alcance === "todos" || seleccion.length > 0
  const totalEnvio    = alcance === "todos" ? conductores.length : seleccion.length

  return (
    <Dialog open={open} onClose={onClose} title="Enviar notificación" className="max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6 text-xs font-medium">
        <span className={cn("flex items-center gap-1.5", paso === "contenido" ? "text-blue-600" : "text-slate-400")}>
          <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
            paso === "contenido" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>1</span>
          Contenido
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className={cn("flex items-center gap-1.5", paso === "destinatarios" ? "text-blue-600" : "text-slate-400")}>
          <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
            paso === "destinatarios" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500")}>2</span>
          Destinatarios
        </span>
      </div>

      {paso === "contenido" && (
        <div className="space-y-4">
          {/* Template picker */}
          {plantillas.length > 0 && (
            <div className="space-y-2">
              <Label>Usar plantilla (opcional)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {plantillas.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => aplicarPlantilla(p.id)}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-700 truncate">{p.titulo}</p>
                    <span className={cn("inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border font-medium", TIPO_STYLES[p.tipo])}>
                      {p.tipo}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400 mb-3">— o escribe un mensaje nuevo —</p>
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-1">
            <Label htmlFor="titulo">Título *</Label>
            <Input id="titulo" placeholder="Asunto del mensaje" {...register("titulo")} />
            {errors.titulo && <p className="text-xs text-red-600">{errors.titulo.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="tipo">Tipo</Label>
            <Select id="tipo" {...register("tipo")}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="cuerpo">Mensaje *</Label>
            <textarea
              id="cuerpo"
              rows={5}
              placeholder="Escribe el mensaje que recibirán los choferes…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              {...register("cuerpo")}
            />
            {errors.cuerpo && <p className="text-xs text-red-600">{errors.cuerpo.message}</p>}
          </div>

          {/* Preview pill */}
          {tipo && (
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", TIPO_STYLES[tipo])}>
              {tipo}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              type="button"
              disabled={!puedeAvanzar}
              onClick={() => setPaso("destinatarios")}
            >
              Siguiente <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {paso === "destinatarios" && (
        <form onSubmit={handleSubmit(onEnviar)} className="space-y-4">
          {/* Summary of content */}
          <div className={cn("rounded-lg border px-4 py-3 space-y-0.5", TIPO_STYLES[tipo])}>
            <p className="text-sm font-semibold">{titulo}</p>
            <p className="text-xs opacity-75 line-clamp-2">{cuerpo}</p>
          </div>

          {/* Alcance selector */}
          <div className="space-y-2">
            <Label>¿A quién enviar?</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAlcance("todos")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left",
                  alcance === "todos" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <Users className={cn("h-5 w-5 shrink-0", alcance === "todos" ? "text-blue-600" : "text-slate-400")} />
                <div>
                  <p className="text-sm font-medium text-slate-800">Todos los choferes</p>
                  <p className="text-xs text-slate-400">{conductores.length} activos</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAlcance("seleccion")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left",
                  alcance === "seleccion" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <User className={cn("h-5 w-5 shrink-0", alcance === "seleccion" ? "text-blue-600" : "text-slate-400")} />
                <div>
                  <p className="text-sm font-medium text-slate-800">Selección manual</p>
                  <p className="text-xs text-slate-400">Elige uno o varios</p>
                </div>
              </button>
            </div>
          </div>

          {/* Conductor multi-select */}
          {alcance === "seleccion" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Buscar chofer…"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="max-w-xs"
                />
                <button
                  type="button"
                  onClick={toggleTodos}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {seleccion.length === conductores.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
              </div>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-52 overflow-y-auto">
                {conductoresFiltrados.map(c => {
                  const checked = seleccion.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleConductor(c.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        checked ? "bg-blue-50" : "hover:bg-slate-50",
                      )}
                    >
                      {checked
                        ? <CheckSquare className="h-4 w-4 text-blue-600 shrink-0" />
                        : <Square      className="h-4 w-4 text-slate-300 shrink-0" />}
                      <span className="text-sm text-slate-800">{c.nombreCompleto}</span>
                    </button>
                  )
                })}
              </div>
              {seleccion.length > 0 && (
                <p className="text-xs text-slate-500">{seleccion.length} chofer{seleccion.length !== 1 ? "es" : ""} seleccionado{seleccion.length !== 1 ? "s" : ""}</p>
              )}
            </div>
          )}

          <div className="flex justify-between gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setPaso("contenido")}>
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Atrás
            </Button>
            <Button
              type="submit"
              disabled={!puedeEnviar || enviar.isPending}
              className="gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              {enviar.isPending
                ? "Enviando…"
                : `Enviar a ${totalEnvio} chofer${totalEnvio !== 1 ? "es" : ""}`}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
