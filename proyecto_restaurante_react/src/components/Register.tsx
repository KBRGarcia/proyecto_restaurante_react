import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { RegisterData, CodigoArea } from '../types.ts'
import { API_ENDPOINTS } from '../config'
import VerificationCode from './VerificationCode.tsx'

/**
 * Componente de Registro con Verificación de 2 Pasos
 * Permite a nuevos usuarios crear una cuenta con verificación por correo
 */
function Register() {
  const [step, setStep] = useState<'form' | 'verification'>('form')
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    codigo_area: '0414',
    numero_telefono: '',
    password: '',
    confirmarPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Códigos de área disponibles
  const codigosArea: CodigoArea[] = ['0414', '0424', '0412', '0416', '0426']
  
  const navigate = useNavigate()

  // Funciones de validación
  const validarNombre = (nombre: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/
    return regex.test(nombre.trim())
  }

  const validarApellido = (apellido: string): boolean => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/
    return regex.test(apellido.trim())
  }

  const validarNumeroTelefono = (numero: string): boolean => {
    const regex = /^[0-9]{7}$/
    return regex.test(numero)
  }

  const validarPassword = (password: string): boolean => {
    return password.length >= 4 && password.length <= 10
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Validaciones en tiempo real para campos específicos
    if (name === 'numero_telefono') {
      // Solo permitir números y máximo 7 caracteres
      const soloNumeros = value.replace(/[^0-9]/g, '').slice(0, 7)
      setFormData({
        ...formData,
        [name]: soloNumeros
      })
    } else if (name === 'nombre' || name === 'apellido') {
      // Solo permitir letras, acentos, ñ y espacios, máximo 16 caracteres
      const soloTexto = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').slice(0, 16)
      setFormData({
        ...formData,
        [name]: soloTexto
      })
    } else if (name === 'password' || name === 'confirmPassword') {
      // Máximo 10 caracteres para contraseñas
      const passwordLimitada = value.slice(0, 10)
      setFormData({
        ...formData,
        [name]: passwordLimitada
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validaciones de campos obligatorios
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.password) {
      setError('Por favor completa todos los campos obligatorios')
      setLoading(false)
      return
    }

    // Validación de nombre
    if (!validarNombre(formData.nombre)) {
      setError('El nombre solo puede contener letras, acentos y ñ (2-16 caracteres)')
      setLoading(false)
      return
    }

    // Validación de apellido
    if (!validarApellido(formData.apellido)) {
      setError('El apellido solo puede contener letras, acentos y ñ (2-16 caracteres)')
      setLoading(false)
      return
    }

    // Validación de número telefónico
    if (formData.numero_telefono && !validarNumeroTelefono(formData.numero_telefono)) {
      setError('El número telefónico debe tener exactamente 7 dígitos')
      setLoading(false)
      return
    }

    // Validación de contraseña
    if (!validarPassword(formData.password)) {
      setError('La contraseña debe tener entre 4 y 10 caracteres')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      // Enviar código de verificación
      const response = await fetch(API_ENDPOINTS.sendVerificationCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.correo,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          codigo_area: formData.codigo_area,
          numero_telefono: formData.numero_telefono
        })
      })

      const data = await response.json()

      if (data.success) {
        setStep('verification')
      } else {
        setError(data.message || 'Error al enviar código de verificación')
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Manejar verificación exitosa
  const handleVerificationSuccess = (token: string, usuario: any) => {
    // Guardar token y datos del usuario
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    
    // Redirigir al menú
    navigate('/menu')
  }

  // Volver al formulario de registro
  const handleBackToForm = () => {
    setStep('form')
    setError(null)
  }

  // Mostrar componente de verificación si estamos en ese paso
  if (step === 'verification') {
    return (
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <VerificationCode
                  email={formData.correo}
                  onVerificationSuccess={handleVerificationSuccess}
                  onBack={handleBackToForm}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                <h2 className="card-title">Crear Cuenta</h2>
                <p className="text-muted">Únete a Sabor & Tradición</p>
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
                <div className="row">
                  {/* Nombre */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength={2}
                      maxLength={16}
                      placeholder="Solo letras, acentos y ñ"
                    />
                    <small className="text-muted">2-16 caracteres, solo letras</small>
                  </div>

                  {/* Apellido */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="apellido" className="form-label">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength={2}
                      maxLength={16}
                      placeholder="Solo letras, acentos y ñ"
                    />
                    <small className="text-muted">2-16 caracteres, solo letras</small>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Correo Electrónico <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-phone me-2"></i>
                    Teléfono
                  </label>
                  <div className="row">
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        name="codigo_area"
                        value={formData.codigo_area}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        {codigosArea.map((codigo) => (
                          <option key={codigo} value={codigo}>
                            {codigo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="tel"
                        className="form-control"
                        id="numero_telefono"
                        name="numero_telefono"
                        value={formData.numero_telefono}
                        onChange={handleChange}
                        placeholder="1234567"
                        disabled={loading}
                        maxLength={7}
                        pattern="[0-9]{7}"
                      />
                    </div>
                  </div>
                  <small className="text-muted">7 dígitos exactos</small>
                </div>

                <div className="row">
                  {/* Password */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Contraseña <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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

                  {/* Confirmar Password */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Confirmar Contraseña <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                </div>

                {/* Términos y condiciones */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terminos"
                    required
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los{' '}
                    <a href="/terminos" className="text-decoration-none">
                      términos y condiciones
                    </a>
                  </label>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Enviando código...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope me-2"></i>
                      Enviar Código de Verificación
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4" />

              {/* Login */}
              <div className="text-center">
                <p className="mb-0">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

