# 🚀 Instrucciones de Implementación - Login, Register y Autenticación

## ✅ ¿Qué he creado?

He implementado un sistema completo de autenticación en React + PHP con:

- ✅ **Login** - Inicio de sesión con email/password
- ✅ **Register** - Registro de nuevos usuarios
- ✅ **Context API** - Gestión global de autenticación
- ✅ **Protected Routes** - Rutas protegidas por autenticación
- ✅ **Navbar dinámico** - Cambia según el estado de autenticación
- ✅ **API REST PHP** - Backend para auth
- ✅ **React Router** - Navegación entre páginas

---

## 📦 PASO 1: Instalar React Router

Ejecuta en tu terminal:

```powershell
npm install react-router-dom
```

Esto instalará React Router DOM 7.x (la última versión oficial).

---

## 🗄️ PASO 2: Crear Tabla de Sesiones en MySQL

1. **Abre phpMyAdmin:** `http://localhost/phpmyadmin`

2. **Selecciona tu base de datos:** `restaurante_db`

3. **Ve a la pestaña SQL**

4. **Copia y pega** el contenido del archivo `sql/sessions_table.sql`:

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

5. **Click en "Continuar"**

Esto creará la tabla necesaria para gestionar tokens de sesión.

---

## 🔄 PASO 3: Reiniciar el Servidor

```powershell
# Detén el servidor (Ctrl + C)
# Luego:
npm run dev
```

---

## 🧪 PASO 4: Probar la Aplicación

### 1. Abre el navegador:
```
http://localhost:3000
```

### 2. Navega entre las páginas:

| Ruta | Descripción | Requiere Login |
|------|-------------|----------------|
| `/` | Página de inicio | ❌ No |
| `/menu` | Menú de productos | ❌ No |
| `/login` | Iniciar sesión | ❌ No |
| `/register` | Crear cuenta | ❌ No |
| `/carrito` | Carrito de compras | ✅ Sí |
| `/mis-ordenes` | Historial de órdenes | ✅ Sí |
| `/perfil` | Perfil de usuario | ✅ Sí |
| `/dashboard` | Panel admin | ✅ Sí (rol admin) |

### 3. Prueba el registro:

1. Click en **"Registrarse"** en el navbar
2. Completa el formulario
3. Click en **"Crear Cuenta"**
4. Deberías ser redirigido a `/menu` automáticamente

### 4. Prueba el login:

1. Click en **"Iniciar Sesión"**
2. Usa las credenciales:
   - **Email:** `admin@restaurante.com`
   - **Password:** `password`
3. Deberías ser redirigido según tu rol

### 5. Verifica la sesión:

- El navbar debe mostrar tu nombre
- Deberías ver nuevas opciones en el menú
- Intenta acceder a `/dashboard` (solo admin)
- Intenta acceder a `/carrito` (requiere login)

---

## 📁 Archivos Creados

### Frontend (React)

```
src/
├── contexts/
│   └── AuthContext.jsx          # ✅ Context para autenticación
├── components/
│   ├── Login.jsx                # ✅ Componente de login
│   ├── Register.jsx             # ✅ Componente de registro
│   ├── Navbar.jsx               # ✅ Navbar con estado de auth
│   └── ProtectedRoute.jsx       # ✅ HOC para rutas protegidas
├── pages/
│   ├── HomePage.jsx             # ✅ Página de inicio
│   └── MenuPage.jsx             # ✅ Página de menú
├── App.jsx                      # ✅ Actualizado con Router
└── config.js                    # ✅ Actualizado con endpoints auth
```

### Backend (PHP)

```
api/
└── auth/
    ├── login.php                # ✅ POST /api/auth/login.php
    ├── register.php             # ✅ POST /api/auth/register.php
    ├── me.php                   # ✅ GET /api/auth/me.php
    └── logout.php               # ✅ POST /api/auth/logout.php
```

### SQL

```
sql/
└── sessions_table.sql           # ✅ Tabla para gestionar sesiones
```

### Documentación

```
GUIA_IMPLEMENTACION_COMPLETA.md  # ✅ Guía completa de arquitectura
INSTRUCCIONES_IMPLEMENTACION.md  # ✅ Este archivo
```

---

## 🔐 Cómo Funciona la Autenticación

### 1. **Usuario se registra** (`/register`)
```
Frontend: Register.jsx
    ↓ POST {nombre, correo, password}
Backend: api/auth/register.php
    ↓ Valida datos
    ↓ Hash password
    ↓ Inserta en BD
    ↓ Devuelve success
Frontend: Auto-login
```

### 2. **Usuario inicia sesión** (`/login`)
```
Frontend: Login.jsx
    ↓ POST {correo, password}
Backend: api/auth/login.php
    ↓ Busca usuario en BD
    ↓ Verifica password
    ↓ Genera token
    ↓ Guarda en tabla sessions
    ↓ Devuelve {token, usuario}
Frontend: AuthContext
    ↓ Guarda token en localStorage
    ↓ Actualiza estado global
    ↓ Redirige a /menu o /dashboard
```

