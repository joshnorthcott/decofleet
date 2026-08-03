"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useConductores, useCreateConductor, useUpdateConductor, useDeleteConductor } from "@/hooks/use-conductores"
import type { ConductorDto, EEstatusConductor } from "@/types/api"
import { DataTable } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ConductorForm } from "./conductor-form"
import { getConductorColumns } from "./conductor-columns"
import { useDebounce } from "@/hooks/use-debounce"

export function ConductoresView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [estatus, setEstatus] = useState<EEstatusConductor | undefined>()
  const [dialogState, setDialogState] = useState<
    | { mode: "create" }
    | { mode: "edit"; conductor: ConductorDto }
    | null
  >(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useConductores({ page, pageSize: 20, search: debouncedSearch, estatus })
  const createMutation = useCreateConductor()
  const deleteMutation = useDeleteConductor()

  const updateMutation = useUpdateConductor(
    dialogState?.mode === "edit" ? dialogState.conductor.id : "",
  )

  const columns = getConductorColumns({
    onEdit: (c) => setDialogState({ mode: "edit", conductor: c }),
    onDelete: async (c) => {
      if (confirm(`¿Eliminar a ${c.nombreCompleto}?`)) {
        await deleteMutation.mutateAsync(c.id)
      }
    },
  })

  async function handleSubmit(formData: Parameters<typeof createMutation.mutateAsync>[0] & { estatus?: EEstatusConductor }) {
    if (dialogState?.mode === "create") {
      await createMutation.mutateAsync(formData)
    } else if (dialogState?.mode === "edit") {
      await updateMutation.mutateAsync({
        ...formData,
        estatus: (formData.estatus ?? dialogState.conductor.estatus) as EEstatusConductor,
      })
    }
    setDialogState(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conductores</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data?.totalCount ?? 0} conductor{data?.totalCount !== 1 ? "es" : ""} en total
          </p>
        </div>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="h-4 w-4" />
          Nuevo conductor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, teléfono..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select
          value={estatus ?? ""}
          onChange={(e) => {
            setEstatus(e.target.value as EEstatusConductor || undefined)
            setPage(1)
          }}
          className="w-40"
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Suspendido">Suspendido</option>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          paged={data}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage="No se encontraron conductores."
        />
      </div>

      {/* Dialog */}
      <Dialog
        open={!!dialogState}
        onClose={() => setDialogState(null)}
        title={dialogState?.mode === "create" ? "Nuevo conductor" : "Editar conductor"}
      >
        <ConductorForm
          initial={dialogState?.mode === "edit" ? dialogState.conductor : undefined}
          isEditing={dialogState?.mode === "edit"}
          onSubmit={handleSubmit}
          onCancel={() => setDialogState(null)}
        />
      </Dialog>
    </div>
  )
}
