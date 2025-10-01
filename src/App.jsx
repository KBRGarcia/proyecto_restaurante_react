import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import FilterBar from './components/FilterBar'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { API_ENDPOINTS } from './config'
import './App.css'

/**
 * Componente Principal de la Aplicación
 * Gestiona el estado y la lógica de negocio
 */
function App() {
  // Estados
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [carrito, setCarrito] = useState([])

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  /**
   * Función para cargar productos y categorías desde la API
   */
  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      // Cargar productos desde la API
      console.log('🔌 Conectando a:', API_ENDPOINTS.productos)
      
      const resProductos = await fetch(API_ENDPOINTS.productos)
      
      if (!resProductos.ok) {
        throw new Error(`HTTP error! status: ${resProductos.status}`)
      }
      
      const dataProductos = await resProductos.json()

      if (dataProductos.success) {
        setProductos(dataProductos.data)
        
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(
          dataProductos.data
            .filter(p => p.categoria_nombre)
            .map(p => ({ id: p.categoria_id, nombre: p.categoria_nombre }))
        )]
        
        // Eliminar duplicados por ID
        const categoriasMap = new Map()
        categoriasUnicas.forEach(cat => {
          if (!categoriasMap.has(cat.id)) {
            categoriasMap.set(cat.id, cat)
          }
        })
        
        setCategorias(Array.from(categoriasMap.values()))
      } else {
        setError('No se pudieron cargar los productos')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Agregar producto al carrito
   */
  const handleAddToCart = async (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id)
      
      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      } else {
        return [...prev, { ...producto, cantidad: 1 }]
      }
    })

    // Mostrar notificación (opcional)
    console.log('Producto agregado:', producto.nombre)
  }

  /**
   * Filtrar productos por categoría
   */
  const productosFiltrados = categoriaActiva === null
    ? productos
    : productos.filter(p => p.categoria_id === categoriaActiva)

  // Renderizado condicional según estado
  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner mensaje="Cargando productos deliciosos..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <ErrorMessage mensaje={error} onRetry={cargarDatos} />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <i className="fas fa-utensils me-3"></i>
          Menú del Restaurante
        </h1>
        <p className="lead text-muted">
          Descubre nuestros deliciosos platillos
        </p>
        
        {/* Indicador de carrito */}
        {carrito.length > 0 && (
          <div className="alert alert-success d-inline-block">
            <i className="fas fa-shopping-cart me-2"></i>
            {carrito.reduce((acc, item) => acc + item.cantidad, 0)} productos en el carrito
          </div>
        )}
      </div>

      {/* Filtros */}
      {categorias.length > 0 && (
        <FilterBar
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onCategoriaChange={setCategoriaActiva}
        />
      )}

      {/* Grid de productos */}
      {productosFiltrados.length > 0 ? (
        <div className="row">
          {productosFiltrados.map(producto => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No hay productos en esta categoría
        </div>
      )}

      {/* Información adicional */}
      <div className="text-center mt-5 mb-4">
        <p className="text-muted">
          <i className="fas fa-clock me-2"></i>
          Horario: Lunes a Domingo 11:00 AM - 10:00 PM
        </p>
      </div>
    </div>
  )
}

export default App

