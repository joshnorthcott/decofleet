"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useVehiculos, useCreateVehiculo, useUpdateVehiculo, useDeleteVehiculo } from "@/hooks/use-vehiculos"
import type { VehiculoDto, EEstatusVehiculo, UpdateVehiculoRequest } from "@/types/api"
import { DataTable } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { VehiculoForm } from "./vehiculo-form"
import { getVehiculoColumns } from "./vehiculo-columns"
import { useDebounce } from "@/hooks/use-debounce"

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; vehiculo: VehiculoDto }
  | null

export function VehiculosView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [estatus, setEstatus] = useState<EEstatusVehiculo | undefined>()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const debouncedSearch = useDebounce(search, 300)
  const { data, isLoading } = useVehiculos({ page, pageSize: 20, search: debouncedSearch, estatus })
  const createMutation = useCreateVehiculo()
  const updateMutation = useUpdateVehiculo(
    dialogState?.mode === "edit" ? dialogState.vehiculo.id : "",
  )
  const deleteMutation = useDeleteVehiculo()

  const columns = getVehiculoColumns({
    onEdit: (v) => setDialogState({ mode: "edit", vehiculo: v }),
    onDelete: async (v) => {
      if (confirm(`¿Eliminar el vehículo ${v.marca} ${v.modelo} (${v.placas ?? "sin placas"})?`)) {
        await deleteMutation.mutateAsync(v.id)
      }
    },
  })

  async function handleSubmit(formData: Parameters<typeof createMutation.mutateAsync>[0] & { estatus?: EEstatusVehiculo }) {
    if (dialogState?.mode === "create") {
      await createMutation.mutateAsync(formData)
    } else if (dialogState?.mode === "edit") {
      await updateMutation.mutateAsync({
        ...formData,
        estatus: (formData.estatus ?? dialogState.vehiculo.estatus) as EEstatusVehiculo,
      } as UpdateVehiculoRequest)
    }
    setDialogState(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehículos</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data?.totalCount ?? 0} vehículo{data?.totalCount !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="h-4 w-4" />
          Nuevo vehículo
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por marca, modelo, placas..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <Select
          value={estatus ?? ""}
          onChange={(e) => { setEstatus(e.target.value as EEstatusVehiculo || undefined); setPage(1) }}
          className="w-44"
        >
          <option value="">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="Arrendado">Arrendado</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Baja">Baja</option>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          paged={data}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage="No se encontraron vehículos."
        />
      </div>

      <Dialog
        open={!!dialogState}
        onClose={() => setDialogState(null)}
        title={dialogState?.mode === "create" ? "Nuevo vehículo" : "Editar vehículo"}
      >
        <VehiculoForm
          initial={dialogState?.mode === "edit" ? dialogState.vehiculo : undefined}
          isEditing={dialogState?.mode === "edit"}
          onSubmit={handleSubmit}
          onCancel={() => setDialogState(null)}
        />
      </Dialog>
    </div>
  )
}
