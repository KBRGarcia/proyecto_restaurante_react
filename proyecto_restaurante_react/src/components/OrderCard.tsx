import type { Orden, EstadoOrden, TipoServicio } from '../types.ts'

/**
 * Componente OrderCard
 * Muestra información resumida de una orden
 * 
 * Fuente: https://react.dev/learn/passing-props-to-a-component
 */

interface OrderCardProps {
  orden: Orden
  onVerDetalles: (orden: Orden) => void
}

function OrderCard({ orden, onVerDetalles }: OrderCardProps) {
  
  /**
   * Obtener configuración de badge según el estado
   */
  const getEstadoConfig = (estado: EstadoOrden) => {
    const configs = {
      pendiente: { 
        color: 'warning', 
        icon: 'clock', 
        texto: 'Pendiente',
        descripcion: 'Tu pedido está en espera'
      },
      preparando: { 
        color: 'info', 
        icon: 'utensils', 
        texto: 'Preparando',
        descripcion: 'Estamos preparando tu pedido'
      },
      listo: { 
        color: 'primary', 
        icon: 'check-circle', 
        texto: 'Listo',
        descripcion: 'Tu pedido está listo'
      },
      entregado: { 
        color: 'success', 
        icon: 'check-double', 
        texto: 'Entregado',
        descripcion: 'Pedido entregado exitosamente'
      },
      cancelado: { 
        color: 'danger', 
        icon: 'times-circle', 
        texto: 'Cancelado',
        descripcion: 'Este pedido fue cancelado'
      },
    }
    return configs[estado]
  }

  /**
   * Obtener configuración de tipo de servicio
   */
  const getTipoServicioConfig = (tipo: TipoServicio) => {
    const configs = {
      domicilio: { 
        icon: 'motorcycle', 
        texto: 'A Domicilio',
        color: 'primary'
      },
      recoger: { 
        icon: 'shopping-bag', 
        texto: 'Para Llevar',
        color: 'info'
      },
    }
    return configs[tipo]
  }

  /**
   * Formatear fecha legible
   */
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const estadoConfig = getEstadoConfig(orden.estado)
  const tipoConfig = getTipoServicioConfig(orden.tipo_servicio)

  return (
    <div className="card mb-3 shadow-sm hover-lift order-card">
      <div className="card-body">
        <div className="row align-items-center">
          
          {/* Columna izquierda: Info de la orden */}
          <div className="col-md-8">
            {/* Header con número de orden y estado */}
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0 me-3">
                <i className="fas fa-receipt me-2 text-primary"></i>
                Orden #{orden.id}
              </h5>
              <span className={`badge bg-${estadoConfig.color} me-2`}>
                <i className={`fas fa-${estadoConfig.icon} me-1`}></i>
                {estadoConfig.texto}
              </span>
              <span className={`badge bg-${tipoConfig.color}`}>
                <i className={`fas fa-${tipoConfig.icon} me-1`}></i>
                {tipoConfig.texto}
              </span>
            </div>

            {/* Información adicional */}
            <div className="row g-2 mb-2">
              <div className="col-sm-6">
                <small className="text-muted d-block">
                  <i className="fas fa-calendar-alt me-1"></i>
                  <strong>Fecha:</strong> {formatearFecha(orden.fecha_orden)}
                </small>
              </div>
              
              {orden.fecha_entrega_estimada && (
                <div className="col-sm-6">
                  <small className="text-muted d-block">
                    <i className="fas fa-clock me-1"></i>
                    <strong>Entrega estimada:</strong> {formatearFecha(orden.fecha_entrega_estimada)}
                  </small>
                </div>
              )}
            </div>

            {/* Dirección para domicilio */}
            {orden.direccion_entrega && (
              <div className="mb-2">
                <small className="text-muted">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  <strong>Dirección:</strong> {orden.direccion_entrega}
                </small>
              </div>
            )}

            {/* Teléfono de contacto */}
            {orden.telefono_contacto && (
              <div className="mb-2">
                <small className="text-muted">
                  <i className="fas fa-phone me-1"></i>
                  <strong>Contacto:</strong> {orden.telefono_contacto}
                </small>
              </div>
            )}

            {/* Notas especiales */}
            {orden.notas_especiales && (
              <div className="mb-2">
                <small className="text-muted fst-italic">
                  <i className="fas fa-sticky-note me-1"></i>
                  {orden.notas_especiales}
                </small>
              </div>
            )}
          </div>

          {/* Columna derecha: Total y acciones */}
          <div className="col-md-4 text-md-end text-center mt-3 mt-md-0">
            {/* Total */}
            <div className="mb-3">
              <small className="text-muted d-block">Total</small>
              <h3 className="mb-0 text-success">
                ${orden.total.toFixed(2)}
              </h3>
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                IVA incluido
              </small>
            </div>

            {/* Botón ver detalles */}
            <button
              className="btn btn-primary btn-sm w-100"
              onClick={() => onVerDetalles(orden)}
            >
              <i className="fas fa-eye me-2"></i>
              Ver Detalles
            </button>

            {/* Progreso visual del estado */}
            <div className="mt-3">
              <div className="progress" style={{ height: '4px' }}>
                <div
                  className={`progress-bar bg-${estadoConfig.color}`}
                  role="progressbar"
                  style={{
                    width: orden.estado === 'pendiente' ? '25%' :
                           orden.estado === 'preparando' ? '50%' :
                           orden.estado === 'listo' ? '75%' :
                           orden.estado === 'entregado' ? '100%' : '0%'
                  }}
                ></div>
              </div>
              <small className="text-muted d-block mt-1">
                {estadoConfig.descripcion}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCard

