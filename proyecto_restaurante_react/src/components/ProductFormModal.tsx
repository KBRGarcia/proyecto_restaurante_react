import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import type { Producto, Categoria, Sucursal } from '../types'

/**
 * Interfaz para los props del componente
 */
interface ProductFormModalProps {
  show: boolean
  onClose: () => void
  onSave: (producto: Partial<Producto> & { sucursal_ids?: number[] }) => Promise<void>
  producto?: Producto | null
  categorias: Categoria[]
  sucursales: Sucursal[]
}

/**
 * Modal para Crear/Editar Productos
 * 
 * Formulario completo para gestionar productos del menú.
 * Soporta tanto creación como edición de productos existentes.
 * 
 * @component
 * @param show - Controla si el modal está visible
 * @param onClose - Callback para cerrar el modal
 * @param onSave - Callback para guardar el producto
 * @param producto - Producto a editar (null para crear nuevo)
 * @param categorias - Lista de categorías disponibles
 * @param sucursales - Lista de sucursales disponibles
 * 
 * Fuentes:
 * - https://react.dev/reference/react/useState
 * - https://getbootstrap.com/docs/5.3/components/modal/
 */
function ProductFormModal({ show, onClose, onSave, producto, categorias, sucursales }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    imagen: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'agotado',
    tiempo_preparacion: '15',
    ingredientes: '',
    es_especial: false
  })
  
  const [sucursalesSeleccionadas, setSucursalesSeleccionadas] = useState<number[]>([])

  // Cargar datos del producto cuando se está editando
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio?.toString() || '',
        categoria_id: producto.categoria_id?.toString() || '',
        imagen: producto.imagen || '',
        estado: producto.estado || 'activo',
        tiempo_preparacion: producto.tiempo_preparacion?.toString() || '15',
        ingredientes: producto.ingredientes || '',
        es_especial: Boolean(producto.es_especial)
      })
      
      // Cargar sucursales del producto
      setSucursalesSeleccionadas(producto.sucursal_ids || [])
    } else {
      // Resetear formulario para nuevo producto
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: categorias[0]?.id?.toString() || '',
        imagen: '',
        estado: 'activo',
        tiempo_preparacion: '15',
        ingredientes: '',
        es_especial: false
      })
      
      // Seleccionar todas las sucursales por defecto para nuevo producto
      setSucursalesSeleccionadas(sucursales.map(s => s.id))
    }
    setError(null)
  }, [producto, categorias, sucursales, show])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio')
      setLoading(false)
      return
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError('El precio debe ser mayor a 0')
      setLoading(false)
      return
    }

    if (!formData.categoria_id) {
      setError('Debes seleccionar una categoría')
      setLoading(false)
      return
    }
    
    if (sucursalesSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una sucursal')
      setLoading(false)
      return
    }

    try {
      // Preparar datos para enviar
      const productoData: Partial<Producto> & { sucursal_ids?: number[] } = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        categoria_id: parseInt(formData.categoria_id),
        imagen: formData.imagen.trim() || null,
        estado: formData.estado,
        tiempo_preparacion: parseInt(formData.tiempo_preparacion),
        ingredientes: formData.ingredientes.trim(),
        es_especial: formData.es_especial,
        sucursal_ids: sucursalesSeleccionadas
      }

      if (producto) {
        // Agregar ID si estamos editando
        productoData.id = producto.id
      }

      await onSave(productoData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }
  
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

  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        style={{ zIndex: 1055 }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="fas fa-utensils me-2"></i>
                {producto ? 'Editar Producto' : 'Nuevo Producto'}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} id="product-form">
                <div className="row">
                  {/* Nombre */}
                  <div className="col-md-8 mb-3">
                    <label htmlFor="nombre" className="form-label">
                      <i className="fas fa-tag me-2"></i>
                      Nombre del Producto <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Ej: Hamburguesa Especial"
                    />
                  </div>

                  {/* Precio */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="precio" className="form-label">
                      <i className="fas fa-dollar-sign me-2"></i>
                      Precio <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    <i className="fas fa-align-left me-2"></i>
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Descripción detallada del producto..."
                  ></textarea>
                </div>

                <div className="row">
                  {/* Categoría */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="categoria_id" className="form-label">
                      <i className="fas fa-list me-2"></i>
                      Categoría <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="categoria_id"
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="estado" className="form-label">
                      <i className="fas fa-toggle-on me-2"></i>
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="agotado">Agotado</option>
                    </select>
                  </div>
                </div>

                {/* Tiempo de Preparación */}
                <div className="mb-3">
                  <label htmlFor="tiempo_preparacion" className="form-label">
                    <i className="fas fa-clock me-2"></i>
                    Tiempo de Preparación (minutos)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="tiempo_preparacion"
                    name="tiempo_preparacion"
                    value={formData.tiempo_preparacion}
                    onChange={handleChange}
                    disabled={loading}
                    min="1"
                    placeholder="15"
                  />
                </div>

                {/* Imagen URL */}
                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">
                    <i className="fas fa-image me-2"></i>
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="imagen"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <small className="text-muted">
                    Deja vacío para usar imagen por defecto
                  </small>
                </div>

                {/* Ingredientes */}
                <div className="mb-3">
                  <label htmlFor="ingredientes" className="form-label">
                    <i className="fas fa-pepper-hot me-2"></i>
                    Ingredientes
                  </label>
                  <textarea
                    className="form-control"
                    id="ingredientes"
                    name="ingredientes"
                    value={formData.ingredientes}
                    onChange={handleChange}
                    disabled={loading}
                    rows={2}
                    placeholder="Lista de ingredientes principales..."
                  ></textarea>
                </div>

                {/* Es Especial */}
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="es_especial"
                    name="es_especial"
                    checked={formData.es_especial}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="es_especial">
                    <i className="fas fa-star me-2 text-warning"></i>
                    Marcar como Especial
                  </label>
                </div>
                
                {/* Sucursales */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-store me-2"></i>
                    Sucursales donde está disponible <span className="text-danger">*</span>
                  </label>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-muted">
                          {sucursalesSeleccionadas.length} de {sucursales.length} seleccionada(s)
                        </small>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={seleccionarTodasSucursales}
                          disabled={loading || sucursalesSeleccionadas.length === sucursales.length}
                        >
                          <i className="fas fa-check-double me-1"></i>
                          Seleccionar Todas
                        </button>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {sucursales.map(sucursal => (
                          <button
                            key={sucursal.id}
                            type="button"
                            className={`btn btn-sm ${
                              sucursalesSeleccionadas.includes(sucursal.id)
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => toggleSucursal(sucursal.id)}
                            disabled={loading}
                          >
                            <i className={`fas fa-${sucursalesSeleccionadas.includes(sucursal.id) ? 'check-circle' : 'circle'} me-1`}></i>
                            {sucursal.nombre}
                            {sucursal.es_principal && (
                              <i className="fas fa-star text-warning ms-1"></i>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <small className="text-muted">
                    Selecciona las sucursales donde este producto estará disponible
                  </small>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                form="product-form"
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
                    {producto ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductFormModal

