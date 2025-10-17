import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config'
import CurrencySelector from '../components/CurrencySelector.tsx'
import PaymentMethodSelector from '../components/PaymentMethodSelector.tsx'
import NationalPaymentSelector from '../components/NationalPaymentSelector.tsx'
import PaymentDataModal from '../components/PaymentDataModal.tsx'
import NationalPaymentDataModal from '../components/NationalPaymentDataModal.tsx'
import '../components/PaymentComponents.css'
import type { 
  TipoMoneda, 
  MetodoPagoInternacional, 
  MetodoPagoNacional,
  DatosTarjeta, 
  DatosPayPal, 
  DatosZinli, 
  DatosZelle,
  DatosPagoMovil,
  DatosTransferencia,
  DatosPagoFisico,
  TipoServicio 
} from '../types.ts'

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
  const [procesando, setProcesando] = useState(false)
  
  // Estados para selección de moneda y métodos de pago
  const [tipoMoneda, setTipoMoneda] = useState<TipoMoneda>('internacional')
  const [metodoPagoInternacional, setMetodoPagoInternacional] = useState<MetodoPagoInternacional>('tarjeta')
  const [metodoPagoNacional, setMetodoPagoNacional] = useState<MetodoPagoNacional>('pago_movil')
  
  // Estados para los modales de datos de pago
  const [mostrarModalPagoInternacional, setMostrarModalPagoInternacional] = useState(false)
  const [mostrarModalPagoNacional, setMostrarModalPagoNacional] = useState(false)
  const [datosPagoCompletos, setDatosPagoCompletos] = useState(false)
  
  // Datos de tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>({
    numeroTarjeta: '',
    nombre: '',
    fecha_expiracion: '',
    fechaExpiracion: '',
    nombreTitular: '',
    tipoTarjeta: '',
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

  // Datos para métodos de pago nacionales
  const [datosPagoMovil, setDatosPagoMovil] = useState<DatosPagoMovil>({
    cedula: '',
    telefono: '',
    banco: 'provincial',
    numeroReferencia: '',
    fechaPago: ''
  })

  const [datosTransferencia, setDatosTransferencia] = useState<DatosTransferencia>({
    banco: 'provincial',
    numero_cuenta: '',
    cedula: '',
    nombre_titular: '',
    telefono: '',
    numeroReferencia: '',
    fechaPago: ''
  })

  const [datosPagoFisico, setDatosPagoFisico] = useState<DatosPagoFisico>({
    metodo: 'efectivo',
    horarioAtencion: 'Lunes a Domingo: 7:00 AM - 10:00 PM',
    direccionRestaurante: 'Av. Principal #123, Centro, Caracas',
    limiteTiempo: 3
  })

  // Validaciones
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Funciones para manejar los modales de datos de pago
  const abrirModalPagoInternacional = (metodo: MetodoPagoInternacional) => {
    setMetodoPagoInternacional(metodo)
    setMostrarModalPagoInternacional(true)
  }

  const cerrarModalPagoInternacional = () => {
    setMostrarModalPagoInternacional(false)
  }

  const abrirModalPagoNacional = (metodo: MetodoPagoNacional) => {
    setMetodoPagoNacional(metodo)
    setMostrarModalPagoNacional(true)
  }

  const cerrarModalPagoNacional = () => {
    setMostrarModalPagoNacional(false)
  }

  const guardarDatosPagoInternacional = (datos: DatosTarjeta | DatosPayPal | DatosZinli | DatosZelle) => {
    // Guardar los datos según el método de pago internacional
    switch (metodoPagoInternacional) {
      case 'tarjeta':
        setDatosTarjeta(datos as DatosTarjeta)
        break
      case 'paypal':
        setDatosPayPal(datos as DatosPayPal)
        break
      case 'zinli':
        setDatosZinli(datos as DatosZinli)
        break
      case 'zelle':
        setDatosZelle(datos as DatosZelle)
        break
    }
    setDatosPagoCompletos(true)
  }

  const guardarDatosPagoNacional = (datos: DatosPagoMovil | DatosTransferencia | DatosPagoFisico) => {
    // Guardar los datos según el método de pago nacional
    switch (metodoPagoNacional) {
      case 'pago_movil':
        setDatosPagoMovil(datos as DatosPagoMovil)
        break
      case 'transferencia':
        setDatosTransferencia(datos as DatosTransferencia)
        break
      case 'fisico':
        setDatosPagoFisico(datos as DatosPagoFisico)
        break
    }
    setDatosPagoCompletos(true)
  }

  /**
   * Detectar tipo de tarjeta según el número (no utilizado actualmente)
   */
  // const detectarTipoTarjeta = (numero: string) => {
  //   const primerDigito = numero.charAt(0)
  //   if (primerDigito === '4') return 'visa'
  //   if (primerDigito === '5') return 'mastercard'
  //   return undefined
  // }

  /**
   * Formatear número de tarjeta (no utilizado actualmente)
   */
  // const formatearNumeroTarjeta = (valor: string) => {
  //   const numero = valor.replace(/\s/g, '')
  //   const grupos = numero.match(/.{1,4}/g)
  //   return grupos ? grupos.join(' ') : numero
  // }

  /**
   * Formatear fecha de expiración (no utilizado actualmente)
   */
  // const formatearFechaExpiracion = (valor: string) => {
  //   const numeros = valor.replace(/\D/g, '')
  //   if (numeros.length >= 2) {
  //     return numeros.slice(0, 2) + '/' + numeros.slice(2, 4)
  //   }
  //   return numeros
  // }

  /**
   * Manejar cambio en número de tarjeta (no utilizado actualmente)
   */
  // const handleNumeroTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valor = e.target.value.replace(/\s/g, '')
  //   if (valor.length <= 16 && /^\d*$/.test(valor)) {
  //     const tipo = detectarTipoTarjeta(valor)
  //     setDatosTarjeta({
  //       ...datosTarjeta,
  //       numeroTarjeta: valor,
  //       tipoTarjeta: tipo
  //     })
  //     if (errores.numeroTarjeta) {
  //       setErrores({ ...errores, numeroTarjeta: '' })
  //     }
  //   }
  // }

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

    // Validar que los datos de pago estén completos según el tipo de moneda
    if (!datosPagoCompletos) {
      nuevosErrores.datosPago = 'Debes completar los datos de pago antes de proceder'
      console.log('❌ Error: Datos de pago incompletos')
    }

    // Validaciones específicas para métodos nacionales
    if (tipoMoneda === 'nacional') {
      if (metodoPagoNacional === 'fisico' && tipoServicio !== 'recoger') {
        nuevosErrores.pagoFisico = 'El pago físico solo está disponible para servicio "Para Llevar"'
        console.log('❌ Error: Pago físico no disponible para domicilio')
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
      tipoMoneda,
      metodoPagoInternacional,
      metodoPagoNacional,
      datosTarjeta,
      datosPayPal,
      datosZinli,
      datosZelle,
      datosPagoMovil,
      datosTransferencia,
      datosPagoFisico
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
                <h5 className="mb-0 text-white">
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
              <h5 className="mb-0 text-white">
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

          {/* Selector de Moneda */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 text-white">
                <i className="fas fa-coins me-2"></i>
                Tipo de Moneda
              </h5>
            </div>
            <div className="card-body">
              <CurrencySelector
                tipoMonedaSeleccionado={tipoMoneda}
                onSeleccionar={setTipoMoneda}
              />
            </div>
          </div>

          {/* Métodos de Pago */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0 text-white">
                <i className="fas fa-credit-card me-2"></i>
                Método de Pago
              </h5>
            </div>
            <div className="card-body">
              {tipoMoneda === 'internacional' ? (
              <PaymentMethodSelector
                  metodoSeleccionado={metodoPagoInternacional}
                  onSeleccionar={setMetodoPagoInternacional}
                  onAbrirModal={abrirModalPagoInternacional}
                />
              ) : (
                <NationalPaymentSelector
                  metodoSeleccionado={metodoPagoNacional}
                  onSeleccionar={setMetodoPagoNacional}
                  onAbrirModal={abrirModalPagoNacional}
                  tipoServicio={tipoServicio}
                />
              )}
            </div>
          </div>

          {/* Estado de datos de pago */}
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0 text-white">
                <i className="fas fa-file-invoice-dollar me-2"></i>
                Datos de Pago
              </h5>
            </div>
            <div className="card-body">
              {datosPagoCompletos ? (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  <strong>Datos de pago completados</strong>
                  <p className="mb-0 mt-2">
                    Los datos para {tipoMoneda === 'internacional' ? 
                      (metodoPagoInternacional === 'tarjeta' ? 'tarjeta de crédito/débito' : 
                       metodoPagoInternacional === 'paypal' ? 'PayPal' :
                       metodoPagoInternacional === 'zinli' ? 'Zinli' : 'Zelle') :
                      (metodoPagoNacional === 'pago_movil' ? 'Pago Móvil' :
                       metodoPagoNacional === 'transferencia' ? 'Transferencia Bancaria' : 'Pago Físico')
                    } han sido guardados correctamente.
                  </p>
                  <button 
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => tipoMoneda === 'internacional' ? 
                      abrirModalPagoInternacional(metodoPagoInternacional) : 
                      abrirModalPagoNacional(metodoPagoNacional)
                    }
                  >
                    <i className="fas fa-edit me-1"></i>
                    Modificar datos
                  </button>
                    </div>
              ) : (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Datos de pago requeridos</strong>
                  <p className="mb-0 mt-2">
                    Haz clic en el método de pago seleccionado para ingresar los datos necesarios.
                  </p>
                  {errores.datosPago && (
                    <div className="text-danger mt-2">
                      <i className="fas fa-times-circle me-1"></i>
                      {errores.datosPago}
                </div>
              )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna lateral - Resumen del pedido */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0 text-white">
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

      {/* Modales de datos de pago */}
      <PaymentDataModal
        show={mostrarModalPagoInternacional}
        onClose={cerrarModalPagoInternacional}
        metodoPago={metodoPagoInternacional}
        onSave={guardarDatosPagoInternacional}
        datosExistentes={
          metodoPagoInternacional === 'tarjeta' ? datosTarjeta :
          metodoPagoInternacional === 'paypal' ? datosPayPal :
          metodoPagoInternacional === 'zinli' ? datosZinli :
          datosZelle
        }
      />

      <NationalPaymentDataModal
        show={mostrarModalPagoNacional}
        onClose={cerrarModalPagoNacional}
        metodoPago={metodoPagoNacional}
        onSave={guardarDatosPagoNacional}
        datosExistentes={
          metodoPagoNacional === 'pago_movil' ? datosPagoMovil :
          metodoPagoNacional === 'transferencia' ? datosTransferencia :
          datosPagoFisico
        }
      />
    </div>
  )
}

export default CheckoutPage

