import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard.tsx'
import ProductFormModal from '../components/ProductFormModal.tsx'
import FilterBar from '../components/FilterBar.tsx'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import ErrorMessage from '../components/ErrorMessage.tsx'
import { useCart } from '../contexts/CartContext.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config.ts'
import type { Producto, Categoria, ApiResponse, Sucursal } from '../types.ts'

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
  
  // Estados para filtro de sucursales
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [sucursalesSeleccionadas, setSucursalesSeleccionadas] = useState<number[]>([])
  
  // Estados para modo administrador
  const [showModal, setShowModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    cargarSucursales()
  }, [])

  useEffect(() => {
    if (sucursales.length > 0 && sucursalesSeleccionadas.length === 0) {
      // Seleccionar todas las sucursales por defecto
      setSucursalesSeleccionadas(sucursales.map(s => s.id))
    }
  }, [sucursales])

  useEffect(() => {
    if (sucursalesSeleccionadas.length > 0) {
      cargarDatos()
    }
  }, [sucursalesSeleccionadas])

  const cargarSucursales = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sucursales)
      const data: ApiResponse<Sucursal[]> = await response.json()
      
      if (data.success && data.data) {
        setSucursales(data.data)
      }
    } catch (err) {
      console.error('Error al cargar sucursales:', err)
    }
  }

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      // Construir URL con filtro de sucursales
      const sucursalesParam = sucursalesSeleccionadas.join(',')
      const url = sucursalesParam 
        ? `${API_ENDPOINTS.productos}?sucursales=${sucursalesParam}`
        : API_ENDPOINTS.productos
      
      console.log('🔌 Conectando a:', url)
      
      const resProductos = await fetch(url)
      
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

  /**
   * Toggle de selección de sucursal
   */
  const toggleSucursal = (sucursalId: number) => {
    setSucursalesSeleccionadas(prev => {
      if (prev.includes(sucursalId)) {
        // Si ya está seleccionada, quitarla (pero mantener al menos una)
        const nuevasSeleccionadas = prev.filter(id => id !== sucursalId)
        return nuevasSeleccionadas.length > 0 ? nuevasSeleccionadas : prev
      } else {
        // Si no está seleccionada, agregarla
        return [...prev, sucursalId]
      }
    })
  }

  /**
   * Seleccionar todas las sucursales
   */
  const seleccionarTodasSucursales = () => {
    setSucursalesSeleccionadas(sucursales.map(s => s.id))
  }

  /**
   * Deseleccionar todas menos una (para evitar filtro vacío)
   */
  const limpiarFiltroSucursales = () => {
    if (sucursales.length > 0) {
      setSucursalesSeleccionadas([sucursales[0].id])
    }
  }

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

      {/* Filtro de Sucursales */}
      {sucursales.length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-transparent">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="fas fa-store me-2 text-primary"></i>
                Filtrar por Sucursal
              </h6>
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-primary"
                  onClick={seleccionarTodasSucursales}
                  disabled={sucursalesSeleccionadas.length === sucursales.length}
                >
                  <i className="fas fa-check-double me-1 text-white"></i>
                  Todas
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={limpiarFiltroSucursales}
                  disabled={sucursalesSeleccionadas.length === 1}
                >
                  <i className="fas fa-times me-1 text-white"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              {sucursales.map(sucursal => (
                <button
                  key={sucursal.id}
                  className={`btn btn-sm ${
                    sucursalesSeleccionadas.includes(sucursal.id)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => toggleSucursal(sucursal.id)}
                >
                  <i className={`fas fa-${sucursalesSeleccionadas.includes(sucursal.id) ? 'check-circle' : 'circle'} me-1`}></i>
                  {sucursal.nombre}
                  {sucursal.es_principal && (
                    <span className="badge bg-warning text-dark ms-1">
                      <i className="fas fa-star"></i>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <small className="text-muted mt-2 d-block">
              <i className="fas fa-info-circle me-1"></i>
              Mostrando productos de {sucursalesSeleccionadas.length} {sucursalesSeleccionadas.length === 1 ? 'sucursal' : 'sucursales'}
            </small>
          </div>
        </div>
      )}

      {/* Filtros de Categorías */}
      {categorias.length > 0 && (
        <FilterBar
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onCategoriaChange={(categoria) => {
            console.log('Categoría seleccionada:', categoria, 'Tipo:', typeof categoria)
            setCategoriaActiva(categoria)
          }}
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
        sucursales={sucursales}
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

