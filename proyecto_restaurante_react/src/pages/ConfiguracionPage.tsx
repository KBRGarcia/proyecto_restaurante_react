import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { useTheme } from '../contexts/ThemeContext.tsx'
import { API_ENDPOINTS } from '../config'
import ErrorMessage from '../components/ErrorMessage.tsx'
import ThemeSelector from '../components/ThemeSelector.tsx'
import { Link } from 'react-router-dom'
import type { PasswordData, PasswordStrength, ShowPasswordState } from '../types'

/**
 * Página de Configuración del Usuario
 * Permite cambiar contraseña y ajustes de cuenta
 */
function ConfiguracionPage() {
  const { usuario } = useAuth()
  const { theme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState<PasswordData>({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmacion: ''
  })
  
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 0,
    text: '',
    color: ''
  })
  
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    actual: false,
    nueva: false,
    confirmacion: false
  })

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Calcular fortaleza de contraseña para la nueva
    if (name === 'passwordNueva') {
      calcularFortaleza(value)
    }
  }

  const calcularFortaleza = (password: string) => {
    let strength = 0
    
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    let text = ''
    let color = ''
    
    if (strength <= 2) {
      text = 'Débil'
      color = 'danger'
    } else if (strength <= 4) {
      text = 'Media'
      color = 'warning'
    } else {
      text = 'Fuerte'
      color = 'success'
    }
    
    setPasswordStrength({ strength, text, color })
  }

  const togglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validaciones
    if (!passwordData.passwordActual || !passwordData.passwordNueva || !passwordData.passwordConfirmacion) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (passwordData.passwordNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordData.passwordNueva !== passwordData.passwordConfirmacion) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.passwordActual === passwordData.passwordNueva) {
      setError('La nueva contraseña debe ser diferente a la actual')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_ENDPOINTS.me}/cambiar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordActual: passwordData.passwordActual,
          passwordNueva: passwordData.passwordNueva
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Contraseña actualizada exitosamente')
        setPasswordData({
          passwordActual: '',
          passwordNueva: '',
          passwordConfirmacion: ''
        })
        setTimeout(() => setSuccess(null), 5000)
      } else {
        setError(data.message || 'Error al cambiar la contraseña')
      }
    } catch (err) {
      setError('Error de conexión al cambiar la contraseña')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const passwordsCoinciden = passwordData.passwordNueva === passwordData.passwordConfirmacion && passwordData.passwordConfirmacion.length > 0

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Menú lateral */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Configuración
              </h6>
            </div>
            <div className="list-group list-group-flush">
              <a href="#cambiar-password" className="list-group-item list-group-item-action">
                <i className="fas fa-key me-2 text-danger"></i>
                Seguridad
              </a>
              <a href="#apariencia" className="list-group-item list-group-item-action">
                <i className="fas fa-palette me-2 text-primary"></i>
                Apariencia
              </a>
              <a href="#notificaciones" className="list-group-item list-group-item-action">
                <i className="fas fa-bell me-2 text-warning"></i>
                Notificaciones
              </a>
              <a href="#privacidad" className="list-group-item list-group-item-action">
                <i className="fas fa-shield-alt me-2 text-success"></i>
                Privacidad
              </a>
              <Link to="/perfil" className="list-group-item list-group-item-action">
                <i className="fas fa-user me-2 text-primary"></i>
                Volver al Perfil
              </Link>
            </div>
          </div>

          {/* Info del usuario */}
          <div className="card shadow-sm mt-3">
            <div className="card-body text-center">
              <i className="fas fa-user-circle fa-3x text-danger mb-2"></i>
              <h6>{usuario?.nombre} {usuario?.apellido}</h6>
              <small className="text-muted">{usuario?.correo}</small>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="col-lg-9">
          <h2 className="mb-4">
            <i className="fas fa-cog me-2 text-danger"></i>
            Configuración de la Cuenta
          </h2>

          {error && <ErrorMessage mensaje={error} />}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              <i className="fas fa-check-circle me-2"></i>
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccess(null)}
              ></button>
            </div>
          )}

          {/* Sección: Cambiar Contraseña */}
          <div className="card shadow-sm mb-4" id="cambiar-password">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-key me-2"></i>
                Cambiar Contraseña
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Por seguridad, te recomendamos usar una contraseña fuerte con al menos 6 caracteres.
              </p>

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    Contraseña Actual
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.actual ? 'text' : 'password'}
                      className="form-control"
                      name="passwordActual"
                      value={passwordData.passwordActual}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility('actual')}
                    >
                      <i className={`fas fa-${showPassword.actual ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-key me-2"></i>
                    Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.nueva ? 'text' : 'password'}
                      className="form-control"
                      name="passwordNueva"
                      value={passwordData.passwordNueva}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility('nueva')}
                    >
                      <i className={`fas fa-${showPassword.nueva ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                  {passwordData.passwordNueva && (
                    <div className="mt-2">
                      <small className="text-muted">Fortaleza de la contraseña:</small>
                      <div className="progress" style={{ height: '5px' }}>
                        <div
                          className={`progress-bar bg-${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <small className={`text-${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </small>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-check-circle me-2"></i>
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword.confirmacion ? 'text' : 'password'}
                      className="form-control"
                      name="passwordConfirmacion"
                      value={passwordData.passwordConfirmacion}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmacion')}
                    >
                      <i className={`fas fa-${showPassword.confirmacion ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                  {passwordData.passwordConfirmacion && (
                    <div className="mt-2">
                      {passwordsCoinciden ? (
                        <small className="text-success">
                          <i className="fas fa-check-circle"></i> Las contraseñas coinciden
                        </small>
                      ) : (
                        <small className="text-danger">
                          <i className="fas fa-times-circle"></i> Las contraseñas no coinciden
                        </small>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Actualizar Contraseña
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sección: Apariencia */}
          <div className="card shadow-sm mb-4" id="apariencia">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-palette me-2"></i>
                Apariencia y Temas
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Personaliza la apariencia de la aplicación según tus preferencias.
              </p>

              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">Configuración Actual</h6>
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span><i className="fas fa-sun me-2"></i>Modo:</span>
                      <span className={`badge bg-${theme.mode === 'light' ? 'warning' : 'dark'}`}>
                        {theme.mode === 'light' ? 'Claro' : 'Oscuro'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span><i className="fas fa-palette me-2"></i>Paleta:</span>
                      <span className="badge bg-primary">
                        {theme.palette === 'default' ? 'Por Defecto' :
                         theme.palette === 'gray' ? 'Gris' :
                         theme.palette === 'black' ? 'Negro' :
                         theme.palette === 'pink' ? 'Rosa' :
                         theme.palette === 'blue' ? 'Azul' :
                         theme.palette === 'green' ? 'Verde' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h6 className="mb-3">Cambiar Configuración</h6>
                  <div className="p-3 border rounded">
                    <ThemeSelector />
                  </div>
                </div>
              </div>

              <div className="alert alert-info mt-3">
                <i className="fas fa-lightbulb me-2"></i>
                <small>
                  Los cambios de apariencia se aplican inmediatamente y se guardan automáticamente 
                  para tu próxima visita.
                </small>
              </div>
            </div>
          </div>

          {/* Sección: Notificaciones */}
          <div className="card shadow-sm mb-4" id="notificaciones">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Preferencias de Notificaciones
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Configura cómo y cuándo quieres recibir notificaciones.
              </p>

              <h6 className="mb-3">Notificaciones por Correo</h6>

              <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" id="notif_ordenes" defaultChecked />
                <label className="form-check-label" htmlFor="notif_ordenes">
                  <i className="fas fa-shopping-bag me-2 text-primary"></i>
                  Actualizaciones de órdenes
                </label>
              </div>

              <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" id="notif_reservaciones" defaultChecked />
                <label className="form-check-label" htmlFor="notif_reservaciones">
                  <i className="fas fa-calendar-check me-2 text-success"></i>
                  Confirmaciones de reservaciones
                </label>
              </div>

              <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" id="notif_promociones" defaultChecked />
                <label className="form-check-label" htmlFor="notif_promociones">
                  <i className="fas fa-tag me-2 text-danger"></i>
                  Promociones y ofertas especiales
                </label>
              </div>

              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="notif_newsletter" />
                <label className="form-check-label" htmlFor="notif_newsletter">
                  <i className="fas fa-newspaper me-2 text-info"></i>
                  Boletín informativo semanal
                </label>
              </div>

              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <small>Las preferencias de notificaciones se guardarán automáticamente.</small>
              </div>
            </div>
          </div>

          {/* Sección: Privacidad */}
          <div className="card shadow-sm mb-4" id="privacidad">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                Privacidad y Seguridad
              </h5>
            </div>
            <div className="card-body">
              <h6 className="mb-3">Información de la Cuenta</h6>

              <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p className="mb-1 fw-bold">
                    <i className="fas fa-user-shield me-2 text-success"></i>
                    Estado de la Cuenta
                  </p>
                  <small className="text-muted">
                    Tu cuenta está{' '}
                    <span className={`badge bg-${usuario?.estado === 'activo' ? 'success' : 'danger'}`}>
                      {usuario?.estado ? usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1) : 'N/A'}
                    </span>
                  </small>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p className="mb-1 fw-bold">
                    <i className="fas fa-envelope me-2 text-primary"></i>
                    Correo Verificado
                  </p>
                  <small className="text-muted">{usuario?.correo}</small>
                </div>
                <span className="badge bg-success">
                  <i className="fas fa-check"></i> Verificado
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p className="mb-1 fw-bold">
                    <i className="fas fa-fingerprint me-2 text-warning"></i>
                    ID de Usuario
                  </p>
                  <small className="text-muted">#{usuario?.id}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Información del Sistema
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p className="mb-1">
                    <i className="fas fa-calendar-alt me-2 text-primary"></i>
                    <strong>Miembro desde:</strong>
                  </p>
                  <p className="text-muted">
                    {usuario?.fecha_registro ? 
                      new Date(usuario.fecha_registro).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      'N/A'
                    }
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="mb-1">
                    <i className="fas fa-user-tag me-2 text-success"></i>
                    <strong>Tipo de Cuenta:</strong>
                  </p>
                  <p>
                    <span className={`badge bg-${
                      usuario?.rol === 'admin' ? 'danger' : 
                      usuario?.rol === 'empleado' ? 'warning' : 'primary'
                    }`}>
                      {usuario?.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionPage

