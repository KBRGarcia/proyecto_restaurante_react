import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import type { ItemCarrito } from '../types.ts'

/**
 * Página del Carrito de Compras
 * 
 * Permite al usuario visualizar, modificar y gestionar los productos
 * que desea ordenar antes de proceder al pago.
 * 
 * Fuentes oficiales:
 * - React Router: https://reactrouter.com/en/main/hooks/use-navigate
 * - React Hooks: https://react.dev/reference/react
 */
function CartPage() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const {
    items,
    cantidadTotal,
    subtotal,
    impuestos,
    total,
    actualizarCantidad,
    eliminarItem,
    vaciarCarrito,
  } = useCart()

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  /**
   * Manejar cambio en la cantidad de un item
   */
  const handleCantidadChange = (itemId: number, nuevaCantidad: number) => {
    if (nuevaCantidad >= 1 && nuevaCantidad <= 99) {
      actualizarCantidad(itemId, nuevaCantidad)
    }
  }

  /**
   * Incrementar cantidad de un item
   */
  const incrementarCantidad = (item: ItemCarrito) => {
    if (item.cantidad < 99) {
      actualizarCantidad(item.id, item.cantidad + 1)
    }
  }

  /**
   * Decrementar cantidad de un item
   */
  const decrementarCantidad = (item: ItemCarrito) => {
    if (item.cantidad > 1) {
      actualizarCantidad(item.id, item.cantidad - 1)
    }
  }

  /**
   * Confirmar vaciado del carrito
   */
  const handleVaciarCarrito = () => {
    setShowConfirmModal(true)
  }

  /**
   * Proceder al checkout
   */
  const handleProcederPago = () => {
    // TODO: Implementar lógica de checkout
    alert('Funcionalidad de pago en desarrollo')
  }

  // Renderizar carrito vacío
  if (items.length === 0) {
    return (
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-sm p-5">
              <div className="mb-4">
                <i className="fas fa-shopping-cart fa-5x text-muted"></i>
              </div>
              <h2 className="mb-3">Tu carrito está vacío</h2>
              <p className="text-muted mb-4">
                Agrega algunos productos deliciosos a tu carrito para comenzar
              </p>
              <Link to="/menu" className="btn btn-primary btn-lg">
                <i className="fas fa-utensils me-2"></i>
                Ver Menú
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar carrito con items
  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">
          <i className="fas fa-shopping-cart me-2"></i>
          Carrito de Compras
        </h1>
        <button
          className="btn btn-outline-danger"
          onClick={handleVaciarCarrito}
        >
          <i className="fas fa-trash me-2"></i>
          Vaciar Carrito
        </button>
      </div>

      {/* Información del usuario */}
      {usuario && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-user me-2"></i>
          Ordenando como: <strong>{usuario.nombre} {usuario.apellido}</strong>
          {usuario.direccion && (
            <>
              <br />
              <i className="fas fa-map-marker-alt me-2 ms-3"></i>
              Dirección: {usuario.direccion}
            </>
          )}
        </div>
      )}

      <div className="row">
        {/* Columna de items */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                Productos ({cantidadTotal} {cantidadTotal === 1 ? 'item' : 'items'})
              </h5>
            </div>
            <div className="card-body p-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-bottom p-3 hover-bg-light"
                  style={{ transition: 'background-color 0.2s' }}
                >
                  <div className="row align-items-center">
                    {/* Imagen */}
                    <div className="col-md-2 col-3 mb-2 mb-md-0">
                      <img
                        src={item.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                        alt={item.nombre}
                        className="img-fluid rounded shadow-sm"
                        style={{ 
                          width: '100%', 
                          height: '80px', 
                          objectFit: 'cover' 
                        }}
                      />
                    </div>

                    {/* Detalles del producto */}
                    <div className="col-md-4 col-9 mb-2 mb-md-0">
                      <h6 className="mb-1">{item.nombre}</h6>
                      {item.descripcion && (
                        <p className="text-muted small mb-1">
                          {item.descripcion.substring(0, 60)}
                          {item.descripcion.length > 60 ? '...' : ''}
                        </p>
                      )}
                      {item.tiempo_preparacion && (
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {item.tiempo_preparacion} min
                        </small>
                      )}
                    </div>

                    {/* Precio unitario */}
                    <div className="col-md-2 col-6 mb-2 mb-md-0 text-center">
                      <small className="text-muted d-block">Precio</small>
                      <strong>${item.precio.toFixed(2)}</strong>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="col-md-2 col-6 mb-2 mb-md-0">
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => decrementarCantidad(item)}
                          disabled={item.cantidad <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.cantidad}
                          onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          max="99"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => incrementarCantidad(item)}
                          disabled={item.cantidad >= 99}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal y eliminar */}
                    <div className="col-md-2 col-12 text-md-end text-center">
                      <div className="d-flex flex-column align-items-md-end align-items-center">
                        <strong className="text-primary mb-2">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </strong>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarItem(item.id)}
                          title="Eliminar producto"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón continuar comprando */}
          <div className="mt-3">
            <Link to="/menu" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Columna de resumen */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Resumen del Pedido
              </h5>
            </div>
            <div className="card-body">
              {/* Desglose de precios */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    Impuestos (16%):
                    <i 
                      className="fas fa-info-circle ms-1 text-muted" 
                      title="IVA incluido"
                      style={{ fontSize: '0.8rem' }}
                    ></i>
                  </span>
                  <strong>${impuestos.toFixed(2)}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h5 mb-0">Total:</span>
                  <span className="h5 mb-0 text-success">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="alert alert-light small mb-3">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Tiempo estimado:</strong>
                <br />
                {items.reduce((max, item) => {
                  return Math.max(max, item.tiempo_preparacion || 0)
                }, 0)} minutos aprox.
              </div>

              {/* Botón de pago */}
              <button
                className="btn btn-success btn-lg w-100 mb-2"
                onClick={handleProcederPago}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceder al Pago
              </button>

              {/* Métodos de pago aceptados */}
              <div className="text-center mt-3">
                <small className="text-muted">Aceptamos:</small>
                <div className="mt-2">
                  <i className="fab fa-cc-visa fa-2x me-2 text-muted"></i>
                  <i className="fab fa-cc-mastercard fa-2x me-2 text-muted"></i>
                  <i className="fab fa-cc-paypal fa-2x text-muted"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para vaciar carrito */}
      {showConfirmModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                  Confirmar Acción
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas vaciar el carrito?</p>
                <p className="text-muted mb-0">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    vaciarCarrito()
                    setShowConfirmModal(false)
                  }}
                >
                  <i className="fas fa-trash me-2"></i>
                  Sí, Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage

