
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import type { ColorPalette } from '../types'

/**
 * Selector de Temas y Paletas de Colores
 * 
 * Componente que permite al usuario cambiar entre modo claro/oscuro
 * y seleccionar entre diferentes paletas de colores.
 * 
 * Fuentes:
 * - https://react.dev/learn/conditional-rendering
 * - https://getbootstrap.com/docs/5.3/components/dropdowns/
 */

interface ThemeSelectorProps {
  className?: string
}

interface PaletteOption {
  id: ColorPalette
  name: string
  color: string
  description: string
}

const paletteOptions: PaletteOption[] = [
  {
    id: 'default',
    name: 'Por Defecto',
    color: '#dc3545',
    description: 'Paleta roja original'
  },
  {
    id: 'gray',
    name: 'Gris',
    color: '#6c757d',
    description: 'Paleta en tonos grises'
  },
  {
    id: 'black',
    name: 'Negro',
    color: '#000000',
    description: 'Paleta monocromática'
  },
  {
    id: 'pink',
    name: 'Rosa',
    color: '#e91e63',
    description: 'Paleta en tonos rosas'
  },
  {
    id: 'blue',
    name: 'Azul',
    color: '#2196f3',
    description: 'Paleta en tonos azules'
  },
  {
    id: 'green',
    name: 'Verde',
    color: '#4caf50',
    description: 'Paleta en tonos verdes'
  }
]

export default function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { theme, setColorPalette, toggleThemeMode } = useTheme()
  const [showPaletteDropdown, setShowPaletteDropdown] = useState(false)

  const handlePaletteSelect = (palette: ColorPalette) => {
    setColorPalette(palette)
    setShowPaletteDropdown(false)
  }

  return (
    <div className={`theme-selector ${className}`}>
      <div className="d-flex align-items-center gap-3">
        {/* Selector de Modo (Claro/Oscuro) */}
        <div className="theme-mode-selector">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={toggleThemeMode}
            title={`Cambiar a modo ${theme.mode === 'light' ? 'oscuro' : 'claro'}`}
          >
            <i className={`fas fa-${theme.mode === 'light' ? 'moon' : 'sun'}`}></i>
            <span className="d-none d-md-inline">
              {theme.mode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
          </button>
        </div>

        {/* Selector de Paleta de Colores */}
        <div className="theme-palette-selector position-relative">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={() => setShowPaletteDropdown(!showPaletteDropdown)}
            title="Seleccionar paleta de colores"
          >
            <div 
              className="palette-preview" 
              style={{ backgroundColor: paletteOptions.find(p => p.id === theme.palette)?.color }}
            ></div>
            <span className="d-none d-md-inline">
              {paletteOptions.find(p => p.id === theme.palette)?.name}
            </span>
            <i className={`fas fa-chevron-${showPaletteDropdown ? 'up' : 'down'}`}></i>
          </button>

          {/* Dropdown de Paletas */}
          {showPaletteDropdown && (
            <div className="palette-dropdown">
              <div className="palette-dropdown-header">
                <h6 className="mb-0">Paletas de Colores</h6>
                <button
                  className="btn-close btn-close-sm"
                  onClick={() => setShowPaletteDropdown(false)}
                  aria-label="Cerrar"
                ></button>
              </div>
              
              <div className="palette-options">
                {paletteOptions.map(palette => (
                  <button
                    key={palette.id}
                    className={`palette-option ${theme.palette === palette.id ? 'active' : ''}`}
                    onClick={() => handlePaletteSelect(palette.id)}
                  >
                    <div className="palette-info">
                      <div className="palette-color-preview">
                        <div 
                          className="color-circle" 
                          style={{ backgroundColor: palette.color }}
                        ></div>
                        <div className="palette-details">
                          <div className="palette-name">{palette.name}</div>
                          <div className="palette-description">{palette.description}</div>
                        </div>
                      </div>
                      {theme.palette === palette.id && (
                        <i className="fas fa-check text-primary"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {showPaletteDropdown && (
        <div 
          className="palette-dropdown-overlay"
          onClick={() => setShowPaletteDropdown(false)}
        ></div>
      )}
    </div>
  )
}
