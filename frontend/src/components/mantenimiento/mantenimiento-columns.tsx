"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { MantenimientoDto, EEstatusMantenimiento } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Pencil, Trash2, PlayCircle, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const estatusBadge: Record<EEstatusMantenimiento, React.ReactNode> = {
  Programado: <Badge variant="secondary">Programado</Badge>,
  EnProceso:  <Badge variant="warning">En proceso</Badge>,
  Completado: <Badge variant="success">Completado</Badge>,
  Cancelado:  <Badge variant="outline">Cancelado</Badge>,
}

interface GetColumnsOptions {
  onEdit:   (row: MantenimientoDto) => void
  onDelete: (row: MantenimientoDto) => void
  onChangeEstatus: (row: MantenimientoDto, estatus: EEstatusMantenimiento) => void
}

export function getMantenimientoColumns({ onEdit, onDelete, onChangeEstatus }: GetColumnsOptions): ColumnDef<MantenimientoDto, unknown>[] {
  return [
    {
      accessorKey: "descripcionVehiculo",
      header: "Vehículo",
      cell: ({ row }) => (
        <div>
          <span className="font-medium text-slate-900 text-sm">{row.original.descripcionVehiculo}</span>
          {row.original.esSiniestro && (
            <span className="ml-2 inline-flex items-center gap-0.5 text-xs text-amber-600 font-medium">
              <AlertTriangle className="h-3 w-3" /> Siniestro
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "nombreTipo",
      header: "Tipo de servicio",
    },
    {
      accessorKey: "fechaProgramada",
      header: "Fecha programada",
      cell: ({ getValue }) => formatDate(getValue() as string | null),
    },
    {
      accessorKey: "proveedor",
      header: "Proveedor",
      cell: ({ getValue }) => (getValue() as string) ?? <span className="text-slate-300">—</span>,
    },
    {
      accessorKey: "costoEstimado",
      header: "Costo est.",
      cell: ({ getValue }) => {
        const v = getValue() as number | null
        return v != null ? formatCurrency(v) : <span className="text-slate-300">—</span>
      },
    },
    {
      accessorKey: "costoReal",
      header: "Costo real",
      cell: ({ row }) => {
        const est  = row.original.costoEstimado
        const real = row.original.costoReal
        if (real == null) return <span className="text-slate-300">—</span>
        const over = est != null && real > est
        return <span className={over ? "text-red-600 font-medium" : "text-green-700 font-medium"}>{formatCurrency(real)}</span>
      },
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ getValue }) => estatusBadge[getValue() as EEstatusMantenimiento],
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { estatus } = row.original
        const isDone = estatus === "Completado" || estatus === "Cancelado"
        return (
          <div className="flex items-center gap-1 justify-end">
            {estatus === "Programado" && (
              <Button variant="ghost" size="icon-sm" title="Iniciar" onClick={() => onChangeEstatus(row.original, "EnProceso")}>
                <PlayCircle className="h-4 w-4 text-blue-500" />
              </Button>
            )}
            {estatus === "EnProceso" && (
              <Button variant="ghost" size="icon-sm" title="Completar" onClick={() => onChangeEstatus(row.original, "Completado")}>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
            )}
            {!isDone && (
              <Button variant="ghost" size="icon-sm" title="Cancelar" onClick={() => onChangeEstatus(row.original, "Cancelado")}>
                <XCircle className="h-4 w-4 text-red-400" />
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" title="Editar" onClick={() => onEdit(row.original)}>
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Eliminar" onClick={() => onDelete(row.original)}>
              <Trash2 className="h-3.5 w-3.5 text-red-300" />
            </Button>
          </div>
        )
      },
    },
  ]
}
