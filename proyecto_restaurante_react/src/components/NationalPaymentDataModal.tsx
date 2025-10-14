import { useState, type FormEvent } from 'react'
import type { MetodoPagoNacional, DatosPagoMovil, DatosTransferencia, DatosPagoFisico, BancoVenezuela } from '../types.ts'

/**
 * Modal para Formulario de Datos de Pago Nacionales
 * Muestra el formulario correspondiente según el método de pago nacional seleccionado
 */

interface NationalPaymentDataModalProps {
  show: boolean
  onClose: () => void
  metodoPago: MetodoPagoNacional
  onSave: (datos: DatosPagoMovil | DatosTransferencia | DatosPagoFisico) => void
  datosExistentes?: DatosPagoMovil | DatosTransferencia | DatosPagoFisico
}

function NationalPaymentDataModal({ 
  show, 
  onClose, 
  metodoPago, 
  onSave, 
  datosExistentes 
}: NationalPaymentDataModalProps) {
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Estados para Pago Móvil
  const [datosPagoMovil, setDatosPagoMovil] = useState<DatosPagoMovil>(
    datosExistentes as DatosPagoMovil || {
      cedula: '',
      telefono: '',
      banco: 'provincial',
      numeroReferencia: '',
      fechaPago: ''
    }
  )

  // Estados para Transferencia
  const [datosTransferencia, setDatosTransferencia] = useState<DatosTransferencia>(
    datosExistentes as DatosTransferencia || {
      cedula: '',
      telefono: '',
      banco: 'provincial',
      numeroReferencia: '',
      fechaPago: ''
    }
  )

  // Estados para Pago Físico
  const [datosPagoFisico] = useState<DatosPagoFisico>(
    datosExistentes as DatosPagoFisico || {
      metodo: 'efectivo',
      horarioAtencion: 'Lunes a Viernes: 11:00 AM - 10:00 PM\nSábado y Domingo: 10:00 AM - 11:00 PM',
      direccionRestaurante: 'Calle Principal #123, Ciudad',
      limiteTiempo: 3
    }
  )

  // Lista de bancos venezolanos
  const bancosVenezuela: { id: BancoVenezuela; nombre: string; codigo: string }[] = [
    { id: 'provincial', nombre: 'Provincial', codigo: '0108' },
    { id: 'mercantil', nombre: 'Mercantil', codigo: '0105' },
    { id: 'banesco', nombre: 'Banesco', codigo: '0134' },
    { id: 'bnc', nombre: 'Banco Nacional de Crédito', codigo: '0191' },
    { id: 'bdv', nombre: 'Banco de Venezuela', codigo: '0102' },
    { id: 'venezolano', nombre: 'Venezolano de Crédito', codigo: '0104' }
  ]

  // Validación del formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (metodoPago === 'pago_movil') {
      if (!datosPagoMovil.cedula.trim()) {
        nuevosErrores.cedula = 'La cédula de identidad es requerida'
      } else if (!/^[VE]-\d{7,8}$/.test(datosPagoMovil.cedula)) {
        nuevosErrores.cedula = 'Formato de cédula inválido (V-12345678)'
      }
      
      if (!datosPagoMovil.telefono.trim()) {
        nuevosErrores.telefono = 'El teléfono es requerido'
      } else if (!/^0\d{10}$/.test(datosPagoMovil.telefono)) {
        nuevosErrores.telefono = 'Formato de teléfono inválido (04142583614)'
      }
      
      if (!datosPagoMovil.numeroReferencia?.trim()) {
        nuevosErrores.numeroReferencia = 'El número de referencia es requerido'
      }
      
      if (!datosPagoMovil.fechaPago) {
        nuevosErrores.fechaPago = 'La fecha del pago es requerida'
      }
    }

    if (metodoPago === 'transferencia') {
      if (!datosTransferencia.cedula.trim()) {
        nuevosErrores.cedula = 'La cédula de identidad es requerida'
      } else if (!/^[VE]-\d{7,8}$/.test(datosTransferencia.cedula)) {
        nuevosErrores.cedula = 'Formato de cédula inválido (V-12345678)'
      }
      
      if (!datosTransferencia.telefono?.trim()) {
        nuevosErrores.telefono = 'El teléfono es requerido'
      } else if (!/^0\d{10}$/.test(datosTransferencia.telefono)) {
        nuevosErrores.telefono = 'Formato de teléfono inválido (04142583614)'
      }
      
      if (!datosTransferencia.numeroReferencia?.trim()) {
        nuevosErrores.numeroReferencia = 'El número de referencia es requerido'
      }
      
      if (!datosTransferencia.fechaPago) {
        nuevosErrores.fechaPago = 'La fecha del pago es requerida'
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
      let datos: DatosPagoMovil | DatosTransferencia | DatosPagoFisico
      
      switch (metodoPago) {
        case 'pago_movil':
          datos = datosPagoMovil
          break
        case 'transferencia':
          datos = datosTransferencia
          break
        case 'fisico':
          datos = datosPagoFisico
          break
        default:
          datos = datosPagoMovil
      }

      onSave(datos)
      setLoading(false)
      onClose()
    }, 1000)
  }

  const getTituloModal = () => {
    switch (metodoPago) {
      case 'pago_movil':
        return 'Datos de Pago Móvil'
      case 'transferencia':
        return 'Datos de Transferencia Bancaria'
      case 'fisico':
        return 'Información de Pago Físico'
      default:
        return 'Datos de Pago Nacional'
    }
  }

  const getIconoModal = () => {
    switch (metodoPago) {
      case 'pago_movil':
        return 'fas fa-mobile-alt'
      case 'transferencia':
        return 'fas fa-university'
      case 'fisico':
        return 'fas fa-hand-holding-usd'
      default:
        return 'fas fa-coins'
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
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
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
                
                {/* Información del sistema para Pago Móvil */}
                {metodoPago === 'pago_movil' && (
                  <>
                    <div className="alert alert-info mb-4">
                      <h6><i className="fas fa-info-circle me-2"></i>Datos del Sistema</h6>
                      <div className="row">
                         <div className="col-md-6">
                           <strong>Cédula:</strong> C.I- V-25478369<br />
                           <strong>Teléfono:</strong> 04142583614
                         </div>
                         <div className="col-md-6">
                           <strong>Banco:</strong> 0108 - BBVA Banco Provincial<br />
                           <strong>Tipo:</strong> Cuenta Corriente
                         </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* Cédula */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-id-card me-1"></i>
                          Cédula de Identidad *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errores.cedula ? 'is-invalid' : ''}`}
                          placeholder="V-12345678"
                          value={datosPagoMovil.cedula}
                          onChange={(e) => {
                            setDatosPagoMovil({ ...datosPagoMovil, cedula: e.target.value.toUpperCase() })
                            if (errores.cedula) setErrores({ ...errores, cedula: '' })
                          }}
                        />
                        {errores.cedula && (
                          <div className="invalid-feedback">{errores.cedula}</div>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-phone me-1"></i>
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                          placeholder="04142583614"
                          value={datosPagoMovil.telefono}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '')
                            if (valor.length <= 11) {
                              setDatosPagoMovil({ ...datosPagoMovil, telefono: valor })
                              if (errores.telefono) setErrores({ ...errores, telefono: '' })
                            }
                          }}
                        />
                        {errores.telefono && (
                          <div className="invalid-feedback">{errores.telefono}</div>
                        )}
                      </div>

                      {/* Banco */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-university me-1"></i>
                          Banco de Origen *
                        </label>
                        <select
                          className={`form-select ${errores.banco ? 'is-invalid' : ''}`}
                          value={datosPagoMovil.banco}
                          onChange={(e) => {
                            setDatosPagoMovil({ ...datosPagoMovil, banco: e.target.value as BancoVenezuela })
                            if (errores.banco) setErrores({ ...errores, banco: '' })
                          }}
                        >
                          {bancosVenezuela.map(banco => (
                            <option key={banco.id} value={banco.id}>
                              {banco.codigo} - {banco.nombre}
                            </option>
                          ))}
                        </select>
                        {errores.banco && (
                          <div className="invalid-feedback">{errores.banco}</div>
                        )}
                      </div>

                      {/* Fecha del pago */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-calendar me-1"></i>
                          Fecha del Pago *
                        </label>
                        <input
                          type="datetime-local"
                          className={`form-control ${errores.fechaPago ? 'is-invalid' : ''}`}
                          value={datosPagoMovil.fechaPago}
                          onChange={(e) => {
                            setDatosPagoMovil({ ...datosPagoMovil, fechaPago: e.target.value })
                            if (errores.fechaPago) setErrores({ ...errores, fechaPago: '' })
                          }}
                        />
                        {errores.fechaPago && (
                          <div className="invalid-feedback">{errores.fechaPago}</div>
                        )}
                      </div>

                      {/* Número de referencia */}
                      <div className="col-12">
                        <label className="form-label">
                          <i className="fas fa-hashtag me-1"></i>
                          Número de Referencia Completo *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errores.numeroReferencia ? 'is-invalid' : ''}`}
                          placeholder="Número de referencia de la transacción"
                          value={datosPagoMovil.numeroReferencia}
                          onChange={(e) => {
                            setDatosPagoMovil({ ...datosPagoMovil, numeroReferencia: e.target.value })
                            if (errores.numeroReferencia) setErrores({ ...errores, numeroReferencia: '' })
                          }}
                        />
                        {errores.numeroReferencia && (
                          <div className="invalid-feedback">{errores.numeroReferencia}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Información del sistema para Transferencia */}
                {metodoPago === 'transferencia' && (
                  <>
                    <div className="alert alert-info mb-4">
                      <h6><i className="fas fa-info-circle me-2"></i>Datos del Sistema</h6>
                      <div className="row">
                         <div className="col-md-6">
                           <strong>Número de Cuenta:</strong> 0108-1234567890<br />
                           <strong>Banco:</strong> BBVA Banco Provincial
                         </div>
                         <div className="col-md-6">
                           <strong>Tipo de Cuenta:</strong> Cuenta Corriente<br />
                           <strong>Titular:</strong> Restaurante Sabor & Tradición
                         </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* Cédula */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-id-card me-1"></i>
                          Cédula de Identidad *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errores.cedula ? 'is-invalid' : ''}`}
                          placeholder="V-12345678"
                          value={datosTransferencia.cedula}
                          onChange={(e) => {
                            setDatosTransferencia({ ...datosTransferencia, cedula: e.target.value.toUpperCase() })
                            if (errores.cedula) setErrores({ ...errores, cedula: '' })
                          }}
                        />
                        {errores.cedula && (
                          <div className="invalid-feedback">{errores.cedula}</div>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-phone me-1"></i>
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                          placeholder="04142583614"
                          value={datosTransferencia.telefono}
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '')
                            if (valor.length <= 11) {
                              setDatosTransferencia({ ...datosTransferencia, telefono: valor })
                              if (errores.telefono) setErrores({ ...errores, telefono: '' })
                            }
                          }}
                        />
                        {errores.telefono && (
                          <div className="invalid-feedback">{errores.telefono}</div>
                        )}
                      </div>

                      {/* Banco */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-university me-1"></i>
                          Banco de Origen *
                        </label>
                        <select
                          className={`form-select ${errores.banco ? 'is-invalid' : ''}`}
                          value={datosTransferencia.banco}
                          onChange={(e) => {
                            setDatosTransferencia({ ...datosTransferencia, banco: e.target.value as BancoVenezuela })
                            if (errores.banco) setErrores({ ...errores, banco: '' })
                          }}
                        >
                          {bancosVenezuela.map(banco => (
                            <option key={banco.id} value={banco.id}>
                              {banco.codigo} - {banco.nombre}
                            </option>
                          ))}
                        </select>
                        {errores.banco && (
                          <div className="invalid-feedback">{errores.banco}</div>
                        )}
                      </div>

                      {/* Fecha del pago */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-calendar me-1"></i>
                          Fecha del Pago *
                        </label>
                        <input
                          type="datetime-local"
                          className={`form-control ${errores.fechaPago ? 'is-invalid' : ''}`}
                          value={datosTransferencia.fechaPago}
                          onChange={(e) => {
                            setDatosTransferencia({ ...datosTransferencia, fechaPago: e.target.value })
                            if (errores.fechaPago) setErrores({ ...errores, fechaPago: '' })
                          }}
                        />
                        {errores.fechaPago && (
                          <div className="invalid-feedback">{errores.fechaPago}</div>
                        )}
                      </div>

                      {/* Número de referencia */}
                      <div className="col-12">
                        <label className="form-label">
                          <i className="fas fa-hashtag me-1"></i>
                          Número de Referencia Completo *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errores.numeroReferencia ? 'is-invalid' : ''}`}
                          placeholder="Número de referencia de la transferencia"
                          value={datosTransferencia.numeroReferencia}
                          onChange={(e) => {
                            setDatosTransferencia({ ...datosTransferencia, numeroReferencia: e.target.value })
                            if (errores.numeroReferencia) setErrores({ ...errores, numeroReferencia: '' })
                          }}
                        />
                        {errores.numeroReferencia && (
                          <div className="invalid-feedback">{errores.numeroReferencia}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Información para Pago Físico */}
                {metodoPago === 'fisico' && (
                  <div className="text-center">
                    <div className="alert alert-info mb-4">
                      <h5><i className="fas fa-money-bill-wave me-2"></i>Pago Físico en el Local</h5>
                      <p className="mb-0">Debes dirigirte al restaurante para realizar el pago en efectivo o con tarjeta.</p>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-clock fa-3x text-primary mb-3"></i>
                            <h6>Horario de Atención</h6>
                            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>{datosPagoFisico.horarioAtencion}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-map-marker-alt fa-3x text-success mb-3"></i>
                            <h6>Dirección del Restaurante</h6>
                            <p className="text-muted">{datosPagoFisico.direccionRestaurante}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info mt-4">
                      <h6><i className="fas fa-clock me-2"></i>Tiempo de la Orden</h6>
                      <p className="mb-0">
                        Su orden estará lista para ser recogida en un plazo menor a {datosPagoFisico.limiteTiempo} horas
                      </p>
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
                className="btn btn-success"
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

export default NationalPaymentDataModal
