"use client"

import { useRef, useState, useCallback } from "react"
import { Upload, X, FileText, Image, Loader2, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useDocumentosVehiculo, useDeleteDocumentoVehiculo } from "@/hooks/use-documentos-vehiculo"
import type { DocumentoVehiculoDto } from "@/types/api"
import { formatDate } from "@/lib/utils"
import { formatSize } from "@/lib/format-size"
import { useQueryClient } from "@tanstack/react-query"
import { documentosKeys } from "@/hooks/use-documentos-vehiculo"

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCEPTED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

const ACCEPTED_EXT = ".pdf,.jpg,.jpeg,.png,.doc,.docx"
const MAX_BYTES     = 50 * 1024 * 1024 // 50 MB

// ── Helpers ───────────────────────────────────────────────────────────────────

type DocKind = "pdf" | "image" | "word" | "other"

function docKind(mimeType: string): DocKind {
  if (mimeType === "application/pdf")   return "pdf"
  if (mimeType.startsWith("image/"))    return "image"
  if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml")) return "word"
  return "other"
}

// ── File type icon ────────────────────────────────────────────────────────────

function FileTypeIcon({ mimeType, preview }: { mimeType: string; preview?: string }) {
  const kind = docKind(mimeType)

  if (kind === "image" && preview) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={preview}
        alt="preview"
        className="w-full h-full object-cover rounded-t-lg"
      />
    )
  }

  const cfg: Record<DocKind, { bg: string; label: string; color: string }> = {
    pdf:   { bg: "bg-red-50",   label: "PDF",  color: "text-red-600" },
    image: { bg: "bg-teal-50",  label: "IMG",  color: "text-teal-600" },
    word:  { bg: "bg-blue-50",  label: "DOC",  color: "text-blue-600" },
    other: { bg: "bg-slate-50", label: "FILE", color: "text-slate-500" },
  }

  const { bg, label, color } = cfg[kind]

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-1 rounded-t-lg ${bg}`}>
      <FileText className={`h-8 w-8 ${color}`} />
      <span className={`text-xs font-bold tracking-widest ${color}`}>{label}</span>
    </div>
  )
}

// ── Document card ─────────────────────────────────────────────────────────────

interface DocCardProps {
  doc: DocumentoVehiculoDto & { preview?: string; isLocal?: boolean }
  onRemove: () => void
  removing: boolean
}

function DocCard({ doc, onRemove, removing }: DocCardProps) {
  return (
    <div className="group relative rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail / icon area */}
      <div className="h-28 w-full relative">
        <FileTypeIcon mimeType={doc.mimeType} preview={doc.preview} />
        {/* Remove button — appears on hover */}
        <button
          onClick={onRemove}
          disabled={removing}
          aria-label="Eliminar documento"
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 disabled:pointer-events-none"
        >
          {removing
            ? <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
            : <X className="h-3 w-3 text-slate-500 hover:text-red-500" />
          }
        </button>
      </div>

      {/* File info */}
      <div className="px-2.5 py-2">
        <p
          className="text-xs font-medium text-slate-700 leading-tight truncate"
          title={doc.nombre}
        >
          {doc.nombre}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {formatSize(doc.tamaño)} · {formatDate(doc.creadoEn)}
        </p>
      </div>
    </div>
  )
}

// ── Drop zone ─────────────────────────────────────────────────────────────────

interface DropZoneProps {
  onFiles: (files: FileList) => void
  compact?: boolean
}

function DropZone({ onFiles, compact }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files)
  }, [onFiles])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  if (compact) {
    return (
      <>
        <input ref={inputRef} type="file" accept={ACCEPTED_EXT} multiple className="hidden" onChange={e => e.target.files && onFiles(e.target.files)} />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" />
          Subir archivo
        </Button>
      </>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors p-8 flex flex-col items-center gap-3 text-center
        ${dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"}`}
    >
      <input ref={inputRef} type="file" accept={ACCEPTED_EXT} multiple className="hidden" onChange={e => e.target.files && onFiles(e.target.files)} />
      <Upload className={`h-8 w-8 ${dragging ? "text-blue-500" : "text-slate-300"}`} />
      <div>
        <p className="text-sm font-medium text-slate-600">Arrastra archivos aquí o haz clic para seleccionar</p>
        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC, DOCX · Máx. 50 MB por archivo</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type LocalDoc = DocumentoVehiculoDto & { preview?: string; isLocal: true }

export function VehiculoDocumentos({ vehiculoId }: { vehiculoId: string }) {
  const qc = useQueryClient()
  const { data: serverDocs = [], isLoading } = useDocumentosVehiculo(vehiculoId)
  const deleteMutation = useDeleteDocumentoVehiculo(vehiculoId)

  const [localDocs, setLocalDocs] = useState<LocalDoc[]>([])
  const [errors, setErrors]       = useState<string[]>([])
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleFiles = useCallback((files: FileList) => {
    const newErrors: string[] = []
    const toAdd: LocalDoc[]   = []

    Array.from(files).forEach(file => {
      if (!ACCEPTED_MIME.has(file.type)) {
        newErrors.push(`"${file.name}": tipo no permitido.`)
        return
      }
      if (file.size > MAX_BYTES) {
        newErrors.push(`"${file.name}": supera los 50 MB.`)
        return
      }
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      toAdd.push({
        id:         crypto.randomUUID(),
        vehiculoId,
        empresaId:  "local",
        nombre:     file.name,
        mimeType:   file.type,
        tamaño:     file.size,
        creadoEn:   new Date().toISOString(),
        preview,
        isLocal:    true,
      })
    })

    setErrors(newErrors)
    if (toAdd.length) setLocalDocs(prev => [...prev, ...toAdd])
  }, [vehiculoId])

  const removeLocal = (id: string) => {
    setLocalDocs(prev => {
      const doc = prev.find(d => d.id === id)
      if (doc?.preview) URL.revokeObjectURL(doc.preview)
      return prev.filter(d => d.id !== id)
    })
  }

  const removeServer = async (id: string) => {
    setRemovingId(id)
    try {
      await deleteMutation.mutateAsync(id)
    } finally {
      setRemovingId(null)
    }
  }

  const allDocs = [
    ...serverDocs.map(d => ({ ...d, isLocal: false as const })),
    ...localDocs,
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-slate-400" />
            Documentos
            {allDocs.length > 0 && (
              <span className="text-xs font-normal text-slate-400">
                {allDocs.length} archivo{allDocs.length !== 1 ? "s" : ""}
              </span>
            )}
          </CardTitle>
          {/* Compact upload button shown when there are already docs */}
          {allDocs.length > 0 && <DropZone onFiles={handleFiles} compact />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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
        ) : allDocs.length === 0 ? (
          <DropZone onFiles={handleFiles} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allDocs.map(doc => (
              <DocCard
                key={doc.id}
                doc={doc}
                removing={removingId === doc.id}
                onRemove={() =>
                  doc.isLocal ? removeLocal(doc.id) : removeServer(doc.id)
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
