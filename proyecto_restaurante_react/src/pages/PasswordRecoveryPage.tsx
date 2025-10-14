import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config'

/**
 * Componente de Recuperación de Contraseña con Verificación de 2 Pasos
 * Permite al usuario recuperar su contraseña mediante código por correo
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - TypeScript con React: https://react.dev/learn/typescript
 */

type Step = 'email' | 'code' | 'password'

function PasswordRecoveryPage() {
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estados para el formulario
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados para el temporizador
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const [timerActive, setTimerActive] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  
  const navigate = useNavigate()

  // Timer para expiración del código
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timerActive, timeLeft])

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Manejar cambio en el código
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setCode(value)
    setError(null)
  }

  // Solicitar código de recuperación
  const handleRequestRecovery = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(API_ENDPOINTS.requestPasswordRecovery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Código de recuperación enviado a tu correo electrónico')
        setStep('code')
        setTimeLeft(600)
        setTimerActive(true)
        setCanResend(false)
      } else {
        setError(data.message || 'Error al enviar código de recuperación')
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Verificar código de recuperación
  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.verifyRecoveryCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })

      const data = await response.json()

      if (data.success) {
        setResetToken(data.reset_token)
        setStep('password')
        setSuccess('Código verificado correctamente. Ahora puedes cambiar tu contraseña')
      } else {
        setError(data.message || 'Código incorrecto')
        if (data.remaining_attempts !== undefined) {
          setAttempts(5 - data.remaining_attempts)
        }
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Cambiar contraseña
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 4 || newPassword.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.changePassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        
        setSuccess('Contraseña actualizada exitosamente. Serás redirigido al menú.')
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/menu')
        }, 2000)
      } else {
        setError(data.message || 'Error al cambiar la contraseña')
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Reenviar código
  const handleResendCode = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.requestPasswordRecovery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setCode('')
        setTimeLeft(600)
        setTimerActive(true)
        setCanResend(false)
        setAttempts(0)
        setError(null)
        setSuccess('Código reenviado exitosamente')
      } else {
        if (data.cooldown_remaining) {
          setError(`Espera ${data.cooldown_remaining} segundos antes de reenviar`)
        } else {
          setError(data.message || 'Error al reenviar el código')
        }
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Volver al paso anterior
  const handleBack = () => {
    if (step === 'code') {
      setStep('email')
      setCode('')
      setTimerActive(false)
      setCanResend(false)
      setAttempts(0)
    } else if (step === 'password') {
      setStep('code')
      setNewPassword('')
      setConfirmPassword('')
      setResetToken(null)
    }
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              
              {/* Paso 1: Solicitar correo */}
              {step === 'email' && (
                <>
                  <div className="text-center mb-4">
                    <i className="fas fa-key fa-3x text-warning mb-3"></i>
                    <h2 className="card-title">Recuperar Contraseña</h2>
                    <p className="text-muted">Ingresa tu correo electrónico para recibir un código de verificación</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleRequestRecovery}>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope me-2"></i>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-warning w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Enviando código...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Enviar Código de Recuperación
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* Paso 2: Verificar código */}
              {step === 'code' && (
                <>
                  <div className="text-center mb-4">
                    <i className="fas fa-envelope-open fa-3x text-primary mb-3"></i>
                    <h2 className="card-title">Verificar Código</h2>
                    <p className="text-muted">
                      Hemos enviado un código de verificación a<br />
                      <strong>{email}</strong>
                    </p>
                  </div>

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

                  {/* Timer */}
                  <div className="text-center mb-4">
                    <div className="badge bg-info fs-6">
                      <i className="fas fa-clock me-2"></i>
                      Tiempo restante: {formatTime(timeLeft)}
                    </div>
                    {attempts > 0 && (
                      <div className="mt-2">
                        <small className="text-warning">
                          Intentos incorrectos: {attempts}/5
                        </small>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleVerifyCode}>
                    <div className="mb-4">
                      <label htmlFor="code" className="form-label">
                        <i className="fas fa-key me-2"></i>
                        Código de Verificación
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center"
                        id="code"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="000000"
                        maxLength={6}
                        required
                        disabled={loading}
                        style={{ 
                          fontSize: '2rem', 
                          letterSpacing: '0.5rem',
                          fontFamily: 'monospace'
                        }}
                      />
                      <small className="text-muted">
                        Ingresa el código de 6 dígitos que recibiste por correo
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      disabled={loading || code.length !== 6}
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
                  </form>

                  {/* Botón de reenvío */}
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleResendCode}
                      disabled={!canResend || loading}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Reenviar Código
                    </button>
                  </div>

                  {/* Botón de regreso */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Volver
                    </button>
                  </div>
                </>
              )}

              {/* Paso 3: Cambiar contraseña */}
              {step === 'password' && (
                <>
                  <div className="text-center mb-4">
                    <i className="fas fa-lock fa-3x text-success mb-3"></i>
                    <h2 className="card-title">Nueva Contraseña</h2>
                    <p className="text-muted">Establece tu nueva contraseña</p>
                  </div>

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

                  <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        <i className="fas fa-lock me-2"></i>
                        Nueva Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="form-control"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          disabled={loading}
                          minLength={4}
                          maxLength={10}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={loading}
                          title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          <i className={`fas fa-${showNewPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                      <small className="text-muted">4-10 caracteres</small>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        <i className="fas fa-lock me-2"></i>
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                      type="submit"
                      className="btn btn-success w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Cambiando contraseña...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Cambiar Contraseña
                        </>
                      )}
                    </button>
                  </form>

                  {/* Botón de regreso */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Volver
                    </button>
                  </div>
                </>
              )}

              <hr className="my-4" />

              {/* Enlace al login */}
              <div className="text-center">
                <p className="mb-0">
                  ¿Recordaste tu contraseña?{' '}
                  <a href="/login" className="text-decoration-none fw-bold">
                    Inicia sesión aquí
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRecoveryPage
