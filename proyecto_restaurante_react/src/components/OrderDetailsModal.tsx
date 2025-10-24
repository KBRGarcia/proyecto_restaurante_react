import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config'
import { useNotification } from '../contexts/NotificationContext'
import LoadingSpinner from './LoadingSpinner'
import ReceiptImage from './ReceiptImage'
import { useImageDownload } from '../hooks/useImageDownload'
import type { Orden, OrdenDetalle } from '../types.ts'

/**
 * Modal de Detalles de Orden
 * Muestra información completa de una orden específica
 * 
 * Fuente: https://getbootstrap.com/docs/5.3/components/modal/
 */

interface OrderDetailsModalProps {
  orden: Orden | null
  onClose: () => void
  onOrdenActualizada?: () => void // Callback para recargar órdenes después de cancelar
}

function OrderDetailsModal({ orden, onClose, onOrdenActualizada }: OrderDetailsModalProps) {
  const { success, error: showError } = useNotification()
  const { downloadImage, copyImageToClipboard, isGenerating } = useImageDownload()
  const [detallesOrden, setDetallesOrden] = useState<OrdenDetalle[]>([])
  const [loadingDetalles, setLoadingDetalles] = useState(false)
  const [errorDetalles, setErrorDetalles] = useState<string | null>(null)
  const [cancelando, setCancelando] = useState(false)
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false)
  const [mostrarRecibo, setMostrarRecibo] = useState(false)

  /**
   * Cargar detalles de productos de la orden desde la API
   */
  useEffect(() => {
    if (orden?.id) {
      cargarDetallesOrden()
    }
  }, [orden?.id])

  const cargarDetallesOrden = async () => {
    if (!orden?.id) return

    setLoadingDetalles(true)
    setErrorDetalles(null)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${API_ENDPOINTS.ordenes}?id=${orden.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (data.success && data.data?.detalles) {
        setDetallesOrden(data.data.detalles)
      } else {
        throw new Error('No se pudieron cargar los detalles de la orden')
      }
    } catch (error) {
      console.error('Error al cargar detalles de la orden:', error)
      setErrorDetalles(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoadingDetalles(false)
    }
  }

  /**
   * Descargar recibo como imagen
   */
  const handleDownloadReceipt = async () => {
    if (!orden || detallesOrden.length === 0) {
      showError(
        'Error',
        'No se pueden generar recibos sin productos',
        4000
      )
      return
    }

    await downloadImage('receipt-content', {
      filename: `recibo_orden_${orden.id}`,
      quality: 0.95,
      backgroundColor: '#ffffff',
      scale: 2
    })
  }

  /**
   * Copiar recibo al portapapeles
   */
  const handleCopyReceipt = async () => {
    if (!orden || detallesOrden.length === 0) {
      showError(
        'Error',
        'No se pueden generar recibos sin productos',
        4000
      )
      return
    }

    await copyImageToClipboard('receipt-content', {
      backgroundColor: '#ffffff',
      scale: 2
    })
  }

  /**
   * Cancelar orden
   */
  const cancelarOrden = async () => {
    if (!orden?.id) return

    setCancelando(true)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${API_ENDPOINTS.ordenes}?id=${orden.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        // Mostrar notificación de éxito con información sobre el reembolso
        success(
          '¡Orden Cancelada Exitosamente!',
          `Tu orden #${orden.id} ha sido cancelada. El monto de $${orden.total.toFixed(2)} será devuelto a tu método de pago original en un plazo máximo de 30 minutos.`,
          8000
        )
        
        // Llamar al callback para recargar las órdenes
        if (onOrdenActualizada) {
          onOrdenActualizada()
        }
        
        // Cerrar el modal
        onClose()
      } else {
        showError(
          'Error al Cancelar',
          data.message || 'No se pudo cancelar la orden. Por favor, intenta nuevamente.',
          6000
        )
      }
    } catch (error) {
      console.error('Error al cancelar orden:', error)
      showError(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente.',
        6000
      )
    } finally {
      setCancelando(false)
      setMostrarModalConfirmacion(false)
    }
  }

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
      en_camino: 'secondary',
      entregado: 'success',
      cancelado: 'danger',
    }
    return colores[estado] || 'secondary'
  }

  /**
   * Obtener texto del estado
   */
  const getEstadoTexto = (estado: string): string => {
    const textos: Record<string, string> = {
      pendiente: 'Pendiente',
      preparando: 'Preparando',
      listo: 'Listo',
      en_camino: 'En Camino',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    }
    return textos[estado] || estado
  }


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
            <h5 className="modal-title text-white">
              <i className="fas fa-receipt me-2"></i>
              Detalles de la Orden #{orden.id}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            >
            </button>
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
                        {getEstadoTexto(orden.estado)}
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
                    <i className={`fas fa-utensils ${['preparando', 'listo', 'en_camino', 'entregado'].includes(orden.estado) ? 'text-info' : 'text-muted'}`}></i>
                    <div className="timeline-content">
                      <strong>En Preparación</strong>
                      <br />
                      <small className="text-muted">
                        {orden.fecha_preparando ? formatearFecha(orden.fecha_preparando) : 'Cocinando tus platillos'}
                      </small>
                    </div>
                  </div>
                )}

                {(orden.estado === 'listo' || orden.estado === 'en_camino' || orden.estado === 'entregado') && (
                  <div className="timeline-item">
                    <i className="fas fa-check text-primary"></i>
                    <div className="timeline-content">
                      <strong>Pedido Listo</strong>
                      <br />
                      <small className="text-muted">
                        {orden.fecha_listo ? formatearFecha(orden.fecha_listo) : 'Tu orden está lista'}
                      </small>
                    </div>
                  </div>
                )}

                {/* En Camino - Solo para domicilio */}
                {orden.tipo_servicio === 'domicilio' && (orden.estado === 'en_camino' || orden.estado === 'entregado') && (
                  <div className="timeline-item">
                    <i className="fas fa-motorcycle text-secondary"></i>
                    <div className="timeline-content">
                      <strong>En Camino</strong>
                      <br />
                      <small className="text-muted">
                        {orden.fecha_en_camino ? formatearFecha(orden.fecha_en_camino) : 'Tu pedido está en camino'}
                      </small>
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
                        {orden.fecha_entregado ? formatearFecha(orden.fecha_entregado) : '¡Disfruta tu comida!'}
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
                      <small className="text-muted">
                        {orden.fecha_cancelado ? formatearFecha(orden.fecha_cancelado) : 'Este pedido fue cancelado'}
                      </small>
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
              
              {loadingDetalles ? (
                <div className="text-center py-4">
                  <LoadingSpinner mensaje="Cargando productos..." />
                </div>
              ) : errorDetalles ? (
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Error al cargar productos:</strong> {errorDetalles}
                  <button 
                    className="btn btn-sm btn-outline-warning ms-2"
                    onClick={cargarDetallesOrden}
                  >
                    <i className="fas fa-redo me-1"></i>
                    Reintentar
                  </button>
                </div>
              ) : detallesOrden.length > 0 ? (
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
                      {detallesOrden.map(detalle => (
                        <tr key={detalle.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {detalle.producto_imagen && (
                                <img 
                                  src={detalle.producto_imagen} 
                                  alt={detalle.producto_nombre}
                                  className="me-3 rounded"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="fw-medium">
                                  <i className="fas fa-utensils me-2 text-muted"></i>
                                  {detalle.producto_nombre}
                                </div>
                                {detalle.producto_descripcion && (
                                  <small className="text-muted">{detalle.producto_descripcion}</small>
                                )}
                                {detalle.notas_producto && (
                                  <div className="mt-1">
                                    <small className="text-warning">
                                      <i className="fas fa-sticky-note me-1"></i>
                                      <em>{detalle.notas_producto}</em>
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">{detalle.cantidad}</span>
                          </td>
                          <td className="text-end">${detalle.precio_unitario.toFixed(2)}</td>
                          <td className="text-end">
                            <strong>${detalle.subtotal.toFixed(2)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  No se encontraron productos para esta orden.
                </div>
              )}
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
                  <strong>${orden.subtotal?.toFixed(2) || '0.00'}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Impuestos (IVA 16%):</span>
                  <strong>${orden.impuestos?.toFixed(2) || '0.00'}</strong>
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
            {['pendiente', 'preparando'].includes(orden.estado) && (
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => setMostrarModalConfirmacion(true)}
                disabled={cancelando}
              >
                <i className="fas fa-ban me-2"></i>
                Cancelar Orden
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-outline-primary me-2"
              onClick={() => setMostrarRecibo(!mostrarRecibo)}
              disabled={detallesOrden.length === 0}
            >
              <i className={`fas fa-${mostrarRecibo ? 'eye-slash' : 'eye'} me-2`}></i>
              {mostrarRecibo ? 'Ocultar Recibo' : 'Ver Recibo'}
            </button>
            {/*<button 
              type="button" 
              className="btn btn-primary me-2"
              onClick={handleDownloadReceipt}
              disabled={isGenerating || detallesOrden.length === 0}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generando...
                </>
              ) : (
                <>
                  <i className="fas fa-download me-2"></i>
                  Descargar Recibo
                </>
              )}
            </button>*/}
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={handleCopyReceipt}
              disabled={isGenerating || detallesOrden.length === 0}
            >
              <i className="fas fa-copy me-2"></i>
              Copiar Imagen
            </button>
          </div>
        </div>
      </div>

      {/* Vista Previa del Recibo */}
      {mostrarRecibo && orden && detallesOrden.length > 0 && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          onClick={() => setMostrarRecibo(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-receipt me-2"></i>
                  Vista Previa del Recibo
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setMostrarRecibo(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <ReceiptImage orden={orden} detallesOrden={detallesOrden} />
                <div className="mt-3">
                  <button 
                    type="button" 
                    className="btn btn-success me-2"
                    onClick={handleDownloadReceipt}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Generando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download me-2"></i>
                        Descargar Imagen
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleCopyReceipt}
                    disabled={isGenerating}
                  >
                    <i className="fas fa-copy me-2"></i>
                    Copiar al Portapapeles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Cancelación */}
      {mostrarModalConfirmacion && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          onClick={() => setMostrarModalConfirmacion(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Confirmar Cancelación
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setMostrarModalConfirmacion(false)}
                  disabled={cancelando}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>¿Estás seguro de cancelar esta orden?</strong>
                </div>
                
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <p className="mb-2"><strong>Orden #:</strong> {orden.id}</p>
                    <p className="mb-2"><strong>Total:</strong> ${orden.total.toFixed(2)}</p>
                    <p className="mb-0"><strong>Estado Actual:</strong> 
                      <span className={`badge bg-${
                        orden.estado === 'pendiente' ? 'warning' : 'info'
                      } ms-2`}>
                        {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="alert alert-info mb-0">
                  <h6 className="alert-heading">
                    <i className="fas fa-money-bill-wave me-2"></i>
                    Información de Reembolso
                  </h6>
                  <p className="mb-0">
                    El monto de <strong>${orden.total.toFixed(2)}</strong> será devuelto a tu método de pago original 
                    en un plazo <strong>no mayor a 30 minutos</strong>.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setMostrarModalConfirmacion(false)}
                  disabled={cancelando}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={cancelarOrden}
                  disabled={cancelando}
                >
                  {cancelando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-ban me-2"></i>
                      Sí, Cancelar Orden
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsModal

