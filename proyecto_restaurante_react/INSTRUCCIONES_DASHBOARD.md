# 📊 Instrucciones para usar el Dashboard Administrativo

## 🚀 Inicio Rápido

### 1. Configurar la Base de Datos

Ejecuta los siguientes scripts SQL en orden:

```bash
# 1. Base de datos principal (si aún no la has creado)
mysql -u root -p < database/09-Septiembre/25-09-2025-database.sql

# 2. Datos de prueba para el dashboard
mysql -u root -p < database/08-10-2025-datos-prueba-dashboard.sql
```

### 2. Verificar la Estructura de Carpetas

Asegúrate de que existe la carpeta `server/api/admin/`:

```
server/
  └── api/
      └── admin/
          ├── dashboard.php    ✅ Archivo API
          └── README.md        ✅ Documentación
```

### 3. Iniciar la Aplicación

```bash
# En el directorio del proyecto
npm run dev
```

### 4. Acceder al Dashboard

1. **Inicia sesión como administrador:**
   - URL: `http://localhost:3000/login`
   - Usuario: `admin@restaurante.com`
   - Contraseña: `password` (por defecto)

2. **Accede al Dashboard:**
   - Verás el enlace "Dashboard" en el navbar (solo para admin)
   - O navega directamente a: `http://localhost:3000/dashboard`

---

## 📊 Qué Verás en el Dashboard

### Tarjetas de Estadísticas

1. **Total Usuarios** - Cantidad total de usuarios registrados
2. **Total Órdenes** - Todas las órdenes realizadas
3. **Ingresos Totales** - Suma de todas las ventas completadas
4. **Promedio por Orden** - Ticket promedio

### Secciones Principales

1. **Top Usuarios por Gasto**
   - Los 3 clientes que más han gastado
   - Muestra nombre, cantidad de órdenes y total gastado

2. **Órdenes Recientes**
   - Últimas 10 órdenes del sistema
   - Tipo de servicio (Domicilio/Para Llevar)
   - Estado actual
   - Total y fecha

3. **Gestión de Usuarios**
   - Lista completa de usuarios
   - Búsqueda en tiempo real
   - Acciones: Banear/Desbanear y Eliminar
   - Total gastado y número de órdenes por usuario

---

## 🔧 Funcionalidades Disponibles

### ✅ Búsqueda de Usuarios

Escribe en el campo de búsqueda para filtrar por:
- Nombre
- Apellido  
- Correo electrónico

### ✅ Banear Usuario

1. Click en el botón amarillo/verde de "Ban"
2. Confirma la acción en el modal
3. El usuario cambiará de estado (activo ↔ inactivo)

**Nota:** No se puede banear a administradores.

### ✅ Eliminar Usuario

1. Click en el botón rojo de "Eliminar"
2. Confirma la acción (¡irreversible!)
3. El usuario será eliminado permanentemente

**Nota:** No se puede eliminar a administradores.

---

## 🗄️ Estructura de Datos

### Tablas Utilizadas

```sql
usuarios          -- Información de usuarios
ordenes           -- Órdenes realizadas
orden_detalles    -- Detalles de cada orden
```

### Relaciones

```
usuarios (1) ----< (N) ordenes
ordenes (1) ----< (N) orden_detalles
```

---

## 🔐 Seguridad

### Controles Implementados

✅ Solo usuarios con rol `admin` pueden acceder  
✅ Verificación de token en cada petición  
✅ Prepared statements para prevenir SQL Injection  
✅ No se pueden modificar/eliminar administradores  
✅ Validación de permisos en backend

---

## 📡 Endpoints API Utilizados

```
GET  /api/admin/dashboard.php?action=estadisticas
GET  /api/admin/dashboard.php?action=usuarios
GET  /api/admin/dashboard.php?action=top-usuarios
GET  /api/admin/dashboard.php?action=ordenes-recientes
POST /api/admin/dashboard.php?action=banear-usuario
POST /api/admin/dashboard.php?action=eliminar-usuario
```

Ver documentación completa en: `server/api/admin/README.md`

---

## 🧪 Datos de Prueba

El script `08-10-2025-datos-prueba-dashboard.sql` incluye:

- **10 usuarios** de prueba
- **17 órdenes** distribuidas en el tiempo
- Órdenes de **hoy**, **este mes** y **meses anteriores**
- Diferentes **estados** (pendiente, preparando, listo, entregado)
- Ambos **tipos de servicio** (domicilio y para llevar)

