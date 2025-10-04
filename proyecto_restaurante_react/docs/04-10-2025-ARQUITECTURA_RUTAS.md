# 🛣️ Estructura y Manejo de Rutas

## 📚 Índice

1. [Introducción](#introducción)
2. [Arquitectura de Rutas](#arquitectura-de-rutas)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Configuración de Rutas](#configuración-de-rutas)
5. [Tipos de Rutas](#tipos-de-rutas)
6. [Lazy Loading](#lazy-loading)
7. [Protección de Rutas](#protección-de-rutas)
8. [Cómo Agregar Nuevas Rutas](#cómo-agregar-nuevas-rutas)
9. [Funciones Auxiliares](#funciones-auxiliares)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Referencias Oficiales](#referencias-oficiales)

---

## 📖 Introducción

Este proyecto utiliza una **arquitectura centralizada de rutas** que sigue las mejores prácticas de **React Router v7** y **TypeScript**. Todas las rutas están definidas en un único archivo de configuración, lo que facilita el mantenimiento, la escalabilidad y el testing.

### Ventajas de esta Arquitectura

✅ **Centralización**: Todas las rutas en un solo lugar  
✅ **Mantenibilidad**: Fácil de encontrar y modificar rutas  
✅ **Escalabilidad**: Simple agregar nuevas rutas sin tocar el código principal  
✅ **Type-Safe**: Totalmente tipado con TypeScript  
✅ **Performance**: Lazy loading automático de componentes  
✅ **Testeable**: Rutas fáciles de testear de forma aislada  
✅ **Documentación**: Metadatos para cada ruta (título, descripción, permisos)

---

## 🏗️ Arquitectura de Rutas

```
┌─────────────────────────────────────────────────────────┐
│                      main.tsx                           │
│              (Punto de entrada React)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      App.tsx                            │
│  ┌──────────────────────────────────────────────┐      │
│  │  Router (BrowserRouter)                      │      │
│  │    ├── AuthProvider (Contexto Auth)          │      │
│  │    ├── CartProvider (Contexto Carrito)       │      │
│  │    ├── Navbar (Navegación)                   │      │
│  │    └── AppRoutes ──────────────────┐         │      │
│  └────────────────────────────────────┼─────────┘      │
└────────────────────────────────────────┼────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────┐
│              src/routes/index.tsx                       │
│         (Configuración Centralizada)                    │
│                                                         │
│  ├── 🌐 publicRoutes[]      (Rutas públicas)          │
│  ├── 🔒 protectedRoutes[]   (Requieren auth)          │
│  ├── 👑 adminRoutes[]       (Requieren admin)         │
│  └── 🚫 specialRoutes[]     (404, redirects)          │
│                                                         │
│  export const routes = [                               │
│    ...publicRoutes,                                    │
│    ...protectedRoutes,                                 │
│    ...adminRoutes,                                     │
│    ...specialRoutes                                    │
│  ]                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
proyecto_restaurante_react/
├── src/
│   ├── App.tsx                    # Componente principal (usa useRoutes)
│   ├── main.tsx                   # Punto de entrada
│   │
│   ├── routes/
│   │   └── index.tsx              # ⭐ CONFIGURACIÓN CENTRALIZADA DE RUTAS
│   │
│   ├── components/
│   │   ├── ProtectedRoute.tsx     # HOC para proteger rutas
│   │   ├── LoadingSpinner.tsx     # Spinner para lazy loading
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── PerfilPage.tsx
│   │   ├── CartPage.tsx
│   │   └── ...
│   │
│   └── contexts/
│       ├── AuthContext.tsx
│       └── CartContext.tsx
│
└── docs/
    └── ESTRUCTURA_RUTAS.md        # Este archivo
```

---

## ⚙️ Configuración de Rutas

### Archivo Principal: `src/routes/index.tsx`

Este archivo contiene:

1. **Importaciones de componentes** (con lazy loading)
2. **Definición de tipos** personalizados
3. **Arrays de rutas** organizados por categoría
4. **Funciones auxiliares** para consultar rutas
5. **Exportación principal** de la configuración

### Estructura de una Ruta

```typescript
{
  path: '/ruta',                    // Path de la URL
  element: <Componente />,          // Componente a renderizar
  meta: {                           // Metadatos opcionales
    title: 'Título',
    requiresAuth: true,
    requiredRole: 'admin',
    description: 'Descripción'
  }
}
```

---

## 🗂️ Tipos de Rutas

### 1. 🌐 Rutas Públicas (`publicRoutes`)

Accesibles sin autenticación:

```typescript
export const publicRoutes: AppRouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/menu', element: <MenuPage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];
```

### 2. 🔒 Rutas Protegidas (`protectedRoutes`)

Requieren autenticación:

```typescript
export const protectedRoutes: AppRouteObject[] = [
  {
    path: '/perfil',
    element: (
      <ProtectedRoute>
        <PerfilPage />
      </ProtectedRoute>
    ),
  },
  // ... más rutas protegidas
];
```

### 3. 👑 Rutas de Administración (`adminRoutes`)

Requieren autenticación + rol de admin:

```typescript
export const adminRoutes: AppRouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
];
```

### 4. 🚫 Rutas Especiales (`specialRoutes`)

Manejo de errores y redirecciones:

```typescript
export const specialRoutes: AppRouteObject[] = [
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
```

---

## 🚀 Lazy Loading

El proyecto implementa **lazy loading** para mejorar el rendimiento inicial:

### ¿Qué es Lazy Loading?

Es una técnica que permite cargar componentes solo cuando se necesitan, en lugar de cargar todo al inicio. Esto reduce el tamaño del bundle inicial y mejora el tiempo de carga.

### Implementación

```typescript
// ❌ Importación normal (carga todo al inicio)
import HomePage from '../pages/HomePage';

// ✅ Importación lazy (carga bajo demanda)
const HomePage = lazy(() => import('../pages/HomePage'));

// En las rutas, se usa directamente
{
  path: '/',
  element: <HomePage />
}

// Suspense se agrega en App.tsx envolviendo todas las rutas
<Suspense fallback={<LoadingSpinner />}>
  <AppRoutes />
</Suspense>
```

### Referencias

- [React.lazy() - Documentación Oficial](https://react.dev/reference/react/lazy)
- [Code Splitting - React Docs](https://react.dev/learn/code-splitting)

---

## 🔐 Protección de Rutas

### Componente `ProtectedRoute`

Ubicado en `src/components/ProtectedRoute.tsx`, este componente verifica:

1. ✅ Si el usuario está autenticado
2. ✅ Si tiene el rol requerido (opcional)
3. ❌ Redirige a `/login` si no cumple los requisitos

### Uso

```typescript
// Ruta que requiere autenticación
<ProtectedRoute>
  <PerfilPage />
</ProtectedRoute>

// Ruta que requiere ser admin
<ProtectedRoute requiredRole="admin">
  <DashboardPage />
</ProtectedRoute>
```

### Fuente Oficial

- [Protected Routes - React Router](https://reactrouter.com/en/main/start/overview#protected-routes)

---

## ➕ Cómo Agregar Nuevas Rutas

### Ejemplo 1: Agregar una Ruta Pública

```typescript
// 1. En src/routes/index.tsx, importar el componente con lazy
const ContactPage = lazy(() => import('../pages/ContactPage'));

// 2. Agregar al array publicRoutes
export const publicRoutes: AppRouteObject[] = [
  // ... rutas existentes
  {
    path: '/contacto',
    element: <ContactPage />,
    meta: {
      title: 'Contacto',
      description: 'Página de contacto',
    },
  },
];
```

### Ejemplo 2: Agregar una Ruta Protegida

```typescript
// 1. Importar el componente con lazy
const ReservasPage = lazy(() => import('../pages/ReservasPage'));

// 2. Agregar al array protectedRoutes
export const protectedRoutes: AppRouteObject[] = [
  // ... rutas existentes
  {
    path: '/reservas',
    element: (
      <ProtectedRoute>
        <ReservasPage />
      </ProtectedRoute>
    ),
    meta: {
      title: 'Mis Reservas',
      requiresAuth: true,
      description: 'Gestión de reservas',
    },
  },
];
```

### Ejemplo 3: Agregar Rutas Anidadas

```typescript
export const adminRoutes: AppRouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'usuarios',
        element: <UsuariosPage />,
      },
      {
        path: 'productos',
        element: <ProductosPage />,
      },
    ],
  },
];
```

**Fuente:** [Nested Routes - React Router](https://reactrouter.com/en/main/start/tutorial#nested-routes)

---

## 🛠️ Funciones Auxiliares

El archivo `src/routes/index.tsx` exporta funciones útiles:

### `getRouteByPath(path: string)`

Obtiene una ruta específica por su path:

```typescript
const route = getRouteByPath('/perfil');
console.log(route?.meta?.title); // "Mi Perfil"
```

### `getPublicRoutes()`

Obtiene todas las rutas públicas:

```typescript
const publicRoutes = getPublicRoutes();
console.log(publicRoutes.length); // 4
```

### `getProtectedRoutes()`

Obtiene todas las rutas que requieren autenticación:

```typescript
const protectedRoutes = getProtectedRoutes();
```

### `getAdminRoutes()`

Obtiene todas las rutas de administración:

```typescript
const adminRoutes = getAdminRoutes();
```

---

## ✨ Mejores Prácticas

### 1. ✅ Usar Lazy Loading

```typescript
// ✅ Correcto
const HomePage = lazy(() => import('../pages/HomePage'));

// ❌ Evitar carga síncrona de páginas grandes
import HomePage from '../pages/HomePage';
```

### 2. ✅ Definir Metadatos

```typescript
// ✅ Correcto - Incluir metadatos útiles
{
  path: '/perfil',
  element: <PerfilPage />,
  meta: {
    title: 'Mi Perfil',
    requiresAuth: true,
    description: 'Gestión del perfil de usuario'
  }
}
```

### 3. ✅ Organizar por Categorías

Mantén las rutas organizadas en arrays separados según su tipo:
- `publicRoutes`
- `protectedRoutes`
- `adminRoutes`
- `specialRoutes`

### 4. ✅ Usar TypeScript

```typescript
// ✅ Correcto - Tipado fuerte
export interface AppRouteObject extends RouteObject {
  meta?: RouteMetadata;
  children?: AppRouteObject[];
}
```

### 5. ✅ Manejar 404 Correctamente

```typescript
// Siempre incluir ruta catch-all al final
{ path: '*', element: <Navigate to="/404" replace /> }
```

### 6. ✅ Comentar Rutas Complejas

```typescript
/**
 * Ruta de checkout
 * Requiere: Autenticación + Carrito con items
 */
{
  path: '/checkout',
  element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
}
```

---

## 📚 Referencias Oficiales

### React Router v7

- [Documentación Oficial](https://reactrouter.com/en/main)
- [useRoutes Hook](https://reactrouter.com/en/main/hooks/use-routes)
- [Route Objects](https://reactrouter.com/en/main/route/route)
- [Protected Routes](https://reactrouter.com/en/main/start/overview#protected-routes)
- [Lazy Loading](https://reactrouter.com/en/main/route/lazy)

### React

- [React.lazy()](https://react.dev/reference/react/lazy)
- [Suspense](https://react.dev/reference/react/Suspense)
- [Code Splitting](https://react.dev/learn/code-splitting)

### TypeScript

- [React TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/react.html)
- [TypeScript with React](https://react.dev/learn/typescript)

### Vite

- [Documentación de Vite](https://vitejs.dev/guide/)
- [Vite + React](https://vitejs.dev/guide/#trying-vite-online)

---

## 🎯 Resumen

Este proyecto utiliza una **arquitectura moderna y escalable** para el manejo de rutas:

1. ✅ **Centralización**: Todas las rutas en `src/routes/index.tsx`
2. ✅ **Lazy Loading**: Carga bajo demanda para mejor performance
3. ✅ **Type-Safe**: Totalmente tipado con TypeScript
4. ✅ **Organizadas**: Separadas por categorías (públicas, protegidas, admin)
5. ✅ **Protegidas**: Sistema de autenticación y roles
6. ✅ **Escalable**: Fácil agregar nuevas rutas sin tocar código existente
7. ✅ **Documentada**: Metadatos y comentarios en cada ruta
8. ✅ **Mantenible**: Siguiendo mejores prácticas oficiales

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas sobre cómo agregar o modificar rutas, consulta:

1. Este documento
2. La documentación oficial de React Router
3. Los comentarios en `src/routes/index.tsx`

---

**Última actualización:** Octubre 4, 2025  
**Versión del proyecto:** 2.0.0  
**React Router:** v7.9.3

