
import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config'
import OrderCard from '../components/OrderCard.tsx'
import OrderDetailsModal from '../components/OrderDetailsModal.tsx'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import type { Orden, EstadoOrden, TipoServicio } from '../types.ts'

/**
 * Página de Mis Órdenes
 * Muestra el historial completo de pedidos del usuario con filtros y estadísticas
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - Estado y Efectos: https://react.dev/learn/state-a-components-memory
 */
function MisOrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<EstadoOrden | 'todas'>('todas')
  const [filtroTipo, setFiltroTipo] = useState<TipoServicio | 'todos'>('todos')
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null)
  const [ordenamiento, setOrdenamiento] = useState<'reciente' | 'antiguo' | 'mayor' | 'menor'>('reciente')

  /**
   * Cargar órdenes del usuario desde la base de datos
   * Fuente: https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No hay token de autenticación')
        setOrdenes([])
        setError('No estás autenticado. Por favor inicia sesión.')
        setLoading(false)
        return
      }

      console.log('Cargando órdenes desde:', API_ENDPOINTS.ordenes)
      
      const response = await fetch(API_ENDPOINTS.ordenes, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Status de órdenes:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error al cargar órdenes:', errorText)
        setError(`Error al cargar órdenes: ${response.status}`)
        setOrdenes([])
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('Datos de órdenes recibidos:', data)

      if (data.success) {
        try {
          // Validar y limpiar datos de órdenes
          const ordenesValidas = (data.data || []).map((orden: Orden) => {
            // Validar fecha_orden
            let fechaOrdenValida = orden.fecha_orden || new Date().toISOString()
            if (fechaOrdenValida && isNaN(new Date(fechaOrdenValida).getTime())) {
              fechaOrdenValida = new Date().toISOString()
            }
            
            return {
              ...orden,
              // Asegurar que los campos requeridos existan
              id: orden.id || 0,
              estado: orden.estado || 'pendiente',
              tipo_servicio: orden.tipo_servicio || 'recoger',
              total: orden.total || 0,
              fecha_orden: fechaOrdenValida
            }
          }).filter((orden: Orden) => orden.id > 0) // Filtrar órdenes sin ID válido
          
          setOrdenes(ordenesValidas)
        } catch (parseError) {
          console.error('Error al procesar datos de órdenes:', parseError)
          setError('Error al procesar los datos de las órdenes')
          setOrdenes([])
        }
      } else {
        console.error('Respuesta no exitosa:', data)
        setError(data.message || 'Error al cargar las órdenes')
        setOrdenes([])
      }
    } catch (error) {
      console.error('Error detallado al cargar órdenes:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido al cargar órdenes')
      setOrdenes([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filtrar órdenes según criterios seleccionados
   */
  const ordenesFiltradas = ordenes
    .filter(orden => {
      // Validar que la orden tenga los campos necesarios
      if (!orden || !orden.id) {
        return false
      }
      
      // Filtro por estado
      if (filtroEstado !== 'todas' && orden.estado !== filtroEstado) {
        return false
      }
      // Filtro por tipo de servicio
      if (filtroTipo !== 'todos' && orden.tipo_servicio !== filtroTipo) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // Ordenamiento con validación de datos
      try {
        switch (ordenamiento) {
          case 'reciente':
            const fechaA = a.fecha_orden ? new Date(a.fecha_orden).getTime() : 0
            const fechaB = b.fecha_orden ? new Date(b.fecha_orden).getTime() : 0
            // Si alguna fecha es inválida, ponerla al final
            if (isNaN(fechaA) && isNaN(fechaB)) return 0
            if (isNaN(fechaA)) return 1
            if (isNaN(fechaB)) return -1
            return fechaB - fechaA
          case 'antiguo':
            const fechaA2 = a.fecha_orden ? new Date(a.fecha_orden).getTime() : 0
            const fechaB2 = b.fecha_orden ? new Date(b.fecha_orden).getTime() : 0
            if (isNaN(fechaA2) && isNaN(fechaB2)) return 0
            if (isNaN(fechaA2)) return 1
            if (isNaN(fechaB2)) return -1
            return fechaA2 - fechaB2
          case 'mayor':
            const totalA = a.total || 0
            const totalB = b.total || 0
            return totalB - totalA
          case 'menor':
            const totalA2 = a.total || 0
            const totalB2 = b.total || 0
            return totalA2 - totalB2
          default:
            return 0
        }
      } catch (error) {
        console.error('Error al ordenar órdenes:', error)
        return 0
      }
    })

  /**
   * Calcular estadísticas con validación
   */
  const estadisticas = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o && o.estado === 'pendiente').length,
    preparando: ordenes.filter(o => o && o.estado === 'preparando').length,
    listos: ordenes.filter(o => o && o.estado === 'listo').length,
    entregados: ordenes.filter(o => o && o.estado === 'entregado').length,
    cancelados: ordenes.filter(o => o && o.estado === 'cancelado').length,
    totalGastado: ordenes
      .filter(o => o && o.estado !== 'cancelado')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner mensaje="Cargando tus órdenes..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5 mb-5">
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
            <h4>Error al cargar órdenes</h4>
            <p className="text-muted mb-4">{error}</p>
            <button 
              className="btn btn-primary"
              onClick={cargarOrdenes}
            >
              <i className="fas fa-redo me-2"></i>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h2">
          <i className="fas fa-receipt me-2"></i>
          Mis Órdenes
        </h1>
        <p className="text-muted">
          Historial completo de tus pedidos
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--theme-card-bg)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-muted">Total Órdenes</h6>
                  <h3 className="mb-0" style={{ color: 'var(--theme-text)' }}>{estadisticas.total}</h3>
                </div>
                <div className="rounded-3 p-3" style={{ backgroundColor: 'var(--theme-highlight-bg)' }}>
                  <i className="fas fa-shopping-bag fa-2x" style={{ color: 'var(--theme-accent-color)' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--theme-card-bg)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-muted">Pendientes</h6>
                  <h3 className="mb-0" style={{ color: 'var(--theme-text)' }}>{estadisticas.pendientes}</h3>
                </div>
                <div className="rounded-3 p-3" style={{ backgroundColor: 'var(--theme-highlight-bg)' }}>
                  <i className="fas fa-clock fa-2x" style={{ color: 'var(--theme-accent-color)' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--theme-card-bg)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-muted">Completadas</h6>
                  <h3 className="mb-0" style={{ color: 'var(--theme-text)' }}>{estadisticas.entregados}</h3>
                </div>
                <div className="rounded-3 p-3" style={{ backgroundColor: 'var(--theme-highlight-bg)' }}>
                  <i className="fas fa-check-circle fa-2x" style={{ color: 'var(--theme-accent-color)' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--theme-card-bg)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-muted">Total Gastado</h6>
                  <h3 className="mb-0" style={{ color: 'var(--theme-text)' }}>${estadisticas.totalGastado.toFixed(0)}</h3>
                </div>
                <div className="rounded-3 p-3" style={{ backgroundColor: 'var(--theme-highlight-bg)' }}>
                  <i className="fas fa-dollar-sign fa-2x" style={{ color: 'var(--theme-accent-color)' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Filtro por estado */}
            <div className="col-md-3">
              <label className="form-label small text-muted mb-1">
                <i className="fas fa-filter me-1"></i>
                Estado
              </label>
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoOrden | 'todas')}
              >
                <option value="todas">Todas</option>
                <option value="pendiente">Pendientes</option>
                <option value="preparando">Preparando</option>
                <option value="listo">Listo</option>
                <option value="entregado">Entregadas</option>
                <option value="cancelado">Canceladas</option>
              </select>
            </div>

            {/* Filtro por tipo de servicio */}
            <div className="col-md-3">
              <label className="form-label small text-muted mb-1">
                <i className="fas fa-truck me-1"></i>
                Tipo de Servicio
              </label>
              <select
                className="form-select"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoServicio | 'todos')}
              >
                <option value="todos">Todos</option>
                <option value="domicilio">A Domicilio</option>
                <option value="recoger">Para Recoger</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="col-md-3">
              <label className="form-label small text-muted mb-1">
                <i className="fas fa-sort me-1"></i>
                Ordenar por
              </label>
              <select
                className="form-select"
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value as typeof ordenamiento)}
              >
                <option value="reciente">Más Recientes</option>
                <option value="antiguo">Más Antiguos</option>
                <option value="mayor">Mayor Total</option>
                <option value="menor">Menor Total</option>
              </select>
            </div>

            {/* Resultados */}
            <div className="col-md-3 d-flex align-items-end">
              <div className="alert alert-light mb-0 w-100 py-2">
                <small className="text-muted">
                  <i className="fas fa-list me-1"></i>
                  Mostrando <strong>{ordenesFiltradas.length}</strong> de <strong>{ordenes.length}</strong>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      {ordenesFiltradas.length > 0 ? (
        <div className="orders-list">
          {ordenesFiltradas.map(orden => (
            <OrderCard
              key={orden.id}
              orden={orden}
              onVerDetalles={setOrdenSeleccionada}
            />
          ))}
        </div>
      ) : (
        <div className="card shadow-sm text-center py-5">
          <div className="card-body">
            <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
            <h4>No se encontraron órdenes</h4>
            <p className="text-muted mb-4">
              {filtroEstado !== 'todas' || filtroTipo !== 'todos'
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Aún no has realizado ningún pedido'}
            </p>
            {filtroEstado === 'todas' && filtroTipo === 'todos' && (
              <a href="/menu" className="btn btn-primary">
                <i className="fas fa-utensils me-2"></i>
                Ver Menú
              </a>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {ordenSeleccionada && (
        <OrderDetailsModal
          orden={ordenSeleccionada}
          onClose={() => setOrdenSeleccionada(null)}
          onOrdenActualizada={cargarOrdenes}
        />
      )}
    </div>
  )
}

export default MisOrdenesPage

