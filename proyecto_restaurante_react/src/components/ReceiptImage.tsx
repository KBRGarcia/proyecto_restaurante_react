import '../styles/receipt.css'
import type { Orden, OrdenDetalle } from '../types'

/**
 * Componente para generar imagen de recibo
 * Diseñado específicamente para ser capturado como imagen
 * 
 * Fuente: https://getbootstrap.com/docs/5.3/utilities/spacing/
 */

interface ReceiptImageProps {
  orden: Orden
  detallesOrden: OrdenDetalle[]
}

function ReceiptImage({ orden, detallesOrden }: ReceiptImageProps) {
  /**
   * Formatear fecha legible
   */
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      id="receipt-content"
      className="receipt-container"
      style={{
        width: '400px',
        backgroundColor: 'white',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#333',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Header del restaurante */}
      <div className="text-center mb-4" style={{ borderBottom: '2px solid #007bff', paddingBottom: '15px' }}>
        <h2 style={{ 
          margin: '0 0 5px 0', 
          color: '#007bff', 
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          🍽️ Restaurante IKA
        </h2>
        <p style={{ margin: '0', color: '#666', fontSize: '11px' }}>
          Calle Principal #123, Ciudad<br />
          Tel: (555) 123-4567<br />
          Email: info@restauranteika.com
        </p>
      </div>

      {/* Información de la orden */}
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          <strong>Orden #:</strong>
          <span>{orden.id}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <strong>Fecha:</strong>
          <span>{formatearFecha(orden.fecha_orden)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <strong>Estado:</strong>
          <span style={{ 
            color: orden.estado === 'cancelado' ? '#dc3545' : '#28a745',
            fontWeight: 'bold'
          }}>
            {getEstadoTexto(orden.estado)}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <strong>Tipo de Servicio:</strong>
          <span>
            {orden.tipo_servicio === 'domicilio' ? '🏠 A Domicilio' : '📦 Para Llevar'}
          </span>
        </div>
      </div>

      {/* Información de entrega */}
      {(orden.direccion_entrega || orden.telefono_contacto) && (
        <div className="mb-3" style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          <h6 style={{ margin: '0 0 8px 0', color: '#495057', fontSize: '13px' }}>
            📍 Información de Entrega
          </h6>
          {orden.direccion_entrega && (
            <p style={{ margin: '0 0 5px 0', fontSize: '11px' }}>
              <strong>Dirección:</strong> {orden.direccion_entrega}
            </p>
          )}
          {orden.telefono_contacto && (
            <p style={{ margin: '0', fontSize: '11px' }}>
              <strong>Teléfono:</strong> {orden.telefono_contacto}
            </p>
          )}
        </div>
      )}

      {/* Productos */}
      <div className="mb-3">
        <h6 style={{ 
          margin: '0 0 10px 0', 
          color: '#495057', 
          fontSize: '13px',
          borderBottom: '1px solid #dee2e6',
          paddingBottom: '5px'
        }}>
          🍽️ Productos Ordenados
        </h6>
        
        {detallesOrden.map((detalle, index) => (
          <div key={detalle.id} style={{ 
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: index < detallesOrden.length - 1 ? '1px dotted #dee2e6' : 'none'
          }}>
            <div className="d-flex justify-content-between mb-1">
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>
                {detalle.producto_nombre}
              </span>
              <span style={{ fontSize: '11px' }}>
                ${detalle.precio_unitario.toFixed(2)}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ fontSize: '10px', color: '#6c757d' }}>
                Cantidad: {detalle.cantidad}
              </span>
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>
                ${detalle.subtotal.toFixed(2)}
              </span>
            </div>
            {detalle.notas_producto && (
              <div style={{ fontSize: '10px', color: '#fd7e14', fontStyle: 'italic', marginTop: '2px' }}>
                📝 {detalle.notas_producto}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de pago */}
      <div style={{ 
        borderTop: '2px solid #007bff', 
        paddingTop: '10px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px'
      }}>
        <div className="d-flex justify-content-between mb-1">
          <span>Subtotal:</span>
          <span>${orden.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span>Impuestos (IVA 16%):</span>
          <span>${orden.impuestos?.toFixed(2) || '0.00'}</span>
        </div>
        <hr style={{ margin: '8px 0', borderColor: '#dee2e6' }} />
        <div className="d-flex justify-content-between">
          <strong style={{ fontSize: '14px' }}>TOTAL:</strong>
          <strong style={{ fontSize: '14px', color: '#28a745' }}>
            ${orden.total.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Notas especiales */}
      {orden.notas_especiales && (
        <div className="mt-3" style={{ 
          backgroundColor: '#fff3cd', 
          padding: '8px', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <h6 style={{ margin: '0 0 5px 0', color: '#856404', fontSize: '12px' }}>
            📝 Notas Especiales
          </h6>
          <p style={{ margin: '0', fontSize: '11px', color: '#856404' }}>
            {orden.notas_especiales}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-4" style={{ 
        borderTop: '1px solid #dee2e6', 
        paddingTop: '10px',
        fontSize: '10px',
        color: '#6c757d'
      }}>
        <p style={{ margin: '0' }}>
          ¡Gracias por tu preferencia!<br />
          Recibo generado el {formatearFecha(new Date().toISOString())}
        </p>
      </div>
    </div>
  )
}

export default ReceiptImage