### Usuarios de Ejemplo

```
juan@example.com    - Usuario activo con muchas compras
maria@example.com   - Usuario activo 
carlos@example.com  - Usuario INACTIVO (baneado)
ana@example.com     - Usuario activo
... (6 más)
```

---

## 🎨 Características de la Interfaz

### Diseño Responsive

- ✅ Desktop (4 columnas de estadísticas)
- ✅ Tablet (2 columnas)
- ✅ Mobile (1 columna, scroll horizontal en tablas)

### Colores y Estados

- 🟢 **Verde** - Activo, Entregado, Ingresos
- 🟡 **Amarillo** - Pendiente, Advertencias
- 🔵 **Azul** - Preparando, Información
- 🔴 **Rojo** - Inactivo, Cancelado, Eliminaciones

### Iconos Font Awesome

- 👥 `fa-users` - Usuarios
- 📋 `fa-receipt` - Órdenes
- 💵 `fa-chart-line` - Ingresos
- 🏆 `fa-trophy` - Top usuarios
- ⚙️ `fa-users-cog` - Gestión

---

## 🐛 Solución de Problemas

### No veo el enlace "Dashboard"

**Causa:** Tu usuario no es administrador.

**Solución:**
```sql
UPDATE usuarios SET rol = 'admin' WHERE correo = 'tu@correo.com';
```

### Error 401 al cargar datos

**Causa:** Token no válido o expirado.

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El token se renovará

### No hay datos en el dashboard

**Causa:** No se ejecutó el script de datos de prueba.

**Solución:**
```bash
mysql -u root -p proyecto_restaurante_react < database/08-10-2025-datos-prueba-dashboard.sql
```

### Error 403 Forbidden

**Causa:** Tu usuario no tiene permisos de admin.

**Solución:** Verifica tu rol en la base de datos:
```sql
SELECT rol FROM usuarios WHERE correo = 'tu@correo.com';
```

### Error al eliminar usuario

**Causa:** Intentas eliminar un administrador.

**Solución:** Solo se pueden eliminar usuarios con rol `cliente`.

---

## 📚 Documentación Adicional

- **Dashboard completo**: `docs/08-10-2025-DASHBOARD_ADMIN.md`
- **API Admin**: `server/api/admin/README.md`
- **Guía TypeScript**: `docs/04-10-2025-GUIA_TYPESCRIPT.md`
- **Arquitectura de Rutas**: `docs/04-10-2025-ARQUITECTURA_RUTAS.md`

---

## 💡 Consejos de Uso

### Para Desarrollo

1. **Mantén datos de prueba actualizados:**
   ```bash
   # Re-ejecutar script cuando necesites resetear datos
   mysql -u root -p proyecto_restaurante_react < database/08-10-2025-datos-prueba-dashboard.sql
   ```

2. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Pestaña "Console" para ver errores
   - Pestaña "Network" para ver llamadas API

3. **Verifica conexión con XAMPP:**
   - MySQL debe estar corriendo
   - Apache debe estar corriendo
   - Verifica que la ruta en `config.ts` sea correcta

### Para Producción

1. **Cambia credenciales por defecto:**
   ```sql
   UPDATE usuarios 
   SET password = PASSWORD('nueva_password_segura')
   WHERE rol = 'admin';
   ```

2. **Configura variables de entorno:**
   - URLs de API
   - Tokens de sesión
   - Claves de encriptación

3. **Implementa rate limiting:**
   - Limita peticiones por IP
   - Protege contra ataques de fuerza bruta

---

## 🎯 Próximos Pasos

### Mejoras Recomendadas

- [ ] Implementar paginación en lista de usuarios
- [ ] Agregar filtros avanzados (por fecha, estado, etc.)
- [ ] Exportar reportes a PDF/Excel
- [ ] Gráficos interactivos (Chart.js)
- [ ] Notificaciones en tiempo real
- [ ] Historial de acciones administrativas
- [ ] Gestión de productos desde el dashboard
- [ ] Analytics con Google Analytics

---

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la documentación en `docs/`
2. Verifica los logs de PHP en XAMPP
3. Revisa la consola del navegador
4. Consulta el archivo `README.md` principal

---

<div align="center">
  <p><strong>Dashboard Administrativo v1.0.0</strong></p>
  <p>Desarrollado con React + TypeScript + Vite + PHP + MySQL</p>
  <p><em>Siguiendo las mejores prácticas de desarrollo moderno</em></p>
</div>

