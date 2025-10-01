/**
 * Componente de Mensaje de Error
 * Para mostrar errores de forma consistente
 */
function ErrorMessage({ mensaje, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
      <div className="flex-grow-1">
        <h5 className="alert-heading mb-2">Error al cargar datos</h5>
        <p className="mb-0">{mensaje}</p>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger ms-3" onClick={onRetry}>
          <i className="fas fa-redo me-2"></i>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

