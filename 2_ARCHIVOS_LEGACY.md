# 📦 Archivos Legacy (No Usar)

## ⚠️ IMPORTANTE

Los siguientes archivos PHP son **LEGACY** (obsoletos) y **NO deben usarse** en el desarrollo actual. El proyecto ahora funciona **100% con React**.

---

## 🗑️ Archivos PHP del Root (Obsoletos)

Estos archivos fueron creados inicialmente para un sistema PHP tradicional, pero ahora están **reemplazados por componentes React**:

| Archivo PHP Legacy | ❌ Estado | ✅ Reemplazo en React |
|-------------------|---------|----------------------|
| `index.php` | Obsoleto | `src/pages/HomePage.jsx` |
| `login.php` | Obsoleto | `src/components/Login.jsx` |
| `registro.php` | Obsoleto | `src/components/Register.jsx` |
| `perfil.php` | Obsoleto | `src/pages/PerfilPage.jsx` |
| `configuracion.php` | Obsoleto | `src/pages/ConfiguracionPage.jsx` |
| `logout.php` | Obsoleto | `AuthContext.logout()` |
| `menu.php` | Obsoleto | `src/pages/MenuPage.jsx` |
| `dashboard.php` | Obsoleto | `src/pages/DashboardPage.jsx` (pendiente) |
| `ejemplo_integracion.php` | Obsoleto | - |

---

## 📁 Archivos de Diseño Legacy

| Archivo | ❌ Estado | ✅ Reemplazo |
|---------|---------|--------------|
| `includes/header.php` | Obsoleto | `src/components/Navbar.jsx` |
| `css/styles.css` | Obsoleto | `src/App.css` + Bootstrap 5 |
| `js/scripts.js` | Obsoleto | Componentes React individuales |

---

## ✅ Archivos que SÍ se Deben Usar

### **Backend (API)**
Estos archivos PHP son **necesarios** y están **activos**:

```
api/
├── auth/
│   ├── login.php           ✅ USAR - Endpoint de login
│   ├── register.php        ✅ USAR - Endpoint de registro
│   ├── logout.php          ✅ USAR - Endpoint de logout
│   └── me.php              ✅ USAR - Endpoint de usuario actual
├── productos.php           ✅ USAR - CRUD de productos
└── test.php               ✅ USAR - Test de conexión
```

### **Configuración**
```
includes/
├── db.php                  ✅ USAR - Conexión a base de datos
└── auth.php                ✅ USAR - Funciones de autenticación

sql/
├── database.sql            ✅ USAR - Estructura de BD
└── sessions_table.sql      ✅ USAR - Tabla de sesiones
```

### **Frontend (React)**
```
src/
├── components/             ✅ USAR - Todos los componentes React
├── pages/                  ✅ USAR - Todas las páginas React
├── contexts/               ✅ USAR - Contextos de React
├── config.js               ✅ USAR - Configuración de API
├── App.jsx                 ✅ USAR - App principal
├── App.css                 ✅ USAR - Estilos
└── main.jsx                ✅ USAR - Punto de entrada
```

### **Configuración del Proyecto**
```
index.html                  ✅ USAR - Entrada de React
package.json                ✅ USAR - Dependencias npm
vite.config.js              ✅ USAR - Config de Vite
.gitignore                  ✅ USAR - Archivos ignorados
README.md                   ✅ USAR - Documentación
INSTRUCCIONES_REACT.md      ✅ USAR - Guía de uso
```

---

## 🧹 Opciones de Limpieza

### **Opción 1: Mover a Carpeta Legacy (Recomendado)**

Puedes mover los archivos obsoletos a una carpeta separada para mantenerlos como referencia:

```bash
# Crear carpeta legacy
mkdir legacy

# Mover archivos PHP obsoletos
mv index.php legacy/
mv login.php legacy/
mv registro.php legacy/
mv perfil.php legacy/
mv configuracion.php legacy/
mv logout.php legacy/
mv menu.php legacy/
mv dashboard.php legacy/
mv ejemplo_integracion.php legacy/

# Mover header obsoleto
mkdir legacy/includes
mv includes/header.php legacy/includes/

# Mover assets obsoletos
mv css legacy/
mv js legacy/
```

### **Opción 2: Eliminar Completamente (Solo si estás seguro)**

```bash
# ⚠️ CUIDADO: Esta acción es irreversible

# Eliminar archivos PHP del root
rm index.php login.php registro.php perfil.php configuracion.php
rm logout.php menu.php dashboard.php ejemplo_integracion.php

# Eliminar header obsoleto
rm includes/header.php

# Eliminar carpetas de assets legacy
rm -rf css/
rm -rf js/
```

### **Opción 3: Mantener pero No Usar (Actual)**

Simplemente **no uses** estos archivos y trabaja solo con React. Esta es la opción más segura si no estás 100% seguro de eliminar.

---

## 🎯 Flujo de Trabajo Correcto

### **❌ Incorrecto (Legacy)**
```
Usuario → http://localhost/codigos-ika XAMPP/proyecto_restaurante_react/index.php
         → PHP genera HTML
         → Envía página completa
```

### **✅ Correcto (React)**
```
Usuario → http://localhost:3000/
         → React carga la aplicación
         → React llama a http://localhost/.../api/...
         → API PHP responde con JSON
         → React actualiza la UI
```

---

## 📝 Reglas de Oro

1. **NUNCA** abras los archivos PHP del root
2. **SIEMPRE** usa la aplicación React en `http://localhost:3000`
3. **SOLO** modifica archivos en `src/` para frontend
4. **SOLO** modifica archivos en `api/` para backend
5. **NUNCA** edites los archivos legacy (son solo referencia)

---

## ⚠️ Advertencias

### **No Mezclar Sistemas**

❌ **Incorrecto:**
```php
// Intentar usar header.php en React
<?php include 'includes/header.php'; ?>
```

✅ **Correcto:**
```jsx
// Usar componente React
import Navbar from './components/Navbar'
```

### **No Duplicar Funcionalidad**

Si ya existe un componente React, **NO** uses su equivalente PHP:

| Funcionalidad | ❌ NO Usar | ✅ SÍ Usar |
|---------------|-----------|-----------|
| Navbar | `includes/header.php` | `Navbar.jsx` |
| Login | `login.php` | `Login.jsx` |
| Perfil | `perfil.php` | `PerfilPage.jsx` |

---

## 🔄 Migración Completada

### **Antes (Sistema PHP)**
```
- Archivos .php separados para cada página
- Mezcla de HTML + PHP
- Recargas completas de página
- JavaScript vanilla
- Estilos CSS tradicionales
```

### **Después (Sistema React)**
```
- Single Page Application (SPA)
- Componentes React reutilizables
- Sin recargas de página
- React Hooks y Context
- Bootstrap 5 + estilos modernos
```

---

## 📞 ¿Dudas?

Si tienes dudas sobre qué archivo usar, consulta:
- `INSTRUCCIONES_REACT.md` - Guía completa de uso
- `README.md` - Documentación general
- Código en `src/` - Implementación actual

---

**Última actualización**: Octubre 2025
**Estado del proyecto**: ✅ 100% React

