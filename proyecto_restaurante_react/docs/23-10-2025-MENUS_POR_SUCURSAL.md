# Feature: Menús por Sucursal

**Fecha de implementación:** 23 de Octubre de 2025  
**Autor:** Sistema de Gestión de Restaurante  
**Versión:** 1.0.0

## 📋 Descripción

Se ha implementado un sistema completo de gestión de menús por sucursal. Ahora cada sucursal puede tener su propio menú personalizado, permitiendo a los administradores asignar productos específicos a sucursales específicas.

## 🎯 Características Principales

### 1. **Base de Datos**
- ✅ Nueva tabla intermedia `producto_sucursal` (relación muchos-a-muchos)
- ✅ Todos los productos actuales asignados automáticamente a la sucursal principal
- ✅ Vista SQL `vista_productos_sucursales` para facilitar consultas
- ✅ Procedimientos almacenados para gestión de asignaciones
- ✅ Soporte para transacciones ACID

### 2. **API Backend**
- ✅ `productos.php` actualizado con filtro por sucursales
- ✅ `productos-admin.php` con gestión de asignación de sucursales
- ✅ Soporte para operaciones en lote (crear/editar múltiples asignaciones)
- ✅ Validaciones de integridad referencial

### 3. **Interfaz de Usuario - MenuPage**
- ✅ Filtro visual de sucursales
- ✅ Selección múltiple de sucursales
- ✅ Botones "Todas" y "Limpiar" para facilitar la navegación
- ✅ Indicador de sucursal principal
- ✅ Por defecto muestra todas las sucursales

### 4. **Interfaz de Administración**
- ✅ ProductFormModal actualizado con selector de sucursales
- ✅ Al crear producto: todas las sucursales seleccionadas por defecto
- ✅ Al editar producto: muestra sucursales actuales
- ✅ Validación: al menos una sucursal debe estar seleccionada
- ✅ Interfaz intuitiva con badges visuales

## 📁 Estructura de Archivos Modificados

```
proyecto_restaurante_react/
├── database/
│   └── 10-Octubre/
│       └── 23-10-2025_02-branches.sql          # Script SQL con tabla intermedia
├── server/
│   └── api/
│       ├── productos.php                        # Actualizado con filtro
│       └── admin/
│           └── productos-admin.php              # Actualizado con asignaciones
├── src/
│   ├── pages/
│   │   └── MenuPage.tsx                         # Filtro de sucursales añadido
│   ├── components/
│   │   └── ProductFormModal.tsx                 # Selector de sucursales añadido
│   └── types.ts                                 # Nuevos campos en Producto
└── docs/
    └── 23-10-2025-MENUS_POR_SUCURSAL.md        # Esta documentación
```

## 🗄️ Modelo de Datos

### Tabla `producto_sucursal`

```sql
CREATE TABLE `producto_sucursal` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `producto_id` INT(11) NOT NULL,
  `sucursal_id` INT(11) NOT NULL,
  `disponible` BOOLEAN DEFAULT TRUE,
  `precio_especial` DECIMAL(10, 2) DEFAULT NULL,
  `fecha_asignacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_producto_sucursal` (`producto_id`, `sucursal_id`),
  CONSTRAINT `fk_producto_sucursal_producto` FOREIGN KEY (`producto_id`) 
    REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_producto_sucursal_sucursal` FOREIGN KEY (`sucursal_id`) 
    REFERENCES `branches` (`id`) ON DELETE CASCADE
);
```

### Vista `vista_productos_sucursales`

```sql
CREATE OR REPLACE VIEW `vista_productos_sucursales` AS
SELECT 
  p.id AS producto_id,
  p.nombre AS producto_nombre,
  b.id AS sucursal_id,
  b.nombre AS sucursal_nombre,
  ps.disponible AS disponible_en_sucursal,
  COALESCE(ps.precio_especial, p.precio) AS precio_final
