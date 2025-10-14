import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'

/**
 * Botón Flotante del Carrito
 * 
 * Componente que muestra un botón flotante en la esquina inferior derecha
 * solo cuando hay productos en el carrito. Incluye un badge con la cantidad
 * total de items.
 * 
 * Fuentes oficiales:
 * - React Router: https://reactrouter.com/en/main/components/link
 * - React Hooks: https://react.dev/reference/react
 */
function FloatingCartButton() {
  const { cantidadTotal } = useCart()
  const { usuario } = useAuth()

  // Solo mostrar si hay productos en el carrito y el usuario no es admin
  if (cantidadTotal === 0 || usuario?.rol === 'admin') {
    return null
  }

  return (
    <Link 
      to="/carrito" 
      className="floating-cart-btn"
      title="Ver carrito de compras"
    >
      <div className="floating-cart-icon">
        <i className="fas fa-shopping-cart"></i>
        {cantidadTotal > 0 && (
          <span className="floating-cart-badge">
            {cantidadTotal > 99 ? '99+' : cantidadTotal}
          </span>
        )}
      </div>
    </Link>
  )
}

export default FloatingCartButton
