# Sistema de Gestión de Menú para Administradores

**Fecha:** 9 de Octubre, 2025  
**Autor:** Sistema de Gestión de Restaurante  
**Versión:** 2.0.0

## 📋 Descripción General

Este documento describe el sistema completo de gestión de productos del menú implementado para usuarios administradores. Permite crear, editar y eliminar productos directamente desde la interfaz web con sincronización completa con la base de datos.

## 🎯 Objetivos Cumplidos

- ✅ **CRUD Completo** - Create, Read, Update, Delete de productos
- ✅ **Interfaz Intuitiva** - Modal de formulario profesional
- ✅ **Validaciones** - Frontend y Backend
- ✅ **Seguridad** - Solo accesible para administradores
- ✅ **UX Optimizada** - Feedback visual inmediato
- ✅ **Base de Datos** - Integración completa con MySQL

---

## 🏗️ Arquitectura del Sistema

### Capas de la Aplicación

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      MenuPage.tsx           │   │
│  │  (Página principal)         │   │
│  └─────────┬───────────────────┘   │
│            │                        │
│  ┌─────────▼───────────────────┐   │
│  │   ProductFormModal.tsx      │   │
│  │  (Formulario CRUD)          │   │
│  └─────────┬───────────────────┘   │
│            │                        │
│  ┌─────────▼───────────────────┐   │
│  │     ProductCard.tsx         │   │
│  │  (Tarjeta de producto)      │   │
│  └─────────────────────────────┘   │
└─────────────┬───────────────────────┘
              │ HTTP Requests
              │ (Fetch API)
┌─────────────▼───────────────────────┐
│         BACKEND (PHP)               │
│                                     │
│  /api/admin/productos-admin.php     │
│  - POST   → Crear producto          │
│  - PUT    → Actualizar producto     │
│  - DELETE → Eliminar producto       │
│                                     │
└─────────────┬───────────────────────┘
              │ SQL Queries
