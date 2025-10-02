import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'

/**
 * Componente de Navbar
 * Muestra el menú de navegación con opciones según el estado de autenticación
 */
function Navbar() {
  const { usuario, logout, estaAutenticado } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <i className="fas fa-utensils me-2"></i>
          Sabor & Tradición
        </Link>

        {/* Toggle para mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                <i className="fas fa-book-open me-1"></i>
                Menú
              </Link>
            </li>
            {estaAutenticado() && (
              <li className="nav-item">
                <Link className="nav-link" to="/mis-ordenes">
                  <i className="fas fa-receipt me-1"></i>
                  Mis Órdenes
                </Link>
              </li>
            )}
            {usuario?.rol === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  <i className="fas fa-chart-line me-1"></i>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Carrito y usuario */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/carrito">
                <i className="fas fa-shopping-cart fa-lg"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  0
                </span>
              </Link>
            </li>

            {estaAutenticado() ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {usuario?.nombre || 'Usuario'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="fas fa-user me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/configuracion">
                      <i className="fas fa-cog me-2"></i>
                      Configuración
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mis-ordenes">
                      <i className="fas fa-receipt me-2"></i>
                      Mis Órdenes
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm ms-2" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

