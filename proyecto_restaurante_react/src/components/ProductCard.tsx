import { useState } from 'react'
import type { ProductCardProps } from '../types.ts'

/**
 * Componente de Tarjeta de Producto
 * Siguiendo las mejores prácticas de React
 */
function ProductCard({ producto, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Simular agregado al carrito
    if (onAddToCart) {
      await onAddToCart(producto)
    }
    
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm hover-lift">
        {/* Imagen del producto */}
        <div className="card-img-top-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
          <img 
            src={producto.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
            alt={producto.nombre}
            className="card-img-top w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
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
          
          {/* Botón agregar al carrito */}
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
        </div>
      </div>
    </div>
  )
}

export default ProductCard

