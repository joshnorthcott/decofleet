import type { Metadata } from "next"
import { DashboardView } from "@/components/dashboard/dashboard-view"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general de la flota</p>
      </div>
      <DashboardView />
    </div>
  )
}
