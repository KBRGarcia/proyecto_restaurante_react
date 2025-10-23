import type { MetodoPagoNacional } from '../types.ts'

/**
 * Selector de Métodos de Pago Nacionales
 * Muestra los métodos de pago disponibles en moneda nacional
 * 
 * Fuente: https://react.dev/learn/conditional-rendering
 */

interface NationalPaymentSelectorProps {
  metodoSeleccionado: MetodoPagoNacional
  onSeleccionar: (metodo: MetodoPagoNacional) => void
  onAbrirModal: (metodo: MetodoPagoNacional) => void
  tipoServicio: 'recoger' | 'domicilio'
}

interface MetodoPagoNacionalOption {
  id: MetodoPagoNacional
  nombre: string
  icono: string
  descripcion: string
  color: string
  disponible: boolean
  motivoNoDisponible?: string
}

function NationalPaymentSelector({ 
  metodoSeleccionado, 
  onSeleccionar, 
  onAbrirModal, 
  tipoServicio 
}: NationalPaymentSelectorProps) {
  
  const metodosPagoNacionales: MetodoPagoNacionalOption[] = [
    {
      id: 'pago_movil',
      nombre: 'Pago Móvil',
      icono: 'fas fa-mobile-alt',
      descripcion: 'Transferencia por Pago Móvil',
      color: 'success',
      disponible: true
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia Bancaria',
      icono: 'fas fa-university',
      descripcion: 'Transferencia directa a cuenta',
      color: 'info',
      disponible: true
    },
    {
      id: 'fisico',
      nombre: 'Pago Físico',
      icono: 'fas fa-hand-holding-usd',
      descripcion: 'Efectivo o tarjeta en el local',
      color: 'warning',
      disponible: tipoServicio === 'recoger',
      motivoNoDisponible: 'Solo disponible para "Para Llevar"'
    }
  ]

  const handleClick = (metodo: MetodoPagoNacionalOption) => {
    if (!metodo.disponible) return
    
    onSeleccionar(metodo.id)
    onAbrirModal(metodo.id)
  }

  return (
    <div className="national-payment-methods-grid">
      <div className="row g-3">
        {metodosPagoNacionales.map(metodo => (
          <div key={metodo.id} className="col-md-4">
            <div
              className={`payment-method-card ${metodoSeleccionado === metodo.id ? 'selected' : ''} ${!metodo.disponible ? 'disabled' : ''}`}
              onClick={() => handleClick(metodo)}
              role="button"
              tabIndex={metodo.disponible ? 0 : -1}
              onKeyPress={(e) => {
                if (metodo.disponible && (e.key === 'Enter' || e.key === ' ')) {
                  handleClick(metodo)
                }
              }}
            >
              <div className="d-flex align-items-center">
                {/* Icono */}
                <div className={`payment-icon bg-${metodo.color} ${!metodo.disponible ? 'opacity-50' : ''}`}>
                  <i className={metodo.icono}></i>
                </div>

                {/* Información */}
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">{metodo.nombre}</h6>
                  <small className="text-muted">{metodo.descripcion}</small>
                  {metodo.disponible ? (
                    <small className="text-primary d-block mt-1">
                      <i className="fas fa-edit me-1"></i>
                      Haz clic para ingresar datos
                    </small>
                  ) : (
                    <small className="text-danger d-block mt-1">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      {metodo.motivoNoDisponible}
                    </small>
                  )}
                </div>

                {/* Checkbox */}
                <div className="payment-check">
                  {metodoSeleccionado === metodo.id && (
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  )}
                  {metodoSeleccionado !== metodo.id && (
                    <i className="far fa-circle text-muted fa-2x"></i>
                  )}
                </div>
              </div>

              {/* Información adicional para pago físico */}
              {metodo.id === 'fisico' && metodo.disponible && (
                <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                  <small className="text-warning">
                    <i className="fas fa-clock me-1"></i>
                    <strong>Importante:</strong> Tienes 3 horas para pagar en el local
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NationalPaymentSelector
