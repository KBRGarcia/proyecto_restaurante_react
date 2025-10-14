import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ThemeMode, ColorPalette, ThemeConfig, ThemeColors } from '../types'

/**
 * Contexto de Temas para la Aplicación
 * 
 * Maneja el estado global de temas (modo oscuro/claro) y paletas de colores.
 * Proporciona funciones para cambiar temas y persistir preferencias del usuario.
 * 
 * Fuentes:
 * - https://react.dev/learn/passing-data-deeply-with-context
 * - https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
 */

interface ThemeContextType {
  theme: ThemeConfig
  setThemeMode: (mode: ThemeMode) => void
  setColorPalette: (palette: ColorPalette) => void
  toggleThemeMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Paletas de colores predefinidas
const colorPalettes: Record<ColorPalette, { light: ThemeColors; dark: ThemeColors }> = {
  default: {
    light: {
      primary: '#dc3545',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.15)'
    },
    dark: {
      primary: '#ff6b7a',
      secondary: '#adb5bd',
      success: '#40d9a4',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#212529',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#495057',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  },
  gray: {
    light: {
      primary: '#6c757d',
      secondary: '#495057',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.15)'
    },
    dark: {
      primary: '#adb5bd',
      secondary: '#6c757d',
      success: '#40d9a4',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#212529',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#495057',
      shadow: 'rgba(0, 0, 0, 0.4)'
    }
  },
  black: {
    light: {
      primary: '#000000',
      secondary: '#343a40',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#000000',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.15)'
    },
    dark: {
      primary: '#ffffff',
      secondary: '#adb5bd',
      success: '#40d9a4',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#000000',
      background: '#000000',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#333333',
      shadow: 'rgba(255, 255, 255, 0.1)'
    }
  },
  pink: {
    light: {
      primary: '#e91e63',
      secondary: '#ad1457',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(233, 30, 99, 0.15)'
    },
    dark: {
      primary: '#f48fb1',
      secondary: '#e91e63',
      success: '#40d9a4',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#212529',
      background: '#1a0e14',
      surface: '#2d1b24',
      text: '#ffffff',
      textSecondary: '#f48fb1',
      border: '#4a2c3a',
      shadow: 'rgba(244, 143, 177, 0.2)'
    }
  },
  blue: {
    light: {
      primary: '#2196f3',
      secondary: '#1976d2',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(33, 150, 243, 0.15)'
    },
    dark: {
      primary: '#64b5f6',
      secondary: '#2196f3',
      success: '#40d9a4',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#212529',
      background: '#0d1117',
      surface: '#161b22',
      text: '#ffffff',
      textSecondary: '#64b5f6',
      border: '#30363d',
      shadow: 'rgba(100, 181, 246, 0.2)'
    }
  },
  green: {
    light: {
      primary: '#4caf50',
      secondary: '#388e3c',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(76, 175, 80, 0.15)'
    },
    dark: {
      primary: '#81c784',
      secondary: '#4caf50',
      success: '#28a745',
      danger: '#ff6b7a',
      warning: '#ffd43b',
      info: '#74c0fc',
      light: '#495057',
      dark: '#212529',
      background: '#0d1b0e',
      surface: '#1a2e1b',
      text: '#ffffff',
      textSecondary: '#81c784',
      border: '#2d4a2e',
      shadow: 'rgba(129, 199, 132, 0.2)'
    }
  }
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Estado inicial desde localStorage o valores por defecto
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode')
    return (saved as ThemeMode) || 'light'
  })

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('color-palette')
    return (saved as ColorPalette) || 'default'
  })

  // Configuración del tema actual
  const theme: ThemeConfig = {
    mode: themeMode,
    palette: colorPalette,
    colors: colorPalettes[colorPalette][themeMode]
  }

  // Función para cambiar el modo del tema
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem('theme-mode', mode)
    applyThemeToDocument({ mode, palette: colorPalette })
  }

  // Función para cambiar la paleta de colores
  const setColorPalette = (palette: ColorPalette) => {
    setColorPaletteState(palette)
    localStorage.setItem('color-palette', palette)
    applyThemeToDocument({ mode: themeMode, palette })
  }

  // Función para alternar entre modo claro y oscuro
  const toggleThemeMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  // Función para aplicar el tema al documento usando CSS custom properties
  const applyThemeToDocument = ({ mode, palette }: { mode: ThemeMode; palette: ColorPalette }) => {
    const colors = colorPalettes[palette][mode]
    const root = document.documentElement

    // Aplicar variables CSS
    root.style.setProperty('--bs-primary', colors.primary)
    root.style.setProperty('--bs-secondary', colors.secondary)
    root.style.setProperty('--bs-success', colors.success)
    root.style.setProperty('--bs-danger', colors.danger)
    root.style.setProperty('--bs-warning', colors.warning)
    root.style.setProperty('--bs-info', colors.info)
    root.style.setProperty('--bs-light', colors.light)
    root.style.setProperty('--bs-dark', colors.dark)

    // Variables personalizadas para el tema
    root.style.setProperty('--theme-bg', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-secondary', colors.textSecondary)
    root.style.setProperty('--theme-border', colors.border)
    root.style.setProperty('--theme-shadow', colors.shadow)

    // Aplicar clase de modo oscuro al body
    if (mode === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }

    // Aplicar clase de paleta al body
    document.body.className = document.body.className.replace(/palette-\w+/g, '')
    document.body.classList.add(`palette-${palette}`)
  }

  // Aplicar tema al montar el componente
  useEffect(() => {
    applyThemeToDocument({ mode: themeMode, palette: colorPalette })
  }, [])

  const contextValue: ThemeContextType = {
    theme,
    setThemeMode,
    setColorPalette,
    toggleThemeMode
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar el contexto de temas
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
}

export default ThemeContext
