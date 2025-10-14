import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'
import LoadingSpinner from './LoadingSpinner'
import type { ProtectedRouteProps } from '../types.ts'

/**
 * Componente HOC para proteger rutas
 * Solo permite acceso a usuarios autenticados
 * 
 * @param children - Componente hijo a renderizar si la validación es exitosa
 * @param requiredRole - Rol requerido para acceder a la ruta (opcional)
 * @param excludedRoles - Roles que NO pueden acceder a esta ruta (opcional)
 * 
 * Uso:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute requiredRole="admin">
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 * 
 * <Route path="/carrito" element={
 *   <ProtectedRoute excludedRoles={['admin']}>
 *     <CartPage />
 *   </ProtectedRoute>
 * } />
 * 
 * Fuente: https://reactrouter.com/en/main/start/overview
 */
function ProtectedRoute({ children, requiredRole, excludedRoles }: ProtectedRouteProps) {
  const { loading, estaAutenticado, tieneRol, usuario } = useAuth()

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

  // Si hay roles excluidos y el usuario tiene uno de esos roles
  if (excludedRoles && usuario?.rol && excludedRoles.includes(usuario.rol)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Acceso Restringido
          </h4>
          <p className="mb-3">
            Esta página no está disponible para usuarios con rol de <strong>{usuario.rol}</strong>.
          </p>
          <hr />
          <p className="mb-0">
            {usuario.rol === 'admin' ? (
              <>
                <i className="fas fa-info-circle me-2"></i>
                Como administrador, puedes acceder al <Link to="/dashboard" className="alert-link">Dashboard</Link> para 
                gestionar el restaurante. Si deseas realizar pedidos, crea una cuenta de cliente separada.
              </>
            ) : (
              <>Contacta al administrador si necesitas acceso.</>
            )}
          </p>
          <div className="mt-3">
            <Link to="/" className="btn btn-primary me-2">
              <i className="fas fa-home me-2"></i>
              Ir al Inicio
            </Link>
            {usuario.rol === 'admin' && (
              <Link to="/dashboard" className="btn btn-outline-primary">
                <i className="fas fa-chart-line me-2"></i>
                Ir al Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Si requiere un rol específico y el usuario no lo tiene
  if (requiredRole && !tieneRol(requiredRole)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">
            <i className="fas fa-ban me-2"></i>
            Acceso Denegado
          </h4>
          <p className="mb-3">No tienes permisos para acceder a esta página.</p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  // Si todo está bien, mostrar el componente hijo
  return <>{children}</>
}

export default ProtectedRoute

