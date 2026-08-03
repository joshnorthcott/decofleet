"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { VehiculoDto, EEstatusVehiculo } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const estatusBadge: Record<EEstatusVehiculo, React.ReactNode> = {
  Disponible:    <Badge variant="success">Disponible</Badge>,
  Arrendado:     <Badge variant="default">Arrendado</Badge>,
  Mantenimiento: <Badge variant="warning">Mantenimiento</Badge>,
  Baja:          <Badge variant="secondary">Baja</Badge>,
}

interface GetColumnsOptions {
  onEdit: (row: VehiculoDto) => void
  onDelete: (row: VehiculoDto) => void
}

export function getVehiculoColumns({ onEdit, onDelete }: GetColumnsOptions): ColumnDef<VehiculoDto, unknown>[] {
  return [
    {
      accessorKey: "marca",
      header: "Marca / Modelo",
      cell: ({ row }) => (
        <Link
          href={`/vehiculos/${row.original.id}`}
          className="hover:text-blue-600 transition-colors group"
        >
          <span className="font-medium text-slate-900 group-hover:text-blue-600">
            {row.original.marca} {row.original.modelo}
          </span>
          <span className="block text-xs text-slate-400">{row.original.anio}</span>
        </Link>
      ),
    },
    {
      accessorKey: "placas",
      header: "Placas",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{(getValue() as string) ?? "—"}</span>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    },
    {
      accessorKey: "vin",
      header: "VIN",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">{(getValue() as string) ?? "—"}</span>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ getValue }) => estatusBadge[getValue() as EEstatusVehiculo],
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/vehiculos/${row.original.id}`}>
            <Button variant="ghost" size="icon-sm" aria-label="Ver detalle">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row.original)} aria-label="Editar">
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(row.original)} aria-label="Eliminar">
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </Button>
        </div>
      ),
    },
  ]
}
