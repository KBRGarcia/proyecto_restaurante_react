import { useState, useEffect, type FormEvent } from 'react'
import { API_ENDPOINTS } from '../config'

/**
 * Componente de Verificación de Código
 * Permite al usuario verificar su código de 6 dígitos recibido por correo
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - TypeScript con React: https://react.dev/learn/typescript
 */

interface VerificationCodeProps {
  email: string
  onVerificationSuccess: (token: string, usuario: any) => void
  onBack: () => void
}

function VerificationCode({ email, onVerificationSuccess, onBack }: VerificationCodeProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Timer para expiración del código
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

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

  // Verificar código
  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.verifyCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })

      const data = await response.json()

      if (data.success) {
        // Verificación exitosa
        onVerificationSuccess(data.token, data.usuario)
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

  // Reenviar código
  const handleResendCode = async () => {
    setResendLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.resendVerificationCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setCode('')
        setTimeLeft(600) // Resetear timer
        setCanResend(false)
        setAttempts(0)
        setError(null)
        // Mostrar mensaje de éxito temporalmente
        const successMsg = document.createElement('div')
        successMsg.className = 'alert alert-success'
        successMsg.textContent = 'Código reenviado exitosamente'
        document.querySelector('.verification-container')?.prepend(successMsg)
        setTimeout(() => successMsg.remove(), 3000)
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
      setResendLoading(false)
    }
  }

  return (
    <div className="verification-container">
      <div className="text-center mb-4">
        <i className="fas fa-envelope-open fa-3x text-primary mb-3"></i>
        <h2 className="card-title">Verificar Correo Electrónico</h2>
        <p className="text-muted">
          Hemos enviado un código de verificación a<br />
          <strong>{email}</strong>
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
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

      {/* Formulario de verificación */}
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

        {/* Botón de verificación */}
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
          disabled={!canResend || resendLoading}
        >
          {resendLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Reenviando...
            </>
          ) : (
            <>
              <i className="fas fa-redo me-2"></i>
              Reenviar Código
            </>
          )}
        </button>
      </div>

      {/* Botón de regreso */}
      <div className="text-center">
        <button
          type="button"
          className="btn btn-link text-decoration-none"
          onClick={onBack}
          disabled={loading}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Volver al Registro
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4">
        <div className="alert alert-info">
          <h6><i className="fas fa-info-circle me-2"></i>Información Importante:</h6>
          <ul className="mb-0">
            <li>El código expira en 10 minutos</li>
            <li>Tienes máximo 5 intentos para verificar</li>
            <li>Revisa tu carpeta de spam si no recibes el correo</li>
            <li>El código es válido solo para este registro</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VerificationCode