┌─────────────▼───────────────────────┐
│       BASE DE DATOS (MySQL)         │
│                                     │
│  Tabla: productos                   │
│  Tabla: categorias                  │
└─────────────────────────────────────┘
```

---

## 📁 Archivos Creados/Modificados

### 1. **Backend - PHP**

#### `server/api/admin/productos-admin.php` (NUEVO)

**Descripción:** Endpoint principal para operaciones CRUD de productos

**Funcionalidades:**
- ✅ Autenticación mediante token JWT
- ✅ Validación de rol de administrador
- ✅ Creación de productos con validaciones
- ✅ Actualización de productos existentes
- ✅ Eliminación lógica (soft delete) cambiando estado a 'inactivo'
- ✅ Manejo de errores robusto
- ✅ Respuestas JSON estandarizadas

**Validaciones Implementadas:**
```php
- Nombre no vacío
- Precio mayor a 0
- Categoría válida y existente
- Datos de entrada sanitizados
- Token de autenticación válido
- Rol de administrador verificado
```

**Métodos HTTP:**
```
POST   /api/admin/productos-admin.php         → Crear producto
PUT    /api/admin/productos-admin.php?id=1    → Actualizar producto #1
DELETE /api/admin/productos-admin.php?id=1    → Eliminar producto #1
```

**Fuente:** [PHP Manual - PDO](https://www.php.net/manual/en/book.pdo.php)

---

### 2. **Frontend - Componentes React**

#### `src/components/ProductFormModal.tsx` (NUEVO)

**Descripción:** Modal completo para crear y editar productos

**Características:**
- ✅ Formulario responsivo con Bootstrap 5
- ✅ Validación en tiempo real
- ✅ Soporte para todos los campos del producto
- ✅ Modo crear y modo editar
- ✅ Feedback visual de errores
- ✅ Loading states durante peticiones
- ✅ Backdrop para cerrar modal

**Campos del Formulario:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | text | ✅ | Nombre del producto |
| precio | number | ✅ | Precio (> 0) |
| categoria_id | select | ✅ | Categoría del producto |
| descripcion | textarea | ❌ | Descripción detallada |
| imagen | url | ❌ | URL de imagen |
| estado | select | ❌ | activo/inactivo/agotado |
| tiempo_preparacion | number | ❌ | Minutos de preparación |
| ingredientes | textarea | ❌ | Lista de ingredientes |
| es_especial | checkbox | ❌ | Marca como especial |

**Fuentes:**
- [React - Forms](https://react.dev/reference/react-dom/components/form)
- [Bootstrap - Modal](https://getbootstrap.com/docs/5.3/components/modal/)

---

#### `src/components/ProductCard.tsx` (MODIFICADO)

**Nuevas Props:**
```typescript
interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void | Promise<void>
  mostrarBotonCompra?: boolean
  // ⬇️ NUEVAS PROPS ⬇️
  onEdit?: (producto: Producto) => void
  onDelete?: (productoId: number) => Promise<void>
  modoAdmin?: boolean
}
```

**Nuevas Características:**
- ✅ **Botones de Admin** - Editar y Eliminar sobre la imagen
- ✅ **Badges de Estado** - Visual cuando no está activo
- ✅ **Badge Especial** - Marca productos especiales
- ✅ **Confirmación de Eliminación** - Dialog nativo antes de eliminar
- ✅ **Loading State** - Spinner durante eliminación
- ✅ **Feedback Visual** - Opacidad reducida durante eliminación

**Fuente:** [React - Conditional Rendering](https://react.dev/learn/conditional-rendering)

---

#### `src/pages/MenuPage.tsx` (MODIFICADO)

**Nuevas Funcionalidades:**

1. **Botón Flotante "+"** (Solo Admin)
   ```tsx
   <button
     className="btn btn-danger btn-lg rounded-circle position-fixed"
     style={{ bottom: '30px', right: '30px' }}
     onClick={handleCrearProducto}
   >
     <i className="fas fa-plus fa-lg"></i>
   </button>
   ```

2. **Gestión de Estados:**
   ```typescript
   const [showModal, setShowModal] = useState(false)
   const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
   const [successMessage, setSuccessMessage] = useState<string | null>(null)
   ```

3. **Funciones CRUD:**
   - `handleCrearProducto()` - Abre modal vacío
   - `handleEditarProducto(producto)` - Abre modal con datos
   - `handleGuardarProducto(data)` - POST o PUT según el caso
   - `handleEliminarProducto(id)` - DELETE con confirmación

4. **Integración con API:**
   ```typescript
   // Crear
   fetch(API_ENDPOINTS.adminCrearProducto, {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${token}` },
     body: JSON.stringify(productoData)
   })

   // Actualizar
   fetch(API_ENDPOINTS.adminActualizarProducto(id), {
     method: 'PUT',
     headers: { 'Authorization': `Bearer ${token}` },
     body: JSON.stringify(productoData)
   })

   // Eliminar
   fetch(API_ENDPOINTS.adminEliminarProducto(id), {
     method: 'DELETE',
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

**Fuentes:**
- [React - useState Hook](https://react.dev/reference/react/useState)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

### 3. **Configuración y Tipos**

#### `src/config.ts` (MODIFICADO)

**Nuevos Endpoints:**
```typescript
export const API_ENDPOINTS = {
  // ... endpoints existentes ...
  
  // Admin Productos
  adminCrearProducto: `${API_BASE_URL}/admin/productos-admin.php`,
  adminActualizarProducto: (id: number) => 
    `${API_BASE_URL}/admin/productos-admin.php?id=${id}`,
  adminEliminarProducto: (id: number) => 
    `${API_BASE_URL}/admin/productos-admin.php?id=${id}`,
} as const
```

**Fuente:** [TypeScript - Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

---

#### `src/types.ts` (MODIFICADO)

**Tipos Actualizados:**
```typescript
export interface ProductCardProps {
  producto: Producto
  onAddToCart: (producto: Producto) => void | Promise<void>
  mostrarBotonCompra?: boolean
  onEdit?: (producto: Producto) => void          // NUEVO
  onDelete?: (productoId: number) => Promise<void> // NUEVO
  modoAdmin?: boolean                            // NUEVO
}
```

**Fuente:** [TypeScript - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

## 🔐 Seguridad Implementada

### Backend (PHP)

1. **Autenticación por Token:**
   ```php
   $usuario = verificarAutenticacion();
   if (!$usuario) {
       http_response_code(401);
       exit();
   }
   ```

2. **Validación de Rol:**
   ```php
   if ($usuario['rol'] !== 'admin') {
       http_response_code(403);
       echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
       exit();
   }
   ```

3. **Prepared Statements:**
   ```php
   $stmt = $conn->prepare("INSERT INTO productos (nombre, precio, ...) VALUES (?, ?, ...)");
   $stmt->bind_param("ssd...", $nombre, $descripcion, $precio);
   ```

4. **Validación de Entrada:**
   ```php
   if (empty($input['nombre']) || $input['precio'] <= 0) {
       http_response_code(400);
       return ['success' => false, 'message' => 'Datos inválidos'];
   }
   ```

### Frontend (React/TypeScript)

1. **Validación de Formularios:**
   ```typescript
   if (!formData.nombre.trim()) {
     setError('El nombre es obligatorio')
     return
   }
   ```

2. **Confirmación de Acciones Destructivas:**
   ```typescript
   if (window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
     await onDelete(producto.id)
   }
   ```

3. **TypeScript Strict Mode:**
   - Tipos definidos para todas las interfaces
   - Validación en tiempo de compilación
   - Prevención de errores de tipo

---

## 💡 Flujo de Usuario - Admin

### 📝 Crear Producto

```
1. Admin hace clic en botón flotante "+"
2. Se abre modal vacío con formulario
3. Admin completa campos obligatorios:
   - Nombre
   - Precio  
   - Categoría
4. Admin hace clic en "Crear Producto"
5. Sistema valida datos
6. Si válido → POST a /api/admin/productos-admin.php
7. Backend valida token y rol
8. Backend inserta en base de datos
9. Frontend recarga productos
10. Muestra mensaje de éxito
11. Modal se cierra automáticamente
```

### ✏️ Editar Producto

```
1. Admin hace clic en botón de editar (icono lápiz)
2. Se abre modal prellenado con datos del producto
3. Admin modifica campos deseados
4. Admin hace clic en "Actualizar Producto"
5. Sistema valida datos
6. Si válido → PUT a /api/admin/productos-admin.php?id=X
7. Backend valida token y rol
8. Backend actualiza en base de datos
9. Frontend recarga productos
10. Muestra mensaje de éxito
11. Modal se cierra automáticamente
```

### 🗑️ Eliminar Producto

```
1. Admin hace clic en botón de eliminar (icono basura)
2. Sistema muestra confirmación:
   "¿Estás seguro de eliminar '[Nombre Producto]'?"
3. Si Admin confirma:
   4. Producto muestra spinner de carga
   5. DELETE a /api/admin/productos-admin.php?id=X
   6. Backend cambia estado a 'inactivo' (soft delete)
   7. Frontend recarga productos
   8. Muestra mensaje de éxito
   9. Producto desaparece de la vista
```

---

## 🎨 Diseño UI/UX

### Elementos Visuales

#### Botón Flotante
```css
position: fixed
bottom: 30px
right: 30px
width: 60px
height: 60px
z-index: 1000
border-radius: 50%
background: #dc3545 (Bootstrap danger)
```

#### Botones sobre Producto
- **Editar**: Icono lápiz azul sobre fondo blanco
- **Eliminar**: Icono basura rojo sobre fondo blanco
- Posicionados en esquina superior derecha de la imagen

#### Modal
- **Tamaño**: Large (modal-lg)
- **Scroll**: modal-dialog-scrollable
- **Header**: Fondo rojo con texto blanco
- **Campos**: Iconos descriptivos de FontAwesome
- **Botones**: Cancelar (gris) y Guardar (rojo)

#### Mensajes de Feedback
- **Éxito**: Alert verde con icono de check
- **Error**: Alert rojo con icono de exclamación
- **Info**: Alert azul con icono de información
- Auto-desaparición después de 5 segundos

---

## 📊 Estructura de Datos

### Tabla `productos` (MySQL)

```sql
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria_id INT,
  imagen VARCHAR(255),
  estado ENUM('activo','inactivo','agotado') DEFAULT 'activo',
  tiempo_preparacion INT DEFAULT 15,
  ingredientes TEXT,
  es_especial BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Interfaz TypeScript

```typescript
export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio: string | number
  categoria_id: number
  categoria_nombre?: string
  imagen?: string
  estado: 'activo' | 'inactivo' | 'agotado'
  tiempo_preparacion?: number
  ingredientes?: string
  es_especial?: boolean
  fecha_creacion?: string
}
```

---

## 🧪 Validaciones Implementadas

### Frontend (TypeScript)

```typescript
// Nombre obligatorio
if (!formData.nombre.trim()) {
  setError('El nombre es obligatorio')
  return
}

// Precio válido
if (!formData.precio || parseFloat(formData.precio) <= 0) {
  setError('El precio debe ser mayor a 0')
  return
}

// Categoría seleccionada
if (!formData.categoria_id) {
  setError('Debes seleccionar una categoría')
  return
}
```

### Backend (PHP)

```php
// Campos obligatorios
if (empty($input['nombre']) || empty($input['precio']) || empty($input['categoria_id'])) {
    http_response_code(400);
    return ['success' => false, 'message' => 'Campos obligatorios faltantes'];
}

// Precio positivo
if ($input['precio'] <= 0) {
    http_response_code(400);
    return ['success' => false, 'message' => 'El precio debe ser mayor a 0'];
}

// Producto existe (para actualizar/eliminar)
$stmtCheck = $conn->prepare("SELECT id FROM productos WHERE id = ?");
$stmtCheck->bind_param("i", $id);
$stmtCheck->execute();
if ($stmtCheck->get_result()->num_rows === 0) {
    http_response_code(404);
    return ['success' => false, 'message' => 'Producto no encontrado'];
}
```

---

## 📈 Beneficios del Sistema

### Para el Administrador

1. ✅ **Gestión en Tiempo Real** - Cambios reflejados inmediatamente
2. ✅ **No requiere acceso a BD** - Todo desde la interfaz web
3. ✅ **Interfaz Intuitiva** - Fácil de usar sin capacitación
4. ✅ **Feedback Inmediato** - Mensajes claros de éxito/error
5. ✅ **Control Total** - Crear, editar, eliminar productos

### Para el Negocio

1. ✅ **Menú Actualizado** - Siempre refleja inventario real
2. ✅ **Reducción de Errores** - Validaciones previenen datos incorrectos
3. ✅ **Auditoría** - Soft delete mantiene histórico
4. ✅ **Escalable** - Fácil agregar más campos o funcionalidades
5. ✅ **Seguro** - Solo admins pueden modificar

### Técnicas

1. ✅ **Código Limpio** - Siguiendo buenas prácticas
2. ✅ **TypeScript** - Prevención de errores en tiempo de desarrollo
3. ✅ **Componentización** - Componentes reutilizables
4. ✅ **Separación de Responsabilidades** - Frontend/Backend desacoplados
5. ✅ **Documentado** - Código auto-explicativo con comentarios

---

## 🔄 Ciclo de Vida de Datos

```
┌─────────────────────────────────────────────┐
│          CREAR PRODUCTO                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Frontend: ProductFormModal.tsx              │
│  - Usuario completa formulario               │
│  - Validaciones cliente                      │
│  - Preparar JSON                             │
└──────────────┬───────────────────────────────┘
               │ POST /api/admin/productos-admin.php
               ▼
┌──────────────────────────────────────────────┐
│  Backend: productos-admin.php                │
│  - Verificar token                           │
│  - Validar rol admin                         │
│  - Validar datos                             │
│  - Sanitizar entrada                         │
└──────────────┬───────────────────────────────┘
               │ SQL INSERT
               ▼
┌──────────────────────────────────────────────┐
│  Base de Datos: MySQL                        │
│  INSERT INTO productos (...)                 │
│  VALUES (...)                                │
└──────────────┬───────────────────────────────┘
               │ Return ID + Datos
               ▼
┌──────────────────────────────────────────────┐
│  Backend: productos-admin.php                │
│  - Obtener producto con JOIN a categorías    │
│  - Formatear respuesta JSON                  │
└──────────────┬───────────────────────────────┘
               │ Response { success: true, data: {...} }
               ▼
┌──────────────────────────────────────────────┐
│  Frontend: MenuPage.tsx                      │
│  - Recargar lista de productos               │
│  - Mostrar mensaje de éxito                  │
│  - Cerrar modal                              │
└──────────────────────────────────────────────┘
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Upload de Imágenes**
   - Permitir subir imágenes locales
   - Almacenar en servidor
   - Thumbnail automático

2. **Gestión de Categorías**
   - CRUD de categorías desde la interfaz
   - Reordenar categorías

3. **Búsqueda y Filtros Avanzados**
   - Búsqueda por nombre
   - Filtro por estado
   - Filtro por precio

4. **Historial de Cambios**
   - Tabla de auditoría
   - Ver quién modificó qué y cuándo

5. **Importación Masiva**
   - CSV import
   - Excel import

6. **Estadísticas de Productos**
   - Productos más vendidos
   - Productos sin ventas
   - Margen de ganancia

---

## 📚 Referencias y Fuentes Oficiales

### Frontend
- ✅ [React Documentation](https://react.dev/)
- ✅ [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- ✅ [React Router](https://reactrouter.com/)
- ✅ [Vite Guide](https://vitejs.dev/guide/)
- ✅ [Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- ✅ [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Backend
- ✅ [PHP Manual](https://www.php.net/manual/en/)
- ✅ [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- ✅ [MySQL Documentation](https://dev.mysql.com/doc/)

### Seguridad
- ✅ [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- ✅ [PHP Security Best Practices](https://www.php.net/manual/en/security.php)

---

## 📝 Conclusión

El sistema de gestión de menú para administradores ha sido implementado exitosamente siguiendo las mejores prácticas de desarrollo web moderno. Proporciona una interfaz intuitiva y segura para gestionar el catálogo de productos del restaurante, con validaciones robustas tanto en frontend como en backend, y completa integración con la base de datos MySQL.

**Estado:** ✅ **Completado y funcional**  
**Versión:** 2.0.0  
**Fecha de finalización:** 9 de Octubre, 2025

---

**Desarrollado con:** React + TypeScript + Vite + PHP + MySQL  
**Patrón de Arquitectura:** MVC con separación frontend/backend  
**Estilo de Código:** Clean Code + SOLID Principles

