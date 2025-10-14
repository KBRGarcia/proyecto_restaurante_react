# Sistema de Temas - Proyecto Restaurante React

## Descripción

Se ha implementado un sistema completo de temas que permite a los usuarios personalizar la apariencia de la aplicación con:

- **Modo Claro/Oscuro**: Alternancia entre tema claro y oscuro
- **6 Paletas de Colores**: Selección entre diferentes esquemas de color
- **Persistencia**: Las preferencias se guardan automáticamente en localStorage
- **Aplicación Global**: Los cambios se aplican a toda la aplicación

## Características Implementadas

### 🎨 Paletas de Colores Disponibles

1. **Por Defecto** - Paleta roja original (`#dc3545`)
2. **Gris** - Paleta en tonos grises (`#6c757d`)
3. **Negro** - Paleta monocromática (`#000000`)
4. **Rosa** - Paleta en tonos rosas (`#e91e63`)
5. **Azul** - Paleta en tonos azules (`#2196f3`)
6. **Verde** - Paleta en tonos verdes (`#4caf50`)

### 🌓 Modos de Tema

- **Modo Claro**: Colores claros con fondo blanco
- **Modo Oscuro**: Colores oscuros con fondo negro/gris oscuro

### 📱 Componentes Implementados

#### ThemeContext (`src/contexts/ThemeContext.tsx`)
- Contexto React para gestión global de temas
- Hook personalizado `useTheme()`
- Persistencia automática en localStorage
- Aplicación de variables CSS dinámicas

#### ThemeSelector (`src/components/ThemeSelector.tsx`)
- Componente selector de modo y paleta
- Interfaz intuitiva con preview de colores
- Dropdown con opciones de paletas
- Botón de alternancia modo claro/oscuro

#### Estilos CSS (`src/styles/themes.css`)
- Variables CSS dinámicas para todos los temas
- Estilos específicos para modo oscuro
- Transiciones suaves entre cambios de tema
- Estilos responsivos y accesibles

## Archivos Modificados

### Nuevos Archivos
- `src/contexts/ThemeContext.tsx` - Contexto de temas
- `src/components/ThemeSelector.tsx` - Selector de temas
- `src/styles/themes.css` - Estilos del sistema de temas

### Archivos Actualizados
- `src/types.ts` - Tipos TypeScript para temas
- `src/App.tsx` - Integración del ThemeProvider
- `src/components/Navbar.tsx` - Selector de temas en navbar
- `src/pages/ConfiguracionPage.tsx` - Sección de apariencia

## Uso del Sistema

### Para Desarrolladores

```typescript
import { useTheme } from '../contexts/ThemeContext'

function MiComponente() {
  const { theme, setThemeMode, setColorPalette, toggleThemeMode } = useTheme()
  
  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <p style={{ color: theme.colors.text }}>
        Contenido con tema aplicado
      </p>
    </div>
  )
}
```

### Para Usuarios

1. **Desde el Navbar**: Usar el selector de temas en la barra superior
2. **Desde Configuración**: Ir a Configuración > Apariencia
3. **Cambios Inmediatos**: Los cambios se aplican al instante
4. **Persistencia**: Las preferencias se guardan automáticamente

## Variables CSS Disponibles

El sistema utiliza variables CSS que se actualizan dinámicamente:

```css
:root {
  --bs-primary: /* Color primario de la paleta */
  --bs-secondary: /* Color secundario */
  --bs-success: /* Color de éxito */
  --bs-danger: /* Color de peligro */
  --bs-warning: /* Color de advertencia */
  --bs-info: /* Color de información */
  --theme-bg: /* Color de fondo */
  --theme-surface: /* Color de superficie */
  --theme-text: /* Color de texto */
  --theme-text-secondary: /* Color de texto secundario */
  --theme-border: /* Color de bordes */
  --theme-shadow: /* Color de sombras */
}
```

## Clases CSS Aplicadas

- `body.dark-mode` - Modo oscuro activo
- `body.palette-{nombre}` - Paleta específica activa

## Tecnologías Utilizadas

- **React Context API** - Gestión de estado global
- **CSS Custom Properties** - Variables dinámicas
- **TypeScript** - Tipado fuerte
- **Bootstrap 5** - Framework CSS base
- **localStorage** - Persistencia de preferencias

## Buenas Prácticas Implementadas

✅ **Accesibilidad**: Contraste adecuado en ambos modos  
✅ **Responsive**: Funciona en todos los dispositivos  
✅ **Performance**: Transiciones suaves sin lag  
✅ **UX**: Cambios inmediatos y feedback visual  
✅ **Mantenibilidad**: Código modular y bien documentado  
✅ **Escalabilidad**: Fácil agregar nuevas paletas  

## Fuentes Oficiales

- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Bootstrap 5 Theming](https://getbootstrap.com/docs/5.3/customize/color/)
- [TypeScript React](https://react-typescript-cheatsheet.netlify.app/)

## Próximas Mejoras Sugeridas

- [ ] Detección automática de preferencia del sistema
- [ ] Animaciones personalizadas por paleta
- [ ] Temas estacionales (Navidad, Halloween, etc.)
- [ ] Editor de colores personalizado
- [ ] Exportar/importar configuraciones de tema
