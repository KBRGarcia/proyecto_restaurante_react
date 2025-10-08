import { Link } from 'react-router-dom'

/**
 * Página 404 - No Encontrada
 * Se muestra cuando el usuario intenta acceder a una ruta que no existe
 * 
 * Fuente: https://reactrouter.com/en/main/start/tutorial
 */
function NotFoundPage() {
  return (
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-lg-6 text-center">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle fa-5x text-warning mb-4"></i>
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-4">Página No Encontrada</h2>
            <p className="lead text-muted mb-4">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
          
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/" className="btn btn-danger btn-lg">
              <i className="fas fa-home me-2"></i>
              Ir al Inicio
            </Link>
            <Link to="/menu" className="btn btn-outline-danger btn-lg">
              <i className="fas fa-utensils me-2"></i>
              Ver Menú
            </Link>
          </div>
          
          <div className="mt-5">
            <p className="text-muted small">
              Si crees que esto es un error, por favor contacta al soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

