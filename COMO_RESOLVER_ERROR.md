# ⚡ Cómo Resolver el Error ECONNREFUSED

## 🎯 Tu Error Actual

```
Error al cargar datos
Error de conexión con el servidor

Terminal:
[vite] http proxy error: /productos.php
ECONNREFUSED
```

---

## ✅ SOLUCIÓN RÁPIDA (Sigue estos pasos)

### **PASO 1: Verifica XAMPP** 🟢

1. Abre el **Panel de Control de XAMPP**
2. Asegúrate que estén en **VERDE** (Running):
   - ✅ Apache
   - ✅ MySQL

Si están en rojo, haz click en "Start"

---

### **PASO 2: Prueba la API directamente** 🧪

Abre tu navegador Chrome/Edge/Firefox y pega esta URL:

```
http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

#### ¿Qué deberías ver?

**✅ CORRECTO** - Un JSON como este:
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

**❌ ERROR** - Una de estas situaciones:

| Problema | Solución |
|----------|----------|
| "No se puede acceder a este sitio" | Apache no está corriendo en XAMPP |
| Página en blanco | Error en PHP, revisa que MySQL esté corriendo |
| Error 404 | La ruta es incorrecta, ve al PASO 3 |
| Error de base de datos | Ve al PASO 4 |

---

### **PASO 3: Ajusta la ruta en config.js** 📝

Si el PASO 2 no funcionó, ajusta la ruta:

1. **Abre:** `src/config.js`

2. **Encuentra esta línea (línea 10):**
   ```javascript
   const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'
   ```

3. **Cámbiala según donde esté tu proyecto:**

   **¿Tu proyecto está directamente en htdocs?**
   ```javascript
   const XAMPP_PROJECT_PATH = '/proyecto_restaurante_react'
   ```

   **¿Está en otra carpeta?**
   ```javascript
   // Ejemplo: C:\xampp\htdocs\mis-proyectos\restaurante
   const XAMPP_PROJECT_PATH = '/mis-proyectos/restaurante'
   ```

   **¿Tu carpeta tiene espacios?** (Reemplaza espacios con `%20`)
   ```javascript
   // "Mi Carpeta" → "Mi%20Carpeta"
   const XAMPP_PROJECT_PATH = '/Mi%20Carpeta/proyecto'
   ```

4. **Guarda el archivo** (Ctrl + S)

5. **Vuelve al PASO 2** para probar la nueva URL

---

### **PASO 4: Verifica la Base de Datos** 🗄️

1. Abre en tu navegador:
   ```
   http://localhost/phpmyadmin
   ```

2. ¿Ves la base de datos `restaurante_db`?
   - ✅ **SÍ** → Continúa al PASO 5
   - ❌ **NO** → Necesitas importar la base de datos:
     - En phpMyAdmin, click en "Nueva"
     - Nombre: `restaurante_db`
     - Click en "Crear"
     - Click en "Importar"
     - Selecciona: `sql/database.sql`
     - Click en "Continuar"

3. Abre `includes/db.php` y verifica:
   ```php
   $servername = "localhost";  // ✅ debe ser localhost
   $username = "root";          // ✅ en XAMPP generalmente es root
   $password = "";              // ✅ vacío en XAMPP por defecto
   $dbname = "restaurante_db";  // ✅ nombre de tu base de datos
   ```

---

### **PASO 5: Reinicia todo** 🔄

1. **En la terminal** (donde corre `npm run dev`):
   - Presiona `Ctrl + C` para detener
   - Espera unos segundos
   - Ejecuta de nuevo:
     ```powershell
     npm run dev
     ```

2. **En el navegador:**
   - Abre `http://localhost:3000`
   - Presiona `F12` para abrir DevTools
   - Ve a la pestaña **Console**
   - Busca este mensaje:
     ```
     🔌 Conectando a: http://localhost/tu-ruta/api/productos.php
     ```

3. **Copia esa URL** y ábrela directamente en el navegador

4. ¿Ves un JSON con productos?
   - ✅ **SÍ** → ¡Perfecto! Recarga `http://localhost:3000`
   - ❌ **NO** → Ve a SOLUCIONES AVANZADAS abajo

---

## 🎯 Checklist de Verificación

Marca cada elemento:

