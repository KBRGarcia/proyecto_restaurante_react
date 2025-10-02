import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
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
  const { usuario } = useAuth()
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<EstadoOrden | 'todas'>('todas')
  const [filtroTipo, setFiltroTipo] = useState<TipoServicio | 'todos'>('todos')
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null)
  const [ordenamiento, setOrdenamiento] = useState<'reciente' | 'antiguo' | 'mayor' | 'menor'>('reciente')

  /**
   * Cargar órdenes del usuario
   * En producción, esto haría una llamada al backend
   */
  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    setLoading(true)
    
    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Datos mock de ejemplo
      // TODO: Reemplazar con llamada real al backend
      const ordenesMock: Orden[] = [
        {
          id: 1001,
          usuario_id: usuario?.id || 1,
          estado: 'entregado',
          tipo_servicio: 'domicilio',
          subtotal: 450.00,
          impuestos: 72.00,
          total: 522.00,
          direccion_entrega: 'Av. Reforma 123, Col. Centro',
          telefono_contacto: '555-1234-5678',
          notas_especiales: 'Sin cebolla, por favor',
          fecha_orden: '2025-10-01T14:30:00',
          fecha_entrega_estimada: '2025-10-01T15:15:00',
        },
        {
          id: 1002,
          usuario_id: usuario?.id || 1,
          estado: 'preparando',
          tipo_servicio: 'recoger',
          subtotal: 280.00,
          impuestos: 44.80,
          total: 324.80,
          telefono_contacto: '555-1234-5678',
          notas_especiales: 'Para llevar',
          fecha_orden: '2025-10-02T12:00:00',
          fecha_entrega_estimada: '2025-10-02T12:45:00',
        },
        {
          id: 1003,
          usuario_id: usuario?.id || 1,
          estado: 'listo',
          tipo_servicio: 'recoger',
          subtotal: 195.00,
          impuestos: 31.20,
          total: 226.20,
          telefono_contacto: '555-1234-5678',
          fecha_orden: '2025-10-02T13:30:00',
        },
        {
          id: 1004,
          usuario_id: usuario?.id || 1,
          estado: 'pendiente',
          tipo_servicio: 'domicilio',
          subtotal: 680.00,
          impuestos: 108.80,
          total: 788.80,
          direccion_entrega: 'Calle 5 de Mayo 456, Col. Juárez',
          telefono_contacto: '555-8765-4321',
          notas_especiales: 'Timbre roto, llamar al teléfono',
          fecha_orden: '2025-10-02T14:00:00',
          fecha_entrega_estimada: '2025-10-02T15:30:00',
        },
        {
          id: 1005,
          usuario_id: usuario?.id || 1,
          mesa_id: 12,
          estado: 'entregado',
          tipo_servicio: 'mesa',
          subtotal: 320.00,
          impuestos: 51.20,
          total: 371.20,
          fecha_orden: '2025-09-28T19:00:00',
        },
        {
          id: 1006,
          usuario_id: usuario?.id || 1,
          estado: 'cancelado',
          tipo_servicio: 'domicilio',
          subtotal: 150.00,
          impuestos: 24.00,
          total: 174.00,
          direccion_entrega: 'Av. Universidad 789',
          telefono_contacto: '555-1111-2222',
          notas_especiales: 'Cancelada por el cliente',
          fecha_orden: '2025-09-25T11:00:00',
        },
      ]

      setOrdenes(ordenesMock)
    } catch (error) {
      console.error('Error cargando órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filtrar órdenes según criterios seleccionados
   */
  const ordenesFiltradas = ordenes
    .filter(orden => {
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
      // Ordenamiento
      switch (ordenamiento) {
        case 'reciente':
          return new Date(b.fecha_orden).getTime() - new Date(a.fecha_orden).getTime()
        case 'antiguo':
          return new Date(a.fecha_orden).getTime() - new Date(b.fecha_orden).getTime()
        case 'mayor':
          return b.total - a.total
        case 'menor':
          return a.total - b.total
        default:
          return 0
      }
    })

  /**
   * Calcular estadísticas
   */
  const estadisticas = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'pendiente').length,
    preparando: ordenes.filter(o => o.estado === 'preparando').length,
    listos: ordenes.filter(o => o.estado === 'listo').length,
    entregados: ordenes.filter(o => o.estado === 'entregado').length,
    cancelados: ordenes.filter(o => o.estado === 'cancelado').length,
    totalGastado: ordenes
      .filter(o => o.estado !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0),
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner mensaje="Cargando tus órdenes..." />
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
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Total Órdenes</h6>
                  <h3 className="mb-0">{estadisticas.total}</h3>
                </div>
                <i className="fas fa-shopping-bag fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-warning text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Pendientes</h6>
                  <h3 className="mb-0">{estadisticas.pendientes}</h3>
                </div>
                <i className="fas fa-clock fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Completadas</h6>
                  <h3 className="mb-0">{estadisticas.entregados}</h3>
                </div>
                <i className="fas fa-check-circle fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-1 text-white-50">Total Gastado</h6>
                  <h3 className="mb-0">${estadisticas.totalGastado.toFixed(0)}</h3>
                </div>
                <i className="fas fa-dollar-sign fa-2x opacity-50"></i>
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
                <option value="mesa">En Mesa</option>
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
        />
      )}
    </div>
  )
}

export default MisOrdenesPage

