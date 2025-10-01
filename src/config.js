/**
 * Archivo de Configuración
 * Ajusta estas variables según tu entorno
 */

// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV

// URL base de tu proyecto en XAMPP
// IMPORTANTE: Ajusta esto según la ruta de tu proyecto
const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'

// Construir URL base de la API
export const API_BASE_URL = isDevelopment
  ? `http://localhost${XAMPP_PROJECT_PATH}/api`
  : '/api'

// Endpoints específicos
export const API_ENDPOINTS = {
  productos: `${API_BASE_URL}/productos.php`,
  categorias: `${API_BASE_URL}/categorias.php`,
  carrito: `${API_BASE_URL}/carrito.php`,
}

// Configuración general
export const CONFIG = {
  appName: 'Sabor & Tradición',
  version: '1.0.0',
  apiTimeout: 10000, // 10 segundos
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  CONFIG,
}

