/**
 * Tipos TypeScript del Sistema de Restaurante
 */

// === TIPOS DE USUARIO ===
export type RolUsuario = 'admin' | 'empleado' | 'cliente'
export type EstadoUsuario = 'activo' | 'inactivo'

export interface Usuario {
  id: number
  nombre: string
  apellido?: string
  correo: string
  rol: RolUsuario
  telefono?: string
  direccion?: string
  estado: EstadoUsuario
  fecha_registro?: string
}

// === TIPOS DE AUTENTICACIÓN ===
export interface LoginCredentials {
  correo: string
  password: string
}

export interface RegisterData {
  nombre: string
  apellido?: string
  correo: string
  telefono?: string
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
export type EstadoOrden = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
export type TipoServicio = 'mesa' | 'domicilio' | 'recoger'

export interface Orden {
  id: number
  usuario_id: number
  mesa_id?: number
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
  totalReservaciones: number
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

