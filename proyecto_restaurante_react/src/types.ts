/**
 * Tipos TypeScript del Sistema de Restaurante
 */

// === TIPOS DE USUARIO ===
export type RolUsuario = 'admin' | 'empleado' | 'cliente'
export type EstadoUsuario = 'activo' | 'inactivo'

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  correo: string
  rol: RolUsuario
  codigo_area?: string
  numero_telefono?: string
  direccion?: string
  foto_perfil?: string
  estado: EstadoUsuario
  fecha_registro?: string
}

// === TIPOS DE AUTENTICACIÓN ===
export interface LoginCredentials {
  correo: string
  password: string
}

// === TIPOS DE VALIDACIÓN ===
export type CodigoArea = '0414' | '0424' | '0412' | '0416' | '0426'

export interface ValidationRules {
  nombre: {
    minLength: number
    maxLength: number
    pattern: RegExp
  }
  apellido: {
    minLength: number
    maxLength: number
    pattern: RegExp
  }
  password: {
    minLength: number
    maxLength: number
  }
  numero_telefono: {
    length: number
    pattern: RegExp
  }
}

export interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  codigo_area: string
  numero_telefono: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  usuario?: Usuario
}

export interface AuthContextType {
  usuario: Usuario | null
  loading: boolean
  error: string | null
  login: (correo: string, password: string) => Promise<AuthResponse>
  register: (datos: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  tieneRol: (rol: RolUsuario) => boolean
  estaAutenticado: () => boolean
  actualizarUsuario: () => Promise<void>
}

// === TIPOS DE PRODUCTOS ===
export type EstadoProducto = 'activo' | 'inactivo' | 'agotado'

export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio: string | number
  categoria_id: number
  categoria_nombre?: string
  imagen?: string
  estado: EstadoProducto
  tiempo_preparacion?: number
  ingredientes?: string
  es_especial?: boolean
  fecha_creacion?: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  imagen?: string
  estado?: string
  orden_mostrar?: number
}

// === TIPOS DE RESPUESTA DE API ===
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

// === TIPOS DE COMPONENTES ===
export interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void | Promise<void>
  mostrarBotonCompra?: boolean
  onEdit?: (producto: Producto) => void
  onDelete?: (productoId: number) => Promise<void>
  modoAdmin?: boolean
}

export interface FilterBarProps {
  categorias: Categoria[]
  categoriaActiva: number | null
  onCategoriaChange: (categoriaId: number | null) => void
}

export interface LoadingSpinnerProps {
  mensaje?: string
}

export interface ErrorMessageProps {
  mensaje: string
  onRetry?: () => void
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: RolUsuario
  excludedRoles?: RolUsuario[]
}

// === TIPOS DE CARRITO ===
export interface ItemCarrito {
  id: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
  descripcion?: string
  tiempo_preparacion?: number
}

export interface CartContextType {
  items: ItemCarrito[]
  cantidadTotal: number
  subtotal: number
  impuestos: number
  total: number
  agregarItem: (producto: Producto, cantidad?: number) => void
  eliminarItem: (productoId: number) => void
  actualizarCantidad: (productoId: number, cantidad: number) => void
  vaciarCarrito: () => void
  estaEnCarrito: (productoId: number) => boolean
  obtenerCantidad: (productoId: number) => number
}

// === TIPOS DE ÓRDENES ===
export type EstadoOrden = 'pendiente' | 'preparando' | 'listo' | 'en_camino' | 'entregado' | 'cancelado'
export type TipoServicio = 'domicilio' | 'recoger'

export interface Orden {
  id: number
  usuario_id: number
  estado: EstadoOrden
  tipo_servicio: TipoServicio
  subtotal: number
  impuestos: number
  total: number
  direccion_entrega?: string
  telefono_contacto?: string
  notas_especiales?: string
  fecha_orden: string
  fecha_entrega_estimada?: string
  empleado_asignado_id?: number
  // Campos de timestamps para seguimiento
  fecha_pendiente?: string
  fecha_preparando?: string
  fecha_listo?: string
  fecha_en_camino?: string
  fecha_entregado?: string
  fecha_cancelado?: string
  // Campos adicionales para el dashboard
  usuario_nombre?: string
  usuario_apellido?: string
}

// === TIPOS DE PERFIL ===
export interface PerfilFormData {
  nombre: string
  apellido: string
  telefono: string
  direccion: string
}

export interface Estadisticas {
  totalOrdenes: number
  totalGastado: number
}

// === TIPOS DE CONFIGURACIÓN ===
export interface PasswordData {
  passwordActual: string
  passwordNueva: string
  passwordConfirmacion: string
}

export interface PasswordStrength {
  strength: number
  text: string
  color: string
}

export interface ShowPasswordState {
  actual: boolean
  nueva: boolean
  confirmacion: boolean
}

// === TIPOS DE PAGO ===
export type TipoMoneda = 'nacional' | 'internacional'
export type MetodoPagoInternacional = 'tarjeta' | 'paypal' | 'zinli' | 'zelle'
export type MetodoPagoNacional = 'pago_movil' | 'transferencia' | 'fisico'
export type MetodoPago = MetodoPagoInternacional | MetodoPagoNacional
export type TipoTarjeta = 'visa' | 'mastercard'
export type BancoVenezuela = 'provincial' | 'mercantil' | 'banesco' | 'bnc' | 'bdv' | 'venezolano'

export interface DatosTarjeta {
  numeroTarjeta: string
  nombreTitular: string
  fechaExpiracion: string
  cvv: string
  tipoTarjeta?: TipoTarjeta
}

export interface DatosPayPal {
  correo: string
  password: string
}

export interface DatosZinli {
  numeroTelefono: string
  pin: string
}

export interface DatosZelle {
  correoZelle: string
  nombreCompleto: string
}

// Datos para métodos de pago nacionales
export interface DatosPagoMovil {
  cedula: string
  telefono: string
  banco: BancoVenezuela
  numeroReferencia: string
  fechaPago: string
}

export interface DatosTransferencia {
  cedula: string
  telefono: string
  banco: BancoVenezuela
  numeroReferencia: string
  fechaPago: string
}

export interface DatosPagoFisico {
  // No requiere datos adicionales, solo información del restaurante
  horarioAtencion: string
  direccionRestaurante: string
  limiteTiempo: number // en horas
}

export interface DatosPago {
  metodoPago: MetodoPago
  tipoMoneda?: TipoMoneda
  tarjeta?: DatosTarjeta
  paypal?: DatosPayPal
  zinli?: DatosZinli
  zelle?: DatosZelle
  pagoMovil?: DatosPagoMovil
  transferencia?: DatosTransferencia
  pagoFisico?: DatosPagoFisico
}

export interface ResultadoPago {
  success: boolean
  mensaje: string
  transaccionId?: string
  fecha?: string
}

// === TIPOS DE DASHBOARD ADMINISTRATIVO ===
export interface EstadisticasDashboard {
  totalUsuarios: number
  totalOrdenes: number
  totalIngresos: number
  ordenesHoy: number
  ingresosHoy: number
  nuevosusuarios: number
  promedioOrden: number
}

export interface UsuarioAdmin extends Usuario {
  total_gastado?: number
  total_ordenes?: number
  ultima_orden?: string
}

export interface TopUsuario {
  id: number
  nombre: string
  apellido: string
  correo: string
  total_gastado: number
  total_ordenes: number
}

export interface ProductoPopular {
  id: number
  nombre: string
  categoria: string
  veces_pedido: number
  ingresos_generados: number
}

