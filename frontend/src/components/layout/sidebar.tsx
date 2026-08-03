"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Truck,
  FileText,
  CreditCard,
  Wrench,
  Tag,
  Bell,
  BarChart3,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"

const navItems = [
  { href: "/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
  { href: "/conductores",     label: "Conductores",    icon: Users },
  { href: "/vehiculos",       label: "Vehículos",      icon: Truck },
  { href: "/contratos",       label: "Contratos",      icon: FileText },
  { href: "/tarifas",         label: "Tarifas",        icon: Tag },
  { href: "/pagos",           label: "Pagos",            icon: CreditCard },
  { href: "/notificaciones",  label: "Notificaciones",  icon: Bell },
  { href: "/reportes",        label: "Reportes",        icon: BarChart3 },
  { href: "/mantenimiento",   label: "Mantenimiento",   icon: Wrench },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-900 text-slate-100 transition-all duration-200 shrink-0",
        sidebarOpen ? "w-56" : "w-14",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-slate-700/50">
        {sidebarOpen && (
          <span className="text-lg font-bold text-white">Decofleet</span>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Version */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">v2.0.0</p>
        </div>
      )}
    </aside>
  )
}
