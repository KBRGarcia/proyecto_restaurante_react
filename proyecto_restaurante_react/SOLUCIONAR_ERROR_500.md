# 🔧 Solución para Error 500 en Dashboard

## ❌ Problema

Al intentar acceder al dashboard administrativo, aparece el error:
```
Error 500
```

## 🎯 Causa del Error

El error 500 se debe a que la tabla `sessions` **NO EXISTE** en la base de datos, y la función `verificarAuth()` intenta consultarla, causando un error fatal de PHP.

---

## ✅ Solución Completa (3 pasos simples)

### Paso 1: Borrar la base de datos anterior (Opcional pero recomendado)

**Opción A: Desde MySQL Command Line**

```sql
DROP DATABASE IF EXISTS proyecto_restaurante_react;
```

**Opción B: Desde phpMyAdmin**
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `proyecto_restaurante_react`
3. Click en pestaña "Operaciones"
4. Scroll hasta abajo y click en "Eliminar base de datos"

---

### Paso 2: Ejecutar el script completo de configuración

He creado un script SQL que incluye **TODO** lo necesario:
- ✅ Crea la base de datos
- ✅ Crea todas las tablas (incluyendo `sessions`)
- ✅ Inserta el usuario admin
- ✅ Inserta productos y categorías
- ✅ Inserta 10 usuarios de prueba
- ✅ Inserta 14 órdenes de prueba

**Opción A: Desde Terminal/PowerShell**

```bash
cd c:\xampp\htdocs\codigos-ika-XAMPP\proyecto_restaurante_react\proyecto_restaurante_react

mysql -u root -p < database/SETUP_COMPLETO_DASHBOARD.sql
```

Presiona Enter y luego ingresa tu contraseña de MySQL (normalmente está vacía, solo presiona Enter).

**Opción B: Desde MySQL Command Line**

1. Abre MySQL Command Line desde XAMPP
2. Ejecuta:

```sql
SOURCE c:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/SETUP_COMPLETO_DASHBOARD.sql
```

**Opción C: Desde phpMyAdmin**

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Click en "SQL" en el menú superior
3. Abre el archivo `database/SETUP_COMPLETO_DASHBOARD.sql` en un editor de texto
4. Copia TODO el contenido
5. Pégalo en el campo de phpMyAdmin
6. Click en "Continuar"

---

### Paso 3: Verificar que las tablas se crearon correctamente

Ejecuta esto en MySQL:

```sql
USE proyecto_restaurante_react;

SHOW TABLES;
```

**Deberías ver estas 8 tablas:**
```
+----------------------------------------+
| Tables_in_proyecto_restaurante_react   |
+----------------------------------------+
| categorias                             |
| evaluaciones                           |
| orden_detalles                         |
| ordenes                                |
| productos                              |
| sessions                               | ← IMPORTANTE: Esta debe existir
| usuarios                               |
+----------------------------------------+
```

**Si NO ves la tabla `sessions`, ejecuta manualmente:**

```sql
CREATE TABLE sessions (
  id INT(11) NOT NULL AUTO_INCREMENT,
  usuario_id INT(11) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY token (token),
  UNIQUE KEY usuario_id (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🚀 Probar el Dashboard

### 1. Asegúrate de que XAMPP esté corriendo

- ✅ MySQL: **Running**
- ✅ Apache: **Running**

### 2. Inicia la aplicación React

```bash
cd c:\xampp\htdocs\codigos-ika-XAMPP\proyecto_restaurante_react\proyecto_restaurante_react

npm run dev
```

### 3. Abre el navegador

Ve a: `http://localhost:5173` (o el puerto que te indique Vite)

### 4. Inicia sesión como Admin

- **Correo:** `admin@restaurante.com`
- **Contraseña:** `password`

### 5. Verifica el Dashboard

Deberías ver:

✅ **Estadísticas:**
- Total Usuarios: 10 (o más)
- Total Órdenes: 14 (o más)
- Ingresos Totales: ~$592
- Promedio por Orden: ~$42

✅ **Top Usuarios por Gasto**
- Lista de 3 usuarios que más han gastado

✅ **Órdenes Recientes**
- Tabla con las últimas 10 órdenes

✅ **Gestión de Usuarios**
- Lista completa de usuarios
- Búsqueda funcional
- Botones de banear/eliminar

---

## 🐛 Si aún tienes problemas

### Error: "Token inválido o expirado"

**Causa:** No hay sesión en la tabla `sessions`

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Al iniciar sesión, se creará automáticamente un registro en `sessions`

**Verificar:**
```sql
USE proyecto_restaurante_react;
SELECT * FROM sessions;
```

### Error: "No se proporcionó token de autenticación"

**Causa:** El token no se está enviando correctamente

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. Busca "Local Storage"
4. Verifica que exista la clave `token`
5. Si no existe, cierra sesión y vuelve a iniciar sesión

### Error: "Error de conexión a la base de datos"

**Causa:** MySQL no está corriendo o las credenciales son incorrectas

**Solución:**
1. Verifica que MySQL esté corriendo en XAMPP
2. Abre `server/includes/db.php`
3. Verifica las credenciales:
   ```php
   $host = "localhost";
   $user = "root";
   $pass = "";  // ← Normalmente vacío en XAMPP
   $db   = "proyecto_restaurante_react";
   ```

### Dashboard muestra todo en 0

**Causa:** No hay datos en la base de datos

**Solución:**
Vuelve a ejecutar el script completo:
```bash
mysql -u root -p < database/SETUP_COMPLETO_DASHBOARD.sql
```

---

## 📊 Verificar Datos en la Base de Datos

Ejecuta estas queries para verificar que hay datos:

```sql
USE proyecto_restaurante_react;

-- Verificar usuarios
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Verificar usuarios admin
SELECT * FROM usuarios WHERE rol = 'admin';

-- Verificar órdenes
SELECT COUNT(*) as total_ordenes FROM ordenes;

-- Verificar ingresos
SELECT SUM(total) as ingresos FROM ordenes WHERE estado = 'entregado';

-- Verificar sesiones
SELECT * FROM sessions;
```

---

## 🔍 Logs para Debugging

### Ver errores de Apache

Abre el archivo de logs:
```
c:\xampp\apache\logs\error.log
```

Busca errores recientes relacionados con `dashboard.php`

### Ver errores en la consola del navegador

1. Presiona F12
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Toma nota de los mensajes de error

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] MySQL está corriendo en XAMPP
- [ ] Apache está corriendo en XAMPP  
- [ ] La base de datos `proyecto_restaurante_react` existe
- [ ] La tabla `sessions` existe
- [ ] Hay un usuario con rol `admin`
- [ ] El archivo `server/api/admin/dashboard.php` existe
- [ ] El archivo `server/includes/db.php` tiene las credenciales correctas
- [ ] Puedes iniciar sesión con `admin@restaurante.com`
- [ ] El token aparece en localStorage del navegador

---

## 📚 Archivos Importantes

```
✅ database/SETUP_COMPLETO_DASHBOARD.sql    ← Ejecuta este
✅ server/api/admin/dashboard.php           ← API del dashboard
✅ server/includes/auth.php                 ← Autenticación (verificarAuth)
✅ server/includes/db.php                   ← Conexión a BD
✅ src/pages/DashboardPage.tsx              ← Componente React
✅ src/config.ts                            ← Configuración de endpoints
```

---

## 💡 Nota Importante

**La tabla `sessions` es CRÍTICA** para el funcionamiento del dashboard. Sin ella, la función `verificarAuth()` fallará con un error 500.

El script `SETUP_COMPLETO_DASHBOARD.sql` crea esta tabla automáticamente, pero si la borras o no se crea, el dashboard NO funcionará.

---

## 🎯 Resumen de la Solución

1. ✅ Ejecutar `database/SETUP_COMPLETO_DASHBOARD.sql`
2. ✅ Verificar que la tabla `sessions` existe
3. ✅ Iniciar sesión como admin
4. ✅ El dashboard debería funcionar correctamente

---

**Fecha:** 09 de Octubre de 2025  
**Versión:** 1.0.0  
**Estado:** Probado y Funcional

