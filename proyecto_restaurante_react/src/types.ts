// === TIPOS PARA SISTEMA DE TEMAS ===

export type ThemeMode = 'light' | 'dark'

export type ColorPalette = 
  | 'default'    // Paleta actual (rojo/primary)
  | 'gray'       // Paleta gris
  | 'black'      // Paleta negro
  | 'pink'       // Paleta rosa
  | 'blue'       // Paleta azul
  | 'green'      // Paleta verde

export interface ThemeColors {
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  light: string
  dark: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  shadow: string
}

export interface ThemeConfig {
  mode: ThemeMode
  palette: ColorPalette
  colors: ThemeColors
}

// === TIPOS DE USUARIO ===

export type RolUsuario = 'admin' | 'empleado' | 'cliente'

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  correo: string
  telefono: string
  rol: RolUsuario
  estado: 'activo' | 'inactivo' | 'baneado'
  foto_perfil?: string
  fecha_registro: string
  ultima_conexion?: string
  direccion?: string
  codigo_area?: string
  numero_telefono?: string
}

// === TIPOS DE AUTENTICACIÓN ===

export interface AuthContextType {
  usuario: Usuario | null
  estaAutenticado: () => boolean
  login: (correo: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<AuthResponse>
  loading: boolean
  tieneRol: (rol: RolUsuario) => boolean
  actualizarUsuario: (usuario: Usuario) => void
  error?: string
}

export interface LoginCredentials {
  correo: string
  password: string
}

export interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  telefono: string
  password: string
  confirmarPassword: string
  codigo_area?: string
  numero_telefono?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  usuario?: Usuario
}

// === TIPOS DE PRODUCTOS ===

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria_id: number
  imagen: string | null
  disponible: boolean
  destacado: boolean
  fecha_creacion: string
  categoria?: Categoria
  estado?: 'activo' | 'inactivo' | 'agotado'
  tiempo_preparacion?: number
  ingredientes?: string
  es_especial?: boolean
  categoria_nombre?: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
}

// === TIPOS DE CARRITO ===

export interface ItemCarrito {
  id: number
  producto: Producto
  cantidad: number
  precio: number
  imagen: string
  nombre: string
  descripcion: string
  tiempo_preparacion?: number
  notas?: string
}

export interface CartContextType {
  items: ItemCarrito[]
  cantidadTotal: number
  precioTotal: number
  subtotal: number
  impuestos: number
  total: number
  agregarItem: (producto: Producto, cantidad?: number) => void
  removerItem: (productoId: number) => void
  actualizarCantidad: (productoId: number, cantidad: number) => void
  limpiarCarrito: () => void
  eliminarItem: (productoId: number) => void
  vaciarCarrito: () => void
  estaEnCarrito: (productoId: number) => boolean
}

// === TIPOS DE ÓRDENES ===

export type EstadoOrden = 'pendiente' | 'preparando' | 'listo' | 'en_camino' | 'entregado' | 'cancelado'
export type TipoServicio = 'domicilio' | 'recoger'

export interface OrdenDetalle {
  id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  notas_producto?: string
  producto_nombre: string
  producto_descripcion?: string
  producto_imagen?: string
}

export interface Orden {
  id: number
  usuario_id: number
  productos?: Array<{
    producto_id: number
    cantidad: number
    precio_unitario: number
    subtotal: number
    producto?: Producto
  }>
  detalles?: OrdenDetalle[]
  total: number
  estado: EstadoOrden
  tipo_servicio: TipoServicio
  direccion?: string
  telefono?: string
  notas?: string
  fecha_creacion: string
  fecha_actualizacion: string
  fecha_orden: string
  usuario?: Usuario
  usuario_nombre?: string
  usuario_apellido?: string
  fecha_entrega_estimada?: string
  direccion_entrega?: string
  telefono_contacto?: string
  notas_especiales?: string
  fecha_preparando?: string
  fecha_listo?: string
  fecha_en_camino?: string
  fecha_entregado?: string
  fecha_cancelado?: string
  subtotal?: number
  impuestos?: number
}

// === TIPOS DE PAGOS ===