FROM productos p
INNER JOIN producto_sucursal ps ON p.id = ps.producto_id
INNER JOIN branches b ON ps.sucursal_id = b.id
WHERE p.estado = 'activo' AND b.activo = TRUE;
```

### Tipos TypeScript Actualizados

```typescript
export interface Producto {
  // ... campos existentes
  sucursal_ids?: number[]       // IDs de sucursales asignadas
  sucursal_nombres?: string      // Nombres concatenados
}
```

## 🌐 API Endpoints

### Obtener productos filtrados por sucursales
```
GET /api/productos.php?sucursales=1,2,3
```

**Parámetros:**
- `sucursales`: IDs de sucursales separados por coma (opcional)

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Hamburguesa Especial",
      "precio": 15.99,
      "sucursal_ids": [1, 2, 3],
      "sucursal_nombres": "Centro, Las Mercedes, Altamira",
      ...
    }
  ],
  "filtro_aplicado": true,
  "total": 10
}
```

### Crear producto con sucursales (Admin)
```
POST /api/admin/productos-admin.php
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Pizza Margarita",
  "precio": 12.50,
  "categoria_id": 1,
  "sucursal_ids": [1, 2, 5],
  ...
}
```

### Actualizar producto y sus sucursales (Admin)
```
PUT /api/admin/productos-admin.php?id=1
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Pizza Margarita XL",
  "precio": 15.00,
  "sucursal_ids": [1, 2, 3, 4, 5],
  ...
}
```

## 🎨 Interfaz de Usuario

### MenuPage - Filtro de Sucursales

El filtro permite:
- ✅ Selección/deselección individual de sucursales
- ✅ Botón "Todas" para seleccionar todas
- ✅ Botón "Limpiar" para deseleccionar (mantiene al menos una)
- ✅ Badge especial para sucursal principal
- ✅ Contador de sucursales seleccionadas

```tsx
<div className="card mb-4 shadow-sm">
  <div className="card-header bg-transparent">
    <h6 className="mb-0">
      <i className="fas fa-store me-2"></i>
      Filtrar por Sucursal
    </h6>
  </div>
  <div className="card-body">
    {/* Botones de sucursales */}
  </div>
</div>
```

### ProductFormModal - Selector de Sucursales

El modal incluye:
- ✅ Sección dedicada para seleccionar sucursales
- ✅ Contador visual de sucursales seleccionadas
- ✅ Botón "Seleccionar Todas"
- ✅ Badges interactivos para cada sucursal
- ✅ Indicador de sucursal principal
- ✅ Validación requerida (al menos una)

## 🔧 Instalación y Configuración

### 1. Ejecutar Script SQL

```bash
# Conectarse a MySQL
mysql -u root -p

# Seleccionar base de datos
USE nombre_de_tu_base_de_datos;

# Ejecutar script
source database/10-Octubre/23-10-2025_02-branches.sql;
```

O usar phpMyAdmin:
1. Abrir phpMyAdmin
2. Seleccionar la base de datos
3. Ir a "Importar"
4. Seleccionar el archivo `23-10-2025_02-branches.sql`
5. Ejecutar

### 2. Verificar Instalación

Ejecutar en MySQL:
```sql
-- Ver productos por sucursal
SELECT 
  b.nombre AS sucursal,
  COUNT(ps.producto_id) AS total_productos
FROM branches b
LEFT JOIN producto_sucursal ps ON b.id = ps.sucursal_id
GROUP BY b.id, b.nombre;

-- Ver sucursales de un producto
SELECT 
  p.nombre AS producto,
  GROUP_CONCAT(b.nombre SEPARATOR ', ') AS sucursales
FROM productos p
LEFT JOIN producto_sucursal ps ON p.id = ps.producto_id
LEFT JOIN branches b ON ps.sucursal_id = b.id
WHERE p.id = 1
GROUP BY p.id;
```

### 3. Verificar en la Interfaz

1. Iniciar servidor: `npm run dev`
2. Navegar a: `http://localhost:5173/menu`
3. Verificar filtro de sucursales visible
4. Como admin: crear/editar producto y verificar selector de sucursales

## 📊 Características Técnicas

### Transacciones ACID

Todas las operaciones de creación/edición usan transacciones:

```php
$conn->begin_transaction();
try {
    // Crear/actualizar producto
    // Asignar a sucursales
    $conn->commit();
} catch (Exception $e) {
    $conn->rollback();
}
```

### Optimización de Consultas

