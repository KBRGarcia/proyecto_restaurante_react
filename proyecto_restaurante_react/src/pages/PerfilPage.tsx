import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { API_ENDPOINTS } from '../config'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage.tsx'
import type { Usuario, PerfilFormData, Estadisticas } from '../types'

/**
 * Página de Perfil del Usuario
 * Permite ver y editar información personal
 */
function PerfilPage() {
  const { estaAutenticado, actualizarUsuario } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [editando, setEditando] = useState<boolean>(false)
  const [subiendoFoto, setSubiendoFoto] = useState<boolean>(false)
  
  const [formData, setFormData] = useState<PerfilFormData>({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  })

  // Cargar datos del perfil
  useEffect(() => {
    if (estaAutenticado()) {
      cargarPerfil()
    }
  }, [])

  const cargarPerfil = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Cargar información del perfil
      const response = await fetch(API_ENDPOINTS.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPerfil(data.usuario)
          setFormData({
            nombre: data.usuario.nombre || '',
            apellido: data.usuario.apellido || '',
            telefono: data.usuario.telefono || '',
            direccion: data.usuario.direccion || ''
          })
        }
      }

      // Cargar estadísticas (simuladas por ahora)
      setEstadisticas({
        totalOrdenes: 0,
        totalGastado: 0
      })

    } catch (err) {
      setError('Error al cargar el perfil')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('El nombre y apellido son obligatorios')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_ENDPOINTS.me}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Perfil actualizado exitosamente')
        setPerfil(prev => prev ? { ...prev, ...formData } : null)
        setEditando(false)
        setTimeout(() => setSuccess(null), 5000)
      } else {
        setError(data.message || 'Error al actualizar el perfil')
      }
    } catch (err) {
      setError('Error de conexión al actualizar el perfil')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cancelarEdicion = () => {
    setFormData({
      nombre: perfil?.nombre || '',
      apellido: perfil?.apellido || '',
      telefono: perfil?.codigo_area && perfil?.numero_telefono 
        ? `${perfil.codigo_area}-${perfil.numero_telefono}` 
        : '',
      direccion: perfil?.direccion || ''
    })
    setEditando(false)
    setError(null)
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      setError('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 5MB')
      return
    }

    try {
      setSubiendoFoto(true)
      setError(null)
      setSuccess(null)

      // Convertir imagen a base64
      const reader = new FileReader()
      reader.onload = async () => {
        const base64String = reader.result as string

        // Enviar al servidor
        const token = localStorage.getItem('token')
        const response = await fetch(API_ENDPOINTS.uploadFoto, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ foto_perfil: base64String })
        })

        const data = await response.json()

        if (data.success) {
          setSuccess('Foto de perfil actualizada exitosamente')
          setPerfil(prev => prev ? { ...prev, foto_perfil: data.foto_perfil } : null)
          
          // Actualizar usuario en el contexto
          await actualizarUsuario()
          
          setTimeout(() => setSuccess(null), 5000)
        } else {
          setError(data.message || 'Error al actualizar la foto')
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Error al subir la foto de perfil')
      console.error(err)
    } finally {
      setSubiendoFoto(false)
    }
  }

  if (loading && !perfil) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Sidebar del perfil */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3 position-relative d-inline-block">
                {perfil?.foto_perfil ? (
                  <img 
                    src={perfil.foto_perfil} 
                    alt="Foto de perfil" 
                    className="rounded-circle"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover',
                      border: '3px solid #dc3545'
                    }}
                  />
                ) : (
                  <i className="fas fa-user-circle fa-5x text-danger"></i>
                )}
                <label 
                  htmlFor="foto-perfil-input" 
                  className="position-absolute bottom-0 end-0 btn btn-danger btn-sm rounded-circle"
                  style={{ 
                    width: '35px', 
                    height: '35px', 
                    padding: '0',
                    cursor: subiendoFoto ? 'not-allowed' : 'pointer'
                  }}
                  title="Cambiar foto de perfil"
                >
                  {subiendoFoto ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <i className="fas fa-camera"></i>
                  )}
                </label>
                <input
                  id="foto-perfil-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  disabled={subiendoFoto}
                />
              </div>
              <h5 className="card-title">
                {perfil?.nombre} {perfil?.apellido}
              </h5>
              <p className="text-muted small mb-2">
                <i className="fas fa-envelope me-1"></i>
                {perfil?.correo}
              </p>
              <span className={`badge bg-${
                perfil?.rol === 'admin' ? 'danger' : 
                perfil?.rol === 'empleado' ? 'warning' : 'primary'
              }`}>
                {(perfil?.rol ?? '').charAt(0).toUpperCase() + (perfil?.rol ?? '').slice(1)}
              </span>
              <hr />
              <p className="text-muted small mb-1">
                <i className="fas fa-calendar-alt me-1"></i>
                Miembro desde
              </p>
              <p className="small">
                {perfil?.fecha_registro ? 
                  new Date(perfil.fecha_registro).toLocaleDateString('es-ES') : 
                  'N/A'
                }
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="fas fa-chart-bar me-2"></i>
                Estadísticas
              </h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">
                    <i className="fas fa-shopping-bag me-1"></i>
                    Órdenes
                  </span>
                  <span className="badge bg-primary">
                    {estadisticas?.totalOrdenes || 0}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    <i className="fas fa-dollar-sign me-1"></i>
                    Total Gastado
                  </span>
                  <span className="badge bg-success">
                    ${estadisticas?.totalGastado?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="col-lg-9">
          <h2 className="mb-4">
            <i className="fas fa-user me-2 text-danger"></i>
            Mi Perfil
          </h2>

          {error && <ErrorMessage mensaje={error} />}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show">
              <i className="fas fa-check-circle me-2"></i>
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccess(null)}
              ></button>
            </div>
          )}

          {/* Formulario de datos personales */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-id-card me-2"></i>
                Información Personal
              </h5>
              {!editando && (
                <button 
                  className="btn btn-light btn-sm"
                  onClick={() => setEditando(true)}
                >
                  <i className="fas fa-edit me-1"></i>
                  Editar
                </button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={!editando}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      disabled={!editando}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={perfil?.correo || ''}
                    disabled
                  />
                  <small className="text-muted">
                    El correo no se puede modificar. Contacta al administrador si necesitas cambiarlo.
                  </small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ej: +52 123 456 7890"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user-tag me-2"></i>
                      Rol
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={(perfil?.rol ?? '').charAt(0).toUpperCase() + (perfil?.rol ?? '').slice(1)}
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Dirección
                  </label>
                  <textarea
                    className="form-control"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={!editando}
                    rows={3}
                    placeholder="Calle, número, colonia, ciudad..."
                  ></textarea>
                </div>

                {editando && (
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelarEdicion}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="fas fa-shield-alt me-2 text-success"></i>
                Seguridad de la Cuenta
              </h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <p className="mb-1">
                    <i className="fas fa-key me-2"></i>
                    Contraseña
                  </p>
                  <small className="text-muted">••••••••</small>
                </div>
                <a href="/configuracion#cambiar-password" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-edit me-1"></i>
                  Cambiar
                </a>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">
                    <i className="fas fa-circle me-2 text-success"></i>
                    Estado de Cuenta
                  </p>
                  <small className="text-muted">
                    <span className={`badge bg-${perfil?.estado === 'activo' ? 'success' : 'danger'}`}>
                      {(perfil?.estado ?? '').charAt(0).toUpperCase() + (perfil?.estado ?? '').slice(1)}
                    </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilPage

