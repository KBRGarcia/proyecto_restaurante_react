# 📡 API REST - Documentación

Esta carpeta contiene los endpoints PHP que React consume.

## 📁 Archivos

### `test.php` - Script de Diagnóstico
Prueba que XAMPP y la API estén funcionando correctamente.

**URL de acceso:**
```
http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "✅ API funcionando correctamente!",
  "database": {
    "connected": true,
    "total_productos": 5
  }
}
```

---

### `productos.php` - Endpoint de Productos
Devuelve todos los productos activos de la base de datos.

**URL de acceso:**
```
http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/productos.php
```

**Método:** GET

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Pizza Margarita",
      "descripcion": "Deliciosa pizza",
      "precio": "12.99",
      "categoria_id": 1,
      "categoria_nombre": "Pizzas",
      "tiempo_preparacion": "15",
      "estado": "activo"
    }
  ]
}
```

**Respuesta con error:**
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## 🔒 Configuración CORS

Todos los endpoints tienen habilitado CORS para desarrollo:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

⚠️ **Importante:** En producción, cambia `*` por el dominio específico de tu aplicación.

---

## 🛠️ Crear Nuevos Endpoints

Para crear un nuevo endpoint, sigue esta plantilla:

```php
<?php
// Configuración de headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir conexión a base de datos
include("../includes/db.php");

// Verificar conexión
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]);
    exit();
}

try {
    // Tu lógica aquí
    $result = $conn->query("SELECT * FROM tu_tabla");
    
    if ($result) {
        $data = [];
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    } else {
        throw new Exception($conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>
```

---

## 🧪 Probar Endpoints

### Desde el Navegador
Simplemente abre la URL del endpoint.

### Desde PowerShell
```powershell
curl http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/productos.php
```

### Desde React
```javascript
import { API_ENDPOINTS } from './config'

const response = await fetch(API_ENDPOINTS.productos)
const data = await response.json()
```

---

## 📝 Endpoints Sugeridos para Implementar

Puedes crear estos endpoints adicionales:

1. **`categorias.php`** - Listar categorías
2. **`carrito.php`** - Gestionar carrito de compras
3. **`ordenes.php`** - Crear y listar órdenes
4. **`auth.php`** - Login/registro de usuarios
5. **`producto.php?id=1`** - Obtener un producto específico

---

## 🔍 Debugging

Si un endpoint no funciona:

1. **Verifica Apache y MySQL en XAMPP**
2. **Abre el endpoint directamente en el navegador**
3. **Revisa errores en:**
   - `C:\xampp\apache\logs\error.log`
   - `C:\xampp\mysql\data\*.err`
4. **Usa el script de prueba:**
   ```
   http://localhost/.../api/test.php
   ```

---

## ✅ Buenas Prácticas

- ✅ Siempre validar y sanitizar datos de entrada
- ✅ Usar prepared statements para prevenir SQL injection
- ✅ Devolver códigos HTTP apropiados (200, 400, 500, etc.)
- ✅ Incluir mensajes de error descriptivos
- ✅ Manejar excepciones correctamente
- ✅ Cerrar conexiones a la base de datos
- ✅ En producción, deshabilitar mensajes de debug

---

## 🔐 Seguridad

Para producción, implementar:

1. **Autenticación:** JWT o sesiones
2. **Validación:** Validar todos los inputs
3. **Rate Limiting:** Limitar peticiones por IP
4. **HTTPS:** Usar conexiones seguras
5. **CORS específico:** Cambiar `*` por tu dominio
6. **Sanitización:** Escapar outputs para prevenir XSS

---

**Ver también:**
- `../includes/db.php` - Configuración de base de datos
- `../src/config.js` - Configuración de URLs en React

