/**
 * Archivo de Configuración
 * Ajusta estas variables según tu entorno
 */

// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV

// URL base de tu proyecto en XAMPP
// IMPORTANTE: Ajusta esto según la ruta de tu proyecto
const XAMPP_PROJECT_PATH = '/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react'

// Construir URL base de la API
export const API_BASE_URL: string = isDevelopment
  ? `http://localhost${XAMPP_PROJECT_PATH}/server/api`
  : '/api'

// Endpoints específicos
export const API_ENDPOINTS = {
  // Productos
  productos: `${API_BASE_URL}/productos.php`,
  categorias: `${API_BASE_URL}/categorias.php`,
  
  // Autenticación
  login: `${API_BASE_URL}/auth/login.php`,
  register: `${API_BASE_URL}/auth/register.php`,
  logout: `${API_BASE_URL}/auth/logout.php`,
  me: `${API_BASE_URL}/auth/me.php`,
  uploadFoto: `${API_BASE_URL}/auth/upload-foto.php`,
  
  // Carrito
  carrito: `${API_BASE_URL}/carrito.php`,
  
  // Órdenes
  ordenes: `${API_BASE_URL}/ordenes.php`,
  ordenDetalle: (id: number) => `${API_BASE_URL}/ordenes.php?id=${id}`,
  crearOrden: `${API_BASE_URL}/ordenes.php`,
  cancelarOrden: (id: number) => `${API_BASE_URL}/ordenes.php?id=${id}`,
  
  // Admin Dashboard
  adminEstadisticas: `${API_BASE_URL}/admin/dashboard.php?action=estadisticas`,
  adminUsuarios: `${API_BASE_URL}/admin/dashboard.php?action=usuarios`,
  adminTopUsuarios: `${API_BASE_URL}/admin/dashboard.php?action=top-usuarios`,
  adminOrdenesRecientes: `${API_BASE_URL}/admin/dashboard.php?action=ordenes-recientes`,
  adminBanearUsuario: `${API_BASE_URL}/admin/dashboard.php?action=banear-usuario`,
  adminEliminarUsuario: `${API_BASE_URL}/admin/dashboard.php?action=eliminar-usuario`,
} as const

// Configuración general
export const CONFIG = {
  appName: 'Sabor & Tradición',
  version: '2.0.0',
  apiTimeout: 10000, // 10 segundos
} as const

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  CONFIG,
}

