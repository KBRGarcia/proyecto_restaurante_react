import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard.tsx'
import ProductFormModal from '../components/ProductFormModal.tsx'
import FilterBar from '../components/FilterBar.tsx'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import ErrorMessage from '../components/ErrorMessage.tsx'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config.ts'
import type { Producto, Categoria, ApiResponse } from '../types.ts'

/**
 * Página de Menú
 * Muestra todos los productos del restaurante con filtros
 * 
 * Para usuarios admin: solo visualización, sin opción de compra
 * Para otros usuarios: funcionalidad completa de compra
 * 
 * Fuente: https://react.dev/reference/react/useContext
 */
function MenuPage() {
  const { agregarItem } = useCart()
  const { usuario } = useAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string>('')
  
  // Estados para modo administrador
  const [showModal, setShowModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
    agregarItem(producto)
    setLastAddedProduct(producto.nombre)
    setShowToast(true)
    
    // Ocultar toast después de 3 segundos
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Funciones para administradores
  const handleCrearProducto = () => {
    setProductoEditar(null)
    setShowModal(true)
  }

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditar(producto)
    setShowModal(true)
  }

  const handleGuardarProducto = async (productoData: Partial<Producto>) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }

    try {
      let response
      
      if (productoData.id) {
        // Actualizar producto existente
        response = await fetch(API_ENDPOINTS.adminActualizarProducto(productoData.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productoData)
        })
      } else {
        // Crear nuevo producto
        response = await fetch(API_ENDPOINTS.adminCrearProducto, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productoData)
        })
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Error al guardar el producto')
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(
        productoData.id 
          ? 'Producto actualizado exitosamente' 
          : 'Producto creado exitosamente'
      )
      
      // Recargar productos
      await cargarDatos()
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000)
      
    } catch (err: any) {
      throw new Error(err.message || 'Error al guardar el producto')
    }
  }

  const handleEliminarProducto = async (productoId: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }

    try {
      const response = await fetch(API_ENDPOINTS.adminEliminarProducto(productoId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar el producto')
      }

      // Mostrar mensaje de éxito
      setSuccessMessage('Producto eliminado exitosamente')
      
      // Recargar productos
      await cargarDatos()
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000)
      
    } catch (err: any) {
      console.error('Error al eliminar:', err)
      setError(err.message || 'Error al eliminar el producto')
      setTimeout(() => setError(null), 5000)
    }
  }

  const productosFiltrados = categoriaActiva === null
    ? productos
    : productos.filter(p => p.categoria_id === categoriaActiva)

  // Determinar si el usuario es admin
  const esAdmin = usuario?.rol === 'admin'

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
          {esAdmin 
            ? 'Gestiona los productos del menú' 
            : 'Descubre nuestros deliciosos platillos'
          }
        </p>
        
        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show mx-auto" style={{ maxWidth: '600px' }}>
            <i className="fas fa-check-circle me-2"></i>
            {successMessage}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccessMessage(null)}
            ></button>
          </div>
        )}
        
        {/* Alerta informativa para administradores */}
        {esAdmin && !successMessage && (
          <div className="alert alert-primary mx-auto" style={{ maxWidth: '600px' }}>
            <i className="fas fa-tools me-2"></i>
            <strong>Modo Administrador:</strong> Puedes crear, editar y eliminar productos del menú.
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
              mostrarBotonCompra={!esAdmin}
              modoAdmin={esAdmin}
              onEdit={esAdmin ? handleEditarProducto : undefined}
              onDelete={esAdmin ? handleEliminarProducto : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No hay productos en esta categoría
        </div>
      )}

      {/* Botón flotante para crear producto (solo admin) */}
      {esAdmin && (
        <button
          className="btn btn-danger btn-lg rounded-circle position-fixed shadow-lg"
          style={{ 
            bottom: '30px', 
            right: '30px', 
            width: '60px', 
            height: '60px',
            zIndex: 1000
          }}
          onClick={handleCrearProducto}
          title="Crear nuevo producto"
        >
          <i className="fas fa-plus fa-lg"></i>
        </button>
      )}

      {/* Modal de formulario */}
      <ProductFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false)
          setProductoEditar(null)
        }}
        onSave={handleGuardarProducto}
        producto={productoEditar}
        categorias={categorias}
      />

      {/* Toast de notificación */}
      {showToast && (
        <div 
          className="position-fixed bottom-0 end-0 p-3" 
          style={{ zIndex: 9999 }}
        >
          <div 
            className="toast show bg-success text-white" 
            role="alert"
          >
            <div className="d-flex align-items-center p-3">
              <i className="fas fa-check-circle fa-2x me-3"></i>
              <div className="flex-grow-1">
                <strong className="d-block">¡Producto agregado!</strong>
                <small>{lastAddedProduct}</small>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white ms-2" 
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuPage

