"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { ConductorDto, EEstatusConductor } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"

const estatusBadge: Record<EEstatusConductor, React.ReactNode> = {
  Activo:     <Badge variant="success">Activo</Badge>,
  Inactivo:   <Badge variant="secondary">Inactivo</Badge>,
  Suspendido: <Badge variant="warning">Suspendido</Badge>,
}

interface GetColumnsOptions {
  onEdit: (row: ConductorDto) => void
  onDelete: (row: ConductorDto) => void
}

export function getConductorColumns({
  onEdit,
  onDelete,
}: GetColumnsOptions): ColumnDef<ConductorDto, unknown>[] {
  return [
    {
      accessorKey: "nombreCompleto",
      header: "Nombre",
      cell: ({ row }) => (
        <Link
          href={`/conductores/${row.original.id}`}
          className="font-medium text-slate-900 hover:text-blue-600 hover:underline transition-colors"
        >
          {row.original.nombreCompleto}
        </Link>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    },
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ getValue }) => (getValue() as string) ?? "—",
    },
    {
      accessorKey: "curp",
      header: "CURP",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">{(getValue() as string) ?? "—"}</span>
      ),
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ getValue }) => estatusBadge[getValue() as EEstatusConductor],
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/conductores/${row.original.id}`}>
            <Button variant="ghost" size="icon-sm" aria-label="Ver detalle">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row.original)}
            aria-label="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </Button>
        </div>
      ),
    },
  ]
}
