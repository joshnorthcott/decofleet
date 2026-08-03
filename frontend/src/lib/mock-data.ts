import type {
  ConductorDto,
  VehiculoDto,
  ContratoDto,
  PagoContratoDto,
  PagoEmitidoDto,
  ReferenciaPersonalDto,
  TarifaDto,
  NotificacionPlantillaDto,
  NotificacionEnviadaDto,
} from "@/types/api"

const EMPRESA_ID = "11111111-1111-1111-1111-111111111111"

// ── Conductores ───────────────────────────────────────────────────────────────
const nullLic  = { licenciaNumero: null, licenciaTipo: null, licenciaVencimiento: null, licenciaEstadoEmisor: null } as const
const nullPago = { pagoContratos: null, pagoTaller: null, pagoExtras: null } as const
const nullFact = { requiereFactura: false, factRfc: null, factRazonSocial: null, factRegimenFiscal: null, factUsoCfdi: null, factEmail: null, factCodigoPostal: null } as const

export const MOCK_CONDUCTORES: ConductorDto[] = [
  { id: "c1",  empresaId: EMPRESA_ID, nombre: "Alejandro", apellidoPaterno: "Ramírez",   apellidoMaterno: "Torres",   nombreCompleto: "Alejandro Ramírez Torres",  curp: "RATA850312HDFMRL09", telefono: "5551234567", email: "a.ramirez@decofleet.mx",   direccion: "Av. Insurgentes 120, CDMX",          codigoPostal: "06600", estatus: "Activo",     licenciaNumero: "CDMX-E-2024-001234", licenciaTipo: "E", licenciaVencimiento: "2026-03-12", licenciaEstadoEmisor: "Ciudad de México", pagoContratos: "Moral",        pagoTaller: "Fisica Derek", pagoExtras: "Moral",        requiereFactura: true,  factRfc: "RATA850312ABC", factRazonSocial: "Alejandro Ramírez Torres",  factRegimenFiscal: "605", factUsoCfdi: "G01", factEmail: "a.ramirez@decofleet.mx",  factCodigoPostal: "06600", createdAt: "2024-01-10T08:00:00Z", updatedAt: "2024-06-01T10:00:00Z" },
  { id: "c2",  empresaId: EMPRESA_ID, nombre: "María",     apellidoPaterno: "González",  apellidoMaterno: "López",    nombreCompleto: "María González López",       curp: "GOLM920514MDFNPR05", telefono: "5559876543", email: "m.gonzalez@decofleet.mx",  direccion: "Calle Reforma 45, CDMX",             codigoPostal: "11560", estatus: "Activo",     licenciaNumero: "CDMX-E-2023-009876", licenciaTipo: "E", licenciaVencimiento: "2025-08-30", licenciaEstadoEmisor: "Ciudad de México", pagoContratos: "Fisica Gene",  pagoTaller: "Fisica Gene",  pagoExtras: null,           requiereFactura: true,  factRfc: "GOLM920514XYZ", factRazonSocial: "María González López",       factRegimenFiscal: "608", factUsoCfdi: "G03", factEmail: "m.gonzalez@decofleet.mx", factCodigoPostal: "11560", createdAt: "2024-02-15T09:00:00Z", updatedAt: "2024-06-10T11:00:00Z" },
  { id: "c3",  empresaId: EMPRESA_ID, nombre: "Carlos",    apellidoPaterno: "Hernández", apellidoMaterno: "Vega",     nombreCompleto: "Carlos Hernández Vega",      curp: "HEVC880901HDFRGR02", telefono: "5554445566", email: "c.hernandez@decofleet.mx", direccion: "Blvd. Manuel Ávila 89",              codigoPostal: "53100", estatus: "Activo",     licenciaNumero: "NLE-E-2022-003456",  licenciaTipo: "E", licenciaVencimiento: "2027-01-15", licenciaEstadoEmisor: "Nuevo León",       ...nullPago, ...nullFact, createdAt: "2024-03-01T10:00:00Z", updatedAt: "2024-06-05T09:00:00Z" },
  { id: "c4",  empresaId: EMPRESA_ID, nombre: "Laura",     apellidoPaterno: "Martínez",  apellidoMaterno: "Cruz",     nombreCompleto: "Laura Martínez Cruz",        curp: "MACL950723MDFRRR08", telefono: "5557778899", email: "l.martinez@decofleet.mx",  direccion: "Col. Del Valle 330, CDMX",           codigoPostal: "03100", estatus: "Inactivo",   ...nullLic, ...nullPago, ...nullFact, createdAt: "2024-03-20T11:00:00Z", updatedAt: "2024-05-30T08:00:00Z" },
  { id: "c5",  empresaId: EMPRESA_ID, nombre: "Jorge",     apellidoPaterno: "Sánchez",   apellidoMaterno: null,       nombreCompleto: "Jorge Sánchez",              curp: "SANJ870630HDFNCR03", telefono: "5552223344", email: null,                          direccion: "Calle 5 de Mayo 12",                 codigoPostal: "64000", estatus: "Activo",     licenciaNumero: "NLE-B-2023-007890",  licenciaTipo: "B", licenciaVencimiento: "2025-11-20", licenciaEstadoEmisor: "Nuevo León",       ...nullPago, ...nullFact, createdAt: "2024-04-05T12:00:00Z", updatedAt: "2024-06-15T14:00:00Z" },
  { id: "c6",  empresaId: EMPRESA_ID, nombre: "Sofía",     apellidoPaterno: "López",     apellidoMaterno: "Ríos",     nombreCompleto: "Sofía López Ríos",           curp: "LORS001104MDFPXF07", telefono: "5556667788", email: "s.lopez@decofleet.mx",     direccion: "Av. Universidad 450",                codigoPostal: "04360", estatus: "Suspendido", ...nullLic, ...nullPago, ...nullFact, createdAt: "2024-04-12T07:00:00Z", updatedAt: "2024-06-01T09:30:00Z" },
  { id: "c7",  empresaId: EMPRESA_ID, nombre: "Miguel",    apellidoPaterno: "Flores",    apellidoMaterno: "Mora",     nombreCompleto: "Miguel Flores Mora",         curp: "FOMM910218HDFLLG00", telefono: "5553334455", email: "m.flores@decofleet.mx",    direccion: "Paseo de la Reforma 222",            codigoPostal: "06600", estatus: "Activo",     licenciaNumero: "CDMX-E-2024-002345", licenciaTipo: "E", licenciaVencimiento: "2026-06-10", licenciaEstadoEmisor: "Ciudad de México", ...nullPago, ...nullFact, createdAt: "2024-04-18T08:30:00Z", updatedAt: "2024-06-20T10:00:00Z" },
  { id: "c8",  empresaId: EMPRESA_ID, nombre: "Ana",       apellidoPaterno: "Reyes",     apellidoMaterno: "Campos",   nombreCompleto: "Ana Reyes Campos",           curp: "RECA940307MDFYNA04", telefono: "5558889900", email: "a.reyes@decofleet.mx",     direccion: "Calle Hidalgo 78, Tlalnepantla",     codigoPostal: "54000", estatus: "Activo",     licenciaNumero: "MEX-E-2023-004567",  licenciaTipo: "E", licenciaVencimiento: "2026-09-05", licenciaEstadoEmisor: "Estado de México",  ...nullPago, ...nullFact, createdAt: "2024-05-02T09:00:00Z", updatedAt: "2024-06-18T11:00:00Z" },
  { id: "c9",  empresaId: EMPRESA_ID, nombre: "Roberto",   apellidoPaterno: "Torres",    apellidoMaterno: "Medina",   nombreCompleto: "Roberto Torres Medina",      curp: "TOMR860910HDFRRB06", telefono: "5551112233", email: "r.torres@decofleet.mx",    direccion: "Av. Revolución 567",                 codigoPostal: "01040", estatus: "Inactivo",   ...nullLic, ...nullPago, ...nullFact, createdAt: "2024-05-10T10:00:00Z", updatedAt: "2024-06-02T08:00:00Z" },
  { id: "c10", empresaId: EMPRESA_ID, nombre: "Gabriela",  apellidoPaterno: "Cruz",      apellidoMaterno: "Vargas",   nombreCompleto: "Gabriela Cruz Vargas",       curp: "CUVG980415MDFRRB01", telefono: "5554445577", email: "g.cruz@decofleet.mx",      direccion: "Col. Nápoles 890",                   codigoPostal: "03810", estatus: "Activo",     licenciaNumero: "CDMX-B-2024-008901", licenciaTipo: "B", licenciaVencimiento: "2028-02-20", licenciaEstadoEmisor: "Ciudad de México", ...nullPago, ...nullFact, createdAt: "2024-05-15T11:00:00Z", updatedAt: "2024-06-22T12:00:00Z" },
  { id: "c11", empresaId: EMPRESA_ID, nombre: "David",     apellidoPaterno: "Morales",   apellidoMaterno: "Jiménez",  nombreCompleto: "David Morales Jiménez",      curp: "MOJD830625HDFRVD05", telefono: "5557778800", email: "d.morales@decofleet.mx",   direccion: "Blvd. Adolfo López 34",              codigoPostal: "57820", estatus: "Activo",     licenciaNumero: "MEX-E-2022-005678",  licenciaTipo: "E", licenciaVencimiento: "2025-12-31", licenciaEstadoEmisor: "Estado de México",  ...nullPago, ...nullFact, createdAt: "2024-05-20T08:00:00Z", updatedAt: "2024-06-23T09:00:00Z" },
  { id: "c12", empresaId: EMPRESA_ID, nombre: "Patricia",  apellidoPaterno: "Gutiérrez", apellidoMaterno: null,       nombreCompleto: "Patricia Gutiérrez",         curp: "GUPX770812MDFTRR09", telefono: "5552221100", email: null,                          direccion: "Calle Allende 23, Ecatepec",          codigoPostal: "55000", estatus: "Suspendido", ...nullLic, ...nullPago, ...nullFact, createdAt: "2024-05-25T12:00:00Z", updatedAt: "2024-06-10T14:00:00Z" },
]

