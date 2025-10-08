# 🛣️ Sistema de Rutas Centralizado - Guía Rápida

**Fecha**: 08/10/2025  
**Versión**: 2.0.0

## ✅ Cambios Implementados

Se ha refactorizado el sistema de rutas para mejorar la organización y mantenibilidad del código.

### Antes ❌
```tsx
// App.tsx (117 líneas)
// Todas las rutas definidas inline con imports dispersos
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/menu" element={<MenuPage />} />
  <Route path="/perfil" element={<ProtectedRoute>...</ProtectedRoute>} />
  {/* ... más rutas ... */}
</Routes>
```

### Después ✅
```tsx
// App.tsx (55 líneas)
// Rutas importadas desde archivo centralizado
<Routes>
  {publicRoutes}
  {protectedRoutes}
  {adminRoutes}
  {notFoundRoute}
</Routes>

// routes/routes.tsx
// Todas las rutas organizadas por categoría
export const publicRoutes = (...)
export const protectedRoutes = (...)
export const adminRoutes = (...)
```

## 📁 Estructura

```
src/
├── App.tsx                    # Configuración de providers y rutas
└── routes/
    ├── routes.tsx            # ⭐ Configuración centralizada de rutas
    └── README.md             # Documentación del sistema
```

## 🎯 Beneficios

✅ **Código más limpio**: App.tsx reducido de 117 a 55 líneas  
✅ **Mejor organización**: Rutas agrupadas por categoría  
✅ **Fácil mantenimiento**: Un solo archivo para todas las rutas  
✅ **Simple y funcional**: Sin complejidad innecesaria  

## 📖 Rutas Configuradas

### Públicas (4)
- `/` → HomePage
- `/menu` → MenuPage
- `/login` → Login
- `/register` → Register

### Protegidas (5)
- `/perfil` → PerfilPage
- `/configuracion` → ConfiguracionPage
- `/carrito` → CartPage
- `/checkout` → CheckoutPage
- `/mis-ordenes` → MisOrdenesPage

### Admin (1)
- `/dashboard` → Dashboard (requiere rol admin)

### Error (1)
- `*` → Página 404

## ➕ Agregar Nueva Ruta

**3 pasos simples:**

### 1. Crear el componente
```tsx
// src/pages/MiPagina.tsx
function MiPagina() {
  return <div>Contenido</div>
}
export default MiPagina
```

### 2. Importar en routes.tsx
```tsx
// src/routes/routes.tsx
import MiPagina from '../pages/MiPagina.tsx'
```

### 3. Agregar a la categoría correspondiente
```tsx
// En publicRoutes (para ruta pública)
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/mi-ruta" element={<MiPagina />} />
    {/* ... */}
  </>
)

// O en protectedRoutes (para ruta protegida)
export const protectedRoutes = (
  <>
    {/* ... */}
    <Route 
      path="/mi-ruta" 
      element={
        <ProtectedRoute>
          <MiPagina />
        </ProtectedRoute>
      } 
    />
  </>
)
```

**¡Listo!** No necesitas modificar App.tsx

## 🔍 Ejemplos

### Ejemplo 1: Ruta Pública Simple

```tsx
// 1. Crear componente
// src/pages/AcercaDePage.tsx
function AcercaDePage() {
  return (
    <div className="container mt-5">
      <h1>Acerca de Nosotros</h1>
      <p>Información del restaurante...</p>
    </div>
  )
}
export default AcercaDePage

// 2. Agregar a routes.tsx
import AcercaDePage from '../pages/AcercaDePage.tsx'

export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/acerca-de" element={<AcercaDePage />} />
    {/* ... otras rutas ... */}
  </>
)
```

### Ejemplo 2: Ruta Protegida

```tsx
// 1. Crear componente
// src/pages/FavoritosPage.tsx
function FavoritosPage() {
  return (
    <div className="container mt-5">
      <h1>Mis Favoritos</h1>
      {/* lista de favoritos */}
    </div>
  )
}
export default FavoritosPage

// 2. Agregar a routes.tsx
import FavoritosPage from '../pages/FavoritosPage.tsx'

export const protectedRoutes = (
  <>
    {/* ... otras rutas ... */}
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

### Ejemplo 3: Ruta Admin

```tsx
// 1. Crear componente
// src/pages/UsuariosPage.tsx
function UsuariosPage() {
  return (
    <div className="container mt-5">
      <h1>Gestión de Usuarios</h1>
      {/* tabla de usuarios */}
    </div>
  )
}
export default UsuariosPage

// 2. Agregar a routes.tsx
import UsuariosPage from '../pages/UsuariosPage.tsx'

export const adminRoutes = (
  <>
    <Route 
      path="/dashboard" 
      element={<ProtectedRoute requiredRole="admin">...</ProtectedRoute>} 
    />
    
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

## 📚 Documentación

Para más detalles, ver:
- **`src/routes/README.md`** - Documentación completa del sistema de rutas
- **`src/routes/routes.tsx`** - Código fuente con todos los ejemplos

## 🎓 Mejores Prácticas

1. ✅ Siempre agregar rutas en `routes/routes.tsx`, nunca en `App.tsx`
2. ✅ Usar la categoría correcta (pública, protegida, admin)
3. ✅ Importar el componente antes de usarlo
4. ✅ Usar rutas protegidas para contenido privado
5. ✅ Documentar rutas complejas con comentarios

## ⚠️ Importante

- **NO modifiques App.tsx** para agregar rutas, usa `routes/routes.tsx`
- **Mantén las categorías separadas** (no mezcles públicas con protegidas)
- **Usa ProtectedRoute** para rutas que requieren autenticación

## 🚀 Ventajas vs. Implementación Anterior

| Aspecto | Antes | Después |
|---------|-------|---------|
| Líneas en App.tsx | 117 | 55 |
| Organización | Dispersa | Centralizada |
| Complejidad | Alta | Simple |
| Funcionamiento | ✅ Funcional | ✅ Funcional |
| Lazy Loading | ❌ No | ⚡ Opcional* |

*Puedes agregar lazy loading más adelante si lo necesitas, por ahora está optimizado para funcionar sin problemas.

## 🔗 Referencias

- [React Router Documentation](https://reactrouter.com/en/main)
- [React Best Practices](https://react.dev/learn)

---

**Estado**: ✅ Implementado y funcionando  
**Complejidad**: ⭐ Simple y directo  
**Mantenibilidad**: ⭐⭐⭐⭐⭐ Excelente


