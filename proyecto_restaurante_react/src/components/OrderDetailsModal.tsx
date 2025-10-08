import type { Orden } from '../types.ts'

/**
 * Modal de Detalles de Orden
 * Muestra información completa de una orden específica
 * 
 * Fuente: https://getbootstrap.com/docs/5.3/components/modal/
 */

interface OrderDetailsModalProps {
  orden: Orden | null
  onClose: () => void
}

// Datos mock de productos en la orden
// TODO: Integrar con backend para obtener detalles reales
interface DetalleProducto {
  id: number
  nombre: string
  cantidad: number
  precio: number
  subtotal: number
}

function OrderDetailsModal({ orden, onClose }: OrderDetailsModalProps) {
  if (!orden) return null

  /**
   * Formatear fecha legible
   */
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Obtener color del estado
   */
  const getEstadoColor = (estado: string): string => {
    const colores: Record<string, string> = {
      pendiente: 'warning',
      preparando: 'info',
      listo: 'primary',
      entregado: 'success',
      cancelado: 'danger',
    }
    return colores[estado] || 'secondary'
  }

  // Mock de productos (en producción vendría del backend)
  const productosEjemplo: DetalleProducto[] = [
    { id: 1, nombre: 'Pizza Margarita', cantidad: 2, precio: 150.00, subtotal: 300.00 },
    { id: 2, nombre: 'Refresco Grande', cantidad: 2, precio: 35.00, subtotal: 70.00 },
    { id: 3, nombre: 'Ensalada César', cantidad: 1, precio: 80.00, subtotal: 80.00 },
  ]

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-receipt me-2"></i>
              Detalles de la Orden #{orden.id}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            
            {/* Estado y tipo de servicio */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Estado Actual</h6>
                    <h4 className="mb-0">
                      <span className={`badge bg-${getEstadoColor(orden.estado)} fs-6`}>
                        {orden.estado.toUpperCase()}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Tipo de Servicio</h6>
                    <h5 className="mb-0">
                      <i className={`fas fa-${
                        orden.tipo_servicio === 'domicilio' ? 'motorcycle' : 'shopping-bag'
                      } me-2`}></i>
                      {orden.tipo_servicio === 'domicilio' ? 'A Domicilio' : 'Para Llevar'}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline de la orden */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="fas fa-history me-2"></i>
                Línea de Tiempo
              </h6>
              <div className="timeline">
                <div className="timeline-item">
                  <i className="fas fa-check-circle text-success"></i>
                  <div className="timeline-content">
                    <strong>Orden Recibida</strong>
                    <br />
                    <small className="text-muted">{formatearFecha(orden.fecha_orden)}</small>
                  </div>
                </div>
                
                {orden.estado !== 'cancelado' && orden.estado !== 'pendiente' && (
                  <div className="timeline-item">
                    <i className={`fas fa-utensils ${orden.estado === 'preparando' || orden.estado === 'listo' || orden.estado === 'entregado' ? 'text-info' : 'text-muted'}`}></i>
                    <div className="timeline-content">
                      <strong>En Preparación</strong>
                      <br />
                      <small className="text-muted">Cocinando tus platillos</small>
                    </div>
                  </div>
                )}

                {(orden.estado === 'listo' || orden.estado === 'entregado') && (
                  <div className="timeline-item">
                    <i className="fas fa-check text-primary"></i>
                    <div className="timeline-content">
                      <strong>Pedido Listo</strong>
                      <br />
                      <small className="text-muted">Tu orden está lista</small>
                    </div>
                  </div>
                )}

                {orden.estado === 'entregado' && (
                  <div className="timeline-item">
                    <i className="fas fa-check-double text-success"></i>
                    <div className="timeline-content">
                      <strong>Entregado</strong>
                      <br />
                      <small className="text-muted">
                        {orden.fecha_entrega_estimada && formatearFecha(orden.fecha_entrega_estimada)}
                      </small>
                    </div>
                  </div>
                )}

                {orden.estado === 'cancelado' && (
                  <div className="timeline-item">
                    <i className="fas fa-times-circle text-danger"></i>
                    <div className="timeline-content">
                      <strong>Orden Cancelada</strong>
                      <br />
                      <small className="text-muted">Este pedido fue cancelado</small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información de entrega */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Información de Entrega
              </h6>
              <div className="card bg-light">
                <div className="card-body">
                  {orden.tipo_servicio === 'domicilio' && orden.direccion_entrega && (
                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                      <strong>Dirección de Entrega:</strong> {orden.direccion_entrega}
                    </p>
                  )}
                  {orden.tipo_servicio === 'recoger' && (
                    <p className="mb-2">
                      <i className="fas fa-store me-2 text-info"></i>
                      <strong>Recoger en:</strong> Calle Principal #123, Ciudad
                    </p>
                  )}
                  {orden.telefono_contacto && (
                    <p className="mb-2">
                      <i className="fas fa-phone me-2 text-success"></i>
                      <strong>Teléfono de Contacto:</strong> {orden.telefono_contacto}
                    </p>
                  )}
                  {orden.notas_especiales && (
                    <p className="mb-0">
                      <i className="fas fa-sticky-note me-2 text-warning"></i>
                      <strong>Notas Especiales:</strong> <em>{orden.notas_especiales}</em>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Productos ordenados */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="fas fa-utensils me-2"></i>
                Productos Ordenados
              </h6>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio Unit.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosEjemplo.map(producto => (
                      <tr key={producto.id}>
                        <td>
                          <i className="fas fa-utensils me-2 text-muted"></i>
                          {producto.nombre}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">{producto.cantidad}</span>
                        </td>
                        <td className="text-end">${producto.precio.toFixed(2)}</td>
                        <td className="text-end">
                          <strong>${producto.subtotal.toFixed(2)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de pago */}
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <strong>
                  <i className="fas fa-calculator me-2"></i>
                  Resumen de Pago
                </strong>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${orden.subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Impuestos (IVA 16%):</span>
                  <strong>${orden.impuestos.toFixed(2)}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h5 mb-0">Total:</span>
                  <span className="h5 mb-0 text-success">${orden.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              <i className="fas fa-times me-2"></i>
              Cerrar
            </button>
            {orden.estado === 'pendiente' && (
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => {
                  // TODO: Implementar cancelación de orden
                  alert('Funcionalidad de cancelación en desarrollo')
                }}
              >
                <i className="fas fa-ban me-2"></i>
                Cancelar Orden
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                // TODO: Implementar descarga de factura
                alert('Descarga de factura en desarrollo')
              }}
            >
              <i className="fas fa-download me-2"></i>
              Descargar Recibo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal

