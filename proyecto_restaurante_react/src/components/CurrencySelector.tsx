import { useState } from 'react'
import type { TipoMoneda } from '../types.ts'

/**
 * Selector de Tipo de Moneda
 * Permite al usuario elegir entre moneda nacional e internacional
 * 
 * Fuente: https://react.dev/learn/conditional-rendering
 */

interface CurrencySelectorProps {
  tipoMonedaSeleccionado: TipoMoneda
  onSeleccionar: (tipo: TipoMoneda) => void
}

interface MonedaOption {
  id: TipoMoneda
  nombre: string
  descripcion: string
  icono: string
  color: string
  simbolo: string
}

function CurrencySelector({ tipoMonedaSeleccionado, onSeleccionar }: CurrencySelectorProps) {
  
  const tiposMoneda: MonedaOption[] = [
    {
      id: 'nacional',
      nombre: 'Moneda Nacional',
      descripcion: 'Bolívares (Bs.)',
      icono: 'fas fa-coins',
      color: 'success',
      simbolo: 'Bs.'
    },
    {
      id: 'internacional',
      nombre: 'Moneda Internacional',
      descripcion: 'Dólares (USD)',
      icono: 'fas fa-dollar-sign',
      color: 'primary',
      simbolo: '$'
    }
  ]

  return (
    <div className="currency-selector">
      <div className="row g-3">
        {tiposMoneda.map(tipo => (
          <div key={tipo.id} className="col-md-6">
            <div
              className={`currency-card ${tipoMonedaSeleccionado === tipo.id ? 'selected' : ''}`}
              onClick={() => onSeleccionar(tipo.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSeleccionar(tipo.id)
                }
              }}
            >
              <div className="d-flex align-items-center">
                {/* Icono */}
                <div className={`currency-icon bg-${tipo.color}`}>
                  <i className={tipo.icono}></i>
                </div>

                {/* Información */}
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">{tipo.nombre}</h6>
                  <small className="text-muted">{tipo.descripcion}</small>
                  <div className="mt-1">
                    <span className={`badge bg-${tipo.color} text-white`}>
                      {tipo.simbolo}
                    </span>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="currency-check">
                  {tipoMonedaSeleccionado === tipo.id && (
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  )}
                  {tipoMonedaSeleccionado !== tipo.id && (
                    <i className="far fa-circle text-muted fa-2x"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CurrencySelector
