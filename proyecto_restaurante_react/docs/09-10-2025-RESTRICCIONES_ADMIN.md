# Restricciones de Usuario Administrador

**Fecha:** 9 de Octubre, 2025  
**Autor:** Sistema de Gestión de Restaurante  
**Versión:** 1.0.0

## 📋 Descripción General

Este documento describe las restricciones implementadas para usuarios con rol de **Administrador** en el sistema del restaurante "Sabor & Tradición". Estas restricciones separan claramente las funcionalidades administrativas de las funcionalidades de cliente.

## 🎯 Objetivo

Prevenir que los usuarios administradores realicen pedidos a través del sistema, manteniendo su enfoque exclusivamente en tareas de gestión y administración del restaurante.

## ⚙️ Cambios Implementados

### 1. **Navbar.tsx**

Se ocultaron las siguientes opciones para usuarios admin:

- ✅ **Carrito de compras**: El icono del carrito no se muestra
- ✅ **Mis Órdenes**: Opción eliminada tanto del menú principal como del dropdown de usuario

```typescript
{/* Solo mostrar carrito si NO es admin */}
{usuario?.rol !== 'admin' && (
  <li className="nav-item">
    <Link className="nav-link position-relative" to="/carrito">
      <i className="fas fa-shopping-cart fa-lg"></i>
      {/* ... */}
    </Link>
  </li>
)}
```

