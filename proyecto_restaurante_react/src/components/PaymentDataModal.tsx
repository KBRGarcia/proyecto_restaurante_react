import { useState, type FormEvent } from 'react'
import type { MetodoPago, DatosTarjeta, DatosPayPal, DatosZinli, DatosZelle } from '../types.ts'

/**
 * Modal para Formulario de Datos de Pago
 * Muestra el formulario correspondiente según el método de pago seleccionado
 */

interface PaymentDataModalProps {
  show: boolean
  onClose: () => void
  metodoPago: MetodoPago
  onSave: (datos: DatosTarjeta | DatosPayPal | DatosZinli | DatosZelle) => void
  datosExistentes?: DatosTarjeta | DatosPayPal | DatosZinli | DatosZelle
}

function PaymentDataModal({ show, onClose, metodoPago, onSave, datosExistentes }: PaymentDataModalProps) {
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Estados para cada método de pago
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>(
    datosExistentes as DatosTarjeta || {
      numeroTarjeta: '',
      nombreTitular: '',
      fechaExpiracion: '',
      cvv: ''
    }
  )

  const [datosPayPal, setDatosPayPal] = useState<DatosPayPal>(
    datosExistentes as DatosPayPal || {
      correo: '',
      password: ''
    }
  )

  const [datosZinli, setDatosZinli] = useState<DatosZinli>(
    datosExistentes as DatosZinli || {
      numeroTelefono: '',
      pin: ''
    }
  )

  const [datosZelle, setDatosZelle] = useState<DatosZelle>(
    datosExistentes as DatosZelle || {
      correoZelle: '',
      nombreCompleto: ''
    }
  )

  // Funciones de formateo
  const formatearNumeroTarjeta = (valor: string) => {
    const numero = valor.replace(/\s/g, '')
    const grupos = numero.match(/.{1,4}/g)
    return grupos ? grupos.join(' ') : numero
  }

  const formatearFechaExpiracion = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length >= 2) {
      return numeros.slice(0, 2) + '/' + numeros.slice(2, 4)
    }
    return numeros
  }

  const detectarTipoTarjeta = (numero: string) => {
    const primerDigito = numero.charAt(0)
    if (primerDigito === '4') return 'visa'
    if (primerDigito === '5') return 'mastercard'
    return undefined
  }

  // Validación del formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (metodoPago === 'tarjeta') {
      if (!datosTarjeta.numeroTarjeta || datosTarjeta.numeroTarjeta.length !== 16) {
        nuevosErrores.numeroTarjeta = 'Número de tarjeta inválido (16 dígitos)'
      }
      if (!datosTarjeta.nombreTitular.trim()) {
        nuevosErrores.nombreTitular = 'Nombre del titular es requerido'
      }
      if (!datosTarjeta.fechaExpiracion || !/^\d{2}\/\d{2}$/.test(datosTarjeta.fechaExpiracion)) {
        nuevosErrores.fechaExpiracion = 'Fecha inválida (MM/AA)'
      }
      if (!datosTarjeta.cvv || datosTarjeta.cvv.length < 3) {
        nuevosErrores.cvv = 'CVV inválido (3-4 dígitos)'
      }
    }

    if (metodoPago === 'paypal') {
      if (!datosPayPal.correo || !/\S+@\S+\.\S+/.test(datosPayPal.correo)) {
        nuevosErrores.correoPayPal = 'Correo de PayPal inválido'
      }
      if (!datosPayPal.password) {
        nuevosErrores.passwordPayPal = 'Contraseña de PayPal requerida'
      }
    }

    if (metodoPago === 'zinli') {
      if (!datosZinli.numeroTelefono || datosZinli.numeroTelefono.length < 10) {
        nuevosErrores.numeroZinli = 'Número de teléfono inválido'
      }
      if (!datosZinli.pin || datosZinli.pin.length !== 4) {
        nuevosErrores.pinZinli = 'PIN debe tener 4 dígitos'
      }
    }

    if (metodoPago === 'zelle') {
      if (!datosZelle.correoZelle || !/\S+@\S+\.\S+/.test(datosZelle.correoZelle)) {
        nuevosErrores.correoZelle = 'Correo de Zelle inválido'
      }
      if (!datosZelle.nombreCompleto.trim()) {
        nuevosErrores.nombreZelle = 'Nombre completo es requerido'
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setLoading(true)

    // Simular guardado
    setTimeout(() => {
      let datos: DatosTarjeta | DatosPayPal | DatosZinli | DatosZelle
      
      switch (metodoPago) {
        case 'tarjeta':
          datos = datosTarjeta
          break
        case 'paypal':
          datos = datosPayPal
          break
        case 'zinli':
          datos = datosZinli
          break
        case 'zelle':
          datos = datosZelle
          break
        default:
          datos = datosTarjeta
      }

      onSave(datos)
      setLoading(false)
      onClose()
    }, 1000)
  }

  const getTituloModal = () => {
    switch (metodoPago) {
      case 'tarjeta':
        return 'Datos de Tarjeta de Crédito/Débito'
      case 'paypal':
        return 'Datos de PayPal'
      case 'zinli':
        return 'Datos de Zinli'
      case 'zelle':
        return 'Datos de Zelle'
      default:
        return 'Datos de Pago'
    }
  }

  const getIconoModal = () => {
    switch (metodoPago) {
      case 'tarjeta':
        return 'fas fa-credit-card'
      case 'paypal':
        return 'fab fa-paypal'
      case 'zinli':
        return 'fas fa-mobile-alt'
      case 'zelle':
        return 'fas fa-university'
      default:
        return 'fas fa-credit-card'
    }
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        style={{ zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title text-white">
                <i className={`${getIconoModal()} me-2`}></i>
                {getTituloModal()}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                
                {/* Formulario de Tarjeta */}
                {metodoPago === 'tarjeta' && (
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
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\s/g, '')
                            // Solo permitir números enteros
                            if (valor.length <= 16 && /^\d+$/.test(valor)) {
                              setDatosTarjeta({
                                ...datosTarjeta,
                                numeroTarjeta: valor,
                                tipoTarjeta: detectarTipoTarjeta(valor)
                              })
                              if (errores.numeroTarjeta) {
                                setErrores({ ...errores, numeroTarjeta: '' })
                              }
                            }
                          }}
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
                      </div>
                      {errores.numeroTarjeta && (
                        <div className="invalid-feedback">{errores.numeroTarjeta}</div>
                      )}
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
                          // Solo permitir números enteros
                          if (valor.length <= 4 && /^\d+$/.test(valor)) {
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
                )}

                {/* Formulario PayPal */}
                {metodoPago === 'paypal' && (
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
                          const valor = e.target.value
                          // Solo permitir formato de email válido
                          if (/^[a-zA-Z0-9._%+-@]*$/.test(valor)) {
                            setDatosPayPal({ ...datosPayPal, correo: valor })
                            if (errores.correoPayPal) setErrores({ ...errores, correoPayPal: '' })
                          }
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
                )}

                {/* Formulario Zinli */}
                {metodoPago === 'zinli' && (
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
                          const valor = e.target.value.replace(/\D/g, '')
                          // Solo permitir números enteros
                          if (valor.length <= 15 && /^\d+$/.test(valor)) {
                            setDatosZinli({ ...datosZinli, numeroTelefono: valor })
                            if (errores.numeroZinli) setErrores({ ...errores, numeroZinli: '' })
                          }
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
                          // Solo permitir números enteros
                          if (valor.length <= 4 && /^\d+$/.test(valor)) {
                            setDatosZinli({ ...datosZinli, pin: valor })
                            if (errores.pinZinli) setErrores({ ...errores, pinZinli: '' })
                          }
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
                )}

                {/* Formulario Zelle */}
                {metodoPago === 'zelle' && (
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
                          const valor = e.target.value
                          // Solo permitir formato de email válido
                          if (/^[a-zA-Z0-9._%+-@]*$/.test(valor)) {
                            setDatosZelle({ ...datosZelle, correoZelle: valor })
                            if (errores.correoZelle) setErrores({ ...errores, correoZelle: '' })
                          }
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
                )}

              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Guardar Datos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentDataModal
