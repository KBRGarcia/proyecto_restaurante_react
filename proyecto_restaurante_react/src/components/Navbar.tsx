import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'
import { useTheme } from '../contexts/ThemeContext.tsx'
import type { ColorPalette } from '../types'

/**
 * Componente de Navbar
 * Muestra el menú de navegación con opciones según el estado de autenticación
 * 
 * Fuente: https://react-bootstrap.github.io/components/navbar/
 */
function Navbar() {
  const { usuario, logout, estaAutenticado } = useAuth()
  const { theme, toggleThemeMode, setColorPalette } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Funciones auxiliares para paletas
  const getPaletteColor = (palette: string) => {
    const colors = {
      default: '#dc3545',
      gray: '#6c757d',
      black: '#000000',
      pink: '#e91e63',
      blue: '#2196f3',
      green: '#4caf50'
    }
    return colors[palette as keyof typeof colors] || '#dc3545'
  }

  const getPaletteName = (palette: string) => {
    const names = {
      default: 'Por Defecto',
      gray: 'Gris',
      black: 'Negro',
      pink: 'Rosa',
      blue: 'Azul',
      green: 'Verde'
    }
    return names[palette as keyof typeof names] || 'Por Defecto'
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        {/* Logo */}
        <span className="navbar-brand">
          <i className="fas fa-utensils me-2"></i>
          Sabor & Tradición
        </span>

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
            <li className="nav-item">
              <Link className="nav-link" to="/sucursales">
                <i className="fas fa-store me-1"></i>
                Sucursales
              </Link>
            </li>
            {/* Solo mostrar "Mis Órdenes" para usuarios NO admin */}
            {estaAutenticado() && usuario?.rol !== 'admin' && (
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

          {/* Usuario */}
          <ul className="navbar-nav">

            {estaAutenticado() ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {usuario?.foto_perfil ? (
                    <img 
                      src={usuario.foto_perfil} 
                      alt="Foto de perfil" 
                      className="rounded-circle me-2"
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        objectFit: 'cover',
                        border: '2px solid white'
                      }}
                    />
                  ) : (
                    <i className="fas fa-user-circle me-1"></i>
                  )}
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
                  {/* Solo mostrar "Mis Órdenes" para usuarios NO admin */}
                  {usuario?.rol !== 'admin' && (
                    <li>
                      <Link className="dropdown-item" to="/mis-ordenes">
                        <i className="fas fa-receipt me-2"></i>
                        Mis Órdenes
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  {/* Selector de Temas integrado como opciones del menú */}
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center justify-content-between"
                      onClick={toggleThemeMode}
                    >
                      <span>
                        <i className={`fas fa-${theme.mode === 'light' ? 'moon' : 'sun'} me-2`}></i>
                        {theme.mode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                      </span>
                    </button>
                  </li>
                  <li>
                    <div className="dropdown-item">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>
                          <i className="fas fa-palette me-2"></i>
                          Paleta: {theme.palette === 'default' ? 'Por Defecto' :
                                   theme.palette === 'gray' ? 'Gris' :
                                   theme.palette === 'black' ? 'Negro' :
                                   theme.palette === 'pink' ? 'Rosa' :
                                   theme.palette === 'blue' ? 'Azul' :
                                   theme.palette === 'green' ? 'Verde' : 'N/A'}
                        </span>
                        <div 
                          className="palette-preview-small" 
                          style={{ backgroundColor: getPaletteColor(theme.palette) }}
                        ></div>
                      </div>
                      <div className="palette-options-inline mt-2">
                        {['default', 'gray', 'black', 'pink', 'blue', 'green'].map(palette => (
                          <button
                            key={palette}
                            className={`palette-option-small ${theme.palette === palette ? 'active' : ''}`}
                            onClick={() => setColorPalette(palette as ColorPalette)}
                            style={{ backgroundColor: getPaletteColor(palette) }}
                            title={getPaletteName(palette)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </li>
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
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="guestDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-1"></i>
                  Usuario
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/login">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/register">
                      <i className="fas fa-user-plus me-2"></i>
                      Registrarse
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {/* Selector de Temas integrado como opciones del menú */}
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center justify-content-between"
                      onClick={toggleThemeMode}
                    >
                      <span>
                        <i className={`fas fa-${theme.mode === 'light' ? 'moon' : 'sun'} me-2`}></i>
                        {theme.mode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                      </span>
                    </button>
                  </li>
                  <li>
                    <div className="dropdown-item">
                      <div className="d-flex align-items-center justify-content-between">
                        <span>
                          <i className="fas fa-palette me-2"></i>
                          Paleta: {getPaletteName(theme.palette)}
                        </span>
                        <div 
                          className="palette-preview-small" 
                          style={{ backgroundColor: getPaletteColor(theme.palette) }}
                        ></div>
                      </div>
                      <div className="palette-options-inline mt-2">
                        {['default', 'gray', 'black', 'pink', 'blue', 'green'].map(palette => (
                          <button
                            key={palette}
                            className={`palette-option-small ${theme.palette === palette ? 'active' : ''}`}
                            onClick={() => setColorPalette(palette as ColorPalette)}
                            style={{ backgroundColor: getPaletteColor(palette) }}
                            title={getPaletteName(palette)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

