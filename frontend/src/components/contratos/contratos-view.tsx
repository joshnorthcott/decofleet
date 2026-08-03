"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useContratos, useCreateContrato, useActualizarEstatusContrato } from "@/hooks/use-contratos"
import { useTarifas } from "@/hooks/use-tarifas"
import type { ContratoDto, EEstatusContrato } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { ContratoForm } from "./contrato-form"
import { getContratoColumns } from "./contrato-columns"

const EMPTY_FILTERS = {
  folio:           "",
  conductorNombre: "",
  vehiculoDesc:    "",
  tarifaId:        "",
  montoMin:        "",
  montoMax:        "",
  estatus:         "" as EEstatusContrato | "",
}

type Filters = typeof EMPTY_FILTERS

function hasActiveFilters(f: Filters) {
  return Object.values(f).some(v => v !== "")
}

export function ContratosView() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [createOpen, setCreateOpen] = useState(false)
  const [changingEstatus, setChangingEstatus] = useState<{
    contrato: ContratoDto
    nuevoEstatus: EEstatusContrato
  } | null>(null)

  const { data: tarifas = [] } = useTarifas()

  const { data, isLoading } = useContratos({
    page,
    estatus:         filters.estatus         || undefined,
    folio:           filters.folio           || undefined,
    conductorNombre: filters.conductorNombre || undefined,
    vehiculoDesc:    filters.vehiculoDesc    || undefined,
    tarifaId:        filters.tarifaId        || undefined,
    montoMin:        filters.montoMin ? parseFloat(filters.montoMin) : undefined,
    montoMax:        filters.montoMax ? parseFloat(filters.montoMax) : undefined,
  })

  const createMutation = useCreateContrato()
  const estatusMutation = useActualizarEstatusContrato(changingEstatus?.contrato.id ?? "")

  function setFilter<K extends keyof Filters>(key: K, val: Filters[K]) {
    setFilters(prev => ({ ...prev, [key]: val }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  function handleChangeEstatus(contrato: ContratoDto, nuevoEstatus: EEstatusContrato) {
    const accion = nuevoEstatus === "Cancelado" ? "cancelar" : nuevoEstatus === "Pausado" ? "pausar" : "reactivar"
    if (confirm(`¿Deseas ${accion} el contrato de ${contrato.nombreConductor}?`)) {
      setChangingEstatus({ contrato, nuevoEstatus })
      estatusMutation.mutate(nuevoEstatus, {
        onSettled: () => setChangingEstatus(null),
      })
    }
  }

  const columns = getContratoColumns({ onChangeEstatus: handleChangeEstatus })
  const active = hasActiveFilters(filters)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contratos</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data?.totalCount ?? 0} contrato{data?.totalCount !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo contrato
        </Button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Folio */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Folio</label>
            <Input
              placeholder="Últimos 8 chars"
              value={filters.folio}
              onChange={e => setFilter("folio", e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Conductor */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Conductor</label>
            <Input
              placeholder="Nombre…"
              value={filters.conductorNombre}
              onChange={e => setFilter("conductorNombre", e.target.value)}
            />
          </div>

          {/* Vehículo */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vehículo</label>
            <Input
              placeholder="Marca, modelo, placas…"
              value={filters.vehiculoDesc}
              onChange={e => setFilter("vehiculoDesc", e.target.value)}
            />
          </div>

          {/* Tarifa */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tarifa</label>
            <Select
              value={filters.tarifaId}
              onChange={e => setFilter("tarifaId", e.target.value)}
            >
              <option value="">Todas</option>
              {tarifas.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </Select>
          </div>

          {/* Renta mín */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Renta mín</label>
            <Input
              type="number"
              placeholder="0"
              min={0}
              value={filters.montoMin}
              onChange={e => setFilter("montoMin", e.target.value)}
            />
          </div>

          {/* Renta máx */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Renta máx</label>
            <Input
              type="number"
              placeholder="∞"
              min={0}
              value={filters.montoMax}
              onChange={e => setFilter("montoMax", e.target.value)}
            />
          </div>

          {/* Estatus */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estatus</label>
            <Select
              value={filters.estatus}
              onChange={e => setFilter("estatus", e.target.value as EEstatusContrato | "")}
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Pausado">Pausado</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Finalizado">Finalizado</option>
            </Select>
          </div>
        </div>

        {/* Clear button — only when filters are active */}
        {active && (
          <div className="flex justify-end pt-1 border-t border-slate-100">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          paged={data}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage="No se encontraron contratos."
        />
      </div>

      {/* Create dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nuevo contrato"
      >
        <ContratoForm
          onSubmit={async (formData) => {
            await createMutation.mutateAsync(formData)
            setCreateOpen(false)
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Dialog>
    </div>
  )
}