- Uso de `INNER JOIN` para filtrado eficiente
- Índices en campos clave (`producto_id`, `sucursal_id`)
- Clave única compuesta para evitar duplicados
- `GROUP_CONCAT` para agrupar sucursales

### Validaciones

**Frontend:**
- Al menos una sucursal seleccionada
- Indicador visual del estado de selección

**Backend:**
- Validación de array de sucursales
- Verificación de existencia de producto/sucursal
- Integridad referencial con foreign keys

## 🚀 Flujo de Trabajo

### Para Usuarios Normales

1. Entrar a "Menú"
2. Ver filtro de sucursales en la parte superior
3. Seleccionar sucursales de interés
4. Ver productos disponibles en esas sucursales
5. Agregar al carrito normalmente

### Para Administradores

1. Entrar a "Menú" en modo admin
2. Click en "+" para crear nuevo producto
3. Llenar formulario del producto
4. Seleccionar sucursales donde estará disponible
5. Guardar

**Para editar:**
1. Click en "Editar" en un producto
2. Modificar información
3. Cambiar sucursales asignadas
4. Guardar cambios

## 📱 Estados Iniciales

### Al crear producto nuevo:
- ✅ Todas las sucursales seleccionadas por defecto
- Facilita disponibilidad amplia

### Al editar producto existente:
- ✅ Muestra sucursales actualmente asignadas
- Permite modificar la asignación

### Al filtrar en MenuPage:
- ✅ Todas las sucursales seleccionadas por defecto
- Muestra todo el menú disponible

## 🐛 Solución de Problemas

### Error: "Tabla producto_sucursal no existe"
**Solución:** Ejecutar el script SQL `23-10-2025_02-branches.sql`

### Los productos no se filtran correctamente
**Solución:** Verificar que los productos tengan asignaciones en `producto_sucursal`

### No aparece el selector de sucursales en el modal
**Solución:** Verificar que se pasó el prop `sucursales` al `ProductFormModal`

### Error al crear producto: "Debes seleccionar al menos una sucursal"
**Solución:** Asegurarse de seleccionar al menos una sucursal antes de guardar

## 📚 Referencias

- [React Hooks](https://react.dev/reference/react)
- [MySQL Transactions](https://dev.mysql.com/doc/refman/8.0/en/commit.html)
- [Foreign Keys](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)
- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## ✅ Checklist de Implementación

- [x] Crear tabla `producto_sucursal`
- [x] Crear vista `vista_productos_sucursales`
- [x] Crear procedimientos almacenados
- [x] Asignar productos existentes a sucursal principal
- [x] Actualizar API `productos.php` con filtro
- [x] Actualizar API `productos-admin.php` con asignaciones
- [x] Actualizar tipos TypeScript
- [x] Agregar filtro en `MenuPage.tsx`
- [x] Agregar selector en `ProductFormModal.tsx`
- [x] Implementar transacciones en backend
- [x] Validaciones frontend y backend
- [x] Documentación completa

## 📝 Notas Adicionales

- **Migración de Datos:** Todos los productos existentes se asignaron automáticamente a la sucursal principal al ejecutar el script SQL.
- **Extensibilidad:** La tabla `producto_sucursal` incluye campo `precio_especial` para futuras implementaciones de precios diferenciados por sucursal.
- **Cascada:** Al eliminar un producto o sucursal, las relaciones se eliminan automáticamente (`ON DELETE CASCADE`).
- **Performance:** Los índices garantizan consultas rápidas incluso con miles de productos y múltiples sucursales.

## 🔮 Mejoras Futuras Sugeridas

1. **Precios Diferenciados:**
   - Implementar el campo `precio_especial` en la interfaz
   - Permitir precios distintos por sucursal

2. **Gestión por Lotes:**
   - Asignar múltiples productos a múltiples sucursales simultáneamente
   - Importar/exportar asignaciones en CSV/Excel

3. **Analytics:**
   - Productos más vendidos por sucursal
   - Comparativa de menús entre sucursales
   - Reportes de disponibilidad

4. **Disponibilidad Dinámica:**
   - Toggle on/off de disponibilidad en tiempo real
   - Historial de cambios de disponibilidad
   - Notificaciones automáticas

---

**Última actualización:** 23 de Octubre de 2025  
**Estado:** ✅ Completado y Funcional

