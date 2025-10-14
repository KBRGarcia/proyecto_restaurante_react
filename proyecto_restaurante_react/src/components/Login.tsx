import { useState, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { useNavigate, Link } from 'react-router-dom'

/**
 * Componente de Login
 * Permite a los usuarios iniciar sesión
 */
function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validaciones básicas
    if (!correo || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    try {
      const resultado = await login(correo, password)

      if (resultado.success && resultado.usuario) {
        // Redirigir según el rol del usuario
        if (resultado.usuario.rol === 'admin') {
          navigate('/dashboard')
        } else {
          navigate('/menu')
        }
      } else {
        setError(resultado.message || 'Credenciales incorrectas')
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  // Mostrar spinner mientras se verifica la sesión inicial
  if (authLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg">
              <div className="card-body p-5 text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Verificando sesión...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="fas fa-utensils fa-3x text-primary mb-3"></i>
                <h2 className="card-title">Iniciar Sesión</h2>
                <p className="text-muted">Sabor & Tradición</p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
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
                    disabled={loading || authLoading}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading || authLoading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || authLoading}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Recordarme */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="recordarme"
                  />
                  <label className="form-check-label" htmlFor="recordarme">
                    Recordarme
                  </label>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading || authLoading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>

              {/* Enlaces adicionales */}
              <div className="text-center">
                <Link to="/recuperar-password" className="text-decoration-none small">
                  <i className="fas fa-question-circle me-1"></i>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <hr className="my-4" />

              {/* Registro */}
              <div className="text-center">
                <p className="mb-0">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Cuenta demo */}
          <div className="card mt-3">
            <div className="card-body text-center">
              <small className="text-muted">
                <strong>Cuenta demo:</strong><br />
                Email: admin@restaurante.com<br />
                Password: 987654321
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