export type MetodoPagoInternacional = 'tarjeta' | 'paypal' | 'zinli' | 'zelle'
export type MetodoPagoNacional = 'pago_movil' | 'transferencia' | 'fisico'
export type MetodoPago = MetodoPagoInternacional | MetodoPagoNacional
export type TipoMoneda = 'USD' | 'VES' | 'internacional' | 'nacional'

export interface DatosTarjeta {
  numeroTarjeta: string
  nombre: string
  fecha_expiracion: string
  fechaExpiracion: string
  nombreTitular: string
  tipoTarjeta?: string
  cvv: string
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

export interface DatosPagoMovil {
  banco: BancoVenezuela
  telefono: string
  cedula: string
  tipoCedula?: 'V' | 'E' | 'J'
  numeroReferencia?: string
  fechaPago?: string
}

export interface DatosTransferencia {
  banco: BancoVenezuela
  numero_cuenta: string
  cedula: string
  tipoCedula?: 'V' | 'E' | 'J'
  nombre_titular: string
  telefono?: string
  numeroReferencia?: string
  fechaPago?: string
}

export interface DatosPagoFisico {
  metodo: 'efectivo' | 'pos'
  horarioAtencion?: string
  direccionRestaurante?: string
  limiteTiempo?: number
}

export type BancoVenezuela = 
  | 'banco_de_venezuela'
  | 'banco_mercantil'
  | 'banco_provincial'
  | 'banco_bicentenario'
  | 'banco_venezuela'
  | 'banco_del_tesoro'
  | 'banco_agrario'
  | 'banco_caroni'
  | 'banco_exterior'
  | 'banco_plaza'
  | 'banco_sofitasa'
  | 'banco_100_por_ciento_banco'
  | 'banco_activo'
  | 'banco_banesco'
  | 'banco_banplus'
  | 'banco_central_de_venezuela'
  | 'banco_citibank'
  | 'banco_de_america_latina'
  | 'banco_de_la_gente'
  | 'banco_de_los_trabajadores'
  | 'banco_del_pueblo_soberano'
  | 'banco_familias'
  | 'banco_fondo_comun'
  | 'banco_internacional'
  | 'banco_lara'
  | 'banco_nacional_de_credito'
  | 'banco_occidental_de_descuento'
  | 'banco_territorial'
  | 'banco_union'
  | 'banco_vzla'
  | 'banco_zerpa'
  | 'banco_otro'
  | 'provincial'
  | 'mercantil'
  | 'banesco'
  | 'bnc'
  | 'bdv'
  | 'venezolano'

// === TIPOS DE COMPONENTES ===

export interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void
  mostrarBotonCompra?: boolean
  modoAdmin?: boolean
  onEdit?: (producto: Producto) => void
  onDelete?: (productoId: number) => Promise<void>
}

export interface FilterBarProps {
  categorias: Categoria[]
  categoriaActiva: number | null
  onCategoriaChange: (categoria: number | null) => void
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  mensaje?: string
}

export interface ErrorMessageProps {
  mensaje: string
  tipo?: 'error' | 'warning' | 'info'
  onRetry?: () => Promise<void>
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: RolUsuario
  excludedRoles?: string[]
}

// === TIPOS DE DASHBOARD ===

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
  codigo_area?: string
  numero_telefono?: string
}

export interface TopUsuario {
  id: number
  nombre: string
  apellido: string
  correo: string
  total_gastado: number
  total_ordenes: number
}

// === TIPOS DE PERFIL ===

export interface PerfilFormData {
  nombre: string
  apellido: string
  telefono: string
  direccion?: string
}

export interface Estadisticas {
  total_ordenes: number
  total_gastado: number
  ultima_orden: string
  ordenes_mes_actual: number
  totalOrdenes?: number
  totalGastado?: number
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

// === TIPOS DE REGISTRO ===

export type CodigoArea = '0414' | '0424' | '0412' | '0416' | '0426'

// === TIPOS DE API ===

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// === TIPOS DE CURRENCY SELECTOR ===

export interface TipoMonedaConfig {
  codigo: string
  nombre: string
  simbolo: string
  tasa_cambio: number
}