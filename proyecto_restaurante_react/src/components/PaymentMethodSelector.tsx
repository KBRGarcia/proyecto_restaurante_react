import type { MetodoPagoInternacional } from '../types.ts'

/**
 * Selector de Métodos de Pago Internacionales
 * Permite al usuario elegir entre diferentes métodos de pago internacionales
 * 
 * Fuente: https://react.dev/learn/conditional-rendering
 */

interface PaymentMethodSelectorProps {
  metodoSeleccionado: MetodoPagoInternacional
  onSeleccionar: (metodo: MetodoPagoInternacional) => void
  onAbrirModal: (metodo: MetodoPagoInternacional) => void
}

interface MetodoPagoOption {
  id: MetodoPagoInternacional
  nombre: string
  icono: string
  descripcion: string
  color: string
}

function PaymentMethodSelector({ metodoSeleccionado, onSeleccionar, onAbrirModal }: PaymentMethodSelectorProps) {
  
  const metodosPago: MetodoPagoOption[] = [
    {
      id: 'tarjeta',
      nombre: 'Tarjeta de Crédito/Débito',
      icono: 'credit-card',
      descripcion: 'Visa, Mastercard',
      color: 'primary'
    },
    {
      id: 'paypal',
      nombre: 'PayPal',
      icono: 'paypal',
      descripcion: 'Pago seguro con PayPal',
      color: 'info'
    },
    {
      id: 'zinli',
      nombre: 'Zinli',
      icono: 'mobile-alt',
      descripcion: 'Pago móvil Zinli',
      color: 'success'
    },
    {
      id: 'zelle',
      nombre: 'Zelle',
      icono: 'university',
      descripcion: 'Transferencia Zelle',
      color: 'warning'
    }
  ]

  return (
    <div className="payment-methods-grid">
      <div className="row g-3">
        {metodosPago.map(metodo => (
          <div key={metodo.id} className="col-md-6">
            <div
              className={`payment-method-card ${metodoSeleccionado === metodo.id ? 'selected' : ''}`}
              onClick={() => {
                onSeleccionar(metodo.id)
                onAbrirModal(metodo.id)
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSeleccionar(metodo.id)
                  onAbrirModal(metodo.id)
                }
              }}
            >
              <div className="d-flex align-items-center">
                {/* Icono */}
                <div className={`payment-icon bg-${metodo.color}`}>
                  <i className={`fab fa-${metodo.icono === 'credit-card' ? 'cc-' + metodo.icono.replace('credit-card', 'visa') : metodo.icono} ${metodo.icono === 'mobile-alt' || metodo.icono === 'university' ? 'fas' : ''}`}></i>
                </div>

                {/* Información */}
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">{metodo.nombre}</h6>
                  <small className="text-muted">{metodo.descripcion}</small>
                  <small className="text-primary d-block mt-1">
                    <i className="fas fa-edit me-1"></i>
                    Haz clic para ingresar datos
                  </small>
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

              {/* Logos de tarjetas */}
              {metodo.id === 'tarjeta' && (
                <div className="mt-2 d-flex gap-2">
                  <i className="fab fa-cc-visa fa-2x text-primary"></i>
                  <i className="fab fa-cc-mastercard fa-2x text-danger"></i>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodSelector

