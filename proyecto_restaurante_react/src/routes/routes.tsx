import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.tsx'

// Importaciones directas (sin lazy loading para garantizar que funcione)
import HomePage from '../pages/HomePage.tsx'
import MenuPage from '../pages/MenuPage.tsx'
import SucursalesPage from '../pages/SucursalesPage.tsx'
import Login from '../components/Login.tsx'
import Register from '../components/Register.tsx'
import PasswordRecoveryPage from '../pages/PasswordRecoveryPage.tsx'
import PerfilPage from '../pages/PerfilPage.tsx'
import ConfiguracionPage from '../pages/ConfiguracionPage.tsx'
import CartPage from '../pages/CartPage.tsx'
import CheckoutPage from '../pages/CheckoutPage.tsx'
import MisOrdenesPage from '../pages/MisOrdenesPage.tsx'
import DashboardPage from '../pages/DashboardPage.tsx'
import TerminosPage from '../pages/TerminosPage.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

/**
 * Configuración Centralizada de Rutas
 * 
 * Este archivo contiene todas las rutas de la aplicación organizadas por categoría:
 * - Rutas públicas: accesibles para todos
 * - Rutas protegidas: requieren autenticación
 * - Rutas admin: requieren autenticación + rol admin
 * 
 * Fuente: https://reactrouter.com/en/main/start/tutorial
 */

/**
 * Rutas Públicas
 * No requieren autenticación
 */
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/sucursales" element={<SucursalesPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/recuperar-password" element={<PasswordRecoveryPage />} />
    <Route path="/terminos" element={<TerminosPage />} />
  </>
)

/**
 * Rutas Protegidas
 * Requieren que el usuario esté autenticado
 * 
 * Algunas rutas excluyen a usuarios admin ya que son funcionalidades
 * específicas para clientes (carrito, checkout, órdenes)
 */
export const protectedRoutes = (
  <>
    <Route 
      path="/perfil" 
      element={
        <ProtectedRoute>
          <PerfilPage />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/configuracion" 
      element={
        <ProtectedRoute>
          <ConfiguracionPage />
        </ProtectedRoute>
      } 
    />
    
    {/* Rutas exclusivas para clientes (admin no puede acceder) */}
    <Route 
      path="/carrito" 
      element={
        <ProtectedRoute excludedRoles={['admin']}>
          <CartPage />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/checkout" 
      element={
        <ProtectedRoute excludedRoles={['admin']}>
          <CheckoutPage />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/mis-ordenes" 
      element={
        <ProtectedRoute excludedRoles={['admin']}>
          <MisOrdenesPage />
        </ProtectedRoute>
      } 
    />
  </>
)

/**
 * Rutas Admin
 * Requieren autenticación + rol de administrador
 */
export const adminRoutes = (
  <>
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute requiredRole="admin">
          <DashboardPage />
        </ProtectedRoute>
      } 
    />
  </>
)

/**
 * Ruta 404
 * Se muestra cuando no se encuentra ninguna ruta
 */
export const notFoundRoute = (
  <Route 
    path="*" 
    element={<NotFoundPage />} 
  />
)

