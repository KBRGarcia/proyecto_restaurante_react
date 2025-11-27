# 📋 Instrucciones de Migración - Base de Datos Nueva

**Fecha:** 27 de Noviembre de 2025  
**Base de Datos Nueva:** `proyecto_restaurante_filament_react`

## ⚠️ ACCIÓN REQUERIDA

Para que el sistema funcione completamente, debes ejecutar **2 scripts SQL** en tu base de datos:

### Script 1: Tabla de Tokens de API

**Archivo:** `database/11-Noviembre/27-11-2025_01-api_tokens_table.sql`

**¿Por qué es necesario?**
- El sistema de autenticación del proyecto React usa tokens simples
- La tabla `sessions` de Laravel tiene una estructura diferente
- Sin esta tabla, el login funcionará pero los tokens no se guardarán en la BD

**Cómo ejecutar:**
```sql
-- Opción 1: Desde phpMyAdmin
-- Copia y pega el contenido del archivo en la pestaña SQL

-- Opción 2: Desde línea de comandos MySQL
SOURCE C:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/11-Noviembre/27-11-2025_01-api_tokens_table.sql;
```

### Script 2: Tabla de Relación Productos-Sucursales

**Archivo:** `database/11-Noviembre/27-11-2025_02-producto_sucursal_table.sql`

**¿Por qué es necesario?**
- Permite filtrar productos por sucursales
- Permite asignar productos a sucursales específicas
- Sin esta tabla, se mostrarán todos los productos sin filtrado

**Cómo ejecutar:**
```sql
-- Opción 1: Desde phpMyAdmin
-- Copia y pega el contenido del archivo en la pestaña SQL

-- Opción 2: Desde línea de comandos MySQL
SOURCE C:/xampp/htdocs/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/database/11-Noviembre/27-11-2025_02-producto_sucursal_table.sql;
```

## ✅ Verificación

Después de ejecutar los scripts, verifica que las tablas existan:

```sql
-- Verificar tabla api_tokens
SHOW TABLES LIKE 'api_tokens';

-- Verificar tabla producto_sucursal
SHOW TABLES LIKE 'producto_sucursal';

-- Ver estructura de api_tokens
DESCRIBE api_tokens;

-- Ver estructura de producto_sucursal
DESCRIBE producto_sucursal;
```

## 🔍 Solución de Problemas

### Error: "Table 'api_tokens' doesn't exist"
**Solución:** Ejecuta el script `27-11-2025_01-api_tokens_table.sql`

### Error: "Table 'producto_sucursal' doesn't exist"
**Solución:** Ejecuta el script `27-11-2025_02-producto_sucursal_table.sql`

### Error 500 al cargar productos
**Solución:** El código ahora maneja este caso automáticamente, pero ejecuta el script 2 para habilitar filtrado por sucursales

### Error 400 al hacer login después de registro
**Solución:** Ejecuta el script 1 (api_tokens). El sistema funcionará sin él, pero es recomendable tenerlo.

## 📝 Notas Importantes

1. **El sistema funcionará sin estas tablas**, pero con funcionalidad limitada:
   - Sin `api_tokens`: Login funcionará, pero tokens no se guardarán en BD
   - Sin `producto_sucursal`: Productos se mostrarán sin filtrado por sucursales

2. **Ambas tablas son recomendadas** para funcionalidad completa

3. **Los scripts son idempotentes** (puedes ejecutarlos múltiples veces sin problemas)

