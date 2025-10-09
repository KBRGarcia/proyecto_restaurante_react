# 📋 Pasos para Probar el Dashboard Administrativo

## ✅ Checklist Previo

Antes de probar el dashboard, asegúrate de que:

- [ ] XAMPP esté instalado y funcionando
- [ ] MySQL esté corriendo en XAMPP
- [ ] Apache esté corriendo en XAMPP
- [ ] La base de datos `proyecto_restaurante_react` exista

---

## 🗄️ Paso 1: Crear/Verificar la Base de Datos

### Opción A: Si NO has creado la base de datos

Abre **MySQL** desde XAMPP (o ejecuta desde terminal):

```bash
mysql -u root -p
```

Luego ejecuta el script principal:

```sql
-- Asegúrate de estar en el directorio correcto
SOURCE c:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/09-Septiembre/25-09-2025-database.sql
```

### Opción B: Si ya existe la base de datos

Solo verifica que exista:

```sql
USE proyecto_restaurante_react;
SHOW TABLES;
```

Deberías ver estas tablas:
- `categorias`
- `evaluaciones`
- `orden_detalles`
- `ordenes`
- `productos`
- `sessions`
- `usuarios`

---

## 📊 Paso 2: Insertar Datos de Prueba

Ahora inserta datos de prueba para el dashboard:

```bash
mysql -u root -p proyecto_restaurante_react < c:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/08-10-2025-datos-prueba-dashboard.sql
```

O desde MySQL:

```sql
USE proyecto_restaurante_react;
SOURCE c:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/08-10-2025-datos-prueba-dashboard.sql
```

Esto insertará:
- 10 usuarios de prueba
- 17 órdenes con diferentes estados
- Órdenes de diferentes fechas (hoy, este mes, meses anteriores)

---

## 🔑 Paso 3: Verificar Usuario Admin

Verifica que existe un usuario administrador:

```sql
USE proyecto_restaurante_react;

SELECT id, nombre, correo, rol 
FROM usuarios 
WHERE rol = 'admin';
```

Si **NO** aparece ningún usuario admin, créalo:

```sql
INSERT INTO usuarios (nombre, apellido, correo, password, rol) 
VALUES ('Admin', 'Principal', 'admin@restaurante.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

**Credenciales por defecto:**
- **Correo:** `admin@restaurante.com`
- **Contraseña:** `password`

---

## 🚀 Paso 4: Iniciar la Aplicación React

Abre una terminal en el directorio del proyecto:

```bash
cd c:\xampp\htdocs\codigos-ika-XAMPP\proyecto_restaurante_react\proyecto_restaurante_react
```

Luego ejecuta:

```bash
npm run dev
```

La aplicación debería iniciar en: `http://localhost:5173` (o el puerto que indique Vite)

---

## 🔐 Paso 5: Iniciar Sesión como Admin

1. **Abre el navegador** y ve a: `http://localhost:5173`

2. **Haz clic en "Login"** (arriba a la derecha)

3. **Ingresa las credenciales:**
   - Correo: `admin@restaurante.com`
   - Contraseña: `password`

4. **Haz clic en "Iniciar Sesión"**

5. **Deberías ser redirigido automáticamente al Dashboard**

---

## 📊 Paso 6: Verificar que el Dashboard Muestre Datos

El dashboard debería mostrar:

### Tarjetas de Estadísticas (parte superior):
- ✅ **Total Usuarios**: Número de clientes registrados
- ✅ **Total Órdenes**: Cantidad total de órdenes
- ✅ **Ingresos Totales**: Suma de todas las ventas completadas
- ✅ **Promedio por Orden**: Ticket promedio

### Sección "Top Usuarios por Gasto":
- ✅ Lista de los 3 usuarios que más han gastado
- ✅ Con nombre, cantidad de órdenes y total gastado

### Sección "Órdenes Recientes":
- ✅ Tabla con las últimas 10 órdenes
- ✅ Con ID, tipo, estado, total y fecha

### Sección "Gestión de Usuarios":
- ✅ Tabla con todos los usuarios
- ✅ Barra de búsqueda funcional
- ✅ Botones para banear y eliminar

---

## 🐛 Solución de Problemas

### Error: "Error al cargar los datos del dashboard"

**Abre la consola del navegador** (F12) y busca mensajes de error.

#### Problema 1: Error 404 (Not Found)

