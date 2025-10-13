import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config'

/**
 * Página de Recuperación de Contraseña
 * Permite a los usuarios recuperar su contraseña mediante código por correo
 * 
 * Flujo:
 * 1. Ingresar correo electrónico
 * 2. Verificar código de 6 dígitos (60 segundos)
 * 3. Crear nueva contraseña
 * 4. Redirigir al login
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - React State: https://react.dev/learn/state-a-components-memory
 * - TypeScript con React: https://react.dev/learn/typescript
 */

type Step = 'email' | 'code' | 'password'

function RecuperarPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estados para el formulario
  const [correo, setCorreo] = useState('')
  const [codigo, setCodigo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados para el temporizador
  const [timeLeft, setTimeLeft] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Efecto para el temporizador
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      setCanResend(true)
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timerActive, timeLeft])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  /**
   * Solicitar código de recuperación
   */
  const solicitarCodigo = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = `${API_ENDPOINTS.recuperarPassword}?action=solicitar`
      console.log('🔗 URL de solicitud:', url)
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
        setSuccess('Código enviado a tu correo electrónico')
        setStep('code')
        setTimeLeft(60)
        setTimerActive(true)
        setCanResend(false)
      } else {
        setError(data.message || 'Error al enviar el código')
      }
    } catch (err) {
      console.error('❌ Error en solicitarCodigo:', err)
      setError(`Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reenviar código
   */
  const reenviarCodigo = async () => {
    setCanResend(false)
    setTimeLeft(60)
    setTimerActive(true)
    await solicitarCodigo()
  }

  /**
   * Verificar código
   */
  const verificarCodigo = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_ENDPOINTS.recuperarPassword}?action=verificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, codigo })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setToken(data.token)
        setStep('password')
        setSuccess('Código verificado correctamente')
        setTimerActive(false)
      } else {
        setError(data.message || 'Código incorrecto')
      }
    } catch (err) {
      setError('Error de conexión')
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
          token, 
          nueva_password: nuevaPassword 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('Contraseña actualizada exitosamente')
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

  /**
   * Formatear tiempo restante
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
                  {step === 'email' && 'Ingresa tu correo electrónico'}
                  {step === 'code' && 'Verifica tu identidad'}
                  {step === 'password' && 'Crea tu nueva contraseña'}
                </p>
              </div>

              {/* Indicador de progreso */}
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <div className={`step-indicator ${step === 'email' ? 'active' : step !== 'email' ? 'completed' : ''}`}>
                    <i className="fas fa-envelope"></i>
                    <small>Correo</small>
                  </div>
                  <div className={`step-indicator ${step === 'code' ? 'active' : step === 'password' ? 'completed' : ''}`}>
                    <i className="fas fa-shield-alt"></i>
                    <small>Código</small>
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
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={solicitarCodigo}
                    disabled={loading || !correo}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Enviando código...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Código
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Paso 2: Verificar código */}
              {step === 'code' && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">
                      <i className="fas fa-shield-alt me-2"></i>
                      Código de Verificación
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      id="codigo"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={loading}
                      style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                    />
                    <small className="text-muted">
                      Ingresa el código de 6 dígitos enviado a {correo}
                    </small>
                  </div>

                  {/* Temporizador */}
                  <div className="text-center mb-3">
                    {timerActive ? (
                      <div className="alert alert-info">
                        <i className="fas fa-clock me-2"></i>
                        Tiempo restante: <strong>{formatTime(timeLeft)}</strong>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        El código ha expirado
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100 mb-2"
                    onClick={verificarCodigo}
                    disabled={loading || codigo.length !== 6 || !timerActive}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Verificar Código
                      </>
                    )}
                  </button>

                  {canResend && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={reenviarCodigo}
                      disabled={loading}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Enviar Código Nuevamente
                    </button>
                  )}
                </div>
              )}

              {/* Paso 3: Nueva contraseña */}
              {step === 'password' && (
                <div>
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
                    className="btn btn-success w-100"
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

      <style jsx>{`
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
