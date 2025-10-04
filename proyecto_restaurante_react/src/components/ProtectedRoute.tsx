import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'
import LoadingSpinner from './LoadingSpinner.tsx'
import type { ProtectedRouteProps } from '../types.ts'

/**
 * Componente HOC para proteger rutas
 * Solo permite acceso a usuarios autenticados
 * 
 * Uso:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 */
function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { loading, estaAutenticado, tieneRol } = useAuth()

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner mensaje="Verificando sesión..." />
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />
  }

  // Si requiere un rol específico y el usuario no lo tiene
  if (requiredRole && !tieneRol(requiredRole)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Acceso Denegado</h4>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el componente hijo
  return <>{children}</>
}

export default ProtectedRoute

