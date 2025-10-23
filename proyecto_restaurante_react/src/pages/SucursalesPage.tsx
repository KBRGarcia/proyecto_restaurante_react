import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import ErrorMessage from '../components/ErrorMessage.tsx'
import { API_ENDPOINTS } from '../config.ts'
import type { Sucursal, ApiResponse } from '../types.ts'

/**
 * Página de Sucursales
 * Muestra todas las sucursales del restaurante con su información detallada
 * 
 * Fuente: https://react.dev/reference/react/useState
 */
function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null)

  useEffect(() => {
    cargarSucursales()
  }, [])

  const cargarSucursales = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🔌 Conectando a:', API_ENDPOINTS.sucursales)
      
      const response = await fetch(API_ENDPOINTS.sucursales)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse<Sucursal[]> = await response.json()

      if (data.success && data.data) {
        setSucursales(data.data)
      } else {
        setError('No se pudieron cargar las sucursales')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para abrir Google Maps con las coordenadas de la sucursal
   */
  const abrirMapa = (sucursal: Sucursal) => {
    if (sucursal.latitud && sucursal.longitud) {
      const url = `https://www.google.com/maps?q=${sucursal.latitud},${sucursal.longitud}`
      window.open(url, '_blank')
    } else {
      const direccionEncoded = encodeURIComponent(`${sucursal.direccion}, ${sucursal.ciudad}, ${sucursal.estado}`)
      const url = `https://www.google.com/maps/search/?api=1&query=${direccionEncoded}`
      window.open(url, '_blank')
    }
  }

  /**
   * Función para formatear el horario
   */
  const formatearHorario = (apertura: string, cierre: string) => {
    return `${apertura} - ${cierre}`
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner mensaje="Cargando sucursales..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <ErrorMessage mensaje={error} onRetry={cargarSucursales} />
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">
          <i className="fas fa-store me-3"></i>
          Nuestras Sucursales
        </h1>
        <p className="lead text-muted">
          Encuentra la sucursal más cercana a ti
        </p>
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <span className="badge bg-primary fs-6">
            <i className="fas fa-map-marker-alt me-2"></i>
            {sucursales.length} {sucursales.length === 1 ? 'Sucursal' : 'Sucursales'}
          </span>
          {sucursales.some(s => s.es_principal) && (
            <span className="badge bg-warning text-white fs-6">
              <i className="fas fa-star me-2"></i>
              Sucursal Principal Disponible
            </span>
          )}
        </div>
      </div>

      {/* Grid de sucursales */}
      {sucursales.length > 0 ? (
        <div className="row g-4">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className="col-lg-6 col-md-6 col-sm-12">
              <div className={`card h-100 shadow-sm hover-shadow ${sucursal.es_principal ? 'border-warning border-2' : ''}`}>
                {/* Imagen de la sucursal */}
                {sucursal.imagen && (
                  <img 
                    src={sucursal.imagen} 
                    className="card-img-top" 
                    alt={sucursal.nombre}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                
                <div className="card-body">
                  {/* Nombre y badges */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">
                      {sucursal.nombre}
                      {sucursal.es_principal && (
                        <span className="badge bg-warning text-white ms-2">
                          <i className="fas fa-star me-1"></i>
                          Principal
                        </span>
                      )}
                    </h5>
                  </div>

                  {/* Descripción */}
                  {sucursal.descripcion && (
                    <p className="card-text text-muted small mb-3">
                      {sucursal.descripcion}
                    </p>
                  )}

                  {/* Información de contacto */}
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="fas fa-map-marker-alt text-danger me-2 mt-1"></i>
                      <div>
                        <strong className="d-block">{sucursal.direccion}</strong>
                        <small className="text-muted">
                          {sucursal.ciudad}, {sucursal.estado}
                          {sucursal.codigo_postal && ` - ${sucursal.codigo_postal}`}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-phone text-success me-2"></i>
                      <a href={`tel:${sucursal.telefono}`} className="text-decoration-none">
                        {sucursal.telefono}
                      </a>
                    </div>

                    {sucursal.email && (
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-envelope text-primary me-2"></i>
                        <a href={`mailto:${sucursal.email}`} className="text-decoration-none">
                          {sucursal.email}
                        </a>
                      </div>
                    )}

                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-clock text-info me-2"></i>
                      <div>
                        <strong>{formatearHorario(sucursal.horario_apertura, sucursal.horario_cierre)}</strong>
                        <br />
                        <small className="text-muted">{sucursal.dias_operacion}</small>
                      </div>
                    </div>

                    {sucursal.gerente && (
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-user-tie text-secondary me-2"></i>
                        <small className="text-muted">
                          Gerente: <strong>{sucursal.gerente}</strong>
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Servicios disponibles */}
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      {sucursal.tiene_delivery && (
                        <span className="badge bg-success">
                          <i className="fas fa-motorcycle me-1"></i>
                          Delivery
                        </span>
                      )}
                      {sucursal.tiene_estacionamiento && (
                        <span className="badge bg-info">
                          <i className="fas fa-parking me-1"></i>
                          Estacionamiento
                        </span>
                      )}
                      {sucursal.capacidad_personas && (
                        <span className="badge bg-secondary">
                          <i className="fas fa-users me-1"></i>
                          Cap. {sucursal.capacidad_personas} personas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-danger btn-sm flex-grow-1"
                      onClick={() => abrirMapa(sucursal)}
                    >
                      <i className="fas fa-map-marked-alt me-2"></i>
                      Ver en Mapa
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSucursalSeleccionada(sucursal)}
                      data-bs-toggle="modal"
                      data-bs-target="#modalDetalleSucursal"
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      Detalles
                    </button>
                  </div>
                </div>

                {/* Footer con fecha de apertura */}
                {sucursal.fecha_apertura && (
                  <div className="card-footer bg-light">
                    <small className="text-muted">
                      <i className="fas fa-calendar-alt me-1"></i>
                      Abierta desde: {new Date(sucursal.fecha_apertura).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No hay sucursales disponibles en este momento
        </div>
      )}

      {/* Modal de detalles de sucursal */}
      {sucursalSeleccionada && (
        <div
          className="modal fade"
          id="modalDetalleSucursal"
          tabIndex={-1}
          aria-labelledby="modalDetalleSucursalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="modalDetalleSucursalLabel">
                  <i className="fas fa-store me-2"></i>
                  {sucursalSeleccionada.nombre}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Imagen */}
                {sucursalSeleccionada.imagen && (
                  <img
                    src={sucursalSeleccionada.imagen}
                    alt={sucursalSeleccionada.nombre}
                    className="img-fluid rounded mb-3"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  />
                )}

                {/* Descripción */}
                {sucursalSeleccionada.descripcion && (
                  <div className="mb-4">
                    <h6 className="fw-bold">Descripción</h6>
                    <p className="text-muted">{sucursalSeleccionada.descripcion}</p>
                  </div>
                )}

                {/* Información detallada */}
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Ubicación</h6>
                    <p className="mb-2">
                      <i className="fas fa-map-marker-alt text-danger me-2"></i>
                      {sucursalSeleccionada.direccion}
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-city text-primary me-2"></i>
                      {sucursalSeleccionada.ciudad}, {sucursalSeleccionada.estado}
                    </p>
                    {sucursalSeleccionada.codigo_postal && (
                      <p className="mb-2">
                        <i className="fas fa-mail-bulk text-secondary me-2"></i>
                        C.P. {sucursalSeleccionada.codigo_postal}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Contacto</h6>
                    <p className="mb-2">
                      <i className="fas fa-phone text-success me-2"></i>
                      <a href={`tel:${sucursalSeleccionada.telefono}`} className="text-decoration-none">
                        {sucursalSeleccionada.telefono}
                      </a>
                    </p>
                    {sucursalSeleccionada.email && (
                      <p className="mb-2">
                        <i className="fas fa-envelope text-primary me-2"></i>
                        <a href={`mailto:${sucursalSeleccionada.email}`} className="text-decoration-none">
                          {sucursalSeleccionada.email}
                        </a>
                      </p>
                    )}
                    {sucursalSeleccionada.gerente && (
                      <p className="mb-2">
                        <i className="fas fa-user-tie text-secondary me-2"></i>
                        Gerente: {sucursalSeleccionada.gerente}
                      </p>
                    )}
                  </div>
                </div>

                {/* Horarios */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">Horarios</h6>
                  <div className="alert alert-info">
                    <i className="fas fa-clock me-2"></i>
                    <strong>{formatearHorario(sucursalSeleccionada.horario_apertura, sucursalSeleccionada.horario_cierre)}</strong>
                    <br />
                    <small>{sucursalSeleccionada.dias_operacion}</small>
                  </div>
                </div>

                {/* Coordenadas (si existen) */}
                {sucursalSeleccionada.latitud && sucursalSeleccionada.longitud && (
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="fas fa-map-pin me-1"></i>
                      Coordenadas: {sucursalSeleccionada.latitud}, {sucursalSeleccionada.longitud}
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => abrirMapa(sucursalSeleccionada)}
                >
                  <i className="fas fa-map-marked-alt me-2"></i>
                  Ver en Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS adicional */}
      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        .card {
          border-radius: 10px;
          overflow: hidden;
        }

        .badge {
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default SucursalesPage