**Fuente:** [React Router - Link Component](https://reactrouter.com/en/main/components/link)

---

### 2. **ProductCard.tsx**

Se añadió un prop opcional `mostrarBotonCompra` para controlar la visualización del botón "Agregar al Carrito":

```typescript
interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void | Promise<void>
  mostrarBotonCompra?: boolean  // Nuevo prop
}
```

- ✅ Cuando `mostrarBotonCompra = false`, se muestra un mensaje informativo: "Solo visualización"
- ✅ Cuando `mostrarBotonCompra = true` o no se especifica, funciona normalmente

**Fuentes:**
- [React - TypeScript](https://react.dev/learn/typescript)
- [React - Props](https://react.dev/learn/passing-props-to-a-component)

---

### 3. **MenuPage.tsx**

Se implementó detección del rol de usuario y se adaptó la UI:

```typescript
const { usuario } = useAuth()
const esAdmin = usuario?.rol === 'admin'

// En el render:
<ProductCard
  producto={producto}
  onAddToCart={handleAddToCart}
  mostrarBotonCompra={!esAdmin}
/>
```

- ✅ **Mensaje informativo** para administradores
- ✅ **Alerta visual** indicando "Modo solo lectura"
- ✅ Productos visibles pero sin opción de compra

**Fuente:** [React - useContext Hook](https://react.dev/reference/react/useContext)

---

### 4. **ProtectedRoute.tsx**

Se añadió soporte para `excludedRoles` que permite denegar acceso a ciertos roles:

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: RolUsuario
  excludedRoles?: RolUsuario[]  // Nuevo prop
}
```

**Funcionalidad:**
- ✅ Si el usuario tiene un rol en `excludedRoles`, se muestra mensaje de acceso restringido
- ✅ Mensaje personalizado para administradores con enlaces útiles
- ✅ Redirección sugerida al Dashboard o Inicio

**Ejemplo de uso:**
```typescript
<ProtectedRoute excludedRoles={['admin']}>
  <CartPage />
</ProtectedRoute>
```

**Fuente:** [React Router - Authentication](https://reactrouter.com/en/main/start/overview)

---

### 5. **routes.tsx**

Se actualizaron las rutas protegidas para excluir a administradores:

```typescript
{/* Rutas exclusivas para clientes (admin no puede acceder) */}
<Route 
  path="/carrito" 
  element={
    <ProtectedRoute excludedRoles={['admin']}>
      <CartPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/checkout" 
  element={
    <ProtectedRoute excludedRoles={['admin']}>
      <CheckoutPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/mis-ordenes" 
  element={
    <ProtectedRoute excludedRoles={['admin']}>
      <MisOrdenesPage />
    </ProtectedRoute>
  } 
/>
```

---

### 6. **types.ts**

Se actualizaron los tipos TypeScript:

```typescript
export interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void | Promise<void>
  mostrarBotonCompra?: boolean  // ✅ Añadido
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: RolUsuario
  excludedRoles?: RolUsuario[]  // ✅ Añadido
}
```

**Fuente:** [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

## 🔐 Rutas Restringidas para Admin

| Ruta | Acceso Admin | Razón |
|------|--------------|-------|
| `/` (Home) | ✅ Permitido | Información general |
| `/menu` | ✅ Permitido (solo lectura) | Ver catálogo de productos |
| `/dashboard` | ✅ Permitido | Funcionalidad principal del admin |
| `/perfil` | ✅ Permitido | Gestión de cuenta personal |
| `/configuracion` | ✅ Permitido | Ajustes de cuenta |
| `/carrito` | ❌ Bloqueado | Funcionalidad exclusiva de clientes |
| `/checkout` | ❌ Bloqueado | Funcionalidad exclusiva de clientes |
| `/mis-ordenes` | ❌ Bloqueado | Funcionalidad exclusiva de clientes |

---

## 🎨 Experiencia de Usuario (UX)

### Para Usuarios Admin:

1. **Navbar limpio**: Sin distracciones de carrito y pedidos
2. **Menú informativo**: Pueden ver productos pero claramente indicado como "solo visualización"
3. **Mensajes claros**: Si intentan acceder a rutas bloqueadas, reciben mensaje explicativo
4. **Navegación guiada**: Sugerencias de dónde pueden ir (Dashboard, Inicio)

### Mensajes de Error Personalizados:

```
⚠️ Acceso Restringido

Esta página no está disponible para usuarios con rol de admin.

ℹ️ Como administrador, puedes acceder al Dashboard para gestionar 
el restaurante. Si deseas realizar pedidos, crea una cuenta de 
cliente separada.

[Ir al Inicio]  [Ir al Dashboard]
```

---

## 🧪 Casos de Prueba

### Caso 1: Admin intenta acceder al carrito
- **Acción:** Usuario admin navega a `/carrito`
- **Resultado esperado:** Mensaje de acceso restringido con botones de navegación
- **Estado:** ✅ Implementado

### Caso 2: Admin ve el menú
- **Acción:** Usuario admin navega a `/menu`
- **Resultado esperado:** Ve productos con mensaje "Solo visualización"
- **Estado:** ✅ Implementado

### Caso 3: Admin ve navbar
- **Acción:** Usuario admin visualiza la barra de navegación
- **Resultado esperado:** No ve icono de carrito ni "Mis Órdenes"
- **Estado:** ✅ Implementado

### Caso 4: Cliente normal accede a todas las funcionalidades
- **Acción:** Usuario con rol "cliente" navega por la app
- **Resultado esperado:** Acceso completo a todas las funciones de compra
- **Estado:** ✅ Implementado

---

## 📚 Buenas Prácticas Aplicadas

1. ✅ **Separación de Responsabilidades**: Los componentes tienen responsabilidades claras
2. ✅ **TypeScript Estricto**: Todos los tipos están definidos y validados
3. ✅ **Validación en Múltiples Capas**:
   - UI (ocultando elementos)
   - Rutas (bloqueando acceso)
   - Componentes (validando permisos)
4. ✅ **Mensajes de Usuario Claros**: Comunicación efectiva sobre restricciones
5. ✅ **Props Opcionales con Defaults**: `mostrarBotonCompra = true` por defecto
6. ✅ **Documentación JSDoc**: Todos los componentes documentados
7. ✅ **Accesibilidad**: Uso de iconos y alertas Bootstrap con roles ARIA

**Fuentes:**
- [React - Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript - Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## 🔄 Flujo de Usuario Admin

```
┌─────────────────┐
│  Login (Admin)  │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │  Home   │ ◄───────┐
    └────┬────┘         │
         │              │
    ┌────▼─────────────┐│
    │   Dashboard      ││
    │  (Principal)     ││
    └────┬─────────────┘│
         │              │
    ┌────▼────┐         │
    │  Menú   │         │
    │(Lectura)│         │
    └────┬────┘         │
         │              │
    ┌────▼────────┐     │
    │   Perfil    │     │
    └────┬────────┘     │
         │              │
    ┌────▼─────────┐    │
    │Configuración │    │
    └──────────────┘    │
         │              │
         └──────────────┘
```

---

## 🔄 Flujo de Usuario Cliente

```
┌──────────────────┐
│ Login (Cliente)  │
└────────┬─────────┘
         │
         ▼
    ┌─────────┐
    │  Home   │ ◄────────┐
    └────┬────┘          │
         │               │
    ┌────▼────┐          │
    │  Menú   │          │
    │(Comprar)│          │
    └────┬────┘          │
         │               │
    ┌────▼─────────┐     │
    │   Carrito    │     │
    └────┬─────────┘     │
         │               │
    ┌────▼─────────┐     │
    │  Checkout    │     │
    └────┬─────────┘     │
         │               │
    ┌────▼────────┐      │
    │ Mis Órdenes │      │
    └────┬────────┘      │
         │               │
    ┌────▼─────────┐     │
    │   Perfil     │     │
    └──────────────┘     │
         │               │
         └───────────────┘
```

---

## 🚀 Próximos Pasos Sugeridos

1. **Testing Automatizado**: Crear tests unitarios para validar restricciones
2. **Logs de Auditoría**: Registrar intentos de acceso a rutas bloqueadas
3. **Rol Intermedio**: Considerar rol "empleado" con permisos específicos
4. **Panel de Permisos**: Interfaz para gestionar roles y permisos dinámicamente

---

## 📝 Notas Técnicas

- **Compatibilidad**: React 18+, TypeScript 5+, React Router 6+
- **Sin Breaking Changes**: Los usuarios existentes no se ven afectados
- **Retrocompatibilidad**: Props opcionales mantienen compatibilidad
- **Performance**: Sin impacto en rendimiento (validaciones en memoria)

---

## 👥 Roles del Sistema

| Rol | Descripción | Permisos de Compra |
|-----|-------------|-------------------|
| **admin** | Administrador del sistema | ❌ No puede comprar |
| **empleado** | Empleado del restaurante | ✅ Puede comprar |
| **cliente** | Cliente normal | ✅ Puede comprar |

---

## 📞 Soporte

Si tienes preguntas sobre estas restricciones o necesitas modificar permisos, contacta al equipo de desarrollo.

---

**Última actualización:** 9 de Octubre, 2025  
**Estado:** ✅ Implementado y probado  
**Versión de React:** 18.x  
**Versión de TypeScript:** 5.x  
**Versión de React Router:** 6.x