// ── Referencias personales ────────────────────────────────────────────────────
export const MOCK_REFERENCIAS: ReferenciaPersonalDto[] = [
  { id: "r1", conductorId: "c1", empresaId: EMPRESA_ID, orden: 1, nombreCompleto: "Rosa Torres Méndez",    relacion: "Madre",           telefono: "5551234560", email: null },
  { id: "r2", conductorId: "c1", empresaId: EMPRESA_ID, orden: 2, nombreCompleto: "Pedro Ramírez Cruz",    relacion: "Hermano",         telefono: "5557654321", email: "pedro.r@gmail.com" },
  { id: "r3", conductorId: "c1", empresaId: EMPRESA_ID, orden: 3, nombreCompleto: "Dr. Luis Mendoza Paz",  relacion: "Médico familiar", telefono: "5554433221", email: null },
  { id: "r4", conductorId: "c2", empresaId: EMPRESA_ID, orden: 1, nombreCompleto: "Carlos González Ruiz",  relacion: "Esposo",          telefono: "5559876540", email: "cgonzalez@mail.com" },
  { id: "r5", conductorId: "c2", empresaId: EMPRESA_ID, orden: 2, nombreCompleto: "Lupita López Serna",    relacion: "Madre",           telefono: "5553456789", email: null },
  { id: "r6", conductorId: "c3", empresaId: EMPRESA_ID, orden: 1, nombreCompleto: "Elena Vega de Hernández", relacion: "Esposa",        telefono: "5554445560", email: "elena.vega@gmail.com" },
  { id: "r7", conductorId: "c3", empresaId: EMPRESA_ID, orden: 2, nombreCompleto: "Ing. Roberto Castillo", relacion: "Colega",         telefono: "5551234599", email: "r.castillo@empresa.mx" },
  { id: "r8", conductorId: "c7", empresaId: EMPRESA_ID, orden: 1, nombreCompleto: "Beatriz Mora Salinas",  relacion: "Madre",           telefono: "5553334450", email: null },
  { id: "r9", conductorId: "c7", empresaId: EMPRESA_ID, orden: 2, nombreCompleto: "Lic. Andrés Pérez",     relacion: "Abogado",         telefono: "5556677889", email: "a.perez@despacho.mx" },
]

// ── Vehiculos ─────────────────────────────────────────────────────────────────
const nullSms  = { smsProveedor: null, smsId: null } as const
const nullSeg  = { seguroEmpresa: null, seguroNumeroPoliza: null, seguroFechaVencimiento: null, seguroTipoPoliza: null, seguroTelefono: null, seguroComentarios: null } as const

