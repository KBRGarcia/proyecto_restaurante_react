/**
 * Componente de Spinner de Carga
 * Componente reutilizable para mostrar estado de carga
 */
function LoadingSpinner({ mensaje = 'Cargando...' }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{mensaje}</span>
      </div>
      <p className="mt-3 text-muted">{mensaje}</p>
    </div>
  )
}

export default LoadingSpinner

