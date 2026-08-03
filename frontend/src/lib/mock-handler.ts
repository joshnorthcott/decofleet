import { NextRequest, NextResponse } from "next/server"
import {
  MOCK_CONDUCTORES,
  MOCK_REFERENCIAS,
  MOCK_VEHICULOS,
  MOCK_TARIFAS,
  MOCK_CONTRATOS,
  MOCK_CONTRATO_CONDUCTORES,
  MOCK_PAGOS,
  MOCK_PAGOS_EMITIDOS,
  MOCK_PLANTILLAS,
  MOCK_NOTIFICACIONES_ENVIADAS,
  MOCK_DASHBOARD,
  MOCK_REVENUE_CHART,
  MOCK_FLOTA_CHART,
  MOCK_TIPOS_MANTENIMIENTO,
  MOCK_MANTENIMIENTOS,
  MOCK_DOCUMENTOS,
  MOCK_FOTOS,
} from "@/lib/mock-data"

// In-memory stores so uploads/deletes persist within the session
const sessionTarifas       = [...MOCK_TARIFAS]
const sessionConductores   = [...MOCK_CONDUCTORES]
const sessionPagos         = MOCK_PAGOS.map(p => ({ ...p }))
const sessionPagosEmitidos = [...MOCK_PAGOS_EMITIDOS]
const sessionPlantillas    = MOCK_PLANTILLAS.map(p => ({ ...p }))
const sessionEnviadas      = [...MOCK_NOTIFICACIONES_ENVIADAS]
const sessionDocumentos  = [...MOCK_DOCUMENTOS]
const sessionFotos       = [...MOCK_FOTOS]
const sessionReferencias = [...MOCK_REFERENCIAS]

// ── Helpers ───────────────────────────────────────────────────────────────────

function paginate<T extends Record<string, unknown>>(
  items: T[],
  url: URL,
  searchFields: (keyof T)[] = [],
  statusField?: keyof T
): NextResponse {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"))
  const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "10"))
  const search = (url.searchParams.get("search") ?? "").toLowerCase()
  const statusFilter = url.searchParams.get("estatus") ?? url.searchParams.get("status") ?? ""

  let filtered = items

  if (search) {
    filtered = filtered.filter((item) =>
      searchFields.some((f) => String(item[f] ?? "").toLowerCase().includes(search))
    )
  }

  if (statusFilter && statusField) {
    filtered = filtered.filter((item) => item[statusField] === statusFilter)
  }

  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const start = (page - 1) * pageSize
  const paginatedItems = filtered.slice(start, start + pageSize)

  return NextResponse.json({
    items: paginatedItems,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  })
}

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}

function created(data: unknown) {
  return NextResponse.json(data, { status: 201 })
}

function ok(data: unknown) {
  return NextResponse.json(data)
}

function noContent() {
  return new NextResponse(null, { status: 204 })
}

// ── Router ────────────────────────────────────────────────────────────────────