```
□ Apache está corriendo en XAMPP (luz verde)
□ MySQL está corriendo en XAMPP (luz verde)
□ http://localhost funciona en el navegador
□ http://localhost/phpmyadmin funciona
□ api/test.php devuelve JSON exitoso
□ La base de datos restaurante_db existe
□ includes/db.php tiene credenciales correctas
□ src/config.js tiene la ruta correcta
□ He reiniciado npm run dev
```

Si **TODOS** están marcados y aún no funciona, continúa abajo.

---

## 🔧 SOLUCIONES AVANZADAS

### Problema: Puerto 80 ocupado

Apache no inicia porque otro programa usa el puerto 80.

**Solución:**
```
1. En XAMPP Control Panel
2. Click en "Config" → "httpd.conf"
3. Busca (Ctrl+F): Listen 80
4. Cámbialo a: Listen 8080
5. Guarda y reinicia Apache
6. Ahora usa: http://localhost:8080/...
7. Edita src/config.js:
```

```javascript
const API_BASE_URL = isDevelopment
  ? `http://localhost:8080${XAMPP_PROJECT_PATH}/api`
  : '/api'
```

---

### Problema: Firewall bloquea conexión

**Solución Windows:**
```powershell
# Ejecuta PowerShell como Administrador
New-NetFirewallRule -DisplayName "XAMPP Apache" -Direction Inbound -Program "C:\xampp\apache\bin\httpd.exe" -Action Allow
```

---

### Problema: Error de permisos en archivos

**Solución:**
```
1. Click derecho en la carpeta del proyecto
2. Propiedades → Seguridad
3. Click en "Editar"
4. Selecciona "Usuarios"
5. Marca "Control total"
6. Aplicar → Aceptar
```

---

## 🆘 Última Opción: Datos de Prueba

Si nada funciona temporalmente, usa datos de prueba:

Edita `src/App.jsx`, busca la función `cargarDatos` y reemplázala por:

```javascript
const cargarDatos = async () => {
  setLoading(true)
  setError(null)

  // DATOS DE PRUEBA - Quita esto cuando XAMPP funcione
  setTimeout(() => {
    const dataPrueba = {
      success: true,
      data: [
        {
          id: 1,
          nombre: 'Pizza Margarita',
          descripcion: 'Deliciosa pizza italiana',
          precio: 12.99,
          categoria_id: 1,
          categoria_nombre: 'Pizzas',
          tiempo_preparacion: 15
        },
        {
          id: 2,
          nombre: 'Hamburguesa Clásica',
          descripcion: 'Hamburguesa con queso y vegetales',
          precio: 8.99,
          categoria_id: 2,
          categoria_nombre: 'Hamburguesas',
          tiempo_preparacion: 10
        },
        {
          id: 3,
          nombre: 'Ensalada César',
          descripcion: 'Ensalada fresca con aderezo césar',
          precio: 6.99,
          categoria_id: 3,
          categoria_nombre: 'Ensaladas',
          tiempo_preparacion: 5
        }
      ]
    }

    setProductos(dataPrueba.data)
    
    const categoriasUnicas = [...new Set(
      dataPrueba.data
        .filter(p => p.categoria_nombre)
        .map(p => ({ id: p.categoria_id, nombre: p.categoria_nombre }))
    )]
    
    const categoriasMap = new Map()
    categoriasUnicas.forEach(cat => {
      if (!categoriasMap.has(cat.id)) {
        categoriasMap.set(cat.id, cat)
      }
    })
    
    setCategorias(Array.from(categoriasMap.values()))
    setLoading(false)
  }, 500)
}
```

Guarda y recarga `http://localhost:3000`

Ahora deberías ver productos de prueba funcionando.

---

## 📞 Información de Depuración

Para reportar el problema, incluye:

```powershell
# 1. Versión de PHP
php -v

# 2. Estado de puertos
netstat -ano | findstr :80
netstat -ano | findstr :3306

# 3. Ubicación del proyecto
pwd

# 4. Prueba de conectividad
curl http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

---

## ✅ Todo funcionó?

Si ahora ves productos en `http://localhost:3000`:

🎉 **¡FELICIDADES!** 

Tu aplicación React está conectada correctamente a XAMPP.

**Próximos pasos:**
- Personaliza los componentes
- Agrega más funcionalidades
- Lee `GUIA_REACT_INTEGRACION.md` para aprender más

---

**Documentación relacionada:**
- `SOLUCION_ERROR_CONEXION.md` - Guía detallada
- `INSTRUCCIONES_RAPIDAS.md` - Quick start
- `GUIA_REACT_INTEGRACION.md` - Guía completa

