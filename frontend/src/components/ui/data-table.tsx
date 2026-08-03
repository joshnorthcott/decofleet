"use client"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import type { PagedResult } from "@/types/api"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  paged?: PagedResult<TData>
  onPageChange?: (page: number) => void
  isLoading?: boolean
  emptyMessage?: string
  enableSorting?: boolean
}

export function DataTable<TData>({
  columns,
  data,
  paged,
  onPageChange,
  isLoading,
  emptyMessage = "Sin resultados.",
  enableSorting = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      state: { sorting },
      onSortingChange: setSorting,
    }),
    manualPagination: true,
    pageCount: paged?.totalPages ?? -1,
  })

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-slate-50 border-b border-slate-200">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted  = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap",
                        canSort && "cursor-pointer select-none hover:text-slate-700 transition-colors",
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="shrink-0 ml-0.5">
                            {sorted === "asc"  ? <ArrowUp   className="h-3 w-3 text-blue-500" /> :
                             sorted === "desc" ? <ArrowDown className="h-3 w-3 text-blue-500" /> :
                                                <ArrowUpDown className="h-3 w-3 text-slate-300" />}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paged && (paged.hasNextPage || paged.hasPreviousPage) && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Mostrando {(paged.page - 1) * paged.pageSize + 1}–
            {Math.min(paged.page * paged.pageSize, paged.totalCount)} de {paged.totalCount}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange?.(paged.page - 1)}
              disabled={!paged.hasPreviousPage}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-slate-700">
              {paged.page} / {paged.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange?.(paged.page + 1)}
              disabled={!paged.hasNextPage}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
