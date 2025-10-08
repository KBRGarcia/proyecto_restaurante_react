import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
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
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Datos simulados - En producción vendrían del backend
      setEstadisticas({
        totalUsuarios: 156,
        totalOrdenes: 842,
        totalIngresos: 45820.50,
        ordenesHoy: 23,
        ingresosHoy: 1250.75,
        nuevosusuarios: 12,
        promedioOrden: 54.40
      })

      // Usuarios simulados
      setUsuarios([
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan@example.com',
          rol: 'cliente',
          estado: 'activo',
          telefono: '+1 555-0101',
          fecha_registro: '2024-01-15',
          total_gastado: 1250.50,
          total_ordenes: 15
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          correo: 'maria@example.com',
          rol: 'cliente',
          estado: 'activo',
          telefono: '+1 555-0102',
          fecha_registro: '2024-02-20',
          total_gastado: 890.25,
          total_ordenes: 12
        },
        {
          id: 3,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          correo: 'carlos@example.com',
          rol: 'cliente',
          estado: 'inactivo',
          telefono: '+1 555-0103',
          fecha_registro: '2024-03-10',
          total_gastado: 450.00,
          total_ordenes: 8
        }
      ])

      // Top usuarios por gasto
      setTopUsuarios([
        { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan@example.com', total_gastado: 1250.50, total_ordenes: 15 },
        { id: 4, nombre: 'Ana', apellido: 'Martínez', correo: 'ana@example.com', total_gastado: 980.75, total_ordenes: 18 },
        { id: 2, nombre: 'María', apellido: 'González', correo: 'maria@example.com', total_gastado: 890.25, total_ordenes: 12 }
      ])

      // Órdenes recientes simuladas
      setOrdenesRecientes([
        {
          id: 1001,
          usuario_id: 1,
          estado: 'pendiente',
          tipo_servicio: 'domicilio',
          subtotal: 45.00,
          impuestos: 7.20,
          total: 52.20,
          fecha_orden: new Date().toISOString(),
          direccion_entrega: 'Calle Principal #123'
        },
        {
          id: 1002,
          usuario_id: 2,
          estado: 'preparando',
          tipo_servicio: 'recoger',
          subtotal: 32.50,
          impuestos: 5.20,
          total: 37.70,
          fecha_orden: new Date(Date.now() - 3600000).toISOString()
        }
      ])

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filtrar usuarios según búsqueda
   */
  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtroUsuarios.toLowerCase()) ||
    u.apellido.toLowerCase().includes(filtroUsuarios.toLowerCase()) ||
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
      // En producción, aquí iría la llamada a la API
      // await fetch(`/api/usuarios/${usuarioSeleccionado.id}/${accionModal}`, { method: 'POST' })

      if (accionModal === 'banear') {
        // Cambiar estado del usuario
        setUsuarios(prev => prev.map(u =>
          u.id === usuarioSeleccionado.id
            ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' }
            : u
        ))
        alert(`Usuario ${usuarioSeleccionado.estado === 'activo' ? 'baneado' : 'desbaneado'} exitosamente`)
      } else if (accionModal === 'eliminar') {
        // Eliminar usuario
        setUsuarios(prev => prev.filter(u => u.id !== usuarioSeleccionado.id))
        alert('Usuario eliminado exitosamente')
      }

      cerrarModal()
    } catch (error) {
      console.error('Error al ejecutar acción:', error)
      alert('Error al ejecutar la acción')
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
                            orden.estado === 'entregado' ? 'success' : 'danger'
                          }`}>
                            {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                          </span>
                        </td>
                        <td><strong>${orden.total.toFixed(2)}</strong></td>
                        <td><small>{formatearFecha(orden.fecha_orden)}</small></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye"></i>
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
                          <td><small>{usuario.telefono || 'N/A'}</small></td>
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
    </div>
  )
}

export default DashboardPage