export async function handleMockRequest(req: NextRequest, path: string[]): Promise<NextResponse> {
  const pathStr = path.join("/")
  const url = new URL(req.url)
  const method = req.method.toUpperCase()

  // ── Tarifas ──────────────────────────────────────────────────────────────────
  if (pathStr === "api/tarifas") {
    if (method === "GET") {
      const soloActivas = url.searchParams.get("soloActivas") === "true"
      const search = (url.searchParams.get("search") ?? "").toLowerCase()
      let base = sessionTarifas as unknown as Record<string, unknown>[]
      if (soloActivas) base = base.filter(t => t["activa"] === true)
      if (search) base = base.filter(t => String(t["nombre"] ?? "").toLowerCase().includes(search))
      return ok(base)
    }
    if (method === "POST") {
      const body = await req.json()
      const tarifa = {
        id: crypto.randomUUID(),
        empresaId: "11111111-1111-1111-1111-111111111111",
        nombre: body.nombre,
        monto: body.monto,
        periodicidad: body.periodicidad,
        descripcion: body.descripcion ?? null,
        activa: body.activa ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      sessionTarifas.push(tarifa)
      return created(tarifa)
    }
  }

  if (pathStr.startsWith("api/tarifas/")) {
    const tarifaId  = path[2]
    const tarifaIdx = sessionTarifas.findIndex(t => t.id === tarifaId)
    const tarifa    = tarifaIdx >= 0 ? sessionTarifas[tarifaIdx] : undefined
    if (method === "GET")    return tarifa ? ok(tarifa) : notFound()
    if (method === "PUT") {
      if (!tarifa) return notFound()
      const body = await req.json()
      const updated = { ...tarifa, ...body, updatedAt: new Date().toISOString() }
      sessionTarifas[tarifaIdx] = updated
      return ok(updated)
    }
    if (method === "DELETE") {
      if (tarifaIdx >= 0) sessionTarifas.splice(tarifaIdx, 1)
      return noContent()
    }
  }

  // ── Conductores ─────────────────────────────────────────────────────────────
  if (pathStr === "api/conductores") {
    if (method === "GET")
      return paginate(
        sessionConductores as unknown as Record<string, unknown>[],
        url,
        ["nombreCompleto", "nombre", "apellidoPaterno", "curp", "email", "telefono"],
        "estatus"
      )
    if (method === "POST") {
      const body = await req.json()
      const conductor = {
        id: crypto.randomUUID(),
        empresaId: "11111111-1111-1111-1111-111111111111",
        nombreCompleto: `${body.nombre} ${body.apellidoPaterno}${body.apellidoMaterno ? " " + body.apellidoMaterno : ""}`,
        estatus: "Activo",
        pagoContratos: null, pagoTaller: null, pagoExtras: null,
        requiereFactura: false, factRfc: null, factRazonSocial: null,
        factRegimenFiscal: null, factUsoCfdi: null, factEmail: null, factCodigoPostal: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...body,
      }
      sessionConductores.push(conductor)
      return created(conductor)
    }
  }

  if (pathStr.startsWith("api/conductores/")) {
    const conductorId = path[2]

    // ── /api/conductores/:id/referencias ──────────────────────────────────────
    if (path[3] === "referencias") {
      const orden = path[4] ? parseInt(path[4]) : null

      if (method === "GET") {
        return ok(sessionReferencias.filter(r => r.conductorId === conductorId))
      }

      if (method === "PUT" && orden) {
        const body = await req.json()
        const idx  = sessionReferencias.findIndex(r => r.conductorId === conductorId && r.orden === orden)
        const ref  = {
          id:             idx >= 0 ? sessionReferencias[idx].id : crypto.randomUUID(),
          conductorId,
          empresaId:      "11111111-1111-1111-1111-111111111111",
          orden:          orden as 1 | 2 | 3,
          nombreCompleto: body.nombreCompleto,
          relacion:       body.relacion,
          telefono:       body.telefono ?? null,
          email:          body.email ?? null,
        }
        if (idx >= 0) sessionReferencias[idx] = ref
        else sessionReferencias.push(ref)
        return ok(ref)
      }

      if (method === "DELETE" && orden) {
        const idx = sessionReferencias.findIndex(r => r.conductorId === conductorId && r.orden === orden)
        if (idx >= 0) sessionReferencias.splice(idx, 1)
        return noContent()
      }
    }

    const conductorIdx = sessionConductores.findIndex((c) => c.id === conductorId)
    const conductor    = conductorIdx >= 0 ? sessionConductores[conductorIdx] : undefined
    if (method === "GET") return conductor ? ok(conductor) : notFound()
    if (method === "PUT") {
      if (!conductor) return notFound()
      const body = await req.json()
      const updated = { ...conductor, ...body, updatedAt: new Date().toISOString() }
      sessionConductores[conductorIdx] = updated
      return ok(updated)
    }
    if (method === "PATCH") {
      if (!conductor) return notFound()
      const body = await req.json()
      const updated = { ...conductor, ...body, updatedAt: new Date().toISOString() }
      sessionConductores[conductorIdx] = updated
      return ok(updated)
    }
    if (method === "DELETE") return noContent()
  }

  // ── Vehiculos ───────────────────────────────────────────────────────────────
  if (pathStr === "api/vehiculos") {
    if (method === "GET")
      return paginate(
        MOCK_VEHICULOS as unknown as Record<string, unknown>[],
        url,
        ["marca", "modelo", "placas", "vin", "color"],
        "estatus"
      )
    if (method === "POST") {
      const body = await req.json()
      return created({
        id: crypto.randomUUID(),
        empresaId: "11111111-1111-1111-1111-111111111111",
        estatus: "Disponible",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...body,
      })
    }
  }

  if (pathStr.startsWith("api/vehiculos/")) {
    const id = path[2]

    // ── /api/vehiculos/:id/documentos ──────────────────────────────────────────
    if (path[3] === "documentos") {
      const docId = path[4]
      if (method === "GET") {
        return ok(sessionDocumentos.filter(d => d.vehiculoId === id))
      }
      if (method === "DELETE" && docId) {
        const idx = sessionDocumentos.findIndex(d => d.id === docId)
        if (idx !== -1) sessionDocumentos.splice(idx, 1)
        return noContent()
      }
      // POST — multipart upload; the component handles this client-side in mock mode
      // but we support a JSON stub for completeness
      if (method === "POST") {
        const doc = {
          id: crypto.randomUUID(),
          vehiculoId: id,
          empresaId: "11111111-1111-1111-1111-111111111111",
          nombre: "documento.pdf",
          mimeType: "application/pdf",
          tamaño: 0,
          creadoEn: new Date().toISOString(),
        }
        sessionDocumentos.push(doc)
        return created(doc)
      }
    }

    // ── /api/vehiculos/:id/fotos ───────────────────────────────────────────────
    if (path[3] === "fotos") {
      const fotoId = path[4]
      if (method === "GET") {
        return ok(sessionFotos.filter(f => f.vehiculoId === id))
      }
      if (method === "DELETE" && fotoId) {
        const idx = sessionFotos.findIndex(f => f.id === fotoId)
        if (idx !== -1) sessionFotos.splice(idx, 1)
        return noContent()
      }
    }

    const vehiculo = MOCK_VEHICULOS.find((v) => v.id === id)
    if (method === "GET") return vehiculo ? ok(vehiculo) : notFound()
    if (method === "PUT") {
      if (!vehiculo) return notFound()
      const body = await req.json()
      return ok({ ...vehiculo, ...body, updatedAt: new Date().toISOString() })
    }
    if (method === "DELETE") return noContent()
  }

  // ── Contratos ────────────────────────────────────────────────────────────────
  if (pathStr === "api/contratos") {
    if (method === "GET") {
      const conductorId     = url.searchParams.get("conductorId")     ?? ""
      const vehiculoId      = url.searchParams.get("vehiculoId")      ?? ""
      const folio           = (url.searchParams.get("folio")           ?? "").toLowerCase()
      const conductorNombre = (url.searchParams.get("conductorNombre") ?? "").toLowerCase()
      const vehiculoDesc    = (url.searchParams.get("vehiculoDesc")    ?? "").toLowerCase()
      const tarifaIdFilter  = url.searchParams.get("tarifaId")         ?? ""
      const montoMinRaw     = url.searchParams.get("montoMin")
      const montoMaxRaw     = url.searchParams.get("montoMax")
      const montoMin        = montoMinRaw ? parseFloat(montoMinRaw) : null
      const montoMax        = montoMaxRaw ? parseFloat(montoMaxRaw) : null

      // Enrich each contract with conductoresCount
      let base = MOCK_CONTRATOS.map(c => ({
        ...c,
        conductoresCount: (MOCK_CONTRATO_CONDUCTORES[c.id] ?? [c.conductorId]).length,
      })) as unknown as Record<string, unknown>[]

      if (conductorId)     base = base.filter(c => c["conductorId"] === conductorId)
      if (vehiculoId)      base = base.filter(c => c["vehiculoId"]  === vehiculoId)
      if (folio)           base = base.filter(c => String(c["id"]).toLowerCase().includes(folio))
      if (conductorNombre) base = base.filter(c => String(c["nombreConductor"] ?? "").toLowerCase().includes(conductorNombre))
      if (vehiculoDesc)    base = base.filter(c => String(c["descripcionVehiculo"] ?? "").toLowerCase().includes(vehiculoDesc))
      if (tarifaIdFilter)  base = base.filter(c => c["tarifaId"] === tarifaIdFilter)
      if (montoMin !== null) base = base.filter(c => (c["montoRenta"] as number) >= montoMin)
      if (montoMax !== null) base = base.filter(c => (c["montoRenta"] as number) <= montoMax)

      return paginate(base, url, [], "estatus")
    }
    if (method === "POST") {
      const body = await req.json()
      const conductor = MOCK_CONDUCTORES.find((c) => c.id === body.conductorId)
      const vehiculo = MOCK_VEHICULOS.find((v) => v.id === body.vehiculoId)
      return created({
        id: crypto.randomUUID(),
        empresaId: "11111111-1111-1111-1111-111111111111",
        nombreConductor: conductor?.nombreCompleto ?? "Conductor",
        descripcionVehiculo: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} — ${vehiculo.placas}` : "Vehículo",
        nombreTarifa: "Tarifa Estándar",
        montoRenta: 3500,
        periodicidad: body.periodicidad ?? "Mensual",
        estatus: "Activo",
        createdAt: new Date().toISOString(),
        ...body,
      })
    }
  }

  if (pathStr.startsWith("api/contratos/")) {
    const id = path[2]
    const contrato = MOCK_CONTRATOS.find((c) => c.id === id)
    if (method === "GET") {
      if (!contrato) return notFound()
      const conductorIds = MOCK_CONTRATO_CONDUCTORES[id] ?? [contrato.conductorId]
      const conductores = conductorIds.map(cid => {
        const c = MOCK_CONDUCTORES.find(x => x.id === cid)
        if (!c) return null
        return {
          conductorId:         c.id,
          nombreCompleto:      c.nombreCompleto,
          estatus:             c.estatus,
          telefono:            c.telefono,
          email:               c.email,
          licenciaNumero:      c.licenciaNumero,
          licenciaTipo:        c.licenciaTipo,
          licenciaVencimiento: c.licenciaVencimiento,
          licenciaEstadoEmisor: c.licenciaEstadoEmisor,
        }
      }).filter(Boolean)
      return ok({ ...contrato, conductores })
    }
    if (method === "PUT" || method === "PATCH") {
      if (!contrato) return notFound()
      const body = await req.json()
      return ok({ ...contrato, ...body })
    }
    if (method === "DELETE") return noContent()
  }

  // ── Facturación / Pagos ──────────────────────────────────────────────────────
  if (pathStr === "api/facturacion/pagos-contrato") {
    if (method === "GET") {
      const contratoId          = url.searchParams.get("contratoId")          ?? ""
      const conductorNombre     = (url.searchParams.get("conductorNombre")    ?? "").toLowerCase()
      const vehiculoDesc        = (url.searchParams.get("vehiculoDesc")       ?? "").toLowerCase()
      const contratoFolio       = (url.searchParams.get("contratoFolio")      ?? "").toLowerCase()
      const fechaVencDesde      = url.searchParams.get("fechaVencimientoDesde") ?? ""
      const fechaVencHasta      = url.searchParams.get("fechaVencimientoHasta") ?? ""
      const montoMinRaw         = url.searchParams.get("montoMin")
      const montoMaxRaw         = url.searchParams.get("montoMax")
      const montoMin            = montoMinRaw ? parseFloat(montoMinRaw) : null
      const montoMax            = montoMaxRaw ? parseFloat(montoMaxRaw) : null

      // Enrich pagos with contract context
      let base = sessionPagos.map(p => {
        const contrato = MOCK_CONTRATOS.find(c => c.id === p.contratoId)
        const conductorIds = contrato ? (MOCK_CONTRATO_CONDUCTORES[contrato.id] ?? [contrato.conductorId]) : []
        return {
          ...p,
          nombreConductor:     contrato?.nombreConductor     ?? "—",
          conductoresCount:    conductorIds.length,
          descripcionVehiculo: contrato?.descripcionVehiculo ?? "—",
          nombreTarifa:        contrato?.nombreTarifa        ?? "—",
          formaPago:           contrato?.formaPago           ?? "Efectivo",
        }
      }) as unknown as Record<string, unknown>[]

      if (contratoId)      base = base.filter(p => p["contratoId"] === contratoId)
      if (contratoFolio)   base = base.filter(p => String(p["contratoId"]).slice(-8).toLowerCase().includes(contratoFolio))
      if (conductorNombre) base = base.filter(p => String(p["nombreConductor"] ?? "").toLowerCase().includes(conductorNombre))
      if (vehiculoDesc)    base = base.filter(p => String(p["descripcionVehiculo"] ?? "").toLowerCase().includes(vehiculoDesc))
      if (fechaVencDesde)  base = base.filter(p => p["fechaVencimiento"] && String(p["fechaVencimiento"]) >= fechaVencDesde)
      if (fechaVencHasta)  base = base.filter(p => p["fechaVencimiento"] && String(p["fechaVencimiento"]) <= fechaVencHasta)
      if (montoMin !== null) base = base.filter(p => (p["montoTotal"] as number) >= montoMin)
      if (montoMax !== null) base = base.filter(p => (p["montoTotal"] as number) <= montoMax)

      return paginate(base, url, [], "estatus")
    }
  }

  // GET single pago (with historial)
  if (pathStr.startsWith("api/facturacion/pagos-contrato/")) {
    const pagoId = path[3]
    const pago   = sessionPagos.find(p => p.id === pagoId)
    if (method === "GET") {
      if (!pago) return notFound()
      // Return ALL emitidos for every period of this contract, enriched with period dates,
      // sorted newest-first — so the historial dialog shows a complete payment timeline.
      const contratosPagos = sessionPagos.filter(p => p.contratoId === pago.contratoId)
      const historial = contratosPagos
        .flatMap(p =>
          sessionPagosEmitidos
            .filter(pe => pe.pagoContratoId === p.id)
            .map(pe => ({ ...pe, periodoInicio: p.periodoInicio, periodoFin: p.periodoFin }))
        )
        .sort((a, b) => b.fechaPago.localeCompare(a.fechaPago))
      return ok({ ...pago, historial })
    }
  }

  if (pathStr === "api/facturacion/registrar-pago" && method === "POST") {
    const body    = await req.json()
    const pagoIdx = sessionPagos.findIndex(p => p.id === body.pagoContratoId)
    if (pagoIdx < 0) return notFound()
    const emitido = {
      id:             crypto.randomUUID(),
      pagoContratoId: body.pagoContratoId,
      monto:          body.monto,
      formaPago:      body.formaPago,
      fechaPago:      body.fechaPago,
      referencia:     body.referencia ?? null,
    }
    sessionPagosEmitidos.push(emitido)
    // Update pago amounts
    const pago = sessionPagos[pagoIdx]
    const nuevoMontoPagado   = Math.min(pago.montoPagado + body.monto, pago.montoTotal)
    const nuevoSaldoPendiente = Math.max(pago.montoTotal - nuevoMontoPagado, 0)
    sessionPagos[pagoIdx] = {
      ...pago,
      montoPagado:    nuevoMontoPagado,
      saldoPendiente: nuevoSaldoPendiente,
      estatus:        nuevoSaldoPendiente === 0 ? "Pagado" : nuevoMontoPagado > 0 ? "PagadoParcial" : pago.estatus,
    }
    return created(emitido)
  }

  if (pathStr === "api/facturacion/cargos" && method === "POST") {
    const body    = await req.json()
    const pagoIdx = sessionPagos.findIndex(p => p.id === body.pagoContratoId)
    if (pagoIdx < 0) return notFound()
    const pago = sessionPagos[pagoIdx]
    const nuevoCargo = body.monto as number
    sessionPagos[pagoIdx] = {
      ...pago,
      montoTotal:     pago.montoTotal + nuevoCargo,
      saldoPendiente: pago.saldoPendiente + nuevoCargo,
      estatus:        pago.estatus === "Pagado" ? "PagadoParcial" : pago.estatus,
    }
    return created({ id: crypto.randomUUID(), ...body })
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  if (pathStr === "api/dashboard" && method === "GET") {
    // Compute live from session data
    const totalVeh   = MOCK_VEHICULOS.length
    const arrendados = MOCK_VEHICULOS.filter(v => v.estatus === "Arrendado").length
    const disponibles = MOCK_VEHICULOS.filter(v => v.estatus === "Disponible").length
    const conductoresActivos = sessionConductores.filter(c => c.estatus === "Activo").length
    const contratosActivos   = MOCK_CONTRATOS.filter(c => c.estatus === "Activo").length
    const pagosVencidos      = sessionPagos.filter(p => p.estatus === "Vencido")
    const pagosPendientes    = sessionPagos.filter(p => p.estatus === "Pendiente" || p.estatus === "PagadoParcial")
    const totalEsperado      = sessionPagos.reduce((s, p) => s + p.montoTotal, 0)
    const totalCobrado       = sessionPagos.reduce((s, p) => s + p.montoPagado, 0)
    return ok({
      conductoresActivos,
      vehiculosDisponibles: disponibles,
      vehiculosArrendados:  arrendados,
      vehiculosTotal:       totalVeh,
      contratosActivos,
      ingresosMes: 23700,
      pagosPendientes:        pagosPendientes.length,
      pagosPendientesImporte: pagosPendientes.reduce((s, p) => s + p.saldoPendiente, 0),
      pagosVencidos:          pagosVencidos.length,
      pagosVencidosImporte:   pagosVencidos.reduce((s, p) => s + p.saldoPendiente, 0),
      totalEsperado,
      totalCobrado,
      tasaCobranza: totalEsperado > 0 ? Math.round(totalCobrado / totalEsperado * 100) : 0,
      ocupacion: Math.round(arrendados / totalVeh * 100),
    })
  }

  if (pathStr === "api/dashboard/revenue-chart" && method === "GET") {
    return ok(MOCK_REVENUE_CHART)
  }

  if (pathStr === "api/dashboard/flota-chart" && method === "GET") {
    return ok(MOCK_FLOTA_CHART)
  }

  if (pathStr === "api/dashboard/resumen" && method === "GET") {
    // Activity feed: last 6 pagosEmitidos with conductor name
    const actividadReciente = [...sessionPagosEmitidos]
      .sort((a, b) => b.fechaPago.localeCompare(a.fechaPago))
      .slice(0, 6)
      .map(pe => {
        const pago     = sessionPagos.find(p => p.id === pe.pagoContratoId)
        const contrato = pago ? MOCK_CONTRATOS.find(c => c.id === pago.contratoId) : null
        return { ...pe, nombreConductor: contrato?.nombreConductor ?? "—", vehiculo: contrato?.descripcionVehiculo ?? "" }
      })

    // Payment method breakdown
    const methodTotals: Record<string, number> = {}
    sessionPagosEmitidos.forEach(pe => {
      methodTotals[pe.formaPago] = (methodTotals[pe.formaPago] ?? 0) + pe.monto
    })
    const paymentMethods = Object.entries(methodTotals)
      .map(([formaPago, monto]) => ({ formaPago, monto }))
      .sort((a, b) => b.monto - a.monto)

    // Pagos por estatus (count + amount)
    const ESTATUS_LIST = ["Pagado", "PagadoParcial", "Pendiente", "Vencido"] as const
    const pagosPorEstatus = ESTATUS_LIST.map(estatus => ({
      estatus,
      count: sessionPagos.filter(p => p.estatus === estatus).length,
      monto: sessionPagos.filter(p => p.estatus === estatus).reduce((s, p) => s + p.montoTotal, 0),
    }))

    // Próximo mantenimiento (top 4 programado sorted by date)
    const proximoMantenimiento = [...MOCK_MANTENIMIENTOS]
      .filter(m => m.estatus === "Programado" || m.estatus === "EnProceso")
      .sort((a, b) => (a.fechaProgramada ?? "").localeCompare(b.fechaProgramada ?? ""))
      .slice(0, 4)

    // Conductores en alerta
    const now = new Date()
    const conductoresAlerta = sessionConductores
      .filter(c => {
        const licDays = c.licenciaVencimiento
          ? Math.ceil((new Date(c.licenciaVencimiento).getTime() - now.getTime()) / 86_400_000)
          : null
        const licAlert = licDays !== null && licDays < 60
        const vencidoPago = sessionPagos.some(p => {
          const ct = MOCK_CONTRATOS.find(ct => ct.id === p.contratoId)
          return ct?.conductorId === c.id && p.estatus === "Vencido"
        })
        return licAlert || vencidoPago
      })
      .slice(0, 5)
      .map(c => {
        const licDays = c.licenciaVencimiento
          ? Math.ceil((new Date(c.licenciaVencimiento).getTime() - now.getTime()) / 86_400_000)
          : null
        const vencidoPago = sessionPagos.find(p => {
          const ct = MOCK_CONTRATOS.find(ct => ct.id === p.contratoId)
          return ct?.conductorId === c.id && p.estatus === "Vencido"
        })
        return {
          id: c.id,
          nombre: c.nombreCompleto,
          licVencimiento: c.licenciaVencimiento,
          licDaysLeft: licDays,
          pagoVencido: vencidoPago ? vencidoPago.saldoPendiente : null,
        }
      })

    // Seguros venciendo <30 días
    const segurosPorVencer = MOCK_VEHICULOS.filter(v => {
      if (!v.seguroFechaVencimiento) return false
      const days = Math.ceil((new Date(v.seguroFechaVencimiento).getTime() - now.getTime()) / 86_400_000)
      return days <= 30
    }).map(v => ({
      id: v.id,
      descripcion: `${v.marca} ${v.modelo} — ${v.placas}`,
      vencimiento: v.seguroFechaVencimiento,
    }))

    return ok({
      actividadReciente,
      paymentMethods,
      pagosPorEstatus,
      proximoMantenimiento,
      conductoresAlerta,
      segurosPorVencer,
    })
  }

  // ── Contrato estatus PATCH ────────────────────────────────────────────────────
  if (pathStr.startsWith("api/contratos/") && path[3] === "estatus" && method === "PATCH") {
    const id = path[2]
    const contrato = MOCK_CONTRATOS.find((c) => c.id === id)
    if (!contrato) return notFound()
    const body = await req.json()
    return ok({ ...contrato, estatus: body.nuevoEstatus })
  }


  // ── Tipos de mantenimiento ────────────────────────────────────────────────
  if (pathStr === "api/tipos-mantenimiento" && method === "GET") {
    return ok(MOCK_TIPOS_MANTENIMIENTO)
  }

  // ── Mantenimiento ──────────────────────────────────────────────────────────
  if (pathStr === "api/mantenimiento") {
    if (method === "GET") {
      const estatusFilter = url.searchParams.get("estatus") ?? ""
      const esSiniestro   = url.searchParams.get("esSiniestro")
      const vehiculoId    = url.searchParams.get("vehiculoId") ?? ""
      const page     = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"))
      const pageSize = Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "10"))

      let filtered = [...MOCK_MANTENIMIENTOS]
      if (estatusFilter)           filtered = filtered.filter(m => m.estatus === estatusFilter)
      if (esSiniestro !== null)    filtered = filtered.filter(m => String(m.esSiniestro) === esSiniestro)
      if (vehiculoId)              filtered = filtered.filter(m => m.vehiculoId === vehiculoId)

      const totalCount = filtered.length
      const totalPages = Math.ceil(totalCount / pageSize)
      const items      = filtered.slice((page - 1) * pageSize, page * pageSize)
      return ok({ items, page, pageSize, totalCount, totalPages,
        hasNextPage: page < totalPages, hasPreviousPage: page > 1 })
    }
    if (method === "POST") {
      const body    = await req.json()
      const vehiculo = MOCK_VEHICULOS.find(v => v.id === body.vehiculoId)
      const tipo     = MOCK_TIPOS_MANTENIMIENTO.find(t => t.id === body.tipoMantenimientoId)
      return created({
        id: crypto.randomUUID(),
        empresaId: "11111111-1111-1111-1111-111111111111",
        descripcionVehiculo: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} — ${vehiculo.placas}` : "Vehículo",
        nombreTipo: tipo?.nombre ?? "Tipo",
        esSiniestro: tipo?.esSiniestro ?? false,
        estatus: "Programado",
        fechaReal: null,
        costoReal: null,
        createdAt: new Date().toISOString(),
        ...body,
      })
    }
  }

  if (pathStr.startsWith("api/mantenimiento/")) {
    const id = path[2]
    const mant = MOCK_MANTENIMIENTOS.find(m => m.id === id)
    if (method === "GET")  return mant ? ok(mant) : notFound()
    if (method === "PUT") {
      if (!mant) return notFound()
      const body = await req.json()
      return ok({ ...mant, ...body })
    }
    if (method === "DELETE") return noContent()
    // PATCH estatus
    if (method === "PATCH" && path[3] === "estatus") {
      if (!mant) return notFound()
      const body = await req.json()
      return ok({ ...mant, estatus: body.nuevoEstatus,
        fechaReal: body.nuevoEstatus === "Completado" ? new Date().toISOString().slice(0,10) : mant.fechaReal })
    }
  }

  // ── Notificaciones — plantillas ───────────────────────────────────────────────
  if (pathStr === "api/notificaciones/plantillas") {
    if (method === "GET") {
      const soloActivas = url.searchParams.get("soloActivas") === "true"
      const items = soloActivas ? sessionPlantillas.filter(p => p.activa) : [...sessionPlantillas]
      return paginate(items as unknown as Record<string, unknown>[], url, ["titulo", "cuerpo"])
    }
    if (method === "POST") {
      const body = await req.json()
      const nueva = {
        id: `np${Date.now()}`,
        empresaId: "11111111-1111-1111-1111-111111111111",
        activa: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...body,
      }
      sessionPlantillas.push(nueva)
      return created(nueva)
    }
  }

  if (pathStr.startsWith("api/notificaciones/plantillas/")) {
    const id = path[3]
    const idx = sessionPlantillas.findIndex(p => p.id === id)
    if (method === "GET")  return idx >= 0 ? ok(sessionPlantillas[idx]) : notFound()
    if (method === "PUT") {
      if (idx < 0) return notFound()
      const body = await req.json()
      sessionPlantillas[idx] = { ...sessionPlantillas[idx], ...body, updatedAt: new Date().toISOString() }
      return ok(sessionPlantillas[idx])
    }
    if (method === "DELETE") {
      if (idx >= 0) sessionPlantillas.splice(idx, 1)
      return noContent()
    }
  }

  // ── Notificaciones — enviadas ──────────────────────────────────────────────
  if (pathStr === "api/notificaciones/enviadas") {
    if (method === "GET") {
      return paginate(
        [...sessionEnviadas].sort((a, b) => b.fechaEnvio.localeCompare(a.fechaEnvio)) as unknown as Record<string, unknown>[],
        url, ["titulo"],
      )
    }
  }

  if (pathStr === "api/notificaciones/enviar" && method === "POST") {
    const body = await req.json()
    const conductores = body.destinatarios === "todos"
      ? sessionConductores.filter(c => c.estatus === "Activo")
      : sessionConductores.filter(c => (body.destinatarios as string[]).includes(c.id))
    const enviada = {
      id: `ne${Date.now()}`,
      empresaId: "11111111-1111-1111-1111-111111111111",
      titulo: body.titulo,
      cuerpo: body.cuerpo,
      tipo: body.tipo,
      totalDestinatarios: conductores.length,
      nombresDestinatarios: conductores.map(c => c.nombreCompleto),
      fechaEnvio: new Date().toISOString(),
    }
    sessionEnviadas.unshift(enviada)
    return created(enviada)
  }

  return notFound()
}
