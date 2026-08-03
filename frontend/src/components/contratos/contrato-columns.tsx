"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import type { ContratoDto, EEstatusContrato } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Eye, PauseCircle, PlayCircle, Users, XCircle } from "lucide-react"

const estatusBadge: Record<EEstatusContrato, React.ReactNode> = {
  Activo:     <Badge variant="success">Activo</Badge>,
  Pausado:    <Badge variant="warning">Pausado</Badge>,
  Cancelado:  <Badge variant="destructive">Cancelado</Badge>,
  Finalizado: <Badge variant="secondary">Finalizado</Badge>,
}

interface GetColumnsOptions {
  onChangeEstatus: (contrato: ContratoDto, nuevoEstatus: EEstatusContrato) => void
}

export function getContratoColumns({ onChangeEstatus }: GetColumnsOptions): ColumnDef<ContratoDto, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: "Folio",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500 select-all">
          #{String(getValue()).slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "nombreConductor",
      header: "Conductor",
      cell: ({ row }) => {
        const count = row.original.conductoresCount ?? 1
        if (count > 1) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium whitespace-nowrap">
              <Users className="h-3 w-3" />
              Varios ({count})
            </span>
          )
        }
        return <span className="font-medium text-slate-900">{row.original.nombreConductor}</span>
      },
    },
    {
      accessorKey: "nombreTarifa",
      header: "Tarifa",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "descripcionVehiculo",
      header: "Vehículo",
      cell: ({ getValue }) => (
        <span
          className="text-sm text-slate-600 block max-w-[160px] truncate"
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "montoRenta",
      header: "Renta",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <span className="font-medium">{formatCurrency(row.original.montoRenta)}</span>
          <span className="block text-xs text-slate-400">{row.original.periodicidad}</span>
        </div>
      ),
    },
    {
      accessorKey: "formaPago",
      header: "Forma de pago",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600 whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "fechaInicio",
      header: "Inicio",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ getValue }) => estatusBadge[getValue() as EEstatusContrato],
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { id, estatus } = row.original
        return (
          <div className="flex items-center gap-1 justify-end">
            {/* View detail */}
            <Link href={`/contratos/${id}`}>
              <Button variant="ghost" size="icon-sm" title="Ver contrato">
                <Eye className="h-4 w-4 text-slate-400 hover:text-blue-600" />
              </Button>
            </Link>

            {/* Status actions — only for non-terminal states */}
            {estatus === "Activo" && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChangeEstatus(row.original, "Pausado")}
                title="Pausar contrato"
              >
                <PauseCircle className="h-4 w-4 text-amber-500" />
              </Button>
            )}
            {estatus === "Pausado" && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChangeEstatus(row.original, "Activo")}
                title="Reactivar contrato"
              >
                <PlayCircle className="h-4 w-4 text-green-500" />
              </Button>
            )}
            {(estatus === "Activo" || estatus === "Pausado") && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChangeEstatus(row.original, "Cancelado")}
                title="Cancelar contrato"
              >
                <XCircle className="h-4 w-4 text-red-400" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
