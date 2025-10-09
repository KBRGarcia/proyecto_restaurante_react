# API Admin - Dashboard

API REST para el panel administrativo del sistema de restaurante.

## 🔐 Autenticación

Todos los endpoints requieren:
- Token de autenticación en el header `Authorization: Bearer {token}`
- Usuario con rol de `admin`

Si no se cumple alguna condición:
- `401` - No autenticado
- `403` - No autorizado (no es admin)

---

## 📍 Endpoints

### 1. Obtener Estadísticas Generales

**GET** `/api/admin/dashboard.php?action=estadisticas`

Retorna estadísticas generales del sistema.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "totalUsuarios": 156,
    "totalOrdenes": 842,
    "totalIngresos": 45820.50,
    "ordenesHoy": 23,
    "ingresosHoy": 1250.75,
    "nuevosusuarios": 12,
    "promedioOrden": 54.40
  }
}
```

---

### 2. Obtener Lista de Usuarios

**GET** `/api/admin/dashboard.php?action=usuarios`

Retorna todos los usuarios clientes con sus estadísticas.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan@example.com",
      "telefono": "+1 555-0101",
      "rol": "cliente",
      "estado": "activo",
      "fecha_registro": "2024-01-15 10:30:00",
      "total_gastado": 1250.50,
      "total_ordenes": 15
    }
  ]
}
```

---

### 3. Obtener Top Usuarios

**GET** `/api/admin/dashboard.php?action=top-usuarios`

Retorna los 3 usuarios que más han gastado.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan@example.com",
      "total_gastado": 1250.50,
      "total_ordenes": 15
    }
  ]
}
```

---

### 4. Obtener Órdenes Recientes

**GET** `/api/admin/dashboard.php?action=ordenes-recientes`

Retorna las 10 órdenes más recientes con información del usuario.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "usuario_id": 1,
      "estado": "pendiente",
      "tipo_servicio": "domicilio",
      "subtotal": 45.00,
      "impuestos": 7.20,
      "total": 52.20,
      "direccion_entrega": "Calle Principal #123",
      "telefono_contacto": "+1 555-0101",
      "notas_especiales": null,
      "fecha_orden": "2024-10-08 15:30:00",
      "fecha_entrega_estimada": null,
      "usuario_nombre": "Juan",
      "usuario_apellido": "Pérez"
    }
  ]
}
```

---

### 5. Banear/Desbanear Usuario

**POST** `/api/admin/dashboard.php?action=banear-usuario`

Cambia el estado de un usuario entre `activo` e `inactivo`.

**Body:**
```json
{
  "usuario_id": 5
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estado del usuario actualizado correctamente",
  "nuevo_estado": "inactivo"
}
```

**Errores:**
- `400` - ID de usuario no proporcionado
- `404` - Usuario no encontrado
- `403` - Intento de banear a un administrador

---

### 6. Eliminar Usuario

**POST** `/api/admin/dashboard.php?action=eliminar-usuario`

Elimina permanentemente un usuario del sistema.

**Body:**
```json
{
  "usuario_id": 5
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

**Errores:**
- `400` - ID de usuario no proporcionado
- `404` - Usuario no encontrado
- `403` - Intento de eliminar a un administrador

---

## 🔒 Validaciones de Seguridad

1. **Verificación de autenticación**: Todos los endpoints verifican el token
2. **Verificación de rol**: Solo usuarios con rol `admin` tienen acceso
3. **Protección contra auto-modificación**: No se puede banear/eliminar administradores
4. **Prepared Statements**: Todas las queries usan prepared statements para prevenir SQL Injection
5. **Validación de entrada**: Se validan todos los parámetros recibidos

---

## 🗄️ Queries SQL Optimizadas

### Estadísticas
- Usa agregaciones (`COUNT`, `SUM`) directamente en MySQL
- Filtros por fecha usando funciones nativas (`CURDATE()`, `MONTH()`, `YEAR()`)

### Lista de Usuarios
- JOIN con tabla `ordenes` para calcular totales
- GROUP BY para agregar por usuario
- COALESCE para manejar valores NULL

### Top Usuarios
- Similar a lista de usuarios pero con `LIMIT 3`
- Ordenado por `total_gastado DESC`

### Órdenes Recientes
- JOIN con tabla `usuarios` para información del cliente
- Ordenado por `fecha_orden DESC`
- Limitado a 10 resultados

---

## 📋 Ejemplo de Uso

```javascript
// Ejemplo en React/TypeScript
const obtenerEstadisticas = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(
    'http://localhost/api/admin/dashboard.php?action=estadisticas',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  const data = await response.json()
  return data
}
```

---

## 🧪 Testing

Para probar los endpoints:

1. **Inicia sesión como administrador**
```bash
POST /api/auth/login.php
{
  "correo": "admin@restaurante.com",
  "password": "password"
}
```

2. **Usa el token recibido**
```bash
GET /api/admin/dashboard.php?action=estadisticas
Authorization: Bearer {token}
```

3. **Ejecuta el script de datos de prueba**
```bash
mysql -u root -p proyecto_restaurante_react < database/08-10-2025-datos-prueba-dashboard.sql
```

---

## 📚 Documentación Relacionada

- [Dashboard Admin Documentation](../../../docs/08-10-2025-DASHBOARD_ADMIN.md)
- [API Authentication](../auth/README.md)
- [Database Schema](../../../database/09-Septiembre/25-09-2025-database.sql)

---

**Última actualización:** 08 de Octubre de 2025  
**Versión:** 1.0.0

