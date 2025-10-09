# 🔍 Pasos de Diagnóstico - Error "Failed to Fetch"

## Paso 1: Verificar en la Consola del Navegador

1. **Abre tu aplicación** en el navegador: `http://localhost:5173`
2. **Inicia sesión** como administrador
3. **Presiona F12** para abrir DevTools
4. **Ve a la pestaña "Network"** (Red)
5. **Marca la opción "Preserve log"** (Conservar registro)
6. **Intenta crear un producto nuevo**

### ¿Qué debes buscar?

Busca una petición a `productos-admin.php` en la lista de Network.

- **Si NO aparece ninguna petición**: El problema está en el frontend (URL incorrecta)
- **Si aparece en ROJO**: Haz click en ella y revisa:
  - Status Code
  - Response
  - Headers

---

## Paso 2: Verificar en Console (Consola)

1. En DevTools, ve a la pestaña **"Console"**
2. Pega este código y presiona Enter:

```javascript
// 1. Verificar token
const token = localStorage.getItem('token');
console.log('🔑 Token:', token ? 'Presente (' + token.substring(0, 20) + '...)' : '❌ FALTANTE');

// 2. Verificar URL del endpoint
console.log('🌐 URL:', 'http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php');

// 3. Probar endpoint de test
fetch('http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/test-connection.php')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Test de conexión exitoso:', data);
    if (data.database && data.database.status === 'Conectada') {
      console.log('✅ Base de datos conectada');
    }
  })
  .catch(e => console.error('❌ Test de conexión falló:', e.message));

// 4. Probar creación de producto (MANUAL)
fetch('http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/admin/productos-admin.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    nombre: 'Producto de Prueba',
    descripcion: 'Solo para testing',
    precio: 10.99,
    categoria_id: 1,
    tiempo_preparacion: 15
  })
})
.then(r => {
  console.log('📊 Status:', r.status);
  return r.json();
})
.then(data => console.log('📦 Respuesta del servidor:', data))
.catch(e => console.error('❌ Error al crear producto:', e.message));
```

---

## Paso 3: Interpretar los Resultados

### Resultado A: "Token: ❌ FALTANTE"
**Problema:** No has iniciado sesión correctamente
**Solución:** 
1. Cierra sesión
2. Vuelve a iniciar sesión como admin
3. Intenta crear el producto de nuevo

---

### Resultado B: Test de conexión falla
**Problema:** Apache no puede acceder al archivo PHP
**Solución:**
1. Verifica que la carpeta esté en: `C:\xampp\htdocs\codigos-ika-XAMPP\proyecto_restaurante_react\proyecto_restaurante_react\`
2. Abre directamente en navegador: `http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/api/test-connection.php`

---

### Resultado C: Status 401 Unauthorized
**Problema:** Token inválido o expirado
**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta de nuevo

---

### Resultado D: Status 403 Forbidden
**Problema:** El usuario no es administrador
**Solución:**
Verifica que estés usando una cuenta con rol 'admin':
```sql
SELECT id, nombre, correo, rol FROM usuarios WHERE correo = 'admin@restaurante.com';
```

---

### Resultado E: Status 500 Internal Server Error
**Problema:** Error en el código PHP
**Solución:**
1. Abre XAMPP Control Panel
2. Click en "Logs" junto a Apache
3. Abre "php_error_log"
4. Busca el error más reciente

---

### Resultado F: CORS Error
**Problema:** Headers CORS bloqueando la petición
**Mensaje:** "blocked by CORS policy"
**Solución:** Verifica que el servidor de Vite esté en puerto 5173

---

## Paso 4: Compartir Resultados

Por favor comparte:

1. **Screenshot de la pestaña Network** mostrando la petición a productos-admin.php
2. **Screenshot de Console** con los resultados del código de prueba
3. **El mensaje de error exacto** que aparece

Con esa información podré identificar el problema exacto.

