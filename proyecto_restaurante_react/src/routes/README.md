# 🛣️ Sistema de Rutas Centralizado

## 📋 Descripción

Este directorio contiene la configuración centralizada de todas las rutas de la aplicación.

## 📁 Estructura

```
routes/
└── routes.tsx    # Configuración de rutas organizada por categoría
```

## 🎯 Ventajas

✅ **Centralización**: Todas las rutas en un solo archivo  
✅ **Organización**: Rutas agrupadas por categoría (públicas, protegidas, admin)  
✅ **Mantenibilidad**: Fácil de encontrar y modificar rutas  
✅ **Escalabilidad**: Simple agregar nuevas rutas  

## 📖 Categorías de Rutas

### 1. Rutas Públicas (`publicRoutes`)
Accesibles para todos los usuarios sin autenticación:
- `/` - Página de inicio
- `/menu` - Menú de productos
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### 2. Rutas Protegidas (`protectedRoutes`)
Requieren que el usuario esté autenticado:
- `/perfil` - Perfil de usuario
- `/configuracion` - Configuración de cuenta
- `/carrito` - Carrito de compras
- `/checkout` - Proceso de pago
- `/mis-ordenes` - Historial de órdenes

### 3. Rutas Admin (`adminRoutes`)
Requieren autenticación + rol de administrador:
- `/dashboard` - Panel administrativo

### 4. Ruta 404 (`notFoundRoute`)
Se muestra cuando no se encuentra ninguna ruta

## ➕ Cómo Agregar una Nueva Ruta

### Ruta Pública

```tsx
// En routes.tsx, dentro de publicRoutes
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    {/* ... otras rutas ... */}
    
    {/* NUEVA RUTA */}
    <Route path="/contacto" element={<ContactoPage />} />
  </>
)
```

### Ruta Protegida

```tsx
// En routes.tsx, dentro de protectedRoutes
export const protectedRoutes = (
  <>
    {/* ... otras rutas ... */}
    
    {/* NUEVA RUTA */}
    <Route 
      path="/favoritos" 
      element={
        <ProtectedRoute>
          <FavoritosPage />
        </ProtectedRoute>
      } 
    />
  </>
)
```

### Ruta Admin

```tsx
// En routes.tsx, dentro de adminRoutes
export const adminRoutes = (
  <>
    {/* ... otras rutas ... */}
    
    {/* NUEVA RUTA */}
    <Route 
      path="/admin/usuarios" 
      element={
        <ProtectedRoute requiredRole="admin">
          <UsuariosPage />
        </ProtectedRoute>
      } 
    />
  </>
)
```

## 🔍 Ejemplo Completo

```tsx
// 1. Crear el componente de la página
// src/pages/ContactoPage.tsx
function ContactoPage() {
  return (
    <div className="container mt-5">
      <h1>Contáctanos</h1>
      {/* contenido */}
    </div>
  )
}
export default ContactoPage

// 2. Importar en routes.tsx
import ContactoPage from '../pages/ContactoPage.tsx'

// 3. Agregar a la categoría correspondiente
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/contacto" element={<ContactoPage />} />
    {/* ... */}
  </>
)
```

## 🚫 Lo que NO debes hacer

❌ No agregues rutas directamente en `App.tsx`  
❌ No dupliques la lógica de protección de rutas  
❌ No mezcles rutas públicas con protegidas  

## ✅ Mejores Prácticas

1. **Mantén las importaciones organizadas** por tipo de componente
2. **Agrupa rutas relacionadas** juntas
3. **Usa nombres de rutas descriptivos**
4. **Documenta rutas complejas** con comentarios

## 📚 Referencias

- [React Router - Routes](https://reactrouter.com/en/main/components/routes)
- [React Router - Route](https://reactrouter.com/en/main/route/route)

---

**Versión**: 2.0.0  
**Última actualización**: 08/10/2025

