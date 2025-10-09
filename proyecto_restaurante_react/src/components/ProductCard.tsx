import { useState } from 'react'
import type { ProductCardProps } from '../types.ts'

/**
 * Componente de Tarjeta de Producto
 * Siguiendo las mejores prácticas de React
 * 
 * @param producto - Información del producto
 * @param onAddToCart - Callback para agregar al carrito
 * @param mostrarBotonCompra - Controla si se muestra el botón de compra (opcional, default: true)
 * @param onEdit - Callback para editar el producto (admin)
 * @param onDelete - Callback para eliminar el producto (admin)
 * @param modoAdmin - Indica si se muestra en modo administrador
 * 
 * Fuente: https://react.dev/learn/passing-props-to-a-component
 */
function ProductCard({ 
  producto, 
  onAddToCart, 
  mostrarBotonCompra = true,
  onEdit,
  onDelete,
  modoAdmin = false
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Simular agregado al carrito
    if (onAddToCart) {
      await onAddToCart(producto)
    }
    
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(producto)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
      setIsDeleting(true)
      try {
        await onDelete(producto.id)
      } catch (error) {
        console.error('Error al eliminar:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 shadow-sm hover-lift ${isDeleting ? 'opacity-50' : ''}`}>
        {/* Imagen del producto */}
        <div className="card-img-top-wrapper position-relative" style={{ height: '200px', overflow: 'hidden' }}>
          <img 
            src={producto.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={producto.nombre}
            className="card-img-top w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
          
          {/* Botones de admin sobre la imagen */}
          {modoAdmin && (
            <div className="position-absolute top-0 end-0 p-2">
              <button
                className="btn btn-sm btn-light me-1"
                onClick={handleEdit}
                title="Editar producto"
                disabled={isDeleting}
              >
                <i className="fas fa-edit text-primary"></i>
              </button>
              <button
                className="btn btn-sm btn-light"
                onClick={handleDelete}
                title="Eliminar producto"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="spinner-border spinner-border-sm text-danger"></span>
                ) : (
                  <i className="fas fa-trash text-danger"></i>
                )}
              </button>
            </div>
          )}
          
          {/* Badge de estado si no está activo */}
          {producto.estado !== 'activo' && (
            <div className="position-absolute top-0 start-0 p-2">
              <span className={`badge bg-${producto.estado === 'agotado' ? 'warning' : 'secondary'}`}>
                {producto.estado.charAt(0).toUpperCase() + producto.estado.slice(1)}
              </span>
            </div>
          )}
          
          {/* Badge de especial */}
          {producto.es_especial && (
            <div className="position-absolute bottom-0 start-0 p-2">
              <span className="badge bg-warning text-dark">
                <i className="fas fa-star me-1"></i>
                Especial
              </span>
            </div>
          )}
        </div>
        
        <div className="card-body d-flex flex-column">
          {/* Nombre del producto */}
          <h5 className="card-title">{producto.nombre}</h5>
          
          {/* Categoría */}
          {producto.categoria_nombre && (
            <span className="badge bg-secondary mb-2 align-self-start">
              <i className="fas fa-tag me-1"></i>
              {producto.categoria_nombre}
            </span>
          )}
          
          {/* Descripción */}
          <p className="card-text text-muted flex-grow-1">
            {producto.descripcion || 'Sin descripción disponible'}
          </p>
          
          {/* Precio y tiempo */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="h4 mb-0 text-primary fw-bold">
              ${Number(producto.precio).toFixed(2)}
            </span>
            {producto.tiempo_preparacion && (
              <span className="text-muted small">
                <i className="fas fa-clock me-1"></i>
                {producto.tiempo_preparacion} min
              </span>
            )}
          </div>
          
          {/* Botón agregar al carrito - Solo si mostrarBotonCompra es true */}
          {mostrarBotonCompra ? (
            <button 
              className={`btn ${isAdding ? 'btn-success' : 'btn-primary'} w-100`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <i className="fas fa-check me-2"></i>
                  Agregado!
                </>
              ) : (
                <>
                  <i className="fas fa-cart-plus me-2"></i>
                  Agregar al Carrito
                </>
              )}
            </button>
          ) : (
            <div className="alert alert-info mb-0 py-2 text-center">
              <small>
                <i className="fas fa-info-circle me-1"></i>
                Solo visualización
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

