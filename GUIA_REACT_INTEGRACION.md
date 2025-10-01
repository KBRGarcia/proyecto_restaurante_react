# 🚀 Guía Oficial de Integración React + PHP

Esta guía sigue las **mejores prácticas oficiales** de React para agregar React a un proyecto existente.

## 📚 Referencias Oficiales

- [React - Add React to an Existing Project](https://react.dev/learn/add-react-to-an-existing-project)
- [Vite - Getting Started](https://vitejs.dev/guide/)
- [React - Quick Start](https://react.dev/learn)

---

## 🎯 Estrategia de Integración

Tienes **2 formas** de integrar React en tu proyecto PHP:

### **Estrategia 1: Migración Gradual (Recomendado)**
Convierte páginas específicas a React mientras mantienes el resto en PHP.

### **Estrategia 2: Componentes React en Páginas PHP**
Inserta componentes React dentro de tus páginas PHP existentes.

---

## 📦 Paso 1: Instalar Dependencias

Ejecuta en tu terminal (PowerShell):

```powershell
npm install
```

Esto instalará:
- ✅ React 19.1.1
- ✅ React DOM 19.1.1
- ✅ Vite (bundler moderno)
- ✅ Plugin de Vite para React

---

## 🛠️ Paso 2: Ejecutar Servidor de Desarrollo

```powershell
npm run dev
```

Vite iniciará un servidor en `http://localhost:3000`

Características:
- ⚡ Hot Module Replacement (HMR) instantáneo
- 🔄 Recarga automática al guardar cambios
- 🚀 Builds ultra rápidos

---

## 🌐 Paso 3: Opciones de Uso

### **Opción A: Aplicación React Standalone**

Accede a `http://localhost:3000` para ver tu aplicación React pura.

**Archivos clave:**
- `src/main.jsx` - Punto de entrada
- `src/App.jsx` - Componente principal
- `index.html` - HTML base

### **Opción B: Integrar React en Páginas PHP**

He creado `ejemplo_integracion.php` que muestra cómo integrar React en PHP.

**Cómo funciona:**

1. **En Desarrollo:** 
   - PHP carga scripts desde `http://localhost:3000` (servidor Vite)
   - Habilita HMR para desarrollo rápido

2. **En Producción:**
   - Ejecutar `npm run build`
   - PHP carga archivos compilados desde `/dist`

**Código de ejemplo:**

```php
<?php if ($_SERVER['SERVER_NAME'] === 'localhost'): ?>
  <!-- Desarrollo: Usar Vite server -->
  <script type="module" src="http://localhost:3000/@vite/client"></script>
  <script type="module" src="http://localhost:3000/src/main.jsx"></script>
<?php else: ?>
  <!-- Producción: Archivos compilados -->
  <script type="module" src="/dist/assets/main.js"></script>
<?php endif; ?>

<div id="react-root"></div>
```

---

## 🔌 Paso 4: Conectar React con tu API PHP

### Crear API REST en PHP

He creado `api/productos.php` como ejemplo de API REST.

**Características:**
- ✅ Retorna JSON
- ✅ Permite CORS para desarrollo
- ✅ Usa tu conexión MySQL existente

### Consumir API desde React

En `src/App.jsx`:

```jsx
useEffect(() => {
  fetch('/api/productos.php')
    .then(res => res.json())
    .then(data => setProductos(data.data))
}, [])
```

---

## 🏗️ Paso 5: Compilar para Producción

Cuando estés listo para desplegar:

```powershell
npm run build
```

Esto generará:
- 📁 `/dist` - Archivos optimizados y minificados
- 📄 Archivos JS/CSS con hash para cache busting
- ⚡ Bundle optimizado con code splitting

**Configurar en tu servidor:**
1. Subir carpeta `/dist` a tu servidor
2. Asegurarte que tus archivos PHP apunten a `/dist/assets/`

---

## 📂 Estructura del Proyecto

```
proyecto_restaurante_react/
├── src/                    # Código fuente React
│   ├── main.jsx           # Punto de entrada React
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos del componente
│   └── index.css          # Estilos globales
├── api/                    # APIs PHP para React
│   └── productos.php      # Endpoint de productos
├── dist/                   # Build de producción (generado)
├── index.html             # HTML para React standalone
├── vite.config.js         # Configuración de Vite
├── package.json           # Dependencias Node
│
├── *.php                  # Tus archivos PHP existentes
├── css/                   # Tus estilos existentes
├── js/                    # Tus scripts existentes
└── includes/              # Includes PHP existentes
```

---

## 🎨 Migración de Componentes

### Ejemplo: Convertir tarjeta de producto PHP a React

**Antes (PHP):**
```php
<div class="col-lg-4">
  <div class="card">
    <h3><?php echo $producto['nombre']; ?></h3>
    <p>$<?php echo $producto['precio']; ?></p>
  </div>
</div>
```

**Después (React):**
```jsx
function ProductCard({ producto }) {
  return (
    <div className="col-lg-4">
      <div className="card">
        <h3>{producto.nombre}</h3>
        <p>${producto.precio}</p>
      </div>
    </div>
  )
}
```

---

## 🔥 Ventajas de Esta Integración

✅ **Gradual:** No necesitas reescribir todo de golpe  
✅ **Moderno:** Usa las herramientas más actuales (Vite)  
✅ **Compatible:** Mantiene tu backend PHP funcionando  
✅ **Rápido:** HMR instantáneo en desarrollo  
✅ **Optimizado:** Builds de producción ultra optimizados  
✅ **Oficial:** Sigue las guías oficiales de React  

---

## 📖 Próximos Pasos Sugeridos

1. **Crear componentes reutilizables:**
   - `src/components/ProductCard.jsx`
   - `src/components/Cart.jsx`
   - `src/components/Menu.jsx`

2. **Gestión de estado:**
   - Usar Context API (built-in React)
   - O instalar Zustand/Redux si es necesario

3. **Routing:**
   - Instalar React Router: `npm install react-router-dom`
   - Crear SPA completa

4. **Formularios:**
   - Crear formularios de login/registro en React
   - Conectar con tu API PHP existente

---

## 🆘 Solución de Problemas

### Error: "Cannot find module 'vite'"
```powershell
npm install
```

### Error: Puerto 3000 ocupado
Cambiar en `vite.config.js`:
```js
server: { port: 3001 }
```

### Error de CORS en producción
Configurar headers en PHP:
```php
header('Access-Control-Allow-Origin: *');
```

---

## 📞 Recursos Adicionales

- [Documentación React (Español)](https://es.react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React + PHP Tutorial](https://react.dev/learn/add-react-to-an-existing-project)

---

**¡Listo para empezar!** 🎉

Ejecuta `npm run dev` y comienza a desarrollar con React.

