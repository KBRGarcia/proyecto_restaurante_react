# 🎯 SIGUE ESTOS PASOS AHORA

## Tu situación actual:
❌ Error: `ECONNREFUSED` al abrir `http://localhost:3000`

## ✅ Solución en 5 minutos:

---

## PASO 1️⃣: Abre XAMPP Control Panel

1. Busca **XAMPP** en el menú inicio de Windows
2. Abre **XAMPP Control Panel**
3. Asegúrate que estos servicios digan **"Running"** en verde:
   - ✅ **Apache**
   - ✅ **MySQL**

Si no están en verde, haz click en **"Start"** para cada uno.

**Captura de pantalla de cómo debe verse:**
```
Apache  [Running]  [Stop]  ...
MySQL   [Running]  [Stop]  ...
```

---

## PASO 2️⃣: Prueba la API

Abre **Chrome/Edge/Firefox** y copia-pega esta URL:

```
http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
```

### ¿Qué deberías ver?

**✅ CORRECTO:**
Un JSON que dice "API funcionando correctamente"

**❌ SI VES UN ERROR:**
Lee el archivo `COMO_RESOLVER_ERROR.md` que tiene todas las soluciones.

---

## PASO 3️⃣: Detén el servidor de Vite

En la terminal de PowerShell donde ejecutaste `npm run dev`:

1. Presiona **`Ctrl + C`**
2. Espera a que se detenga completamente

---

## PASO 4️⃣: Reinicia el servidor

En la misma terminal, ejecuta:

```powershell
npm run dev
```

Deberías ver algo como:

```
  VITE v6.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## PASO 5️⃣: Abre React en el navegador

1. Abre: `http://localhost:3000`
2. Presiona **`F12`** para abrir DevTools
3. Ve a la pestaña **"Console"**
4. Deberías ver:
   ```
   🔌 Conectando a: http://localhost/codigos-ika%20XAMPP/...
   ```

### ¿Qué deberías ver en la página?

**✅ SI FUNCIONA:**
- Verás el título "Menú del Restaurante"
- Tarjetas de productos (si hay productos en la BD)
- Filtros por categoría

**❌ SI SIGUE EL ERROR:**
- Ve al siguiente paso 👇

---

## 🔧 SI SIGUE EL ERROR:

### Opción A: Ajusta la ruta

1. **Abre:** `src/config.js`
2. **Línea 10**, busca:
   ```javascript
   const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'
   ```
3. **Prueba cambiarlo a:**
   ```javascript
   const XAMPP_PROJECT_PATH = '/proyecto_restaurante_react'
   ```
4. **Guarda** (Ctrl + S)
5. **Vuelve al PASO 2** para probar la nueva ruta

### Opción B: Usa datos de prueba (temporal)

Mientras arreglas XAMPP, puedes ver la app funcionando con datos de prueba:

1. **Abre:** `src/App.jsx`
2. **Busca** (Ctrl + F): `const cargarDatos`
3. **Reemplaza toda la función** por este código:

```javascript
const cargarDatos = async () => {
  setLoading(true)
  
  // DATOS DE PRUEBA - Quita esto cuando XAMPP funcione
  setTimeout(() => {
    const dataPrueba = {
      success: true,
      data: [
        {
          id: 1,
          nombre: 'Pizza Margarita',
          descripcion: 'Deliciosa pizza con queso mozzarella y albahaca fresca',
          precio: 12.99,
          categoria_id: 1,
          categoria_nombre: 'Pizzas',
          tiempo_preparacion: 15
        },
        {
          id: 2,
          nombre: 'Hamburguesa Clásica',
          descripcion: 'Hamburguesa de carne con queso, lechuga y tomate',
          precio: 8.99,
          categoria_id: 2,
          categoria_nombre: 'Hamburguesas',
          tiempo_preparacion: 10
        },
        {
          id: 3,
          nombre: 'Ensalada César',
          descripcion: 'Ensalada fresca con pollo, crutones y aderezo césar',
          precio: 6.99,
          categoria_id: 3,
          categoria_nombre: 'Ensaladas',
          tiempo_preparacion: 5
        }
      ]
    }

    setProductos(dataPrueba.data)
    
    const categoriasUnicas = [...new Set(
      dataPrueba.data.map(p => ({ 
        id: p.categoria_id, 
        nombre: p.categoria_nombre 
      }))
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

4. **Guarda** (Ctrl + S)
5. **Recarga** `http://localhost:3000`
6. Ahora deberías ver 3 productos de prueba

---

## ✅ Checklist Final

Marca cada paso completado:

```
□ XAMPP Control Panel abierto
□ Apache en verde (Running)
□ MySQL en verde (Running)
□ api/test.php devuelve JSON exitoso
□ npm run dev ejecutándose sin errores
□ http://localhost:3000 abierto
□ Console (F12) sin errores rojos
□ Veo productos en la página
```

---

## 📚 Archivos de Ayuda

Según tu problema, lee:

| Problema | Archivo a Leer |
|----------|---------------|
| Error ECONNREFUSED | `COMO_RESOLVER_ERROR.md` |
| No sé cómo funciona React | `GUIA_REACT_INTEGRACION.md` |
| Necesito referencia rápida | `INSTRUCCIONES_RAPIDAS.md` |
| Problemas con la API | `api/README.md` |
| Configuración de base de datos | `SOLUCION_ERROR_CONEXION.md` |

---

## 🎉 ¡Funcionó!

Si ahora ves productos en `http://localhost:3000`:

**¡FELICIDADES!** 🎊

Tu aplicación React está funcionando.

### Próximos pasos sugeridos:

1. **Explora los componentes:**
   - Abre `src/components/ProductCard.jsx`
   - Modifica los estilos en `src/App.css`
   - Juega con los filtros

2. **Aprende React:**
   - Lee la [documentación oficial en español](https://es.react.dev/)
   - Tutorial interactivo: [react.dev/learn](https://react.dev/learn)

3. **Personaliza tu app:**
   - Cambia colores
   - Agrega más componentes
   - Conecta con más endpoints PHP

4. **Agrega funcionalidades:**
   - Sistema de carrito completo
   - Login/registro
   - Checkout
   - Panel de administración en React

---

## 🆘 ¿Sigues con problemas?

Si después de seguir TODOS los pasos aún tienes errores:

1. **Toma capturas de pantalla de:**
   - XAMPP Control Panel
   - La consola del navegador (F12)
   - El error en la terminal
   - El contenido de `src/config.js`

2. **Verifica los archivos de log de XAMPP:**
   ```
   C:\xampp\apache\logs\error.log
   ```

3. **Ejecuta este comando y copia el resultado:**
   ```powershell
   curl http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
   ```

Con esa información podrás diagnosticar mejor el problema.

---

**¡Éxito en tu desarrollo!** 🚀

