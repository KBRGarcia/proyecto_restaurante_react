# 🚀 Proyecto Restaurante - Sistema React

## 📋 Descripción

Este proyecto es una **aplicación web moderna** para un restaurante, construida con **React + Vite** en el frontend y **PHP** como API backend.

---

## 🏗️ Arquitectura del Proyecto

### **Frontend (React)**
- **Framework**: React 18 con Vite
- **Puerto de desarrollo**: `http://localhost:3000`
- **Carpeta principal**: `src/`

### **Backend (API PHP)**
- **Servidor**: Apache (XAMPP)
- **Puerto**: `http://localhost/codigos-ika XAMPP/proyecto_restaurante_react/api/`
- **Base de datos**: MySQL
- **Carpeta principal**: `api/`

---

## 📁 Estructura de Archivos

```
proyecto_restaurante_react/
├── src/                          # ✅ APLICACIÓN REACT (USAR)
│   ├── components/               # Componentes reutilizables
│   │   ├── Navbar.jsx           # Menú de navegación
│   │   ├── Login.jsx            # Formulario de login
│   │   ├── Register.jsx         # Formulario de registro
│   │   ├── ProductCard.jsx      # Tarjeta de producto
│   │   ├── LoadingSpinner.jsx   # Indicador de carga
│   │   └── ErrorMessage.jsx     # Mensajes de error
│   │
│   ├── pages/                    # Páginas principales
│   │   ├── HomePage.jsx         # Página de inicio
│   │   ├── MenuPage.jsx         # Menú del restaurante
│   │   ├── PerfilPage.jsx       # Perfil del usuario
│   │   └── ConfiguracionPage.jsx # Configuración de cuenta
│   │
│   ├── contexts/                 # Contextos de React
│   │   └── AuthContext.jsx      # Manejo de autenticación
│   │
│   ├── config.js                 # Configuración de API
│   ├── App.jsx                   # Componente principal
│   └── main.jsx                  # Punto de entrada
│
├── api/                          # ✅ API PHP (USAR)
│   ├── auth/                     # Endpoints de autenticación
│   │   ├── login.php            # POST: Iniciar sesión
│   │   ├── register.php         # POST: Registrar usuario
│   │   ├── logout.php           # POST: Cerrar sesión
│   │   └── me.php               # GET/PUT/POST: Usuario actual
│   │
│   ├── productos.php            # CRUD de productos
│   └── README.md                # Documentación de la API
│
├── includes/                     # ✅ Archivos PHP compartidos (USAR)
│   ├── db.php                   # Conexión a base de datos
│   └── auth.php                 # Funciones de autenticación
│
├── sql/                          # ✅ Scripts de base de datos (USAR)
│   ├── database.sql             # Estructura completa
│   └── sessions_table.sql       # Tabla de sesiones
│
├── ❌ ARCHIVOS PHP LEGACY (NO USAR)
│   ├── index.php                # ❌ Usar React en su lugar
│   ├── login.php                # ❌ Usar Login.jsx
│   ├── registro.php             # ❌ Usar Register.jsx
│   ├── perfil.php               # ❌ Usar PerfilPage.jsx
│   ├── configuracion.php        # ❌ Usar ConfiguracionPage.jsx
│   ├── menu.php                 # ❌ Usar MenuPage.jsx
│   ├── dashboard.php            # ❌ Crear DashboardPage.jsx
│   ├── includes/header.php      # ❌ Usar Navbar.jsx
│   ├── css/styles.css           # ❌ Usar App.css o Tailwind
│   └── js/scripts.js            # ❌ Usar componentes React
│
├── index.html                    # ✅ Punto de entrada de React
├── package.json                  # ✅ Dependencias de npm
├── vite.config.js               # ✅ Configuración de Vite
└── README.md                    # ✅ Documentación general
```

---

## 🚀 Instalación y Configuración

### **Paso 1: Instalar Dependencias**

```bash
# Instalar Node.js packages
npm install
```

### **Paso 2: Configurar Base de Datos**

1. Abre **phpMyAdmin** (`http://localhost/phpmyadmin`)
2. Crea una nueva base de datos llamada: `proyecto_restaurante_react`
3. Importa el archivo: `sql/database.sql`
4. Importa el archivo: `sql/sessions_table.sql`

### **Paso 3: Configurar XAMPP**

1. Inicia **Apache** y **MySQL** en XAMPP
2. Verifica que puedas acceder a: `http://localhost/codigos-ika XAMPP/proyecto_restaurante_react/api/test.php`

### **Paso 4: Iniciar Servidor de Desarrollo**

```bash
# Iniciar React con Vite
npm run dev
```

La aplicación se abrirá en: **http://localhost:3000**

---

## 🔐 Autenticación

### **Endpoints de la API**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login.php` | Iniciar sesión |
| `POST` | `/api/auth/register.php` | Registrar usuario |
| `POST` | `/api/auth/logout.php` | Cerrar sesión |
| `GET` | `/api/auth/me.php` | Obtener usuario actual |
| `PUT` | `/api/auth/me.php` | Actualizar perfil |
| `POST` | `/api/auth/me.php` | Cambiar contraseña |

### **Flujo de Autenticación**

1. El usuario ingresa credenciales en `Login.jsx`
2. React envía `POST` a `/api/auth/login.php`
3. PHP valida y devuelve un **token**
4. React guarda el token en `localStorage`
5. Las peticiones posteriores incluyen el token en el header: `Authorization: Bearer {token}`

---

## 📱 Rutas de la Aplicación

