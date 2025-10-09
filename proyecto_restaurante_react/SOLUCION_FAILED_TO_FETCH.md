# Solución: Error "Failed to Fetch"

## 🔴 Problema
Al intentar crear un producto, aparece el error: **"Failed to fetch"**

---

## 🎯 Causas y Soluciones

### **Paso 1: Verificar que XAMPP esté corriendo**

1. Abre el **Panel de Control de XAMPP**
2. Verifica que estos servicios estén **CORRIENDO** (verde):
   - ✅ **Apache** debe estar activo
   - ✅ **MySQL** debe estar activo

3. Si no están corriendo:
   - Click en **"Start"** para Apache
   - Click en **"Start"** para MySQL

---

### **Paso 2: Verificar que el archivo PHP existe**

Abre tu navegador y visita:

```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php
```

**Resultados esperados:**

- ✅ **SI VES:** `{"success":false,"message":"No autenticado"}`
  - **BIEN!** El archivo existe y responde
  
- ❌ **SI VES:** "404 Not Found" o página en blanco
  - **PROBLEMA:** El archivo no está en la ubicación correcta

---

### **Paso 3: Verificar la configuración de la URL en config.ts**

Abre el archivo `src/config.ts` y verifica que la ruta sea correcta:

```typescript
// Debe coincidir con la carpeta en XAMPP
const XAMPP_PROJECT_PATH = '/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react'
```

**Verificación:**
- Abre el Explorador de Archivos de Windows
- Navega a: `C:\xampp\htdocs\`
- Verifica que la carpeta coincida exactamente con la ruta en config.ts

---

### **Paso 4: Probar el endpoint manualmente**

#### Opción A: Con el Navegador

1. Abre tu navegador
2. Ve a: `http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php`
3. Deberías ver un JSON como: `{"success":false,"message":"No autenticado"}`

#### Opción B: Con la Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Pega y ejecuta este código:

```javascript
fetch('http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php', {
  method: 'OPTIONS'
})
.then(r => console.log('✅ Servidor responde:', r.status))
.catch(e => console.error('❌ Error:', e.message))
```

---

### **Paso 5: Verificar errores de PHP**

Si el endpoint no responde, puede haber un error de sintaxis en PHP.

**Verificar logs de error de Apache:**

1. Abre XAMPP Control Panel
2. Click en **"Logs"** junto a Apache
3. Click en **"php_error_log"**
4. Busca errores recientes relacionados con `productos-admin.php`

**Errores comunes:**
- Sintaxis incorrecta
- Includes faltantes (`db.php` o `auth.php`)
- Base de datos no conectada

---

### **Paso 6: Verificar que la base de datos existe**

1. Abre **phpMyAdmin**: http://localhost/phpmyadmin/
2. Verifica que existe la base de datos: **proyecto_restaurante_react**
3. Verifica que existe la tabla: **productos**
4. Verifica que existe la tabla: **categorias**

Si no existen:
- Ejecuta el script SQL: `database/10-Octubre/09-10-2025-SETUP_COMPLETO_DASHBOARD.sql`

---

### **Paso 7: Verificar CORS (si todo lo anterior está bien)**

Abre `server/api/admin/productos-admin.php` y verifica estas líneas al inicio:

```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

**Asegúrate que el puerto coincide con tu servidor de desarrollo Vite (normalmente 5173)**

---

### **Paso 8: Verificar en la Consola del Navegador**

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Intenta crear un producto de nuevo
4. Busca la petición a `productos-admin.php`
5. Haz click en ella y verifica:
   - **Status Code**: ¿Qué código aparece?
   - **Response**: ¿Qué respuesta da el servidor?
   - **Headers**: ¿Están los headers CORS correctos?

---

## 🛠️ Solución Rápida Recomendada

**Ejecuta estos pasos en orden:**

### 1. Verificar XAMPP
```
✅ Apache CORRIENDO
✅ MySQL CORRIENDO
```

### 2. Probar URL directamente
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php
```
**Debe responder:** `{"success":false,"message":"No autenticado"}`

### 3. Verificar en consola del navegador (DevTools → Console)
```javascript
console.log(localStorage.getItem('token'))
// Debe mostrar un token largo

fetch('http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    nombre: 'Producto de Prueba',
    precio: 10.99,
    categoria_id: 1
  })
})
.then(r => r.json())
.then(data => console.log('✅ Respuesta:', data))
.catch(e => console.error('❌ Error:', e))
```

---

## 📊 Tabla de Diagnóstico

| Error en Consola | Causa | Solución |
|-----------------|-------|----------|
| `Failed to fetch` | Servidor no responde | Iniciar Apache en XAMPP |
| `404 Not Found` | Archivo no existe | Verificar ruta del archivo |
| `CORS policy` | Headers CORS incorrectos | Verificar headers en PHP |
| `401 Unauthorized` | Token inválido | Re-iniciar sesión |
| `403 Forbidden` | No es admin | Usar cuenta admin |
| `500 Internal Server Error` | Error de PHP | Ver php_error_log |

---

## 🔧 Si Nada Funciona: Verificación Completa

### Crear archivo de prueba simple

Crea este archivo: `server/api/test-simple.php`

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => '¡Servidor PHP funcionando!',
    'timestamp' => date('Y-m-d H:i:s')
]);
```

Luego prueba accediendo a:
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/test-simple.php
```

**Si esto funciona** → El problema está en `productos-admin.php` (probablemente includes faltantes)

**Si esto NO funciona** → El problema es la configuración de XAMPP o la ruta del proyecto

---

## 📞 Debugging Avanzado

### Ver qué URL se está llamando

En `src/pages/MenuPage.tsx`, agrega console.logs:

```typescript
const handleGuardarProducto = async (productoData: Partial<Producto>) => {
  const token = localStorage.getItem('token')
  
  console.log('🔍 Token:', token ? 'Presente' : 'FALTANTE')
  console.log('🔍 URL:', API_ENDPOINTS.adminCrearProducto)
  console.log('🔍 Datos:', productoData)
  
  // ... resto del código
}
```

Luego:
1. Abre DevTools (F12)
2. Ve a Console
3. Intenta crear un producto
4. Revisa los logs

---

## ✅ Checklist Final

Marca cada uno cuando lo verifiques:

- [ ] XAMPP Apache está corriendo (luz verde)
- [ ] XAMPP MySQL está corriendo (luz verde)
- [ ] Puedo acceder a http://localhost/phpmyadmin/
- [ ] La base de datos `proyecto_restaurante_react` existe
- [ ] La tabla `productos` existe
- [ ] El archivo `productos-admin.php` existe en la ruta correcta
- [ ] La URL del navegador responde con JSON (aunque diga "No autenticado")
- [ ] Tengo un token guardado (localStorage.getItem('token') != null)
- [ ] Estoy logueado como admin
- [ ] DevTools Network muestra la petición (aunque falle)

---

## 🎯 Solución Más Probable

**Causa #1 (90% de casos):** Apache no está corriendo
- **Solución:** Iniciar Apache en XAMPP

**Causa #2 (8% de casos):** Ruta incorrecta en config.ts
- **Solución:** Verificar `XAMPP_PROJECT_PATH` en src/config.ts

**Causa #3 (2% de casos):** Base de datos no configurada
- **Solución:** Ejecutar script SQL de setup

---

**Si después de seguir todos estos pasos aún tienes problemas, comparte:**
1. Screenshot del Panel de XAMPP
2. Screenshot de la consola del navegador (pestaña Network)
3. Screenshot del error exacto

