import { Link } from 'react-router-dom'

/**
 * Página 404 - Página no encontrada
 * Se muestra cuando el usuario accede a una ruta que no existe
 */
function NotFoundPage() {
  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <h2 className="mb-4">Página no encontrada</h2>
          <p className="text-muted mb-4">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

