# 🔧 Solución al Error de Conexión

## ❌ Error Actual

```
Error de conexión con el servidor
ECONNREFUSED
```

## 🎯 Causa del Problema

El error ocurre porque:
1. Vite (React) intenta conectarse a una API PHP
2. XAMPP necesita estar corriendo correctamente
3. La ruta del proyecto tiene espacios (`codigos-ika XAMPP`) que pueden causar problemas en las URLs

---

## ✅ Solución Paso a Paso

### **Paso 1: Verificar que XAMPP esté corriendo**

1. Abre el **Panel de Control de XAMPP**
2. Asegúrate que estos servicios estén **Running** (en verde):
   - ✅ **Apache** 
   - ✅ **MySQL**

Si no están corriendo, haz click en "Start" para cada uno.

---

### **Paso 2: Probar la API directamente**

Abre tu navegador y accede a esta URL:

```
http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

**Si ves un JSON con información del servidor:**
✅ ¡Perfecto! XAMPP está funcionando correctamente.

**Si ves un error o página en blanco:**
❌ Hay un problema con XAMPP o la ruta del proyecto.

---

### **Paso 3: Ajustar la ruta en el archivo de configuración**

Si la URL anterior NO funciona, necesitas ajustar la ruta:

1. **Abre el archivo:** `src/config.js`

2. **Busca esta línea:**
   ```javascript
   const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'
   ```

3. **Ajústala según dónde está tu proyecto en XAMPP:**

   **Opciones comunes:**

   ```javascript
   // Si tu proyecto está directamente en htdocs
   const XAMPP_PROJECT_PATH = '/proyecto_restaurante_react'

   // Si está en una subcarpeta
   const XAMPP_PROJECT_PATH = '/mi-carpeta/proyecto_restaurante_react'

   // Con espacios (usar %20)
   const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'
   ```

4. **Guarda el archivo**

---

### **Paso 4: Reiniciar el servidor de Vite**

En la terminal (PowerShell):

```powershell
# Detén el servidor (Ctrl + C)
# Luego reinicia:
npm run dev
```

---

### **Paso 5: Verificar en el navegador**

1. Abre `http://localhost:3000`
2. Abre la **Consola de Desarrollador** (F12)
3. En la pestaña **Console**, deberías ver:
   ```
   🔌 Conectando a: http://localhost/tu-ruta/api/productos.php
   ```

Si todo está bien, ¡los productos deberían cargar! 🎉

---

## 🔍 Diagnóstico Avanzado

### **Opción A: Probar API desde terminal**

```powershell
# Probar conexión a la API
curl http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

### **Opción B: Ver qué URL está usando React**

1. Abre `http://localhost:3000`
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **Network**
4. Recarga la página (F5)
5. Busca la petición a `productos.php`
6. Verifica que la URL sea correcta

---

## 🚨 Problemas Comunes y Soluciones

### **Problema 1: Puerto 80 ocupado**

**Síntoma:** Apache no inicia en XAMPP

**Solución:**
1. Abre XAMPP Control Panel
2. Click en "Config" (Apache) → "httpd.conf"
3. Busca `Listen 80`
4. Cámbialo a `Listen 8080`
5. Reinicia Apache
6. Ahora la URL será: `http://localhost:8080/...`
7. Ajusta `src/config.js`:
   ```javascript
   const API_BASE_URL = isDevelopment
     ? `http://localhost:8080${XAMPP_PROJECT_PATH}/api`
     : '/api'
   ```

### **Problema 2: Base de datos no conecta**

**Síntoma:** API devuelve error de base de datos

**Solución:**
1. Verifica que MySQL esté corriendo en XAMPP
2. Abre `includes/db.php`
3. Verifica las credenciales:
   ```php
   $servername = "localhost";
   $username = "root";
   $password = ""; // Generalmente vacío en XAMPP
   $dbname = "restaurante_db";
   ```
4. Asegúrate de haber importado `sql/database.sql`

### **Problema 3: CORS Error**

**Síntoma:** Error de CORS en la consola del navegador

**Solución:**
Ya está configurado en `api/productos.php`, pero si persiste:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### **Problema 4: Ruta incorrecta**

**Síntoma:** Error 404 en la API

**Solución:**
1. Verifica la ruta real de tu proyecto
2. Desde la carpeta del proyecto, ejecuta:
   ```powershell
   pwd
   ```
3. Si está en: `C:\xampp\htdocs\codigos-ika XAMPP\proyecto_restaurante_react`
4. La URL debe ser: `http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php`

---

## 📋 Checklist de Verificación

Marca cada paso:

- [ ] ✅ XAMPP Apache está corriendo (luz verde)
- [ ] ✅ XAMPP MySQL está corriendo (luz verde)
- [ ] ✅ Puedo acceder a `http://localhost` en el navegador
- [ ] ✅ Puedo acceder a `http://localhost/phpmyadmin`
- [ ] ✅ El archivo `api/test.php` funciona y muestra JSON
- [ ] ✅ La ruta en `src/config.js` es correcta
- [ ] ✅ He reiniciado el servidor Vite (`npm run dev`)
- [ ] ✅ La base de datos está importada
- [ ] ✅ El archivo `includes/db.php` tiene las credenciales correctas

---

## 🎯 Comandos Útiles

```powershell
# Ver archivos en la carpeta api
ls api/

# Reiniciar servidor Vite
npm run dev

# Limpiar caché de npm
npm cache clean --force
rm -r node_modules
npm install

# Ver configuración actual
cat src/config.js
```

---

## 📞 Última Opción: Usar Datos de Prueba

Si XAMPP no funciona temporalmente, puedes usar datos de prueba:

Edita `src/App.jsx` y comenta el fetch real:

```javascript
const cargarDatos = async () => {
  setLoading(true)
  setError(null)

  try {
    // DATOS DE PRUEBA (quita esto cuando XAMPP funcione)
    const dataProductos = {
      success: true,
      data: [
        {
          id: 1,
          nombre: 'Pizza Margarita',
          descripcion: 'Deliciosa pizza con queso mozzarella',
          precio: 12.99,
          categoria_id: 1,
          categoria_nombre: 'Pizzas',
          tiempo_preparacion: 15
        },
        // ... más productos de prueba
      ]
    }
    
    setProductos(dataProductos.data)
    // ... resto del código
  }
}
```

---

## ✅ Si todo funciona

Deberías ver:
1. ✅ React cargando en `http://localhost:3000`
2. ✅ Productos mostrados en tarjetas
3. ✅ Filtros por categoría funcionando
4. ✅ Sin errores en la consola

**¡Listo para desarrollar!** 🚀

