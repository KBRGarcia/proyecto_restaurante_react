import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import type { EstadisticasDashboard, UsuarioAdmin, TopUsuario, Orden } from '../types'

/**
 * Página de Dashboard Administrativo
 * Panel de control para administradores del sistema
 * 
 * Funcionalidades:
 * - Visualización de estadísticas generales
 * - Gestión de usuarios (banear/eliminar)
 * - Ver órdenes recientes
 * - Análisis de ingresos
 * 
 * Fuentes oficiales:
 * - React Hooks: https://react.dev/reference/react
 * - React State: https://react.dev/learn/state-a-components-memory
 * - TypeScript con React: https://react.dev/learn/typescript
 */
function DashboardPage() {
  const { usuario } = useAuth()
  const [loading, setLoading] = useState(true)
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null)
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [topUsuarios, setTopUsuarios] = useState<TopUsuario[]>([])
  const [ordenesRecientes, setOrdenesRecientes] = useState<Orden[]>([])
  const [filtroUsuarios, setFiltroUsuarios] = useState('')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioAdmin | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [accionModal, setAccionModal] = useState<'banear' | 'eliminar' | null>(null)
  
  // Estados para gestión de órdenes
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null)
  const [mostrarModalOrden, setMostrarModalOrden] = useState(false)
  const [nuevoEstado, setNuevoEstado] = useState<string>('')
  const [actualizandoOrden, setActualizandoOrden] = useState(false)

  /**
   * Cargar datos del dashboard
   * En producción, estos datos vendrían de la API
   */
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No hay token de autenticación')
        alert('Sesión no válida. Por favor inicia sesión nuevamente.')
        setLoading(false)
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Cargar estadísticas
      console.log('Cargando estadísticas desde:', API_ENDPOINTS.adminEstadisticas)
      const estadisticasRes = await fetch(API_ENDPOINTS.adminEstadisticas, { headers })
      console.log('Status estadísticas:', estadisticasRes.status)
      
      if (!estadisticasRes.ok) {
        const errorText = await estadisticasRes.text()
        console.error('Error en estadísticas:', errorText)
        throw new Error(`Error ${estadisticasRes.status}: ${errorText}`)
      }

      const estadisticasData = await estadisticasRes.json()
      console.log('Datos de estadísticas:', estadisticasData)
      
      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.data)
      } else {
        console.error('Respuesta no exitosa:', estadisticasData)
      }

      // Cargar usuarios
      console.log('Cargando usuarios desde:', API_ENDPOINTS.adminUsuarios)
      const usuariosRes = await fetch(API_ENDPOINTS.adminUsuarios, { headers })
      console.log('Status usuarios:', usuariosRes.status)
      
      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json()
        console.log('Datos de usuarios:', usuariosData)
        if (usuariosData.success) {
          setUsuarios(usuariosData.data)
        }
      }

      // Cargar top usuarios
      console.log('Cargando top usuarios desde:', API_ENDPOINTS.adminTopUsuarios)
      const topUsuariosRes = await fetch(API_ENDPOINTS.adminTopUsuarios, { headers })
      console.log('Status top usuarios:', topUsuariosRes.status)
      
      if (topUsuariosRes.ok) {
        const topUsuariosData = await topUsuariosRes.json()
        console.log('Datos de top usuarios:', topUsuariosData)
        if (topUsuariosData.success) {
          setTopUsuarios(topUsuariosData.data)
        }
      }

      // Cargar órdenes recientes
      console.log('Cargando órdenes desde:', API_ENDPOINTS.adminOrdenesRecientes)
      const ordenesRes = await fetch(API_ENDPOINTS.adminOrdenesRecientes, { headers })
      console.log('Status órdenes:', ordenesRes.status)
      
      if (ordenesRes.ok) {
        const ordenesData = await ordenesRes.json()
        console.log('Datos de órdenes:', ordenesData)
        if (ordenesData.success) {
          setOrdenesRecientes(ordenesData.data)
        }
      }

    } catch (error) {
      console.error('Error detallado al cargar datos del dashboard:', error)
      alert(`Error al cargar los datos del dashboard.\n\nDetalles: ${error instanceof Error ? error.message : 'Error desconocido'}\n\nAbre la consola (F12) para más información.`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filtrar usuarios según búsqueda
   */
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtroUsuarios.toLowerCase()) ||
    (u.apellido && u.apellido.toLowerCase().includes(filtroUsuarios.toLowerCase())) ||
    u.correo.toLowerCase().includes(filtroUsuarios.toLowerCase())
  )

  /**
   * Abrir modal de confirmación
   */
  const abrirModal = (usuario: UsuarioAdmin, accion: 'banear' | 'eliminar') => {
    setUsuarioSeleccionado(usuario)
    setAccionModal(accion)
    setMostrarModal(true)
  }

  /**
   * Ejecutar acción sobre usuario
   */
  const ejecutarAccion = async () => {
    if (!usuarioSeleccionado || !accionModal) return

    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      if (accionModal === 'banear') {
        // Llamada a la API para banear/desbanear
        const response = await fetch(API_ENDPOINTS.adminBanearUsuario, {
          method: 'POST',
          headers,
          body: JSON.stringify({ usuario_id: usuarioSeleccionado.id })
        })

        const data = await response.json()

        if (data.success) {
          // Actualizar estado local
          setUsuarios(prev => prev.map(u =>
            u.id === usuarioSeleccionado.id
              ? { ...u, estado: data.nuevo_estado }
              : u
          ))
          alert(`Usuario ${data.nuevo_estado === 'inactivo' ? 'baneado' : 'desbaneado'} exitosamente`)
        } else {
          alert(data.message || 'Error al cambiar el estado del usuario')
        }
      } else if (accionModal === 'eliminar') {
        // Llamada a la API para eliminar
        const response = await fetch(API_ENDPOINTS.adminEliminarUsuario, {
          method: 'POST',
          headers,
          body: JSON.stringify({ usuario_id: usuarioSeleccionado.id })
        })

        const data = await response.json()

        if (data.success) {
          // Eliminar del estado local
          setUsuarios(prev => prev.filter(u => u.id !== usuarioSeleccionado.id))
          alert('Usuario eliminado exitosamente')
        } else {
          alert(data.message || 'Error al eliminar el usuario')
        }
      }

      cerrarModal()
    } catch (error) {
      console.error('Error al ejecutar acción:', error)
      alert('Error de conexión al ejecutar la acción')
    }
  }

  /**
   * Cerrar modal
   */
  const cerrarModal = () => {
    setMostrarModal(false)
    setUsuarioSeleccionado(null)
    setAccionModal(null)
  }

  /**
   * Abrir modal para cambiar estado de orden
   */
  const abrirModalOrden = (orden: Orden) => {
    setOrdenSeleccionada(orden)
    setNuevoEstado(orden.estado)
    setMostrarModalOrden(true)
  }

  /**
   * Cerrar modal de orden
   */
  const cerrarModalOrden = () => {
    setMostrarModalOrden(false)
    setOrdenSeleccionada(null)
    setNuevoEstado('')
  }

  /**
   * Actualizar estado de orden
   */
  const actualizarEstadoOrden = async () => {
    if (!ordenSeleccionada || !nuevoEstado) return

    setActualizandoOrden(true)

    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await fetch(`${API_ENDPOINTS.ordenes}?id=${ordenSeleccionada.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ estado: nuevoEstado })
      })

      const data = await response.json()

      if (data.success) {
        // Actualizar la orden en el estado local
        setOrdenesRecientes(prev => prev.map(orden =>
          orden.id === ordenSeleccionada.id
            ? { ...orden, estado: nuevoEstado as any }
            : orden
        ))
        
        alert(`Estado de la orden #${ordenSeleccionada.id} actualizado a "${nuevoEstado}"`)
        cerrarModalOrden()
      } else {
        alert(data.message || 'Error al actualizar el estado de la orden')
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error)
      alert('Error de conexión al actualizar la orden')
    } finally {
      setActualizandoOrden(false)
    }
  }

  /**
   * Obtener opciones de estado disponibles según el estado actual y tipo de servicio
   */
  const obtenerEstadosDisponibles = (estadoActual: string, tipoServicio: string) => {
    // Flujo para PARA LLEVAR (recoger)
    if (tipoServicio === 'recoger') {
      const estados = {
        'pendiente': ['preparando', 'cancelado'],
        'preparando': ['listo', 'cancelado'],
        'listo': ['entregado'],
        'entregado': [], // No se puede cambiar
        'cancelado': [] // No se puede cambiar
      }
      return estados[estadoActual as keyof typeof estados] || []
    }
    
    // Flujo para A DOMICILIO (domicilio)
    if (tipoServicio === 'domicilio') {
      const estados = {
        'pendiente': ['preparando', 'cancelado'],
        'preparando': ['listo', 'cancelado'],
        'listo': ['en_camino'],
        'en_camino': ['entregado'],
        'entregado': [], // No se puede cambiar
        'cancelado': [] // No se puede cambiar
      }
      return estados[estadoActual as keyof typeof estados] || []
    }
    
    return []
  }

  /**
   * Formatear fecha
   */
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSpinner mensaje="Cargando dashboard..." />
  }

  return (
    <div className="container-fluid mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2">
            <i className="fas fa-chart-line me-2 text-danger"></i>
            Dashboard Administrativo
          </h1>
          <p className="text-muted mb-0">
            Bienvenido, {usuario?.nombre} | Panel de control
          </p>
        </div>
        <div className="text-end">
          <small className="text-muted d-block">
            <i className="fas fa-calendar me-1"></i>
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </small>
          <small className="text-muted">
            <i className="fas fa-clock me-1"></i>
            {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </small>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Usuarios</p>
                  <h3 className="mb-0">{estadisticas?.totalUsuarios}</h3>
                  <small className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    +{estadisticas?.nuevosusuarios} este mes
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Órdenes</p>
                  <h3 className="mb-0">{estadisticas?.totalOrdenes}</h3>
                  <small className="text-info">
                    <i className="fas fa-shopping-bag me-1"></i>
                    {estadisticas?.ordenesHoy} hoy
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-receipt fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ingresos Totales</p>
                  <h3 className="mb-0">${estadisticas?.totalIngresos.toFixed(2)}</h3>
                  <small className="text-success">
                    <i className="fas fa-dollar-sign me-1"></i>
                    ${estadisticas?.ingresosHoy.toFixed(2)} hoy
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-chart-line fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Promedio por Orden</p>
                  <h3 className="mb-0">${estadisticas?.promedioOrden.toFixed(2)}</h3>
                  <small className="text-muted">
                    <i className="fas fa-calculator me-1"></i>
                    Calculado
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                  <i className="fas fa-money-bill-wave fa-2x text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Top Usuarios por Gasto */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="mb-0">
                <i className="fas fa-trophy me-2 text-warning"></i>
                Top Usuarios por Gasto
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {topUsuarios.map((usuario, index) => (
                  <div key={usuario.id} className="list-group-item px-0 d-flex align-items-center">
                    <div className={`badge ${
                      index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : 'bg-danger'
                    } rounded-circle me-3`} style={{ width: '35px', height: '35px', lineHeight: '35px' }}>
                      {index + 1}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{usuario.nombre} {usuario.apellido}</h6>
                      <small className="text-muted">{usuario.total_ordenes} órdenes</small>
                    </div>
                    <div className="text-end">
                      <strong className="text-success">${usuario.total_gastado.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Órdenes Recientes */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2 text-primary"></i>
                Órdenes Recientes
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesRecientes.map(orden => (
                      <tr key={orden.id}>
                        <td><strong>#{orden.id}</strong></td>
                        <td>
                          <span className={`badge bg-${orden.tipo_servicio === 'domicilio' ? 'primary' : 'info'}`}>
                            <i className={`fas fa-${orden.tipo_servicio === 'domicilio' ? 'motorcycle' : 'shopping-bag'} me-1`}></i>
                            {orden.tipo_servicio === 'domicilio' ? 'Domicilio' : 'Para Llevar'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            orden.estado === 'pendiente' ? 'warning' :
                            orden.estado === 'preparando' ? 'info' :
                            orden.estado === 'listo' ? 'primary' :
                            orden.estado === 'en_camino' ? 'secondary' :
                            orden.estado === 'entregado' ? 'success' : 'danger'
                          }`}>
                            {orden.estado === 'en_camino' ? 'En Camino' : 
                             orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                          </span>
                        </td>
                        <td><strong>${orden.total.toFixed(2)}</strong></td>
                        <td><small>{formatearFecha(orden.fecha_orden)}</small></td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => abrirModalOrden(orden)}
                            title="Cambiar estado de la orden"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestión de Usuarios */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-4">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="mb-0">
                    <i className="fas fa-users-cog me-2 text-danger"></i>
                    Gestión de Usuarios
                  </h5>
                </div>
                <div className="col-auto">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar usuario..."
                      value={filtroUsuarios}
                      onChange={(e) => setFiltroUsuarios(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Usuario</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Registro</th>
                      <th>Total Gastado</th>
                      <th className="text-center">Órdenes</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length > 0 ? (
                      usuariosFiltrados.map(usuario => (
                        <tr key={usuario.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                <i className="fas fa-user text-primary"></i>
                              </div>
                              <div>
                                <strong>{usuario.nombre} {usuario.apellido}</strong>
                                <br />
                                <small className="text-muted">ID: {usuario.id}</small>
                              </div>
                            </div>
                          </td>
                          <td><small>{usuario.correo}</small></td>
                          <td><small>{usuario.codigo_area && usuario.numero_telefono ? `${usuario.codigo_area}-${usuario.numero_telefono}` : 'N/A'}</small></td>
                          <td>
                            <span className={`badge bg-${usuario.estado === 'activo' ? 'success' : 'danger'}`}>
                              {usuario.estado === 'activo' ? 'Activo' : 'Baneado'}
                            </span>
                          </td>
                          <td><small>{formatearFecha(usuario.fecha_registro || '')}</small></td>
                          <td>
                            <strong className="text-success">
                              ${usuario.total_gastado?.toFixed(2) || '0.00'}
                            </strong>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info">{usuario.total_ordenes || 0}</span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                className={`btn btn-outline-${usuario.estado === 'activo' ? 'warning' : 'success'}`}
                                onClick={() => abrirModal(usuario, 'banear')}
                                title={usuario.estado === 'activo' ? 'Banear usuario' : 'Desbanear usuario'}
                              >
                                <i className={`fas fa-${usuario.estado === 'activo' ? 'ban' : 'check'}`}></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => abrirModal(usuario, 'eliminar')}
                                title="Eliminar usuario"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <i className="fas fa-search fa-2x text-muted mb-2 d-block"></i>
                          <p className="text-muted mb-0">No se encontraron usuarios</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nota sobre Analytics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info border-0 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle fa-2x me-3"></i>
              <div>
                <h6 className="alert-heading mb-1">Analytics en Desarrollo</h6>
                <p className="mb-0">
                  Las estadísticas de visitas a la página estarán disponibles cuando el sistema esté en producción.
                  Se integrará con Google Analytics o similar para tracking en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {mostrarModal && usuarioSeleccionado && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas fa-${accionModal === 'banear' ? 'ban' : 'trash'} me-2 text-${accionModal === 'banear' ? 'warning' : 'danger'}`}></i>
                  Confirmar {accionModal === 'banear' 
                    ? (usuarioSeleccionado.estado === 'activo' ? 'Baneo' : 'Desbaneo')
                    : 'Eliminación'}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  {accionModal === 'banear' 
                    ? `¿Estás seguro de ${usuarioSeleccionado.estado === 'activo' ? 'banear' : 'desbanear'} a este usuario?`
                    : '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.'}
                </p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p className="mb-1"><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                    <p className="mb-1"><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
                    <p className="mb-0"><strong>Total gastado:</strong> ${usuarioSeleccionado.total_gastado?.toFixed(2)}</p>
                  </div>
                </div>
                {accionModal === 'eliminar' && (
                  <div className="alert alert-danger mt-3 mb-0">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Advertencia:</strong> Esta acción eliminará permanentemente al usuario y su historial.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className={`btn btn-${accionModal === 'banear' ? 'warning' : 'danger'}`}
                  onClick={ejecutarAccion}
                >
                  <i className={`fas fa-${accionModal === 'banear' ? 'ban' : 'trash'} me-2`}></i>
                  {accionModal === 'banear' 
                    ? (usuarioSeleccionado.estado === 'activo' ? 'Banear' : 'Desbanear')
                    : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar estado de orden */}
      {mostrarModalOrden && ordenSeleccionada && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2 text-primary"></i>
                  Cambiar Estado de Orden
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModalOrden}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Información de la Orden</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p className="mb-1"><strong>Orden #:</strong> {ordenSeleccionada.id}</p>
                      <p className="mb-1"><strong>Cliente:</strong> {ordenSeleccionada.usuario_nombre} {ordenSeleccionada.usuario_apellido}</p>
                      <p className="mb-1"><strong>Tipo:</strong> {ordenSeleccionada.tipo_servicio === 'domicilio' ? 'A Domicilio' : 'Para Llevar'}</p>
                      <p className="mb-1"><strong>Total:</strong> ${ordenSeleccionada.total.toFixed(2)}</p>
                      <p className="mb-0"><strong>Estado Actual:</strong> 
                        <span className={`badge bg-${
                          ordenSeleccionada.estado === 'pendiente' ? 'warning' :
                          ordenSeleccionada.estado === 'preparando' ? 'info' :
                          ordenSeleccionada.estado === 'listo' ? 'primary' :
                          ordenSeleccionada.estado === 'en_camino' ? 'secondary' :
                          ordenSeleccionada.estado === 'entregado' ? 'success' : 'danger'
                        } ms-2`}>
                          {ordenSeleccionada.estado === 'en_camino' ? 'En Camino' : 
                           ordenSeleccionada.estado.charAt(0).toUpperCase() + ordenSeleccionada.estado.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-arrow-right me-1"></i>
                    Nuevo Estado
                  </label>
                  <select
                    className="form-select"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                  >
                    <option value={ordenSeleccionada.estado}>
                      Mantener: {ordenSeleccionada.estado === 'en_camino' ? 'En Camino' : 
                                ordenSeleccionada.estado.charAt(0).toUpperCase() + ordenSeleccionada.estado.slice(1)}
                    </option>
                    {obtenerEstadosDisponibles(ordenSeleccionada.estado, ordenSeleccionada.tipo_servicio).map(estado => (
                      <option key={estado} value={estado}>
                        {estado === 'en_camino' ? 'En Camino' : 
                         estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {obtenerEstadosDisponibles(ordenSeleccionada.estado, ordenSeleccionada.tipo_servicio).length === 0 && (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Esta orden no puede cambiar de estado. Las órdenes entregadas o canceladas son finales.
                  </div>
                )}

                {nuevoEstado !== ordenSeleccionada.estado && (
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Confirmar cambio:</strong> La orden pasará de "{ordenSeleccionada.estado === 'en_camino' ? 'En Camino' : ordenSeleccionada.estado}" a "{nuevoEstado === 'en_camino' ? 'En Camino' : nuevoEstado}".
                  </div>
                )}

                {/* Mostrar flujo de estados según el tipo de servicio */}
                <div className="alert alert-light">
                  <h6 className="mb-2">
                    <i className="fas fa-route me-2"></i>
                    Flujo de Estados - {ordenSeleccionada.tipo_servicio === 'domicilio' ? 'A Domicilio' : 'Para Llevar'}
                  </h6>
                  <div className="d-flex align-items-center">
                    {ordenSeleccionada.tipo_servicio === 'domicilio' ? (
                      <>
                        <span className="badge bg-warning me-1">Pendiente</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-info me-1">Preparando</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-primary me-1">Listo</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-secondary me-1">En Camino</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-success">Entregado</span>
                      </>
                    ) : (
                      <>
                        <span className="badge bg-warning me-1">Pendiente</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-info me-1">Preparando</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-primary me-1">Listo</span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className="badge bg-success">Entregado</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModalOrden}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={actualizarEstadoOrden}
                  disabled={actualizandoOrden || nuevoEstado === ordenSeleccionada.estado || obtenerEstadosDisponibles(ordenSeleccionada.estado, ordenSeleccionada.tipo_servicio).length === 0}
                >
                  {actualizandoOrden ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Actualizar Estado
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage

