import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard.tsx'
import FilterBar from '../components/FilterBar.tsx'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import ErrorMessage from '../components/ErrorMessage.tsx'
import { API_ENDPOINTS } from '../config.ts'
import type { Producto, Categoria, ApiResponse } from '../types.ts'

/**
 * Página de Menú
 * Muestra todos los productos del restaurante con filtros
 */
function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🔌 Conectando a:', API_ENDPOINTS.productos)
      
      const resProductos = await fetch(API_ENDPOINTS.productos)
      
      if (!resProductos.ok) {
        throw new Error(`HTTP error! status: ${resProductos.status}`)
      }
      
      const dataProductos: ApiResponse<Producto[]> = await resProductos.json()

      if (dataProductos.success && dataProductos.data) {
        setProductos(dataProductos.data)
        
        // Extraer categorías únicas
        const categoriasMap = new Map<number, Categoria>()
        
        dataProductos.data.forEach(p => {
          if (p.categoria_id && p.categoria_nombre && !categoriasMap.has(p.categoria_id)) {
            categoriasMap.set(p.categoria_id, {
              id: p.categoria_id,
              nombre: p.categoria_nombre
            })
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

  const handleAddToCart = async (producto: Producto) => {
    // TODO: Implementar lógica del carrito
    console.log('Producto agregado:', producto.nombre)
    alert(`${producto.nombre} agregado al carrito`)
  }

  const productosFiltrados = categoriaActiva === null
    ? productos
    : productos.filter(p => p.categoria_id === categoriaActiva)

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
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <i className="fas fa-utensils me-3"></i>
          Nuestro Menú
        </h1>
        <p className="lead text-muted">
          Descubre nuestros deliciosos platillos
        </p>
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
    </div>
  )
}

export default MenuPage

