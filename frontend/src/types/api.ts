// ── Shared ──────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// ── Auth ─────────────────────────────────────────────────────
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  usuario: UsuarioInfo
}

export interface UsuarioInfo {
  id: string
  email: string
  nombre: string
  apellido: string | null
  empresaId: string
  rolId: string
}

// ── Conductores ───────────────────────────────────────────────
export type EEstatusConductor = "Activo" | "Inactivo" | "Suspendido"
export type ETipoLicencia    = "A" | "B" | "C" | "D" | "E"
export type EDestinoPago     = "Moral" | "Fisica Derek" | "Fisica Gene"

export interface ConductorDto {
  id: string
  empresaId: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string | null
  nombreCompleto: string
  curp: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  codigoPostal: string | null
  estatus: EEstatusConductor
  // Licencia
  licenciaNumero: string | null
  licenciaTipo: ETipoLicencia | null
  licenciaVencimiento: string | null
  licenciaEstadoEmisor: string | null
  // Configuración de pagos
  pagoContratos: EDestinoPago | null
  pagoTaller: EDestinoPago | null
  pagoExtras: EDestinoPago | null
  // Facturación
  requiereFactura: boolean
  factRfc: string | null
  factRazonSocial: string | null
  factRegimenFiscal: string | null
  factUsoCfdi: string | null
  factEmail: string | null
  factCodigoPostal: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateConductorRequest {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  curp?: string
  telefono?: string
  email?: string
  direccion?: string
  codigoPostal?: string
  licenciaNumero?: string
  licenciaTipo?: ETipoLicencia
  licenciaVencimiento?: string
  licenciaEstadoEmisor?: string
  pagoContratos?: EDestinoPago
  pagoTaller?: EDestinoPago
  pagoExtras?: EDestinoPago
  requiereFactura?: boolean
  factRfc?: string
  factRazonSocial?: string
  factRegimenFiscal?: string
  factUsoCfdi?: string
  factEmail?: string
  factCodigoPostal?: string
}

export interface UpdateConductorRequest extends CreateConductorRequest {
  estatus: EEstatusConductor
}

// ── Referencias personales ─────────────────────────────────────
export interface ReferenciaPersonalDto {
  id: string
  conductorId: string
  empresaId: string
  orden: 1 | 2 | 3
  nombreCompleto: string
  relacion: string
  telefono: string | null
  email: string | null
}

export interface UpsertReferenciaRequest {
  nombreCompleto: string
  relacion: string
  telefono?: string
  email?: string
}

// ── Vehiculos ────────────────────────────────────────────────
export type EEstatusVehiculo = "Disponible" | "Arrendado" | "Mantenimiento" | "Baja"

export type ESmsProveedor = "Emnify" | "Twilio"

export interface VehiculoDto {
  id: string
  empresaId: string
  marca: string
  modelo: string
  anio: number
  placas: string | null
  vin: string | null
  color: string | null
  estatus: EEstatusVehiculo
  telefono: string | null
  // SMS host
  smsProveedor: ESmsProveedor | null
  smsId: string | null
  // Seguro
  seguroEmpresa: string | null
  seguroNumeroPoliza: string | null
  seguroFechaVencimiento: string | null
  seguroTipoPoliza: string | null
  seguroTelefono: string | null
  seguroComentarios: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateVehiculoRequest {
  marca: string
  modelo: string
  anio: number
  placas?: string
  vin?: string
  color?: string
  telefono?: string
  smsProveedor?: ESmsProveedor
  smsId?: string
  seguroEmpresa?: string
  seguroNumeroPoliza?: string
  seguroFechaVencimiento?: string
  seguroTipoPoliza?: string
  seguroTelefono?: string
  seguroComentarios?: string
}

export interface UpdateVehiculoRequest extends CreateVehiculoRequest {
  estatus: EEstatusVehiculo
}

// ── Tarifas ───────────────────────────────────────────────────
export interface TarifaDto {
  id: string
  empresaId: string
  nombre: string
  monto: number
  periodicidad: EPeriodicidad
  descripcion: string | null
  activa: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTarifaRequest {
  nombre: string
  monto: number
  periodicidad: EPeriodicidad
  descripcion?: string
  activa?: boolean
}

export interface UpdateTarifaRequest extends CreateTarifaRequest {}

// ── Contratos ─────────────────────────────────────────────────
export type EEstatusContrato = "Activo" | "Pausado" | "Cancelado" | "Finalizado"
export type EFormaPago = "Efectivo" | "Transferencia" | "Tarjeta" | "Cheque"
export type EPeriodicidad = "Semanal" | "Quincenal" | "Mensual" | "Bimestral"

/** Conductor summary embedded in a contract detail response */
export interface ContratoConductorDto {
  conductorId: string
  nombreCompleto: string
  estatus: EEstatusConductor
  telefono: string | null
  email: string | null
  licenciaNumero: string | null
  licenciaTipo: ETipoLicencia | null
  licenciaVencimiento: string | null
  licenciaEstadoEmisor: string | null
}

export interface ContratoDto {
  id: string
  empresaId: string
  conductorId: string
  nombreConductor: string
  vehiculoId: string
  descripcionVehiculo: string
  tarifaId: string
  nombreTarifa: string
  montoRenta: number
  periodicidad: EPeriodicidad
  fechaInicio: string
  fechaFin: string | null
  estatus: EEstatusContrato
  formaPago: EFormaPago
  observaciones: string | null
  conductoresCount: number
  createdAt: string
}

/** Full contract detail — includes all conductors assigned to it */
export interface ContratoDetailDto extends ContratoDto {
  conductores: ContratoConductorDto[]
}

export interface CreateContratoRequest {
  conductorId: string
  vehiculoId: string
  tarifaId: string
  fechaInicio: string
  fechaFin?: string
  formaPago: EFormaPago
  observaciones?: string
}

// ── Facturacion ───────────────────────────────────────────────
export type EEstatusPago = "Pendiente" | "PagadoParcial" | "Pagado" | "Vencido" | "Cancelado"

/** PagoContratoDto enriched with contract context for the list view */
export interface PagoListItemDto extends PagoContratoDto {
  nombreConductor: string
  conductoresCount: number
  descripcionVehiculo: string
  nombreTarifa: string
  formaPago: EFormaPago
}

export interface AgregarCargoRequest {
  pagoContratoId: string
  concepto: string
  monto: number
  fecha: string
}

export interface PagoContratoDto {
  id: string
  contratoId: string
  empresaId: string
  periodoInicio: string
  periodoFin: string
  montoTotal: number
  montoPagado: number
  saldoPendiente: number
  estatus: EEstatusPago
  fechaVencimiento: string | null
  createdAt: string
}

export interface PagoEmitidoDto {
  id: string
  pagoContratoId: string
  monto: number
  formaPago: string
  fechaPago: string
  referencia: string | null
  /** Enriched by the server when returning full contract history */
  periodoInicio?: string
  periodoFin?: string
}

export interface RegistrarPagoRequest {
  pagoContratoId: string
  monto: number
  formaPago: EFormaPago
  fechaPago: string
  referencia?: string
}

// ── Notificaciones ────────────────────────────────────────────
export type ENotificacionTipo = "Informativa" | "Urgente" | "Recordatorio" | "Promocional"

export interface NotificacionPlantillaDto {
  id: string
  empresaId: string
  titulo: string
  cuerpo: string
  tipo: ENotificacionTipo
  activa: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePlantillaRequest {
  titulo: string
  cuerpo: string
  tipo: ENotificacionTipo
  activa?: boolean
}

export interface UpdatePlantillaRequest extends CreatePlantillaRequest {
  activa: boolean
}

export interface EnviarNotificacionRequest {
  titulo: string
  cuerpo: string
  tipo: ENotificacionTipo
  /** "todos" sends to all active conductores; otherwise array of conductorIds */
  destinatarios: "todos" | string[]
}

export interface NotificacionEnviadaDto {
  id: string
  empresaId: string
  titulo: string
  cuerpo: string
  tipo: ENotificacionTipo
  totalDestinatarios: number
  /** Snapshot of conductor names at send time */
  nombresDestinatarios: string[]
  fechaEnvio: string
}

// ── Fotos ─────────────────────────────────────────────────────
export type EFotoCategoria = "Inventario" | "Exteriores" | "Interiores" | "Motor"

export interface FotoVehiculoDto {
  id: string
  vehiculoId: string
  empresaId: string
  categoria: EFotoCategoria
  nombre: string
  mimeType: string
  tamaño: number
  url: string | null
  creadoEn: string
}

// ── Documentos ────────────────────────────────────────────────
export interface DocumentoVehiculoDto {
  id: string
  vehiculoId: string
  empresaId: string
  nombre: string
  mimeType: string
  tamaño: number
  creadoEn: string
}

// ── API errors ────────────────────────────────────────────────
export interface ApiValidationError {
  errors: Record<string, string[]>
}

export interface ApiError {
  error: string
}

// ── Mantenimiento ─────────────────────────────────────────────
export type EEstatusMantenimiento = "Programado" | "EnProceso" | "Completado" | "Cancelado"

export interface TipoMantenimientoDto {
  id: string
  empresaId: string
  nombre: string
  descripcion: string | null
  esSiniestro: boolean
}

export interface MantenimientoDto {
  id: string
  empresaId: string
  vehiculoId: string
  descripcionVehiculo: string
  tipoMantenimientoId: string
  nombreTipo: string
  esSiniestro: boolean
  estatus: EEstatusMantenimiento
  fechaProgramada: string | null
  fechaReal: string | null
  proveedor: string | null
  costoEstimado: number | null
  costoReal: number | null
  createdAt: string
}

export interface CreateMantenimientoRequest {
  vehiculoId: string
  tipoMantenimientoId: string
  fechaProgramada?: string
  proveedor?: string
  costoEstimado?: number
}

export interface UpdateMantenimientoRequest extends CreateMantenimientoRequest {
  estatus: EEstatusMantenimiento
  fechaReal?: string
  costoReal?: number
}