| Ruta | Componente | Protegida | Descripción |
|------|------------|-----------|-------------|
| `/` | `HomePage` | No | Página de inicio |
| `/menu` | `MenuPage` | No | Menú del restaurante |
| `/login` | `Login` | No | Iniciar sesión |
| `/register` | `Register` | No | Registrarse |
| `/perfil` | `PerfilPage` | ✅ Sí | Perfil del usuario |
| `/configuracion` | `ConfiguracionPage` | ✅ Sí | Configuración de cuenta |
| `/carrito` | _Pendiente_ | ✅ Sí | Carrito de compras |
| `/mis-ordenes` | _Pendiente_ | ✅ Sí | Historial de órdenes |
| `/dashboard` | _Pendiente_ | ✅ Admin | Panel administrativo |

---

## 🛠️ Desarrollo

### **Comandos Disponibles**

```bash
# Desarrollo (Hot Reload)
npm run dev

# Compilar para producción
npm run build

# Vista previa de build
npm run preview

# Linter
npm run lint
```

### **Agregar Nuevas Páginas**

1. Crear el componente en `src/pages/NombrePage.jsx`
2. Importar en `src/App.jsx`
3. Agregar la ruta en el componente `<Routes>`

**Ejemplo:**

```jsx
// src/pages/MiNuevaPagina.jsx
function MiNuevaPagina() {
  return (
    <div className="container mt-5">
      <h1>Mi Nueva Página</h1>
    </div>
  )
}

export default MiNuevaPagina
```

```jsx
// src/App.jsx
import MiNuevaPagina from './pages/MiNuevaPagina'

// Dentro de <Routes>
<Route path="/nueva-pagina" element={<MiNuevaPagina />} />
```

### **Crear Nuevos Endpoints de API**

1. Crear archivo en `api/nombre-endpoint.php`
2. Incluir headers CORS y conexión a DB
3. Validar datos y responder con JSON
4. Agregar endpoint en `src/config.js`

**Ejemplo:**

```php
<?php
// api/ejemplo.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once '../includes/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Tu lógica aquí
    
    echo json_encode([
        'success' => true,
        'message' => 'Operación exitosa'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
```

---

## 🎨 Estilos

El proyecto usa **Bootstrap 5** + **Font Awesome** cargados desde CDN en `index.html`.

Puedes agregar estilos personalizados en:
- `src/App.css` - Estilos globales
- `src/index.css` - Estilos base
- Inline en componentes con `className`

---

## 🔒 Seguridad

### **Implementado:**
- ✅ Tokens de autenticación en sesiones
- ✅ Prepared Statements en SQL (previene SQL Injection)
- ✅ Password hashing con `password_hash()`
- ✅ Sanitización de datos de entrada
- ✅ Validación en frontend y backend
- ✅ Headers CORS configurados

### **Recomendaciones:**
- 🔐 Usar HTTPS en producción
- 🔐 Implementar rate limiting
- 🔐 Agregar CSRF tokens
- 🔐 Configurar CSP headers

---

## 📊 Base de Datos

### **Tablas Principales:**
- `usuarios` - Información de usuarios
- `sessions` - Tokens de autenticación
- `productos` - Productos del menú
- `categorias` - Categorías de productos
- `ordenes` - Órdenes de clientes
- `orden_detalles` - Detalles de cada orden
- `mesas` - Mesas del restaurante
- `reservaciones` - Reservas de mesas

### **Roles de Usuario:**
- `cliente` - Usuario normal
- `empleado` - Personal del restaurante
- `admin` - Administrador completo

---

## 🐛 Solución de Problemas

### **El dropdown del navbar no funciona**
**Solución**: Verifica que Bootstrap JS esté cargado en `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### **Error de CORS al llamar a la API**
**Solución**: Verifica que los headers CORS estén en cada archivo PHP:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### **Token inválido o expirado**
**Solución**: 
1. Cierra sesión
2. Limpia `localStorage` en DevTools (F12 → Application → Local Storage)
3. Inicia sesión nuevamente

### **Errores de base de datos**
**Solución**:
1. Verifica que Apache y MySQL estén corriendo en XAMPP
2. Revisa la configuración en `includes/db.php`
3. Asegúrate de haber importado los archivos SQL

---

## 📚 Recursos y Documentación

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Bootstrap 5](https://getbootstrap.com)
- [Font Awesome](https://fontawesome.com)

---

## ✅ Checklist de Migración

- [x] Componentes React creados (Login, Register, Navbar)
- [x] Sistema de autenticación con API
- [x] Página de Perfil
- [x] Página de Configuración
- [x] Rutas protegidas
- [ ] Página de Menú con productos
- [ ] Carrito de compras
- [ ] Sistema de órdenes
- [ ] Dashboard administrativo
- [ ] Sistema de reservaciones

---

## 👥 Usuarios de Prueba

Después de importar `sql/database.sql`, puedes usar:

**Admin:**
- Email: `admin@restaurante.com`
- Password: `password` (cambiar después del login)

---

## 🎯 Próximos Pasos

1. **Completar funcionalidades del Menú**
   - Mostrar productos con filtros
   - Agregar al carrito
   
2. **Implementar Carrito de Compras**
   - Ver productos agregados
   - Modificar cantidades
   - Proceder al checkout

3. **Sistema de Órdenes**
   - Crear orden
   - Tracking de estado
   - Historial

4. **Panel Administrativo**
   - Gestión de productos
   - Gestión de usuarios
   - Reportes y estadísticas

---

## 📝 Notas Importantes

- ⚠️ **NO uses los archivos PHP del root** (index.php, login.php, etc.) - Son legacy
- ✅ **USA solo la aplicación React** en `http://localhost:3000`
- ✅ **La API PHP** en `api/` sigue siendo necesaria para el backend
- ⚠️ Los archivos PHP legacy se pueden eliminar o mover a una carpeta `legacy/`

---

¿Tienes preguntas? Revisa el código o consulta la documentación de React y Vite. 🚀