**Síntoma:** La consola muestra `404 Not Found` en las llamadas a la API.

**Solución:**

Verifica que la ruta en `src/config.ts` sea correcta:

```typescript
const XAMPP_PROJECT_PATH = '/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react'
```

Debería coincidir con tu ruta real en XAMPP.

#### Problema 2: Error 401 (Unauthorized)

**Síntoma:** La consola muestra `401 Unauthorized`.

**Solución:**

1. Cierra sesión
2. Vuelve a iniciar sesión
3. Verifica que la tabla `sessions` exista en la base de datos

#### Problema 3: Error 500 (Internal Server Error)

**Síntoma:** La consola muestra `500 Internal Server Error`.

**Solución:**

1. Verifica los logs de Apache en XAMPP: `c:\xampp\apache\logs\error.log`

2. Busca errores de PHP relacionados con el archivo `dashboard.php`

3. Verifica que los archivos existan:
   - `server/api/admin/dashboard.php`
   - `server/includes/db.php`
   - `server/includes/auth.php`

#### Problema 4: Dashboard vacío pero sin errores

**Síntoma:** El dashboard carga pero no muestra datos.

**Solución:**

Verifica que hay datos en la base de datos:

```sql
USE proyecto_restaurante_react;

-- Verificar usuarios
SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente';

-- Verificar órdenes
SELECT COUNT(*) FROM ordenes;

-- Verificar datos de hoy
SELECT COUNT(*) FROM ordenes WHERE DATE(fecha_orden) = CURDATE();
```

Si no hay datos, ejecuta nuevamente el script de datos de prueba (Paso 2).

---

## 🔍 Verificación Manual de la API

Para probar la API directamente, puedes usar herramientas como **Postman** o **cURL**:

### 1. Obtener un token de sesión

```bash
POST http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/auth/login.php

Body (JSON):
{
  "correo": "admin@restaurante.com",
  "password": "password"
}
```

### 2. Usar el token para obtener estadísticas

```bash
GET http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/dashboard.php?action=estadisticas

Headers:
Authorization: Bearer {TU_TOKEN_AQUI}
```

Deberías recibir una respuesta JSON como:

```json
{
  "success": true,
  "data": {
    "totalUsuarios": 10,
    "totalOrdenes": 17,
    "totalIngresos": 592.21,
    "ordenesHoy": 4,
    "ingresosHoy": 56.72,
    "nuevosusuarios": 1,
    "promedioOrden": 34.83
  }
}
```

---

## 📚 Verificar Archivos Importantes

Asegúrate de que estos archivos existan y tengan contenido:

```
✅ server/api/admin/dashboard.php
✅ server/includes/db.php
✅ server/includes/auth.php
✅ database/08-10-2025-datos-prueba-dashboard.sql
✅ src/pages/DashboardPage.tsx
✅ src/config.ts
```

---

## 🎯 Funcionalidades para Probar

Una vez que el dashboard esté mostrando datos:

### 1. Búsqueda de Usuarios
- Escribe en la barra de búsqueda
- Los usuarios deberían filtrarse en tiempo real

### 2. Banear Usuario
- Haz clic en el botón amarillo (🚫) de un usuario activo
- Confirma la acción
- El estado debería cambiar a "Baneado"
- Haz clic nuevamente para desbanear

### 3. Eliminar Usuario
- Haz clic en el botón rojo (🗑️)
- Confirma la acción
- El usuario debería desaparecer de la lista

---

## ✅ Checklist Final

- [ ] La base de datos existe y tiene datos
- [ ] El usuario admin existe y puede iniciar sesión
- [ ] El dashboard carga sin errores
- [ ] Se muestran estadísticas correctas
- [ ] Se muestran usuarios en la lista
- [ ] Se muestran órdenes recientes
- [ ] La búsqueda funciona
- [ ] Banear/desbanear funciona
- [ ] Eliminar usuario funciona

---

## 📞 Contacto

Si después de seguir estos pasos sigues teniendo problemas:

1. Revisa la consola del navegador (F12 → Console)
2. Revisa los logs de Apache (`c:\xampp\apache\logs\error.log`)
3. Verifica que MySQL esté corriendo en XAMPP
4. Verifica que Apache esté corriendo en XAMPP

---

**Última actualización:** 09 de Octubre de 2025  
**Versión:** 1.0.0