### 3. **Usuario navega** (rutas protegidas)
```
Frontend: ProtectedRoute.jsx
    ↓ Verifica si hay usuario en context
    ↓ Si NO → redirige a /login
    ↓ Si SÍ → muestra componente
```

### 4. **Verificar sesión** (al recargar página)
```
Frontend: AuthContext (useEffect)
    ↓ Lee token de localStorage
    ↓ GET /api/auth/me.php
Backend: api/auth/me.php
    ↓ Verifica token en tabla sessions
    ↓ Verifica expiración
    ↓ Devuelve usuario
Frontend: Actualiza estado
```

### 5. **Usuario cierra sesión**
```
Frontend: Navbar → logout()
    ↓ POST /api/auth/logout.php
Backend: Elimina sesión de BD
Frontend: 
    ↓ Elimina token de localStorage
    ↓ Limpia estado global
    ↓ Redirige a /login
```

---

## 🎯 Conceptos Clave de React

### 1. **Context API** (Estado Global)
```javascript
// AuthContext.jsx
const AuthContext = createContext(null)

// Proveer en el nivel superior
<AuthContext.Provider value={...}>
  {children}
</AuthContext.Provider>

// Consumir en cualquier componente
const { usuario, login, logout } = useAuth()
```

**Fuente oficial:** [React Context](https://react.dev/learn/passing-data-deeply-with-context)

### 2. **React Router** (Navegación)
```javascript
// App.jsx
<Router>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</Router>
```

**Fuente oficial:** [React Router](https://reactrouter.com/)

### 3. **Protected Routes** (HOC Pattern)
```javascript
// ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const { estaAutenticado } = useAuth()
  
  if (!estaAutenticado()) {
    return <Navigate to="/login" />
  }
  
  return children
}
```

**Patrón:** Higher-Order Component (HOC)

### 4. **Custom Hooks**
```javascript
// AuthContext.jsx
export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}

// Uso:
const { usuario } = useAuth()
```

---

## 🛠️ Próximos Pasos: Implementar Carrito

Para implementar el carrito de compras completo, necesitas:

### 1. Crear CartContext
```javascript
// src/contexts/CartContext.jsx
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  
  const addItem = (producto) => { ... }
  const removeItem = (id) => { ... }
  const updateQuantity = (id, cantidad) => { ... }
  const getTotal = () => { ... }
  
  return (
    <CartContext.Provider value={{...}}>
      {children}
    </CartContext.Provider>
  )
}
```

### 2. Persistir en localStorage
```javascript
useEffect(() => {
  localStorage.setItem('carrito', JSON.stringify(items))
}, [items])
```

### 3. Crear página de carrito
```javascript
// src/pages/CartPage.jsx
function CartPage() {
  const { items, removeItem, updateQuantity } = useCart()
  
  return (
    <div>
      {items.map(item => (
        <CartItem key={item.id} {...item} />
      ))}
      <CheckoutButton />
    </div>
  )
}
```

### 4. Crear API de órdenes
```php
// api/ordenes.php
// POST: Crear nueva orden
// GET: Listar órdenes del usuario
```

---

## 📚 Recursos de Aprendizaje

### React Oficial
- [React Docs (Español)](https://es.react.dev/)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [useContext Hook](https://react.dev/reference/react/useContext)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

### React Router
- [Tutorial Official](https://reactrouter.com/en/main/start/tutorial)
- [Protected Routes](https://reactrouter.com/en/main/start/concepts#authenticated-routes)

### PHP & MySQL
- [PHP Sessions](https://www.php.net/manual/en/book.session.php)
- [PDO Prepared Statements](https://www.php.net/manual/en/pdo.prepared-statements.php)
- [Password Hashing](https://www.php.net/manual/en/function.password-hash.php)

---

## ✅ Checklist de Verificación

Marca cada elemento completado:

```
□ React Router instalado (npm install react-router-dom)
□ Tabla `sessions` creada en MySQL
□ Servidor reiniciado (npm run dev)
□ Puedo acceder a http://localhost:3000
□ Puedo navegar entre páginas (/, /menu, /login, /register)
□ Puedo crear una cuenta nueva
□ Puedo iniciar sesión
□ El navbar muestra mi nombre al estar logueado
□ Las rutas protegidas redirigen a /login si no estoy autenticado
□ Puedo cerrar sesión
□ La sesión persiste al recargar la página
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de autenticación funcionando con:

- ✅ Login / Register / Logout
- ✅ Sesiones persistentes
- ✅ Rutas protegidas
- ✅ Roles de usuario
- ✅ Context API para estado global
- ✅ React Router para navegación

**Siguiente paso:** Implementar el carrito de compras y sistema de órdenes.

**¿Dudas?** Lee `GUIA_IMPLEMENTACION_COMPLETA.md` para más detalles.

