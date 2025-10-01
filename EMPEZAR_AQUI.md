# 🎯 EMPEZAR AQUÍ - Sistema Completo de Autenticación

## ✅ ¿Qué he implementado?

He creado un sistema completo de autenticación con React + PHP que incluye:

### Frontend (React)
- ✅ **Login** - Componente de inicio de sesión
- ✅ **Register** - Componente de registro
- ✅ **AuthContext** - Gestión global de autenticación (Context API)
- ✅ **ProtectedRoutes** - Rutas protegidas por autenticación
- ✅ **React Router** - Navegación entre páginas
- ✅ **Navbar dinámico** - Cambia según el usuario
- ✅ **Páginas** - HomePage y MenuPage

### Backend (PHP)
- ✅ **API de Login** - `api/auth/login.php`
- ✅ **API de Registro** - `api/auth/register.php`
- ✅ **API de Verificación** - `api/auth/me.php`
- ✅ **API de Logout** - `api/auth/logout.php`
- ✅ **Sistema de tokens** - Tabla `sessions` en MySQL

---

## 🚀 PASOS PARA IMPLEMENTAR (5 minutos)

### **PASO 1: Instalar React Router**

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install react-router-dom
```

Esto instalará la librería oficial de enrutamiento de React.

---

### **PASO 2: Crear Tabla de Sesiones**

1. Abre **phpMyAdmin**: `http://localhost/phpmyadmin`

2. Selecciona la base de datos **`restaurante_db`**

3. Ve a la pestaña **SQL**

4. Copia y pega este código:

```sql
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` INT(11) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

5. Click **"Continuar"**

---

### **PASO 3: Reiniciar el Servidor**

En la terminal de PowerShell:

```powershell
# Detén el servidor (Ctrl + C)
# Espera a que se detenga completamente
# Luego ejecuta:
npm run dev
```

---

### **PASO 4: Probar la Aplicación**

1. Abre el navegador: `http://localhost:3000`

2. **Verás una nueva página de inicio** con navbar

3. **Prueba la navegación:**
   - Click en "Inicio" → Página de bienvenida
   - Click en "Menú" → Lista de productos
   - Click en "Registrarse" → Formulario de registro

4. **Crea una cuenta:**
   - Completa el formulario de registro
   - Click en "Crear Cuenta"
   - Deberías ser redirigido automáticamente al menú

5. **Verifica que estás logueado:**
   - El navbar debe mostrar tu nombre
   - Deberías ver un menú desplegable con tu usuario

6. **Prueba el login:**
   - Cierra sesión (menú desplegable → "Cerrar Sesión")
   - Click en "Iniciar Sesión"
   - Usa: `admin@restaurante.com` / `password`
   - Deberías ver el dashboard admin

---

## 📁 Estructura de Archivos Creados

```
proyecto_restaurante_react/
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx       🆕 Gestión de autenticación
│   ├── components/
│   │   ├── Login.jsx             🆕 Formulario de login
│   │   ├── Register.jsx          🆕 Formulario de registro
│   │   ├── Navbar.jsx            🆕 Barra de navegación
│   │   └── ProtectedRoute.jsx    🆕 Protección de rutas
│   ├── pages/
│   │   ├── HomePage.jsx          🆕 Página de inicio
│   │   └── MenuPage.jsx          🆕 Página de menú
│   ├── App.jsx                   ✏️ Actualizado con Router
│   └── config.js                 ✏️ Nuevos endpoints
│
├── api/
│   └── auth/
│       ├── login.php             🆕 API de login
│       ├── register.php          🆕 API de registro
│       ├── me.php                🆕 API de usuario actual
│       └── logout.php            🆕 API de logout
│
├── sql/
│   └── sessions_table.sql        🆕 Tabla de sesiones
│
├── package.json                  ✏️ React Router agregado
│
└── Documentación/
    ├── EMPEZAR_AQUI.md          🆕 Este archivo ⭐
    ├── INSTRUCCIONES_IMPLEMENTACION.md  🆕 Guía completa
    └── GUIA_IMPLEMENTACION_COMPLETA.md  🆕 Arquitectura
```

**Leyenda:**
- 🆕 Archivo nuevo
- ✏️ Archivo modificado
- ⭐ Leer primero

---

## 🎨 Rutas Disponibles

| URL | Descripción | Protegida | Rol Requerido |
|-----|-------------|-----------|---------------|
| `/` | Página de inicio | ❌ No | - |
| `/menu` | Menú de productos | ❌ No | - |
| `/login` | Iniciar sesión | ❌ No | - |
| `/register` | Crear cuenta | ❌ No | - |
| `/carrito` | Carrito de compras | ✅ Sí | cliente |
| `/mis-ordenes` | Historial de órdenes | ✅ Sí | cliente |
| `/perfil` | Perfil de usuario | ✅ Sí | cliente |
| `/dashboard` | Panel administrativo | ✅ Sí | admin |

---

## 🔐 Cómo Funciona

