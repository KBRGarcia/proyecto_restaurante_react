import type { FilterBarProps } from '../types.ts'

/**
 * Componente de Barra de Filtros
 * Para filtrar productos por categoría
 */
function FilterBar({ categorias, categoriaActiva, onCategoriaChange }: FilterBarProps) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="fas fa-filter me-2"></i>
          Filtrar por Categoría
        </h5>
        
        <div className="d-flex flex-wrap gap-2">
          {/* Botón "Todas" */}
          <button
            className={`btn ${categoriaActiva === null ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onCategoriaChange(null)}
          >
            <i className="fas fa-list me-2"></i>
            Todas
          </button>
          
          {/* Botones de categorías */}
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              className={`btn ${categoriaActiva === categoria.id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onCategoriaChange(categoria.id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterBar

