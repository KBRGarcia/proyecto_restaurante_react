# Sistema de Notificaciones Global

## Descripción

Sistema de notificaciones tipo toast implementado para reemplazar todos los `alert()` nativos del navegador por notificaciones elegantes y personalizadas.

**Fecha de implementación:** 23 de octubre de 2025

## Componentes

### 1. NotificationContext (`src/contexts/NotificationContext.tsx`)

Contexto global que gestiona el estado de las notificaciones en toda la aplicación.

#### API

```typescript
interface NotificationContextType {
  notifications: Notification[]
  showNotification: (type, title, message, duration?) => void
  removeNotification: (id) => void
  success: (title, message, duration?) => void
  error: (title, message, duration?) => void
  warning: (title, message, duration?) => void
  info: (title, message, duration?) => void
}
```

#### Tipos de Notificación

- **success**: Operaciones exitosas (verde)
- **error**: Errores y fallos (rojo)
- **warning**: Advertencias (amarillo)
- **info**: Información general (azul)

### 2. NotificationContainer (`src/components/NotificationContainer.tsx`)

Componente que renderiza las notificaciones en la esquina superior derecha de la pantalla.

**Características:**
- Animación de entrada suave (slide-in desde la derecha)
- Barra de progreso que indica el tiempo restante
- Botón de cierre manual
- Auto-cierre después de la duración especificada
- Apilamiento de múltiples notificaciones

### 3. Estilos y Animaciones (`src/index.css`)

```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
```

## Uso

### 1. Importar el Hook

```typescript
import { useNotification } from '../contexts/NotificationContext'
```

### 2. Usar en Componentes

```typescript
function MiComponente() {
  const { success, error, warning, info } = useNotification()

  const handleSuccess = () => {
    success(
      'Operación Exitosa',
      'Los datos se guardaron correctamente.',
      5000 // duración en ms (opcional, default: 5000)
    )
  }

  const handleError = () => {
    error(
      'Error al Guardar',
      'No se pudieron guardar los datos. Intenta nuevamente.',
      6000
    )
  }

  return (
    // Tu componente...
  )
}
```

### 3. Tipos de Notificaciones

#### Success (Éxito)
```typescript
success('Título', 'Mensaje de éxito', 5000)
```
- **Color:** Verde
- **Icono:** fa-check-circle
- **Uso:** Operaciones completadas exitosamente

#### Error
```typescript
error('Título', 'Mensaje de error', 6000)
```
- **Color:** Rojo
- **Icono:** fa-times-circle
- **Uso:** Errores, fallos en operaciones

#### Warning (Advertencia)
```typescript
warning('Título', 'Mensaje de advertencia', 5000)
```
- **Color:** Amarillo
- **Icono:** fa-exclamation-triangle
- **Uso:** Situaciones que requieren atención

#### Info (Información)
```typescript
info('Título', 'Mensaje informativo', 4000)
```
- **Color:** Azul
- **Icono:** fa-info-circle
- **Uso:** Información general, mensajes informativos

## Ejemplos de Implementación

### Cancelación de Orden
```typescript
if (data.success) {
  success(
    '¡Orden Cancelada Exitosamente!',
    `Tu orden #${orden.id} ha sido cancelada. El monto será devuelto en 30 minutos.`,
    8000
  )
}
```

### Error de Conexión
```typescript
catch (error) {
  showError(
    'Error de Conexión',
    'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
    6000
  )
}
```

### Validación de Formulario
```typescript
if (!campoValido) {
  warning(
    'Campo Requerido',
    'Por favor completa todos los campos obligatorios.',
    5000
  )
}
```

## Archivos Modificados

### Archivos Reemplazados (alert → notificaciones)

1. **src/components/OrderDetailsModal.tsx**
   - Cancelación de órdenes
   - Descarga de recibos (en desarrollo)

2. **src/pages/DashboardPage.tsx**
   - Errores de carga
   - Gestión de usuarios (banear/eliminar)
   - Actualización de estados de órdenes
   - Cancelación de órdenes por admin

3. **src/pages/CheckoutPage.tsx**
   - Validación de sesión
   - Errores en procesamiento de pagos

### Nuevos Archivos Creados

1. `src/contexts/NotificationContext.tsx` - Contexto global
2. `src/components/NotificationContainer.tsx` - Componente de renderizado

### Archivos Modificados

1. `src/App.tsx` - Integración del NotificationProvider
2. `src/index.css` - Animaciones CSS

## Ventajas sobre `alert()`

### Antes (alert)
```typescript
alert('Error al procesar\n\nIntenta nuevamente')
```

❌ **Problemas:**
- Bloquea la interfaz completamente
- No permite interacción con la página
- Estilo poco atractivo y no personalizable
- Interrumpe el flujo del usuario
- No se puede cerrar automáticamente

### Ahora (Notificaciones)
```typescript
error('Error al Procesar', 'Intenta nuevamente', 6000)
```

✅ **Ventajas:**
- No bloquea la interfaz
- Diseño moderno y profesional
- Cierre automático configurable
- Múltiples notificaciones simultáneas
- Animaciones suaves
- Consistente con el diseño de la aplicación
- Mejor experiencia de usuario

## Configuración

### Duración Predeterminada
- **Default:** 5000ms (5 segundos)
- **Recomendado para éxito:** 5000-8000ms
- **Recomendado para errores:** 6000-10000ms
- **Mensajes cortos:** 3000-4000ms

### Personalización de Colores

Las notificaciones usan las clases de Bootstrap:
- `alert-success` - Verde
- `alert-danger` - Rojo
- `alert-warning` - Amarillo
- `alert-info` - Azul

Puedes personalizar los colores en `src/styles/themes.css`.

## Mejores Prácticas

### ✅ Hacer

1. **Títulos claros y concisos**
   ```typescript
   success('Orden Creada', 'Tu orden se procesó exitosamente')
   ```

2. **Mensajes informativos**
   ```typescript
   error('Error al Guardar', 'Verifica tu conexión e intenta nuevamente')
   ```

3. **Duraciones apropiadas**
   - Mensajes cortos: 3-4 segundos
   - Mensajes normales: 5-6 segundos
   - Mensajes largos: 8-10 segundos

4. **Usar el tipo correcto**
   - success: Cuando algo sale bien
   - error: Cuando algo falla
   - warning: Cuando hay que tener cuidado
   - info: Para información general

### ❌ Evitar

1. **Mensajes muy largos**
   ```typescript
   // Mal
   success('Título', 'Este es un mensaje extremadamente largo que...')
   ```

2. **Múltiples notificaciones para la misma acción**
   ```typescript
   // Mal
   success('Guardando...')
   success('Procesando...')
   success('Completado')
   ```

3. **Duraciones excesivas**
   ```typescript
   // Mal
   error('Error', 'Mensaje', 60000) // 1 minuto
   ```

4. **Tipos incorrectos**
   ```typescript
   // Mal
   success('Error al guardar', 'No se pudo guardar') // Debería ser error()
   ```

## Mantenimiento

### Agregar Nuevo Tipo de Notificación

1. Agregar tipo en `NotificationContext.tsx`:
```typescript
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'custom'
```

2. Agregar configuración en `NotificationContainer.tsx`:
```typescript
custom: {
  bgClass: 'alert-custom',
  icon: 'fa-star',
  iconColor: 'text-custom'
}
```

3. Agregar método helper en el contexto:
```typescript
const custom = useCallback(
  (title: string, message: string, duration?: number) => {
    showNotification('custom', title, message, duration)
  },
  [showNotification]
)
```

## Fuentes Oficiales

- **React Context:** https://react.dev/reference/react/useContext
- **React State:** https://react.dev/reference/react/useState
- **React Callbacks:** https://react.dev/reference/react/useCallback
- **Bootstrap Alerts:** https://getbootstrap.com/docs/5.3/components/alerts/
- **Font Awesome Icons:** https://fontawesome.com/icons

## Soporte

Para problemas o mejoras, consulta:
- Documentación de React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs/
- Bootstrap: https://getbootstrap.com/docs/5.3/

---

**Última actualización:** 23 de octubre de 2025