### 1. **Registro de Usuario**
```
Usuario llena formulario → Register.jsx
    ↓
POST /api/auth/register.php
    ↓
PHP valida y crea usuario en BD
    ↓
Auto-login después de registro
    ↓
Redirige a /menu
```

### 2. **Inicio de Sesión**
```
Usuario ingresa email/password → Login.jsx
    ↓
POST /api/auth/login.php
    ↓
PHP verifica credenciales
    ↓
Genera token y guarda en tabla sessions
    ↓
Devuelve {token, usuario}
    ↓
AuthContext guarda en localStorage
    ↓
Redirige según rol (admin → /dashboard, cliente → /menu)
```

### 3. **Persistencia de Sesión**
```
Usuario recarga página
    ↓
AuthContext lee token de localStorage
    ↓
GET /api/auth/me.php (con token)
    ↓
PHP verifica token en tabla sessions
    ↓
Si válido: devuelve usuario
    ↓
AuthContext actualiza estado
    ↓
Usuario permanece logueado
```

### 4. **Rutas Protegidas**
```
Usuario intenta acceder a /carrito
    ↓
ProtectedRoute verifica AuthContext
    ↓
¿Está autenticado?
  → SÍ: Muestra el componente
  → NO: Redirige a /login
```

---

## 💡 Conceptos Clave

### **Context API** (Estado Global)
React Context permite compartir datos entre componentes sin pasar props manualmente.

```javascript
// AuthContext.jsx - Proveedor
<AuthContext.Provider value={{ usuario, login, logout }}>
  {children}
</AuthContext.Provider>

// Cualquier componente - Consumidor
const { usuario, login } = useAuth()
```

**Fuente:** [React Context Official](https://react.dev/learn/passing-data-deeply-with-context)

### **React Router** (Navegación)
Permite crear Single Page Applications (SPA) con múltiples "páginas".

```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

**Fuente:** [React Router Official](https://reactrouter.com/)

### **Protected Routes** (HOC)
Componente de orden superior que protege rutas.

```javascript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

---

## 📚 Próximos Pasos

### ✅ Ya Implementado
- [x] Login / Register
- [x] Autenticación con tokens
- [x] Rutas protegidas
- [x] Navbar dinámico
- [x] Persistencia de sesión

### 🔜 Por Implementar (Siguiente Fase)

#### **1. Carrito de Compras**
- Context para gestionar items
- Persistencia en localStorage
- Página de carrito con lista de productos
- Botones para modificar cantidades

#### **2. Sistema de Órdenes**
- API para crear órdenes
- Página "Mis Órdenes"
- Historial con detalles
- Estados de órdenes

#### **3. Dashboard Administrativo**
- Gestión de productos (CRUD)
- Gestión de órdenes
- Estadísticas
- Gestión de usuarios

#### **4. Perfil de Usuario**
- Editar información
- Cambiar contraseña
- Direcciones guardadas

---

## 🆘 Problemas Comunes

### Error: "Cannot find module 'react-router-dom'"
**Solución:**
```powershell
npm install react-router-dom
```

### Error: "Table 'sessions' doesn't exist"
**Solución:** Ejecuta el SQL del PASO 2

### La sesión no persiste al recargar
**Solución:** 
1. Abre DevTools (F12)
2. Application → Local Storage
3. Verifica que exista la key `token`

### Error 401 en /api/auth/me.php
**Solución:**
- Verifica que la tabla `sessions` existe
- Verifica que el token no haya expirado (7 días por defecto)

---

## ✅ Checklist de Verificación

Marca cada item cuando lo completes:

```
□ React Router instalado
□ Tabla sessions creada en MySQL
□ Servidor reiniciado
□ http://localhost:3000 carga correctamente
□ Puedo ver el navbar
□ Puedo navegar a todas las páginas públicas
□ Puedo registrar una cuenta nueva
□ Puedo iniciar sesión
□ El navbar muestra mi nombre
□ La sesión persiste al recargar
□ Puedo cerrar sesión
□ Las rutas protegidas funcionan
```

---

## 📖 Documentación Completa

Para más detalles, consulta:

| Archivo | Contenido |
|---------|-----------|
| **INSTRUCCIONES_IMPLEMENTACION.md** | Guía paso a paso detallada |
| **GUIA_IMPLEMENTACION_COMPLETA.md** | Arquitectura y conceptos |
| `src/contexts/AuthContext.jsx` | Código del Context (comentado) |
| `src/components/ProtectedRoute.jsx` | Código de protección de rutas |

---

## 🎉 ¡Listo!

Si completaste todos los pasos del checklist, ahora tienes:

✅ Sistema de autenticación completo  
✅ Login y registro funcionando  
✅ Rutas protegidas  
✅ Navbar dinámico  
✅ Persistencia de sesión  
✅ Backend PHP seguro  

**Siguiente paso:** Implementar el carrito de compras y sistema de órdenes.

---

**¿Dudas?** Lee `INSTRUCCIONES_IMPLEMENTACION.md` para más información.

**¡Éxito en tu desarrollo!** 🚀

