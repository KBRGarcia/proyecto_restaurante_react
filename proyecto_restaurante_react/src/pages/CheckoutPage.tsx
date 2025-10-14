import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config'
import PaymentMethodSelector from '../components/PaymentMethodSelector.tsx'
import type { MetodoPago, DatosTarjeta, DatosPayPal, DatosZinli, DatosZelle, TipoServicio } from '../types.ts'

/**
 * Página de Checkout y Procesamiento de Pago
 * 
 * Permite al usuario seleccionar método de pago, tipo de servicio y completar la transacción
 * 
 * Fuentes oficiales:
 * - React Forms: https://react.dev/reference/react-dom/components/input
 * - React Router Navigation: https://reactrouter.com/en/main/hooks/use-navigate
 * - React useState: https://react.dev/reference/react/useState
 */
function CheckoutPage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const { items, total, subtotal, impuestos, vaciarCarrito } = useCart()

  // Estados
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('recoger')
  const [direccionEntrega, setDireccionEntrega] = useState('')
  const [telefonoContacto, setTelefonoContacto] = useState(usuario?.telefono || '')
  const [notasEspeciales, setNotasEspeciales] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta')
  const [procesando, setProcesando] = useState(false)
  
  // Datos de tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: ''
  })

  // Datos PayPal
  const [datosPayPal, setDatosPayPal] = useState<DatosPayPal>({
    correo: '',
    password: ''
  })

  // Datos Zinli
  const [datosZinli, setDatosZinli] = useState<DatosZinli>({
    numeroTelefono: '',
    pin: ''
  })

  // Datos Zelle
  const [datosZelle, setDatosZelle] = useState<DatosZelle>({
    correoZelle: '',
    nombreCompleto: ''
  })

  // Validaciones
  const [errores, setErrores] = useState<Record<string, string>>({})

  /**
   * Detectar tipo de tarjeta según el número
   */
  const detectarTipoTarjeta = (numero: string) => {
    const primerDigito = numero.charAt(0)
    if (primerDigito === '4') return 'visa'
    if (primerDigito === '5') return 'mastercard'
    return undefined
  }

  /**
   * Formatear número de tarjeta
   */
  const formatearNumeroTarjeta = (valor: string) => {
    const numero = valor.replace(/\s/g, '')
    const grupos = numero.match(/.{1,4}/g)
    return grupos ? grupos.join(' ') : numero
  }

  /**
   * Formatear fecha de expiración
   */
  const formatearFechaExpiracion = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length >= 2) {
      return numeros.slice(0, 2) + '/' + numeros.slice(2, 4)
    }
    return numeros
  }

  /**
   * Manejar cambio en número de tarjeta
   */
  const handleNumeroTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\s/g, '')
    if (valor.length <= 16 && /^\d*$/.test(valor)) {
      const tipo = detectarTipoTarjeta(valor)
      setDatosTarjeta({
        ...datosTarjeta,
        numeroTarjeta: valor,
        tipoTarjeta: tipo
      })
      if (errores.numeroTarjeta) {
        setErrores({ ...errores, numeroTarjeta: '' })
      }
    }
  }

  /**
   * Validar formulario según método de pago y tipo de servicio
   */
  const validarFormulario = (): boolean => {
    console.log('🔍 Iniciando validación del formulario...')
    const nuevosErrores: Record<string, string> = {}

    // Validar tipo de servicio
    if (tipoServicio === 'domicilio' && !direccionEntrega.trim()) {
      nuevosErrores.direccionEntrega = 'La dirección de entrega es requerida para servicio a domicilio'
      console.log('❌ Error: Dirección de entrega requerida')
    }

    if (!telefonoContacto.trim()) {
      nuevosErrores.telefonoContacto = 'El teléfono de contacto es requerido'
      console.log('❌ Error: Teléfono de contacto requerido')
    }

    if (metodoPago === 'tarjeta') {
      console.log('🔍 Validando datos de tarjeta:', datosTarjeta)
      if (!datosTarjeta.numeroTarjeta || datosTarjeta.numeroTarjeta.length !== 16) {
        nuevosErrores.numeroTarjeta = 'Número de tarjeta inválido (16 dígitos)'
        console.log('❌ Error: Número de tarjeta inválido')
      }
      if (!datosTarjeta.nombreTitular.trim()) {
        nuevosErrores.nombreTitular = 'Nombre del titular es requerido'
        console.log('❌ Error: Nombre del titular requerido')
      }
      if (!datosTarjeta.fechaExpiracion || !/^\d{2}\/\d{2}$/.test(datosTarjeta.fechaExpiracion)) {
        nuevosErrores.fechaExpiracion = 'Fecha inválida (MM/AA)'
        console.log('❌ Error: Fecha de expiración inválida')
      }
      if (!datosTarjeta.cvv || datosTarjeta.cvv.length < 3) {
        nuevosErrores.cvv = 'CVV inválido (3-4 dígitos)'
        console.log('❌ Error: CVV inválido')
      }
    }

    if (metodoPago === 'paypal') {
      console.log('🔍 Validando datos de PayPal:', datosPayPal)
      if (!datosPayPal.correo || !/\S+@\S+\.\S+/.test(datosPayPal.correo)) {
        nuevosErrores.correoPayPal = 'Correo de PayPal inválido'
        console.log('❌ Error: Correo de PayPal inválido')
      }
      if (!datosPayPal.password) {
        nuevosErrores.passwordPayPal = 'Contraseña de PayPal requerida'
        console.log('❌ Error: Contraseña de PayPal requerida')
      }
    }

    if (metodoPago === 'zinli') {
      console.log('🔍 Validando datos de Zinli:', datosZinli)
      if (!datosZinli.numeroTelefono || datosZinli.numeroTelefono.length < 10) {
        nuevosErrores.numeroZinli = 'Número de teléfono inválido'
        console.log('❌ Error: Número de teléfono Zinli inválido')
      }
      if (!datosZinli.pin || datosZinli.pin.length !== 4) {
        nuevosErrores.pinZinli = 'PIN debe tener 4 dígitos'
        console.log('❌ Error: PIN Zinli inválido')
      }
    }

    if (metodoPago === 'zelle') {
      console.log('🔍 Validando datos de Zelle:', datosZelle)
      if (!datosZelle.correoZelle || !/\S+@\S+\.\S+/.test(datosZelle.correoZelle)) {
        nuevosErrores.correoZelle = 'Correo de Zelle inválido'
        console.log('❌ Error: Correo de Zelle inválido')
      }
      if (!datosZelle.nombreCompleto.trim()) {
        nuevosErrores.nombreZelle = 'Nombre completo es requerido'
        console.log('❌ Error: Nombre completo Zelle requerido')
      }
    }

    console.log('📋 Errores encontrados:', nuevosErrores)
    setErrores(nuevosErrores)
    const esValido = Object.keys(nuevosErrores).length === 0
    console.log('✅ Formulario válido:', esValido)
    return esValido
  }

  /**
   * Procesar pago y crear orden
   */
  const procesarPago = async () => {
    console.log('=== INICIANDO PROCESAMIENTO DE PAGO ===')
    console.log('Datos del formulario:', {
      tipoServicio,
      direccionEntrega,
      telefonoContacto,
      notasEspeciales,
      metodoPago,
      datosTarjeta,
      datosPayPal,
      datosZinli,
      datosZelle
    })
    
    console.log('Items en el carrito:', items)
    
    const esValido = validarFormulario()
    console.log('Formulario válido:', esValido)
    console.log('Errores encontrados:', errores)
    
    if (!esValido) {
      console.log('❌ Validación falló, no se puede proceder')
      return
    }

    setProcesando(true)
    console.log('✅ Iniciando procesamiento...')

    try {
      const token = localStorage.getItem('token')
      console.log('Token encontrado:', token ? 'Sí' : 'No')
      
      if (!token) {
        console.log('❌ No hay token de autenticación')
        alert('Sesión no válida. Por favor inicia sesión nuevamente.')
        navigate('/login')
        return
      }

      // Preparar datos de la orden
      const ordenData = {
        tipo_servicio: tipoServicio,
        direccion_entrega: tipoServicio === 'domicilio' ? direccionEntrega : null,
        telefono_contacto: telefonoContacto,
        notas_especiales: notasEspeciales,
        productos: items.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
          notas: item.notas || null
        }))
      }

      console.log('Creando orden con datos:', ordenData)
      console.log('URL de la API:', API_ENDPOINTS.crearOrden)

      // Crear la orden en la base de datos
      const response = await fetch(API_ENDPOINTS.crearOrden, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordenData)
      })

      console.log('Respuesta de la API:', response.status)
      console.log('Headers de respuesta:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error al crear orden:', errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('Resultado de crear orden:', result)

      if (!result.success) {
        throw new Error(result.message || 'Error al crear la orden')
      }

      // Simular procesamiento de pago (2 segundos)
      console.log('⏳ Simulando procesamiento de pago...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Limpiar carrito
      console.log('🧹 Limpiando carrito...')
      vaciarCarrito()

      // Mostrar notificación de éxito y redirigir
      console.log('✅ Guardando datos de éxito...')
      localStorage.setItem('paymentSuccess', 'true')
      localStorage.setItem('ordenCreada', JSON.stringify({
        ordenId: result.orden_id,
        total: total,
        fecha: new Date().toISOString()
      }))
      
      console.log('🏠 Redirigiendo a home...')
      // Redirigir a home
      navigate('/')
    } catch (error) {
      console.error('❌ Error procesando pago:', error)
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}\n\nPor favor intenta nuevamente.`)
    } finally {
      console.log('🏁 Finalizando procesamiento...')
      setProcesando(false)
    }
  }

  // Verificar que hay items en el carrito
  if (items.length === 0) {
    return (
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
            <h3>Tu carrito está vacío</h3>
            <p className="text-muted mb-4">Agrega productos antes de proceder al pago</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/menu')}
            >
              <i className="fas fa-utensils me-2"></i>
              Ver Menú
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h2">
          <i className="fas fa-lock me-2 text-success"></i>
          Checkout Seguro
        </h1>
        <p className="text-muted">Completa tu pago de forma segura</p>
      </div>

      <div className="row">
        {/* Columna principal - Formulario de pago */}
        <div className="col-lg-8 mb-4">
          
          {/* Información del usuario */}
          {usuario && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  Información de Facturación
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Correo:</strong> {usuario.correo}
                  </div>
                  {usuario.telefono && (
                    <div className="col-md-6 mb-2">
                      <strong>Teléfono:</strong> {usuario.telefono}
                    </div>
                  )}
                  {usuario.direccion && (
                    <div className="col-md-12">
                      <strong>Dirección:</strong> {usuario.direccion}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tipo de Servicio */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-truck me-2"></i>
                Tipo de Servicio
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Selector de tipo de servicio */}
                <div className="col-12">
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="tipoServicio"
                      id="servicio-recoger"
                      checked={tipoServicio === 'recoger'}
                      onChange={() => setTipoServicio('recoger')}
                    />
                    <label className="btn btn-outline-info" htmlFor="servicio-recoger">
                      <i className="fas fa-shopping-bag fa-2x d-block mb-2"></i>
                      <strong>Para Llevar</strong>
                      <br />
                      <small>Recoger en el local</small>
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="tipoServicio"
                      id="servicio-domicilio"
                      checked={tipoServicio === 'domicilio'}
                      onChange={() => setTipoServicio('domicilio')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="servicio-domicilio">
                      <i className="fas fa-motorcycle fa-2x d-block mb-2"></i>
                      <strong>A Domicilio</strong>
                      <br />
                      <small>Entrega en tu dirección</small>
                    </label>
                  </div>
                </div>

                {/* Dirección de entrega (solo si es domicilio) */}
                {tipoServicio === 'domicilio' && (
                  <div className="col-12">
                    <label className="form-label">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      Dirección de Entrega *
                    </label>
                    <textarea
                      className={`form-control ${errores.direccionEntrega ? 'is-invalid' : ''}`}
                      rows={2}
                      placeholder="Calle, número, colonia, referencias..."
                      value={direccionEntrega}
                      onChange={(e) => {
                        setDireccionEntrega(e.target.value)
                        if (errores.direccionEntrega) setErrores({ ...errores, direccionEntrega: '' })
                      }}
                    />
                    {errores.direccionEntrega && (
                      <div className="invalid-feedback">{errores.direccionEntrega}</div>
                    )}
                  </div>
                )}

                {/* Teléfono de contacto */}
                <div className="col-md-6">
                  <label className="form-label">
                    <i className="fas fa-phone me-1"></i>
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errores.telefonoContacto ? 'is-invalid' : ''}`}
                    placeholder="+1 (555) 123-4567"
                    value={telefonoContacto}
                    onChange={(e) => {
                      setTelefonoContacto(e.target.value)
                      if (errores.telefonoContacto) setErrores({ ...errores, telefonoContacto: '' })
                    }}
                  />
                  {errores.telefonoContacto && (
                    <div className="invalid-feedback">{errores.telefonoContacto}</div>
                  )}
                </div>

                {/* Notas especiales */}
                <div className="col-12">
                  <label className="form-label">
                    <i className="fas fa-sticky-note me-1"></i>
                    Notas Especiales (opcional)
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Instrucciones adicionales para tu pedido..."
                    value={notasEspeciales}
                    onChange={(e) => setNotasEspeciales(e.target.value)}
                  />
                </div>

                {/* Información adicional según tipo de servicio */}
                {tipoServicio === 'recoger' && (
                  <div className="col-12">
                    <div className="alert alert-info mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Para Llevar:</strong> Tu pedido estará listo para recoger en aproximadamente 30-45 minutos.
                      <br />
                      <strong>Dirección del local:</strong> Calle Principal #123, Ciudad
                    </div>
                  </div>
                )}

                {tipoServicio === 'domicilio' && (
                  <div className="col-12">
                    <div className="alert alert-primary mb-0">
                      <i className="fas fa-motorcycle me-2"></i>
                      <strong>Entrega a Domicilio:</strong> Tiempo estimado de entrega: 45-60 minutos.
                      <br />
                      <small>El tiempo puede variar según la distancia y el tráfico.</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selector de método de pago */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-credit-card me-2"></i>
                Método de Pago
              </h5>
            </div>
            <div className="card-body">
              <PaymentMethodSelector
                metodoSeleccionado={metodoPago}
                onSeleccionar={setMetodoPago}
              />
            </div>
          </div>

          {/* Formulario según método seleccionado */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-file-invoice-dollar me-2"></i>
                Datos de Pago
              </h5>
            </div>
            <div className="card-body">
              
              {/* Formulario de Tarjeta */}
              {metodoPago === 'tarjeta' && (
                <div className="payment-form">
                  <div className="row g-3">
                    {/* Número de tarjeta */}
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-credit-card me-1"></i>
                        Número de Tarjeta *
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errores.numeroTarjeta ? 'is-invalid' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          value={formatearNumeroTarjeta(datosTarjeta.numeroTarjeta)}
                          onChange={handleNumeroTarjetaChange}
                          maxLength={19}
                        />
                        <span className="input-group-text">
                          {datosTarjeta.tipoTarjeta === 'visa' && (
                            <i className="fab fa-cc-visa fa-2x text-primary"></i>
                          )}
                          {datosTarjeta.tipoTarjeta === 'mastercard' && (
                            <i className="fab fa-cc-mastercard fa-2x text-danger"></i>
                          )}
                          {!datosTarjeta.tipoTarjeta && (
                            <i className="fas fa-credit-card text-muted"></i>
                          )}
                        </span>
                        {errores.numeroTarjeta && (
                          <div className="invalid-feedback">{errores.numeroTarjeta}</div>
                        )}
                      </div>
                    </div>

                    {/* Nombre del titular */}
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-user me-1"></i>
                        Nombre del Titular *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errores.nombreTitular ? 'is-invalid' : ''}`}
                        placeholder="Como aparece en la tarjeta"
                        value={datosTarjeta.nombreTitular}
                        onChange={(e) => {
                          setDatosTarjeta({ ...datosTarjeta, nombreTitular: e.target.value.toUpperCase() })
                          if (errores.nombreTitular) setErrores({ ...errores, nombreTitular: '' })
                        }}
                      />
                      {errores.nombreTitular && (
                        <div className="invalid-feedback">{errores.nombreTitular}</div>
                      )}
                    </div>

                    {/* Fecha de expiración */}
                    <div className="col-md-6">
                      <label className="form-label">
                        <i className="fas fa-calendar me-1"></i>
                        Fecha de Expiración *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errores.fechaExpiracion ? 'is-invalid' : ''}`}
                        placeholder="MM/AA"
                        value={datosTarjeta.fechaExpiracion}
                        onChange={(e) => {
                          const formatted = formatearFechaExpiracion(e.target.value)
                          setDatosTarjeta({ ...datosTarjeta, fechaExpiracion: formatted })
                          if (errores.fechaExpiracion) setErrores({ ...errores, fechaExpiracion: '' })
                        }}
                        maxLength={5}
                      />
                      {errores.fechaExpiracion && (
                        <div className="invalid-feedback">{errores.fechaExpiracion}</div>
                      )}
                    </div>

                    {/* CVV */}
                    <div className="col-md-6">
                      <label className="form-label">
                        <i className="fas fa-lock me-1"></i>
                        CVV *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errores.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={datosTarjeta.cvv}
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '')
                          if (valor.length <= 4) {
                            setDatosTarjeta({ ...datosTarjeta, cvv: valor })
                            if (errores.cvv) setErrores({ ...errores, cvv: '' })
                          }
                        }}
                        maxLength={4}
                      />
                      {errores.cvv && (
                        <div className="invalid-feedback">{errores.cvv}</div>
                      )}
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        3-4 dígitos en el reverso de la tarjeta
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario PayPal */}
              {metodoPago === 'paypal' && (
                <div className="payment-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-envelope me-1"></i>
                        Correo de PayPal *
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errores.correoPayPal ? 'is-invalid' : ''}`}
                        placeholder="tu@correo.com"
                        value={datosPayPal.correo}
                        onChange={(e) => {
                          setDatosPayPal({ ...datosPayPal, correo: e.target.value })
                          if (errores.correoPayPal) setErrores({ ...errores, correoPayPal: '' })
                        }}
                      />
                      {errores.correoPayPal && (
                        <div className="invalid-feedback">{errores.correoPayPal}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-lock me-1"></i>
                        Contraseña de PayPal *
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errores.passwordPayPal ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        value={datosPayPal.password}
                        onChange={(e) => {
                          setDatosPayPal({ ...datosPayPal, password: e.target.value })
                          if (errores.passwordPayPal) setErrores({ ...errores, passwordPayPal: '' })
                        }}
                      />
                      {errores.passwordPayPal && (
                        <div className="invalid-feedback">{errores.passwordPayPal}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <i className="fab fa-paypal me-2"></i>
                        Serás redirigido a PayPal para completar el pago de forma segura
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Zinli */}
              {metodoPago === 'zinli' && (
                <div className="payment-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-mobile-alt me-1"></i>
                        Número de Teléfono *
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errores.numeroZinli ? 'is-invalid' : ''}`}
                        placeholder="+58 412-1234567"
                        value={datosZinli.numeroTelefono}
                        onChange={(e) => {
                          setDatosZinli({ ...datosZinli, numeroTelefono: e.target.value })
                          if (errores.numeroZinli) setErrores({ ...errores, numeroZinli: '' })
                        }}
                      />
                      {errores.numeroZinli && (
                        <div className="invalid-feedback">{errores.numeroZinli}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-key me-1"></i>
                        PIN de Zinli *
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errores.pinZinli ? 'is-invalid' : ''}`}
                        placeholder="••••"
                        maxLength={4}
                        value={datosZinli.pin}
                        onChange={(e) => {
                          const valor = e.target.value.replace(/\D/g, '')
                          setDatosZinli({ ...datosZinli, pin: valor })
                          if (errores.pinZinli) setErrores({ ...errores, pinZinli: '' })
                        }}
                      />
                      {errores.pinZinli && (
                        <div className="invalid-feedback">{errores.pinZinli}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="alert alert-success mb-0">
                        <i className="fas fa-shield-alt me-2"></i>
                        Pago seguro procesado a través de Zinli
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Zelle */}
              {metodoPago === 'zelle' && (
                <div className="payment-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-envelope me-1"></i>
                        Correo de Zelle *
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errores.correoZelle ? 'is-invalid' : ''}`}
                        placeholder="tu@correo.com"
                        value={datosZelle.correoZelle}
                        onChange={(e) => {
                          setDatosZelle({ ...datosZelle, correoZelle: e.target.value })
                          if (errores.correoZelle) setErrores({ ...errores, correoZelle: '' })
                        }}
                      />
                      {errores.correoZelle && (
                        <div className="invalid-feedback">{errores.correoZelle}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-user me-1"></i>
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errores.nombreZelle ? 'is-invalid' : ''}`}
                        placeholder="Como está registrado en Zelle"
                        value={datosZelle.nombreCompleto}
                        onChange={(e) => {
                          setDatosZelle({ ...datosZelle, nombreCompleto: e.target.value })
                          if (errores.nombreZelle) setErrores({ ...errores, nombreZelle: '' })
                        }}
                      />
                      {errores.nombreZelle && (
                        <div className="invalid-feedback">{errores.nombreZelle}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <div className="alert alert-warning mb-0">
                        <i className="fas fa-university me-2"></i>
                        Transferencia segura a través de tu banco con Zelle
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna lateral - Resumen del pedido */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Resumen del Pedido
              </h5>
            </div>
            <div className="card-body">
              {/* Items */}
              <div className="mb-3">
                <h6 className="text-muted mb-2">Productos ({items.length})</h6>
                <div className="order-items-summary">
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <small>{item.cantidad}x {item.nombre}</small>
                      <small className="text-muted">${(item.precio * item.cantidad).toFixed(2)}</small>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <small className="text-muted">
                      +{items.length - 3} producto(s) más
                    </small>
                  )}
                </div>
              </div>

              <hr />

              {/* Totales */}
              <div className="mb-2 d-flex justify-content-between">
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span>Impuestos (16%):</span>
                <strong>${impuestos.toFixed(2)}</strong>
              </div>
              
              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="h5 mb-0">Total:</span>
                <span className="h4 mb-0 text-success">${total.toFixed(2)}</span>
              </div>

              {/* Botón de pago */}
              <button
                className="btn btn-success btn-lg w-100 mb-2"
                onClick={procesarPago}
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock me-2"></i>
                    Pagar ${total.toFixed(2)}
                  </>
                )}
              </button>

              {/* Seguridad */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Pago 100% seguro y encriptado
                </small>
              </div>

              {/* Botón volver */}
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate('/carrito')}
                disabled={procesando}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

