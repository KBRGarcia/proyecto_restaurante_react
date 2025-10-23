import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config'

/**
 * Página de Recuperación de Contraseña
 * Permite a los usuarios recuperar su contraseña de forma simplificada
 * 
 * Flujo:
 * 1. Ingresar correo electrónico
 * 2. Verificar que el correo existe en la base de datos
 * 3. Ingresar nueva contraseña y confirmarla
 * 4. Actualizar la contraseña en el sistema
 * 5. Redirigir al login
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - React State: https://react.dev/learn/state-a-components-memory
 * - TypeScript con React: https://react.dev/learn/typescript
 */

type Step = 'email' | 'password'

function RecuperarPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estados para el formulario
  const [correo, setCorreo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()

  /**
   * Verificar que el correo existe en la base de datos
   */
  const verificarCorreo = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const url = `${API_ENDPOINTS.recuperarPassword}?action=verificar-correo`
      console.log('🔗 Verificando correo:', url)
      console.log('📧 Correo:', correo)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo })
      })
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('📦 Datos recibidos:', data)
      
      if (data.success) {
        setSuccess('Correo verificado correctamente. Ahora ingresa tu nueva contraseña.')
        setStep('password')
      } else {
        setError(data.message || 'El correo no está registrado en el sistema')
      }
    } catch (err) {
      console.error('❌ Error en verificarCorreo:', err)
      setError(`Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Actualizar contraseña
   */
  const actualizarPassword = async () => {
    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (nuevaPassword.length < 4 || nuevaPassword.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_ENDPOINTS.recuperarPassword}?action=actualizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          correo, 
          nueva_password: nuevaPassword 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('Contraseña actualizada exitosamente. Redirigiendo al login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.message || 'Error al actualizar la contraseña')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="fas fa-key fa-3x text-primary mb-3"></i>
                <h2 className="card-title">Recuperar Contraseña</h2>
                <p className="text-muted">
                  {step === 'email' && 'Ingresa tu correo electrónico registrado'}
                  {step === 'password' && 'Crea tu nueva contraseña'}
                </p>
              </div>

              {/* Indicador de progreso */}
              <div className="mb-4">
                <div className="d-flex justify-content-around">
                  <div className={`step-indicator ${step === 'email' ? 'active' : 'completed'}`}>
                    <i className="fas fa-envelope"></i>
                    <small>Verificar Correo</small>
                  </div>
                  <div className={`step-indicator ${step === 'password' ? 'active' : ''}`}>
                    <i className="fas fa-lock"></i>
                    <small>Nueva Contraseña</small>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Paso 1: Ingresar correo */}
              {step === 'email' && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      disabled={loading}
                    />
                    <small className="text-muted">
                      Ingresa el correo asociado a tu cuenta
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={verificarCorreo}
                    disabled={loading || !correo}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Verificando correo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Verificar Correo
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Paso 2: Nueva contraseña */}
              {step === 'password' && (
                <div>
                  <div className="alert alert-info mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Se actualizará la contraseña para: <strong>{correo}</strong>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nuevaPassword" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Nueva Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="nuevaPassword"
                        value={nuevaPassword}
                        onChange={(e) => setNuevaPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        minLength={4}
                        maxLength={10}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                    <small className="text-muted">4-10 caracteres</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmarPassword" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmarPassword"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        minLength={4}
                        maxLength={10}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                        title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-success w-100 mb-2"
                    onClick={actualizarPassword}
                    disabled={loading || !nuevaPassword || !confirmarPassword}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Actualizar Contraseña
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setStep('email')
                      setNuevaPassword('')
                      setConfirmarPassword('')
                      setError(null)
                      setSuccess(null)
                    }}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Cambiar Correo
                  </button>
                </div>
              )}

              <hr className="my-4" />

              {/* Enlaces */}
              <div className="text-center">
                <Link to="/login" className="text-decoration-none">
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver al Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .step-indicator.active {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .step-indicator.completed {
          background-color: #e8f5e8;
          color: #2e7d32;
        }
        
        .step-indicator i {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }
        
        .step-indicator small {
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default RecuperarPasswordPage
