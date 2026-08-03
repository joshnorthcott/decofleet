"use client"

import { useRef, useState, useCallback } from "react"
import { Camera, Upload, X, Loader2, ImageOff } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFotosVehiculo, useDeleteFotoVehiculo } from "@/hooks/use-fotos-vehiculo"
import type { FotoVehiculoDto, EFotoCategoria } from "@/types/api"
import { formatSize } from "@/lib/format-size"

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIAS: EFotoCategoria[] = ["Inventario", "Exteriores", "Interiores", "Motor"]

const CATEGORIA_STYLE: Record<EFotoCategoria, { bg: string; ring: string; label: string }> = {
  Inventario: { bg: "bg-slate-100",  ring: "ring-slate-300",  label: "text-slate-500"  },
  Exteriores: { bg: "bg-sky-50",     ring: "ring-sky-200",    label: "text-sky-500"    },
  Interiores: { bg: "bg-amber-50",   ring: "ring-amber-200",  label: "text-amber-500"  },
  Motor:      { bg: "bg-zinc-100",   ring: "ring-zinc-300",   label: "text-zinc-500"   },
}

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp"])
const ACCEPTED_EXT  = ".jpg,.jpeg,.png,.webp"
const MAX_BYTES      = 50 * 1024 * 1024

// ── Helpers ───────────────────────────────────────────────────────────────────

type LocalFoto = FotoVehiculoDto & { preview: string; isLocal: true }
type AnyFoto   = (FotoVehiculoDto & { isLocal?: false }) | LocalFoto

// ── Photo card ────────────────────────────────────────────────────────────────

function FotoCard({
  foto,
  categoria,
  onRemove,
  removing,
}: {
  foto: AnyFoto
  categoria: EFotoCategoria
  onRemove: () => void
  removing: boolean
}) {
  const style   = CATEGORIA_STYLE[categoria]
  const preview = foto.isLocal ? foto.preview : foto.url

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={foto.nombre} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center gap-1 ${style.bg}`}>
          <Camera className={`h-6 w-6 ${style.label}`} />
          <span className={`text-[10px] font-medium ${style.label} max-w-[80%] text-center truncate px-1`}>
            {foto.nombre}
          </span>
        </div>
      )}

      {/* Overlay on hover: filename + size */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
        <p className="text-white text-[10px] font-medium truncate leading-tight">{foto.nombre}</p>
        <p className="text-white/70 text-[10px]">{formatSize(foto.tamaño)}</p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        disabled={removing}
        aria-label="Eliminar foto"
        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 disabled:pointer-events-none"
      >
        {removing
          ? <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
          : <X className="h-3 w-3 text-slate-500 hover:text-red-500" />
        }
      </button>
    </div>
  )
}

// ── Per-category section ──────────────────────────────────────────────────────

function CategoriaSection({
  categoria,
  fotos,
  onUpload,
  onRemove,
  removingId,
}: {
  categoria: EFotoCategoria
  fotos: AnyFoto[]
  onUpload: (cat: EFotoCategoria, files: FileList) => void
  onRemove: (foto: AnyFoto) => void
  removingId: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const style = CATEGORIA_STYLE[categoria]

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) onUpload(categoria, e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700">{categoria}</h3>
          {fotos.length > 0 && (
            <span className="text-xs text-slate-400">{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXT}
            multiple
            className="hidden"
            onChange={e => e.target.files && onUpload(categoria, e.target.files)}
          />
          <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}
            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800">
            <Upload className="h-3 w-3" />
            Agregar
          </Button>
        </div>
      </div>

      {fotos.length === 0 ? (
        /* Empty drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors flex items-center justify-center gap-2 py-5
            ${dragging
              ? "border-blue-400 bg-blue-50"
              : `border-slate-200 ${style.bg} hover:border-slate-300`}`}
        >
          <Camera className={`h-4 w-4 ${dragging ? "text-blue-400" : style.label}`} />
          <p className={`text-xs ${dragging ? "text-blue-500" : "text-slate-400"}`}>
            Arrastra fotos aquí o haz clic
          </p>
        </div>
      ) : (
        /* Photo grid */
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 rounded-lg p-2 transition-colors
            ${dragging ? "bg-blue-50 ring-2 ring-blue-300 ring-dashed" : ""}`}
        >
          {fotos.map(foto => (
            <FotoCard
              key={foto.id}
              foto={foto}
              categoria={categoria}
              removing={removingId === foto.id}
              onRemove={() => onRemove(foto)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function VehiculoFotos({ vehiculoId }: { vehiculoId: string }) {
  const { data: serverFotos = [], isLoading } = useFotosVehiculo(vehiculoId)
  const deleteMutation = useDeleteFotoVehiculo(vehiculoId)

  const [localFotos, setLocalFotos]   = useState<LocalFoto[]>([])
  const [errors, setErrors]           = useState<string[]>([])
  const [removingId, setRemovingId]   = useState<string | null>(null)

  const handleUpload = useCallback((categoria: EFotoCategoria, files: FileList) => {
    const newErrors: string[] = []
    const toAdd: LocalFoto[]  = []

    Array.from(files).forEach(file => {
      if (!ACCEPTED_MIME.has(file.type)) {
        newErrors.push(`"${file.name}": solo se permiten JPG, PNG o WebP.`)
        return
      }
      if (file.size > MAX_BYTES) {
        newErrors.push(`"${file.name}": supera los 50 MB.`)
        return
      }
      toAdd.push({
        id:         crypto.randomUUID(),
        vehiculoId,
        empresaId:  "local",
        categoria,
        nombre:     file.name,
        mimeType:   file.type,
        tamaño:     file.size,
        url:        null,
        creadoEn:   new Date().toISOString(),
        preview:    URL.createObjectURL(file),
        isLocal:    true,
      })
    })

    setErrors(newErrors)
    if (toAdd.length) setLocalFotos(prev => [...prev, ...toAdd])
  }, [vehiculoId])

  const handleRemove = async (foto: AnyFoto) => {
    if (foto.isLocal) {
      URL.revokeObjectURL((foto as LocalFoto).preview)
      setLocalFotos(prev => prev.filter(f => f.id !== foto.id))
      return
    }
    setRemovingId(foto.id)
    try {
      await deleteMutation.mutateAsync(foto.id)
    } finally {
      setRemovingId(null)
    }
  }

  const allFotos: AnyFoto[] = [
    ...serverFotos.map(f => ({ ...f, isLocal: false as const })),
    ...localFotos,
  ]

  const totalFotos = allFotos.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-slate-400" />
          Fotos
          {totalFotos > 0 && (
            <span className="text-xs font-normal text-slate-400">
              {totalFotos} foto{totalFotos !== 1 ? "s" : ""}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 space-y-1">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-red-600">{e}</p>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="space-y-6 divide-y divide-slate-100">
            {CATEGORIAS.map((cat, i) => (
              <div key={cat} className={i > 0 ? "pt-6" : ""}>
                <CategoriaSection
                  categoria={cat}
                  fotos={allFotos.filter(f => f.categoria === cat)}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                  removingId={removingId}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