export const MOCK_VEHICULOS: VehiculoDto[] = [
  { id: "v1",  empresaId: EMPRESA_ID, marca: "Nissan",     modelo: "Versa",     anio: 2022, placas: "ABC-123-A", vin: "3N1CN7AP1NL123456", color: "Blanco",  estatus: "Arrendado",     telefono: null,         createdAt: "2024-01-05T08:00:00Z", updatedAt: "2024-06-01T10:00:00Z",
    smsProveedor: "Emnify", smsId: "EM-8821047",
    seguroEmpresa: "GNP Seguros", seguroNumeroPoliza: "GNP-2024-001234", seguroFechaVencimiento: "2025-01-31", seguroTipoPoliza: "Amplia", seguroTelefono: "8009000462", seguroComentarios: null },
  { id: "v2",  empresaId: EMPRESA_ID, marca: "Chevrolet",  modelo: "Aveo",      anio: 2021, placas: "DEF-456-B", vin: "KL1TD5DE8MB234567", color: "Gris",    estatus: "Disponible",    telefono: null,         createdAt: "2024-01-10T09:00:00Z", updatedAt: "2024-06-10T11:00:00Z",
    ...nullSms, seguroEmpresa: "Qualitas", seguroNumeroPoliza: "QUA-2024-005678", seguroFechaVencimiento: "2025-03-15", seguroTipoPoliza: "Limitada", seguroTelefono: "8003900100", seguroComentarios: "Deducible $10,000 MXN" },
  { id: "v3",  empresaId: EMPRESA_ID, marca: "Volkswagen", modelo: "Jetta",     anio: 2023, placas: "GHI-789-C", vin: "3VW2B7AJ5NM345678", color: "Negro",   estatus: "Arrendado",     telefono: "5551234567", createdAt: "2024-02-01T10:00:00Z", updatedAt: "2024-06-05T09:00:00Z",
    smsProveedor: "Twilio", smsId: "AC7d8f2e3a91b4c056d",
    seguroEmpresa: "HDI Seguros", seguroNumeroPoliza: "HDI-2024-009012", seguroFechaVencimiento: "2025-02-28", seguroTipoPoliza: "Amplia Plus", seguroTelefono: "8007346347", seguroComentarios: null },
  { id: "v4",  empresaId: EMPRESA_ID, marca: "Toyota",     modelo: "Yaris",     anio: 2022, placas: "JKL-012-D", vin: "MNTEA3FJ5NN456789", color: "Rojo",    estatus: "Mantenimiento", telefono: null,         createdAt: "2024-02-15T11:00:00Z", updatedAt: "2024-05-30T08:00:00Z", ...nullSms, ...nullSeg },
  { id: "v5",  empresaId: EMPRESA_ID, marca: "Kia",        modelo: "Rio",       anio: 2021, placas: "MNO-345-E", vin: "KNADM4A37M6567890", color: "Azul",    estatus: "Disponible",    telefono: null,         createdAt: "2024-03-01T12:00:00Z", updatedAt: "2024-06-15T14:00:00Z", ...nullSms, ...nullSeg },
  { id: "v6",  empresaId: EMPRESA_ID, marca: "Hyundai",    modelo: "Grand i10", anio: 2023, placas: "PQR-678-F", vin: "MALAN41B9NM678901", color: "Plata",   estatus: "Arrendado",     telefono: null,         createdAt: "2024-03-10T07:00:00Z", updatedAt: "2024-06-01T09:30:00Z",
    smsProveedor: "Emnify", smsId: "EM-9934210", ...nullSeg },
  { id: "v7",  empresaId: EMPRESA_ID, marca: "Seat",       modelo: "Ibiza",     anio: 2022, placas: "STU-901-G", vin: "VSSZZZ6JZ9R789012", color: "Blanco",  estatus: "Disponible",    telefono: null,         createdAt: "2024-03-20T08:30:00Z", updatedAt: "2024-06-20T10:00:00Z", ...nullSms, ...nullSeg },
  { id: "v8",  empresaId: EMPRESA_ID, marca: "Renault",    modelo: "Kwid",      anio: 2021, placas: "VWX-234-H", vin: "VF1BBA400J0890123", color: "Naranja", estatus: "Baja",          telefono: null,         createdAt: "2024-04-01T09:00:00Z", updatedAt: "2024-06-18T11:00:00Z", ...nullSms, ...nullSeg },
  { id: "v9",  empresaId: EMPRESA_ID, marca: "Nissan",     modelo: "March",     anio: 2020, placas: "YZA-567-I", vin: "3N1BC1CP8LL901234", color: "Verde",   estatus: "Arrendado",     telefono: null,         createdAt: "2024-04-10T10:00:00Z", updatedAt: "2024-06-02T08:00:00Z", ...nullSms, ...nullSeg },
  { id: "v10", empresaId: EMPRESA_ID, marca: "Ford",       modelo: "Figo",      anio: 2022, placas: "BCD-890-J", vin: "MAJ0BXX0XJJ012345", color: "Gris",    estatus: "Disponible",    telefono: "5559876543", createdAt: "2024-04-15T11:00:00Z", updatedAt: "2024-06-22T12:00:00Z",
    ...nullSms, seguroEmpresa: "AXA Seguros", seguroNumeroPoliza: "AXA-2024-112233", seguroFechaVencimiento: "2025-04-30", seguroTipoPoliza: "Amplia", seguroTelefono: "8009122695", seguroComentarios: "Cobertura extendida roadside assistance" },
  { id: "v11", empresaId: EMPRESA_ID, marca: "Chevrolet",  modelo: "Beat",      anio: 2023, placas: "EFG-123-K", vin: "KL8CH6SA4NC123456", color: "Azul",    estatus: "Mantenimiento", telefono: null,         createdAt: "2024-04-20T08:00:00Z", updatedAt: "2024-06-23T09:00:00Z", ...nullSms, ...nullSeg },
  { id: "v12", empresaId: EMPRESA_ID, marca: "Toyota",     modelo: "Corolla",   anio: 2023, placas: "HIJ-456-L", vin: "JTDBE32K930234567", color: "Negro",   estatus: "Arrendado",     telefono: null,         createdAt: "2024-05-01T12:00:00Z", updatedAt: "2024-06-10T14:00:00Z",
    smsProveedor: "Twilio", smsId: "AC1a2b3c4d5e6f7890ab",
    seguroEmpresa: "Mapfre", seguroNumeroPoliza: "MAP-2024-445566", seguroFechaVencimiento: "2025-05-31", seguroTipoPoliza: "Amplia", seguroTelefono: "8007006273", seguroComentarios: null },
]

