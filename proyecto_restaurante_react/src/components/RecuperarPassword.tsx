import { useState } from 'react'
import { API_ENDPOINTS } from '../config.ts'

/**
 * Componente de Recuperación de Contraseña
 * Maneja el flujo completo de recuperación de contraseña:
 * 1. Verificación del correo electrónico
 * 2. Actualización de la contraseña
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - React State: https://react.dev/learn/state-a-components-memory
 */

type RecoveryStep = 'email' | 'password'

interface RecuperarPasswordProps {
  onVolver: () => void
  onSuccess?: () => void
}

function RecuperarPassword({ onVolver, onSuccess }: RecuperarPasswordProps) {
  const [step, setStep] = useState<RecoveryStep>('email')
  const [correo, setCorreo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showNuevaPassword, setShowNuevaPassword] = useState(false)
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /**
   * Verificar que el correo existe en la base de datos
   */
  const verificarCorreo = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    if (!correo) {
      setError('Por favor ingresa tu correo electrónico')
      setLoading(false)
      return
    }

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
      
      // Leer el texto de la respuesta primero (solo se puede leer una vez)
      const responseText = await response.text()
      console.log('📦 Respuesta texto:', responseText)
      
      // Intentar parsear como JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log('📦 Datos parseados:', data)
      } catch (jsonError) {
        // Si no es JSON válido, usar el texto como mensaje de error
        console.error('❌ Error al parsear JSON:', jsonError)
        const errorMessage = responseText || `Error del servidor: ${response.statusText}`
        setError(errorMessage)
        return
      }
      
      // Si la respuesta HTTP no es exitosa, usar el mensaje del servidor si está disponible
      if (!response.ok) {
        const errorMessage = data?.message || `Error HTTP ${response.status}: ${response.statusText}`
        console.error('❌ Error HTTP:', errorMessage)
        setError(errorMessage)
        return
      }
      
      if (data.success) {
        setSuccess('Correo verificado correctamente')
        setStep('password')
      } else {
        setError(data.message || 'La dirección de correo no se encuentra registrada')
      }
    } catch (err) {
      console.error('❌ Error en verificarCorreo:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error de conexión: ${errorMessage}. Por favor verifica que el servidor esté corriendo.`)
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
      const url = `${API_ENDPOINTS.recuperarPassword}?action=actualizar`
      console.log('🔗 Actualizando contraseña:', url)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          correo, 
          nueva_password: nuevaPassword 
        })
      })
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText)
      
      // Leer el texto de la respuesta primero (solo se puede leer una vez)
      const responseText = await response.text()
      console.log('📦 Respuesta texto:', responseText)
      
      // Intentar parsear como JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log('📦 Datos parseados:', data)
      } catch (jsonError) {
        // Si no es JSON válido, usar el texto como mensaje de error
        console.error('❌ Error al parsear JSON:', jsonError)
        const errorMessage = responseText || `Error del servidor: ${response.statusText}`
        setError(errorMessage)
        return
      }
      
      // Si la respuesta HTTP no es exitosa, usar el mensaje del servidor si está disponible
      if (!response.ok) {
        const errorMessage = data?.message || `Error HTTP ${response.status}: ${response.statusText}`
        console.error('❌ Error HTTP:', errorMessage)
        setError(errorMessage)
        return
      }
      
      if (data.success) {
        setSuccess('Contraseña actualizada exitosamente. Redirigiendo al login...')
        setTimeout(() => {
          // Resetear estados
          setStep('email')
          setCorreo('')
          setNuevaPassword('')
          setConfirmarPassword('')
          setError(null)
          setSuccess(null)
          
          // Llamar callback de éxito si existe
          if (onSuccess) {
            onSuccess()
          }
        }, 2000)
      } else {
        setError(data.message || 'Error al actualizar la contraseña')
      }
    } catch (err) {
      console.error('❌ Error en actualizarPassword:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error de conexión: ${errorMessage}. Por favor verifica que el servidor esté corriendo.`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Volver al paso de correo
   */
  const volverAlPasoCorreo = () => {
    setStep('email')
    setNuevaPassword('')
    setConfirmarPassword('')
    setError(null)
    setSuccess(null)
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-4">
        <i className="fas fa-key fa-3x text-primary mb-3"></i>
        <h2 className="card-title">Recuperar Contraseña</h2>
        <p className="text-muted">
          {step === 'email' && 'Ingresa tu correo electrónico registrado'}
          {step === 'password' && 'Crea tu nueva contraseña'}
        </p>
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
            <label htmlFor="recoveryCorreo" className="form-label">
              <i className="fas fa-envelope me-2"></i>
              Correo Electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="recoveryCorreo"
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
            className="btn btn-primary w-100 mb-3"
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

          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onVolver}
            disabled={loading}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver al Login
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
                type={showNuevaPassword ? "text" : "password"}
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
                onClick={() => setShowNuevaPassword(!showNuevaPassword)}
                disabled={loading}
                title={showNuevaPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fas fa-${showNuevaPassword ? 'eye-slash' : 'eye'}`}></i>
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
                type={showConfirmarPassword ? "text" : "password"}
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
                onClick={() => setShowConfirmarPassword(!showConfirmarPassword)}
                disabled={loading}
                title={showConfirmarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fas fa-${showConfirmarPassword ? 'eye-slash' : 'eye'}`}></i>
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
            onClick={volverAlPasoCorreo}
            disabled={loading}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Cambiar Correo
          </button>
        </div>
      )}
    </>
  )
}

export default RecuperarPassword