// ── Tarifas ───────────────────────────────────────────────────────────────────
export const MOCK_TARIFAS: TarifaDto[] = [
  { id: "t1", empresaId: EMPRESA_ID, nombre: "Tarifa Estándar",    monto: 3500, periodicidad: "Mensual",    descripcion: "Plan base para vehículos compactos.",                       activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-01-01T08:00:00Z" },
  { id: "t2", empresaId: EMPRESA_ID, nombre: "Tarifa Plus",        monto: 4800, periodicidad: "Mensual",    descripcion: "Plan para sedanes y vehículos medianos.",                   activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-01-01T08:00:00Z" },
  { id: "t3", empresaId: EMPRESA_ID, nombre: "Tarifa Económica",   monto: 2800, periodicidad: "Mensual",    descripcion: "Plan reducido para contratos de corto plazo.",               activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-01-01T08:00:00Z" },
  { id: "t4", empresaId: EMPRESA_ID, nombre: "Tarifa Premium",     monto: 6500, periodicidad: "Mensual",    descripcion: "Plan para vehículos de gama alta (Corolla, Jetta y sim.).", activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-02-15T10:00:00Z" },
  { id: "t5", empresaId: EMPRESA_ID, nombre: "Tarifa Quincenal",   monto: 1750, periodicidad: "Quincenal",  descripcion: "Pago quincenal equivalente a Tarifa Estándar mensual.",      activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-01-01T08:00:00Z" },
  { id: "t6", empresaId: EMPRESA_ID, nombre: "Tarifa Semanal",     monto:  900, periodicidad: "Semanal",    descripcion: "Pago semanal. Ideal para conductores con flujo variable.",   activa: true,  createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-01-01T08:00:00Z" },
  { id: "t7", empresaId: EMPRESA_ID, nombre: "Tarifa Inactiva",    monto: 3200, periodicidad: "Mensual",    descripcion: "Tarifa descontinuada — no disponible para nuevos contratos.", activa: false, createdAt: "2024-01-01T08:00:00Z", updatedAt: "2024-04-01T12:00:00Z" },
]

// ── Conductores por contrato (many-to-many) ───────────────────────────────────
// Maps each contract to its set of conductorIds.
// Most contracts have 1 conductor; ct5 and ct8 demonstrate multi-driver.
export const MOCK_CONTRATO_CONDUCTORES: Record<string, string[]> = {
  ct1: ["c1"],
  ct2: ["c2"],
  ct3: ["c3"],
  ct4: ["c5"],
  ct5: ["c7", "c8", "c10"],  // Miguel (primary) + Ana + Gabriela
  ct6: ["c8"],
  ct7: ["c10"],
  ct8: ["c11", "c3"],        // David (primary) + Carlos
}

// ── Contratos ─────────────────────────────────────────────────────────────────
export const MOCK_CONTRATOS: ContratoDto[] = [
  { id: "ct1", empresaId: EMPRESA_ID, conductorId: "c1",  nombreConductor: "Alejandro Ramírez Torres", vehiculoId: "v1",  descripcionVehiculo: "Nissan Versa 2022 — ABC-123-A",          tarifaId: "t1", nombreTarifa: "Tarifa Estándar",  montoRenta: 3500, periodicidad: "Mensual",    fechaInicio: "2024-02-01", fechaFin: null,         estatus: "Activo",     formaPago: "Transferencia", conductoresCount: 1, observaciones: null,                                        createdAt: "2024-02-01T08:00:00Z" },
  { id: "ct2", empresaId: EMPRESA_ID, conductorId: "c2",  nombreConductor: "María González López",      vehiculoId: "v3",  descripcionVehiculo: "Volkswagen Jetta 2023 — GHI-789-C",      tarifaId: "t2", nombreTarifa: "Tarifa Plus",      montoRenta: 4800, periodicidad: "Mensual",    fechaInicio: "2024-03-15", fechaFin: null,         estatus: "Activo",     formaPago: "Efectivo",      conductoresCount: 1, observaciones: "Pago los días 15 de cada mes",     createdAt: "2024-03-15T09:00:00Z" },
  { id: "ct3", empresaId: EMPRESA_ID, conductorId: "c3",  nombreConductor: "Carlos Hernández Vega",     vehiculoId: "v6",  descripcionVehiculo: "Hyundai Grand i10 2023 — PQR-678-F",     tarifaId: "t1", nombreTarifa: "Tarifa Estándar",  montoRenta: 3200, periodicidad: "Quincenal",  fechaInicio: "2024-04-01", fechaFin: null,         estatus: "Activo",     formaPago: "Transferencia", conductoresCount: 1, observaciones: null,                                        createdAt: "2024-04-01T10:00:00Z" },
  { id: "ct4", empresaId: EMPRESA_ID, conductorId: "c5",  nombreConductor: "Jorge Sánchez",             vehiculoId: "v9",  descripcionVehiculo: "Nissan March 2020 — YZA-567-I",          tarifaId: "t3", nombreTarifa: "Tarifa Económica", montoRenta: 2800, periodicidad: "Semanal",    fechaInicio: "2024-04-15", fechaFin: null,         estatus: "Activo",     formaPago: "Efectivo",      conductoresCount: 1, observaciones: "Pago en oficina todos los lunes",  createdAt: "2024-04-15T11:00:00Z" },
  { id: "ct5", empresaId: EMPRESA_ID, conductorId: "c7",  nombreConductor: "Miguel Flores Mora",        vehiculoId: "v12", descripcionVehiculo: "Toyota Corolla 2023 — HIJ-456-L",        tarifaId: "t2", nombreTarifa: "Tarifa Plus",      montoRenta: 5200, periodicidad: "Mensual",    fechaInicio: "2024-05-01", fechaFin: null,         estatus: "Activo",     formaPago: "Tarjeta",       conductoresCount: 1, observaciones: null,                                        createdAt: "2024-05-01T08:00:00Z" },
  { id: "ct6", empresaId: EMPRESA_ID, conductorId: "c8",  nombreConductor: "Ana Reyes Campos",          vehiculoId: "v2",  descripcionVehiculo: "Chevrolet Aveo 2021 — DEF-456-B",        tarifaId: "t1", nombreTarifa: "Tarifa Estándar",  montoRenta: 3000, periodicidad: "Mensual",    fechaInicio: "2024-01-15", fechaFin: "2024-05-14", estatus: "Finalizado", formaPago: "Transferencia", conductoresCount: 1, observaciones: "Contrato finalizado por cambio de vehículo", createdAt: "2024-01-15T12:00:00Z" },
  { id: "ct7", empresaId: EMPRESA_ID, conductorId: "c10", nombreConductor: "Gabriela Cruz Vargas",      vehiculoId: "v5",  descripcionVehiculo: "Kia Rio 2021 — MNO-345-E",               tarifaId: "t3", nombreTarifa: "Tarifa Económica", montoRenta: 2600, periodicidad: "Quincenal",  fechaInicio: "2024-05-20", fechaFin: null,         estatus: "Pausado",    formaPago: "Efectivo",      conductoresCount: 1, observaciones: "Pausado temporalmente",             createdAt: "2024-05-20T08:00:00Z" },
  { id: "ct8", empresaId: EMPRESA_ID, conductorId: "c11", nombreConductor: "David Morales Jiménez",     vehiculoId: "v7",  descripcionVehiculo: "Seat Ibiza 2022 — STU-901-G",            tarifaId: "t1", nombreTarifa: "Tarifa Estándar",  montoRenta: 3400, periodicidad: "Mensual",    fechaInicio: "2024-06-01", fechaFin: null,         estatus: "Activo",     formaPago: "Transferencia", conductoresCount: 1, observaciones: null,                                        createdAt: "2024-06-01T09:00:00Z" },
]

// ── Pagos de contrato ─────────────────────────────────────────────────────────
// 28 entries across multiple months and contracts — fills 2 pages at pageSize=20.
// Each conductor has several periods so the historial dialog shows real data.
export const MOCK_PAGOS: PagoContratoDto[] = [
  // ── ct1 · Alejandro Ramírez · Nissan Versa · $3,500/mes ──────────────────
  { id: "p8",  contratoId: "ct1", empresaId: EMPRESA_ID, periodoInicio: "2024-04-01", periodoFin: "2024-04-30", montoTotal: 3500, montoPagado: 3500, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-04-05", createdAt: "2024-04-01T08:00:00Z" },
  { id: "p9",  contratoId: "ct1", empresaId: EMPRESA_ID, periodoInicio: "2024-05-01", periodoFin: "2024-05-31", montoTotal: 3500, montoPagado: 3500, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-05-05", createdAt: "2024-05-01T08:00:00Z" },
  { id: "p1",  contratoId: "ct1", empresaId: EMPRESA_ID, periodoInicio: "2024-06-01", periodoFin: "2024-06-30", montoTotal: 3500, montoPagado: 3500, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-05", createdAt: "2024-06-01T08:00:00Z" },
  { id: "p2",  contratoId: "ct1", empresaId: EMPRESA_ID, periodoInicio: "2024-07-01", periodoFin: "2024-07-31", montoTotal: 3500, montoPagado:    0, saldoPendiente: 3500, estatus: "Pendiente",     fechaVencimiento: "2024-07-05", createdAt: "2024-07-01T08:00:00Z" },

  // ── ct2 · María González · VW Jetta · $4,800/mes ─────────────────────────
  { id: "p10", contratoId: "ct2", empresaId: EMPRESA_ID, periodoInicio: "2024-04-15", periodoFin: "2024-05-14", montoTotal: 4800, montoPagado: 4800, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-04-20", createdAt: "2024-04-15T09:00:00Z" },
  { id: "p11", contratoId: "ct2", empresaId: EMPRESA_ID, periodoInicio: "2024-05-15", periodoFin: "2024-06-14", montoTotal: 4800, montoPagado: 4800, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-05-20", createdAt: "2024-05-15T09:00:00Z" },
  { id: "p3",  contratoId: "ct2", empresaId: EMPRESA_ID, periodoInicio: "2024-06-15", periodoFin: "2024-07-14", montoTotal: 4800, montoPagado: 2400, saldoPendiente: 2400, estatus: "PagadoParcial", fechaVencimiento: "2024-06-20", createdAt: "2024-06-15T09:00:00Z" },
  { id: "p12", contratoId: "ct2", empresaId: EMPRESA_ID, periodoInicio: "2024-07-15", periodoFin: "2024-08-14", montoTotal: 4800, montoPagado:    0, saldoPendiente: 4800, estatus: "Pendiente",     fechaVencimiento: "2024-07-20", createdAt: "2024-07-15T09:00:00Z" },

  // ── ct3 · Carlos Hernández · Hyundai i10 · $1,600/quincenal ──────────────
  { id: "p13", contratoId: "ct3", empresaId: EMPRESA_ID, periodoInicio: "2024-06-01", periodoFin: "2024-06-14", montoTotal: 1600, montoPagado: 1600, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-03", createdAt: "2024-06-01T10:00:00Z" },
  { id: "p4",  contratoId: "ct3", empresaId: EMPRESA_ID, periodoInicio: "2024-06-15", periodoFin: "2024-06-29", montoTotal: 1600, montoPagado: 1600, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-18", createdAt: "2024-06-15T10:00:00Z" },
  { id: "p14", contratoId: "ct3", empresaId: EMPRESA_ID, periodoInicio: "2024-07-01", periodoFin: "2024-07-14", montoTotal: 1600, montoPagado:    0, saldoPendiente: 1600, estatus: "Pendiente",     fechaVencimiento: "2024-07-03", createdAt: "2024-07-01T10:00:00Z" },
  { id: "p15", contratoId: "ct3", empresaId: EMPRESA_ID, periodoInicio: "2024-07-15", periodoFin: "2024-07-29", montoTotal: 1600, montoPagado:    0, saldoPendiente: 1600, estatus: "Pendiente",     fechaVencimiento: "2024-07-18", createdAt: "2024-07-15T10:00:00Z" },

  // ── ct4 · Jorge Sánchez · Nissan March · $700/semanal ────────────────────
  { id: "p16", contratoId: "ct4", empresaId: EMPRESA_ID, periodoInicio: "2024-06-10", periodoFin: "2024-06-16", montoTotal:  700, montoPagado:  700, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-10", createdAt: "2024-06-10T11:00:00Z" },
  { id: "p17", contratoId: "ct4", empresaId: EMPRESA_ID, periodoInicio: "2024-06-17", periodoFin: "2024-06-23", montoTotal:  700, montoPagado:  700, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-17", createdAt: "2024-06-17T11:00:00Z" },
  { id: "p5",  contratoId: "ct4", empresaId: EMPRESA_ID, periodoInicio: "2024-06-24", periodoFin: "2024-06-30", montoTotal:  700, montoPagado:    0, saldoPendiente:  700, estatus: "Vencido",       fechaVencimiento: "2024-06-24", createdAt: "2024-06-24T11:00:00Z" },
  { id: "p18", contratoId: "ct4", empresaId: EMPRESA_ID, periodoInicio: "2024-07-01", periodoFin: "2024-07-07", montoTotal:  700, montoPagado:    0, saldoPendiente:  700, estatus: "Pendiente",     fechaVencimiento: "2024-07-01", createdAt: "2024-07-01T11:00:00Z" },

  // ── ct5 · Miguel Flores · Toyota Corolla · $5,200/mes ────────────────────
  { id: "p19", contratoId: "ct5", empresaId: EMPRESA_ID, periodoInicio: "2024-05-01", periodoFin: "2024-05-31", montoTotal: 5200, montoPagado: 5200, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-05-05", createdAt: "2024-05-01T08:00:00Z" },
  { id: "p6",  contratoId: "ct5", empresaId: EMPRESA_ID, periodoInicio: "2024-06-01", periodoFin: "2024-06-30", montoTotal: 5200, montoPagado: 5200, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-06-05", createdAt: "2024-06-01T08:00:00Z" },
  { id: "p20", contratoId: "ct5", empresaId: EMPRESA_ID, periodoInicio: "2024-07-01", periodoFin: "2024-07-31", montoTotal: 5200, montoPagado:    0, saldoPendiente: 5200, estatus: "Pendiente",     fechaVencimiento: "2024-07-05", createdAt: "2024-07-01T08:00:00Z" },

  // ── ct6 · Ana Reyes · Chevrolet Aveo · $3,000/mes (finalizado) ───────────
  { id: "p21", contratoId: "ct6", empresaId: EMPRESA_ID, periodoInicio: "2024-01-15", periodoFin: "2024-02-14", montoTotal: 3000, montoPagado: 3000, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-01-20", createdAt: "2024-01-15T12:00:00Z" },
  { id: "p22", contratoId: "ct6", empresaId: EMPRESA_ID, periodoInicio: "2024-02-15", periodoFin: "2024-03-14", montoTotal: 3000, montoPagado: 3000, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-02-20", createdAt: "2024-02-15T12:00:00Z" },
  { id: "p23", contratoId: "ct6", empresaId: EMPRESA_ID, periodoInicio: "2024-03-15", periodoFin: "2024-04-14", montoTotal: 3000, montoPagado: 3000, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-03-20", createdAt: "2024-03-15T12:00:00Z" },
  { id: "p24", contratoId: "ct6", empresaId: EMPRESA_ID, periodoInicio: "2024-04-15", periodoFin: "2024-05-14", montoTotal: 3000, montoPagado: 3000, saldoPendiente:    0, estatus: "Pagado",        fechaVencimiento: "2024-04-20", createdAt: "2024-04-15T12:00:00Z" },

  // ── ct7 · Gabriela Cruz · Kia Rio · $1,300/quincenal (pausado) ───────────
  { id: "p25", contratoId: "ct7", empresaId: EMPRESA_ID, periodoInicio: "2024-05-20", periodoFin: "2024-06-03", montoTotal: 1300, montoPagado:  800, saldoPendiente:  500, estatus: "PagadoParcial", fechaVencimiento: "2024-05-23", createdAt: "2024-05-20T08:00:00Z" },
  { id: "p26", contratoId: "ct7", empresaId: EMPRESA_ID, periodoInicio: "2024-06-04", periodoFin: "2024-06-18", montoTotal: 1300, montoPagado:    0, saldoPendiente: 1300, estatus: "Vencido",       fechaVencimiento: "2024-06-07", createdAt: "2024-06-04T08:00:00Z" },

  // ── ct8 · David Morales · Seat Ibiza · $3,400/mes ────────────────────────
  { id: "p7",  contratoId: "ct8", empresaId: EMPRESA_ID, periodoInicio: "2024-06-01", periodoFin: "2024-06-30", montoTotal: 3400, montoPagado:    0, saldoPendiente: 3400, estatus: "Pendiente",     fechaVencimiento: "2024-06-08", createdAt: "2024-06-01T09:00:00Z" },
  { id: "p27", contratoId: "ct8", empresaId: EMPRESA_ID, periodoInicio: "2024-07-01", periodoFin: "2024-07-31", montoTotal: 3400, montoPagado:    0, saldoPendiente: 3400, estatus: "Pendiente",     fechaVencimiento: "2024-07-08", createdAt: "2024-07-01T09:00:00Z" },
]

// ── Notificaciones — plantillas ───────────────────────────────────────────────
export const MOCK_PLANTILLAS: NotificacionPlantillaDto[] = [
  { id: "np1", empresaId: EMPRESA_ID, titulo: "Recordatorio de pago",          tipo: "Recordatorio",  activa: true,  cuerpo: "Hola {{nombre}}, te recordamos que tu pago del período {{periodo}} vence el {{fechaVencimiento}}. Por favor realiza tu depósito a tiempo para evitar cargos adicionales.",                           createdAt: "2024-03-01T08:00:00Z", updatedAt: "2024-03-01T08:00:00Z" },
  { id: "np2", empresaId: EMPRESA_ID, titulo: "Pago vencido",                  tipo: "Urgente",       activa: true,  cuerpo: "Estimado {{nombre}}, tu pago del período {{periodo}} por ${{monto}} está VENCIDO. Comunícate con nosotros de inmediato al 55-1234-5678 para regularizar tu situación.",                           createdAt: "2024-03-01T08:00:00Z", updatedAt: "2024-04-10T12:00:00Z" },
  { id: "np3", empresaId: EMPRESA_ID, titulo: "Bienvenido a Decofleet",        tipo: "Informativa",   activa: true,  cuerpo: "¡Bienvenido, {{nombre}}! Tu contrato ha sido activado exitosamente. Cualquier duda comunícate con tu asesor o escríbenos al WhatsApp de soporte.",                                                    createdAt: "2024-03-15T10:00:00Z", updatedAt: "2024-03-15T10:00:00Z" },
  { id: "np4", empresaId: EMPRESA_ID, titulo: "Mantenimiento programado",      tipo: "Informativa",   activa: true,  cuerpo: "Hola {{nombre}}, tu vehículo {{vehiculo}} tiene un mantenimiento programado el {{fecha}}. Preséntate en el taller a las 9:00 am. En caso de no poder asistir comunícate con anticipación.",          createdAt: "2024-04-01T09:00:00Z", updatedAt: "2024-04-01T09:00:00Z" },
  { id: "np5", empresaId: EMPRESA_ID, titulo: "Documentación vencida",         tipo: "Urgente",       activa: true,  cuerpo: "{{nombre}}, tu licencia de conducir vence el {{fechaVencLic}}. Para continuar operando con Decofleet debes renovarla y entregar copia actualizada en oficinas antes de esa fecha.",                  createdAt: "2024-05-01T08:00:00Z", updatedAt: "2024-05-01T08:00:00Z" },
  { id: "np6", empresaId: EMPRESA_ID, titulo: "Promoción de temporada",        tipo: "Promocional",   activa: false, cuerpo: "¡Buenas noticias! Durante este mes ofrecemos una bonificación especial del 10% en tu próximo pago si lo realizas antes del día 5. ¡Aprovecha esta oportunidad!",                                         createdAt: "2024-06-01T08:00:00Z", updatedAt: "2024-06-20T14:00:00Z" },
]

// ── Notificaciones — enviadas ─────────────────────────────────────────────────
export const MOCK_NOTIFICACIONES_ENVIADAS: NotificacionEnviadaDto[] = [
  { id: "ne1", empresaId: EMPRESA_ID, titulo: "Recordatorio de pago — Julio",  tipo: "Recordatorio", cuerpo: "Hola {{nombre}}, te recordamos que tu pago del mes de julio vence el día 5. Por favor realiza tu pago a tiempo para evitar cargos por mora.",                           totalDestinatarios: 8,  nombresDestinatarios: ["Alejandro Ramírez Torres", "María González López", "Carlos Hernández Vega", "Jorge Sánchez", "Miguel Flores Mora", "Ana Reyes Campos", "Gabriela Cruz Vargas", "David Morales Jiménez"], fechaEnvio: "2024-07-01T09:00:00Z" },
  { id: "ne2", empresaId: EMPRESA_ID, titulo: "Pago vencido",                  tipo: "Urgente",       cuerpo: "Tu pago del mes de junio está vencido. Es necesario que regularices tu situación a la brevedad para evitar la suspensión del servicio. Comunícate con nosotros de inmediato.", totalDestinatarios: 2,  nombresDestinatarios: ["Jorge Sánchez", "David Morales Jiménez"],                                                                                                                                       fechaEnvio: "2024-07-05T10:30:00Z" },
  { id: "ne3", empresaId: EMPRESA_ID, titulo: "Cierre de oficinas — 15 Jul",   tipo: "Informativa",   cuerpo: "Te informamos que nuestras oficinas permanecerán cerradas el próximo 15 de julio con motivo del día festivo. Los pagos realizados ese día serán procesados el siguiente día hábil.",  totalDestinatarios: 8,  nombresDestinatarios: ["Alejandro Ramírez Torres", "María González López", "Carlos Hernández Vega", "Jorge Sánchez", "Miguel Flores Mora", "Ana Reyes Campos", "Gabriela Cruz Vargas", "David Morales Jiménez"], fechaEnvio: "2024-07-12T08:00:00Z" },
  { id: "ne4", empresaId: EMPRESA_ID, titulo: "Revisión de documentos",        tipo: "Recordatorio",  cuerpo: "Estimado conductor, te recordamos que debes entregar copias actualizadas de tu licencia de conducir e identificación oficial antes del 31 de julio. Visítanos en oficinas.",          totalDestinatarios: 3,  nombresDestinatarios: ["María González López", "Jorge Sánchez", "Miguel Flores Mora"],                                                                                                                   fechaEnvio: "2024-07-18T11:00:00Z" },
]

// ── Dashboard summary ─────────────────────────────────────────────────────────
export const MOCK_DASHBOARD = {
  conductoresActivos: 8,
  vehiculosDisponibles: 4,
  vehiculosArrendados: 5,
  contratosActivos: 6,
  ingresosMes: 23700,
  pagosPendientes: 4,
  pagosPendientesImporte: 7600,
  ocupacion: 62,
}

// ── Dashboard charts ──────────────────────────────────────────────────────────
export const MOCK_REVENUE_CHART = [
  { mes: "Ene", esperado: 18500, cobrado: 17200 },
  { mes: "Feb", esperado: 21200, cobrado: 20800 },
  { mes: "Mar", esperado: 19800, cobrado: 19800 },
  { mes: "Abr", esperado: 22400, cobrado: 21600 },
  { mes: "May", esperado: 20100, cobrado: 19300 },
  { mes: "Jun", esperado: 23700, cobrado: 13700 },
]

export const MOCK_FLOTA_CHART = [
  { name: "Arrendado",     value: 5, fill: "#3b82f6" },
  { name: "Disponible",    value: 4, fill: "#22c55e" },
  { name: "Mantenimiento", value: 2, fill: "#f59e0b" },
  { name: "Baja",          value: 1, fill: "#94a3b8" },
]

// ── Pagos emitidos (abonos registrados) ───────────────────────────────────────
// Multiple abonos per period to show real historial data.
export const MOCK_PAGOS_EMITIDOS: PagoEmitidoDto[] = [
  // ct1 · Alejandro — abr/may/jun: pagos completos; historial shows 3 periodos pagados
  { id: "pe1",  pagoContratoId: "p8",  monto: 3500, formaPago: "Transferencia", fechaPago: "2024-04-03", referencia: "SPEI-20240403-008" },
  { id: "pe2",  pagoContratoId: "p9",  monto: 3500, formaPago: "Transferencia", fechaPago: "2024-05-03", referencia: "SPEI-20240503-009" },
  { id: "pe3",  pagoContratoId: "p1",  monto: 3500, formaPago: "Transferencia", fechaPago: "2024-06-03", referencia: "SPEI-20240603-001" },

  // ct2 · María — abr: pago completo; may: 2 abonos parciales que suman 4800; jun: 1 abono parcial
  { id: "pe4",  pagoContratoId: "p10", monto: 4800, formaPago: "Transferencia", fechaPago: "2024-04-18", referencia: "SPEI-20240418-010" },
  { id: "pe5",  pagoContratoId: "p11", monto: 2000, formaPago: "Efectivo",      fechaPago: "2024-05-16", referencia: null },
  { id: "pe6",  pagoContratoId: "p11", monto: 2800, formaPago: "Transferencia", fechaPago: "2024-05-22", referencia: "SPEI-20240522-011" },
  { id: "pe7",  pagoContratoId: "p3",  monto: 2400, formaPago: "Efectivo",      fechaPago: "2024-06-17", referencia: null },

  // ct3 · Carlos — jun 1-14: pago completo; jun 15-29: pago completo
  { id: "pe8",  pagoContratoId: "p13", monto: 1600, formaPago: "Transferencia", fechaPago: "2024-06-02", referencia: "SPEI-20240602-013" },
  { id: "pe9",  pagoContratoId: "p4",  monto: 1600, formaPago: "Transferencia", fechaPago: "2024-06-16", referencia: "SPEI-20240616-004" },

  // ct4 · Jorge — jun 10-16 y 17-23: pagos completos en efectivo
  { id: "pe10", pagoContratoId: "p16", monto:  700, formaPago: "Efectivo",      fechaPago: "2024-06-10", referencia: null },
  { id: "pe11", pagoContratoId: "p17", monto:  700, formaPago: "Efectivo",      fechaPago: "2024-06-17", referencia: null },

  // ct5 · Miguel — may y jun: pagos completos con tarjeta
  { id: "pe12", pagoContratoId: "p19", monto: 5200, formaPago: "Tarjeta",       fechaPago: "2024-05-03", referencia: "TRJ-0038" },
  { id: "pe13", pagoContratoId: "p6",  monto: 5200, formaPago: "Tarjeta",       fechaPago: "2024-06-04", referencia: "TRJ-0042" },

  // ct6 · Ana — 4 mensualidades pagadas durante vigencia del contrato
  { id: "pe14", pagoContratoId: "p21", monto: 3000, formaPago: "Transferencia", fechaPago: "2024-01-18", referencia: "SPEI-20240118-021" },
  { id: "pe15", pagoContratoId: "p22", monto: 3000, formaPago: "Transferencia", fechaPago: "2024-02-18", referencia: "SPEI-20240218-022" },
  { id: "pe16", pagoContratoId: "p23", monto: 3000, formaPago: "Transferencia", fechaPago: "2024-03-18", referencia: "SPEI-20240318-023" },
  { id: "pe17", pagoContratoId: "p24", monto: 3000, formaPago: "Transferencia", fechaPago: "2024-04-18", referencia: "SPEI-20240418-024" },

  // ct7 · Gabriela — abono parcial en 2 pagos para el primer periodo
  { id: "pe18", pagoContratoId: "p25", monto:  500, formaPago: "Efectivo",      fechaPago: "2024-05-21", referencia: null },
  { id: "pe19", pagoContratoId: "p25", monto:  300, formaPago: "Efectivo",      fechaPago: "2024-05-28", referencia: null },
]

// ── Tipos de mantenimiento ────────────────────────────────────────────────────
import type { TipoMantenimientoDto, MantenimientoDto, DocumentoVehiculoDto, FotoVehiculoDto } from "@/types/api"

// ── Fotos de vehículo ─────────────────────────────────────────────────────────
export const MOCK_FOTOS: FotoVehiculoDto[] = [
  { id: "f1",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Inventario", nombre: "inventario_frontal.jpg",   mimeType: "image/jpeg", tamaño: 1_250_000, url: null, creadoEn: "2024-01-06T08:00:00Z" },
  { id: "f2",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Inventario", nombre: "inventario_trasero.jpg",   mimeType: "image/jpeg", tamaño: 1_100_000, url: null, creadoEn: "2024-01-06T08:05:00Z" },
  { id: "f3",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Exteriores", nombre: "exterior_lateral_der.jpg", mimeType: "image/jpeg", tamaño:   980_000, url: null, creadoEn: "2024-01-06T08:10:00Z" },
  { id: "f4",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Exteriores", nombre: "exterior_lateral_izq.jpg", mimeType: "image/jpeg", tamaño:   870_000, url: null, creadoEn: "2024-01-06T08:12:00Z" },
  { id: "f5",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Interiores", nombre: "interior_tablero.jpg",     mimeType: "image/jpeg", tamaño: 1_430_000, url: null, creadoEn: "2024-01-06T08:20:00Z" },
  { id: "f6",  vehiculoId: "v1", empresaId: EMPRESA_ID, categoria: "Motor",      nombre: "motor_general.jpg",        mimeType: "image/jpeg", tamaño: 1_600_000, url: null, creadoEn: "2024-01-06T08:30:00Z" },
  { id: "f7",  vehiculoId: "v3", empresaId: EMPRESA_ID, categoria: "Inventario", nombre: "inventario_completo.jpg",  mimeType: "image/jpeg", tamaño: 1_350_000, url: null, creadoEn: "2024-02-02T09:00:00Z" },
  { id: "f8",  vehiculoId: "v3", empresaId: EMPRESA_ID, categoria: "Exteriores", nombre: "exterior_frontal.jpg",     mimeType: "image/jpeg", tamaño:   920_000, url: null, creadoEn: "2024-02-02T09:10:00Z" },
  { id: "f9",  vehiculoId: "v3", empresaId: EMPRESA_ID, categoria: "Exteriores", nombre: "exterior_trasero.jpg",     mimeType: "image/jpeg", tamaño:   840_000, url: null, creadoEn: "2024-02-02T09:15:00Z" },
  { id: "f10", vehiculoId: "v3", empresaId: EMPRESA_ID, categoria: "Interiores", nombre: "interior_asientos.jpg",    mimeType: "image/jpeg", tamaño: 1_200_000, url: null, creadoEn: "2024-02-02T09:20:00Z" },
  { id: "f11", vehiculoId: "v3", empresaId: EMPRESA_ID, categoria: "Motor",      nombre: "motor_vista_arriba.jpg",   mimeType: "image/jpeg", tamaño: 1_550_000, url: null, creadoEn: "2024-02-02T09:30:00Z" },
  { id: "f12", vehiculoId: "v12", empresaId: EMPRESA_ID, categoria: "Inventario", nombre: "inventario_frontal.jpg",  mimeType: "image/jpeg", tamaño: 1_180_000, url: null, creadoEn: "2024-05-02T10:00:00Z" },
  { id: "f13", vehiculoId: "v12", empresaId: EMPRESA_ID, categoria: "Exteriores", nombre: "exterior_lateral.jpg",    mimeType: "image/jpeg", tamaño:   900_000, url: null, creadoEn: "2024-05-02T10:10:00Z" },
]

// ── Documentos de vehículo ────────────────────────────────────────────────────
export const MOCK_DOCUMENTOS: DocumentoVehiculoDto[] = [
  { id: "doc1", vehiculoId: "v1", empresaId: EMPRESA_ID, nombre: "Factura_Nissan_Versa_2022.pdf",         mimeType: "application/pdf",   tamaño: 2_400_000, creadoEn: "2024-01-06T10:00:00Z" },
  { id: "doc2", vehiculoId: "v1", empresaId: EMPRESA_ID, nombre: "Poliza_GNP_2024.pdf",                  mimeType: "application/pdf",   tamaño: 1_820_000, creadoEn: "2024-01-11T11:00:00Z" },
  { id: "doc3", vehiculoId: "v1", empresaId: EMPRESA_ID, nombre: "Tarjeta_circulacion_2024.jpg",          mimeType: "image/jpeg",        tamaño:   430_000, creadoEn: "2024-01-12T09:00:00Z" },
  { id: "doc4", vehiculoId: "v3", empresaId: EMPRESA_ID, nombre: "Contrato_arrendamiento_Jetta.docx",    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", tamaño: 340_000, creadoEn: "2024-02-02T08:00:00Z" },
  { id: "doc5", vehiculoId: "v3", empresaId: EMPRESA_ID, nombre: "Poliza_HDI_2024.pdf",                  mimeType: "application/pdf",   tamaño: 1_650_000, creadoEn: "2024-02-05T10:00:00Z" },
  { id: "doc6", vehiculoId: "v3", empresaId: EMPRESA_ID, nombre: "Foto_frente.png",                      mimeType: "image/png",         tamaño: 1_100_000, creadoEn: "2024-02-06T14:00:00Z" },
  { id: "doc7", vehiculoId: "v12", empresaId: EMPRESA_ID, nombre: "Poliza_Mapfre_Corolla.pdf",           mimeType: "application/pdf",   tamaño: 2_100_000, creadoEn: "2024-05-02T10:00:00Z" },
  { id: "doc8", vehiculoId: "v12", empresaId: EMPRESA_ID, nombre: "Revision_tecnica_Jun2024.pdf",        mimeType: "application/pdf",   tamaño:   890_000, creadoEn: "2024-06-15T09:00:00Z" },
]

export const MOCK_TIPOS_MANTENIMIENTO: TipoMantenimientoDto[] = [
  { id: "tm1", empresaId: EMPRESA_ID, nombre: "Cambio de aceite",          descripcion: "Cambio de aceite y filtro",                    esSiniestro: false },
  { id: "tm2", empresaId: EMPRESA_ID, nombre: "Revisión de frenos",        descripcion: "Inspección y cambio de balatas/discos",         esSiniestro: false },
  { id: "tm3", empresaId: EMPRESA_ID, nombre: "Cambio de llantas",         descripcion: "Rotación o sustitución de neumáticos",          esSiniestro: false },
  { id: "tm4", empresaId: EMPRESA_ID, nombre: "Servicio mayor",            descripcion: "Revisión completa de 60,000 km",                esSiniestro: false },
  { id: "tm5", empresaId: EMPRESA_ID, nombre: "Afinación",                 descripcion: "Bujías, filtro de aire, cables",                esSiniestro: false },
  { id: "tm6", empresaId: EMPRESA_ID, nombre: "Revisión eléctrica",        descripcion: "Batería, alternador, fusibles",                 esSiniestro: false },
  { id: "tm7", empresaId: EMPRESA_ID, nombre: "Siniestro — Colisión",      descripcion: "Daño por accidente de tránsito",                esSiniestro: true  },
  { id: "tm8", empresaId: EMPRESA_ID, nombre: "Siniestro — Robo parcial",  descripcion: "Robo de accesorios o partes del vehículo",      esSiniestro: true  },
]

// ── Mantenimientos ────────────────────────────────────────────────────────────
export const MOCK_MANTENIMIENTOS: MantenimientoDto[] = [
  { id: "m1",  empresaId: EMPRESA_ID, vehiculoId: "v1",  descripcionVehiculo: "Nissan Versa 2022 — ABC-123-A",        tipoMantenimientoId: "tm1", nombreTipo: "Cambio de aceite",    esSiniestro: false, estatus: "Completado",  fechaProgramada: "2024-05-10", fechaReal: "2024-05-10", proveedor: "Taller López",     costoEstimado: 850,   costoReal: 820,   createdAt: "2024-05-08T10:00:00Z" },
  { id: "m2",  empresaId: EMPRESA_ID, vehiculoId: "v3",  descripcionVehiculo: "Volkswagen Jetta 2023 — GHI-789-C",    tipoMantenimientoId: "tm2", nombreTipo: "Revisión de frenos",  esSiniestro: false, estatus: "Programado",  fechaProgramada: "2024-07-20", fechaReal: null,          proveedor: "Autopartes Ramírez", costoEstimado: 2200,  costoReal: null,  createdAt: "2024-06-15T09:00:00Z" },
  { id: "m3",  empresaId: EMPRESA_ID, vehiculoId: "v4",  descripcionVehiculo: "Toyota Yaris 2022 — JKL-012-D",        tipoMantenimientoId: "tm4", nombreTipo: "Servicio mayor",      esSiniestro: false, estatus: "EnProceso",   fechaProgramada: "2024-06-28", fechaReal: null,          proveedor: "Taller Toyota Oficial", costoEstimado: 4500, costoReal: null,  createdAt: "2024-06-20T11:00:00Z" },
  { id: "m4",  empresaId: EMPRESA_ID, vehiculoId: "v9",  descripcionVehiculo: "Nissan March 2020 — YZA-567-I",        tipoMantenimientoId: "tm3", nombreTipo: "Cambio de llantas",   esSiniestro: false, estatus: "Completado",  fechaProgramada: "2024-06-01", fechaReal: "2024-06-03", proveedor: "Llantas del Norte",  costoEstimado: 3200,  costoReal: 3400,  createdAt: "2024-05-28T08:00:00Z" },
  { id: "m5",  empresaId: EMPRESA_ID, vehiculoId: "v6",  descripcionVehiculo: "Hyundai Grand i10 2023 — PQR-678-F",   tipoMantenimientoId: "tm5", nombreTipo: "Afinación",           esSiniestro: false, estatus: "Programado",  fechaProgramada: "2024-07-15", fechaReal: null,          proveedor: null,                 costoEstimado: 1200,  costoReal: null,  createdAt: "2024-07-01T12:00:00Z" },
  { id: "m6",  empresaId: EMPRESA_ID, vehiculoId: "v11", descripcionVehiculo: "Chevrolet Beat 2023 — EFG-123-K",      tipoMantenimientoId: "tm6", nombreTipo: "Revisión eléctrica",  esSiniestro: false, estatus: "EnProceso",   fechaProgramada: "2024-07-02", fechaReal: null,          proveedor: "Eléctrico Martínez", costoEstimado: 900,   costoReal: null,  createdAt: "2024-07-02T08:00:00Z" },
  { id: "m7",  empresaId: EMPRESA_ID, vehiculoId: "v8",  descripcionVehiculo: "Renault Kwid 2021 — VWX-234-H",        tipoMantenimientoId: "tm7", nombreTipo: "Siniestro — Colisión",esSiniestro: true,  estatus: "Completado",  fechaProgramada: "2024-04-15", fechaReal: "2024-05-02", proveedor: "Hojalatería Reyes",  costoEstimado: 8000,  costoReal: 9500,  createdAt: "2024-04-15T14:00:00Z" },
  { id: "m8",  empresaId: EMPRESA_ID, vehiculoId: "v2",  descripcionVehiculo: "Chevrolet Aveo 2021 — DEF-456-B",      tipoMantenimientoId: "tm1", nombreTipo: "Cambio de aceite",    esSiniestro: false, estatus: "Programado",  fechaProgramada: "2024-07-25", fechaReal: null,          proveedor: "Taller López",       costoEstimado: 850,   costoReal: null,  createdAt: "2024-07-05T09:00:00Z" },
  { id: "m9",  empresaId: EMPRESA_ID, vehiculoId: "v12", descripcionVehiculo: "Toyota Corolla 2023 — HIJ-456-L",      tipoMantenimientoId: "tm2", nombreTipo: "Revisión de frenos",  esSiniestro: false, estatus: "Cancelado",   fechaProgramada: "2024-06-10", fechaReal: null,          proveedor: "Autopartes Ramírez", costoEstimado: 1800,  costoReal: null,  createdAt: "2024-06-05T10:00:00Z" },
]
