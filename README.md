# 🍽️ Sistema de Restaurante - Sabor & Tradición

**Una aplicación web moderna para gestión de restaurantes, construida con React + Vite y API PHP.**

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)](https://vitejs.dev)
[![PHP](https://img.shields.io/badge/PHP-8.x-777bb4?logo=php)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1?logo=mysql)](https://www.mysql.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?logo=bootstrap)](https://getbootstrap.com)

---

## 🎯 Descripción

Sistema completo de gestión para restaurantes que permite:
- 👤 **Autenticación de usuarios** (Clientes, Empleados, Administradores)
- 🍕 **Visualización del menú** con productos y categorías
- 🛒 **Carrito de compras** y sistema de órdenes
- 📋 **Gestión administrativa** de productos, usuarios y pedidos
- 📊 **Reportes y estadísticas** para el negocio
- 📱 **Diseño responsive** para móviles y tablets

---

## ✨ Características Principales

### ✅ Ya Implementado

- ✅ **Sistema de autenticación completo**
  - Login y registro de usuarios
  - Sesiones con tokens seguros
  - Gestión de perfiles
  - Cambio de contraseña

- ✅ **Arquitectura Moderna**
  - Single Page Application (SPA) con React
  - API RESTful en PHP
  - Context API para estado global
  - React Router para navegación

- ✅ **Gestión de Usuarios**
  - Página de perfil personalizable
  - Configuración de cuenta
  - Roles (Cliente, Empleado, Admin)

- ✅ **Diseño y UX**
  - Interfaz moderna con Bootstrap 5
  - Responsive design
  - Iconos con Font Awesome
  - Dropdowns funcionales

### 🔜 Por Implementar

- 🔜 Carrito de compras completo
- 🔜 Sistema de órdenes y tracking
- 🔜 Panel administrativo
- 🔜 Sistema de reservaciones
- 🔜 Reportes y estadísticas

---

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐
│   React SPA     │ ←HTTP→  │   API PHP       │
│  (Frontend)     │ JSON    │   (Backend)     │
│  Port: 3000     │         │   XAMPP         │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │   MySQL DB      │
                            │  (Base Datos)   │
                            └─────────────────┘
```

---

## 🛠️ Tecnologías

### Frontend
- **React 19** - Librería UI con Hooks
- **Vite 6** - Build tool ultrarrápido
- **React Router** - Enrutamiento SPA
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconos

### Backend
- **PHP 8.x** - Lenguaje backend
- **MySQL 8.0** - Base de datos
- **Apache** - Servidor web (XAMPP)

### Seguridad
- Password hashing con `password_hash()`
- Prepared Statements (SQL injection protection)
- Tokens de autenticación
- Validación en frontend y backend
- CORS configurado

---

## 📦 Instalación

### Requisitos Previos

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP)
- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/proyecto-restaurante-react.git
cd proyecto-restaurante-react
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Base de Datos

1. Inicia **XAMPP** y activa **Apache** y **MySQL**
2. Abre **phpMyAdmin**: `http://localhost/phpmyadmin`
3. Crea una base de datos: `proyecto_restaurante_react`
4. Importa los archivos SQL en orden:
   - `sql/database.sql` (estructura y datos)
   - `sql/sessions_table.sql` (tabla de sesiones)

### Paso 4: Verificar Configuración

Verifica que puedas acceder a:
- API Test: `http://localhost/codigos-ika XAMPP/proyecto_restaurante_react/api/test.php`

Si ves un mensaje JSON, ¡la API está funcionando! ✅

### Paso 5: Iniciar Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: **http://localhost:3000** 🚀

---

## 🚀 Uso

### Iniciar Servidores

1. **Inicia XAMPP**:
   - Apache ✅
   - MySQL ✅

2. **Inicia React**:
   ```bash
   npm run dev
   ```

3. **Abre el navegador**: `http://localhost:3000`

### Usuarios de Prueba

Después de importar la base de datos, usa:

**Administrador:**
- Email: `admin@restaurante.com`
- Password: `password`

---

## 📁 Estructura del Proyecto

```
proyecto_restaurante_react/
│
├── src/                          # 🎨 Aplicación React
│   ├── components/               # Componentes reutilizables
│   │   ├── Navbar.jsx           # ✅ Menú de navegación
│   │   ├── Login.jsx            # ✅ Formulario de login
│   │   ├── Register.jsx         # ✅ Formulario de registro
│   │   └── ...
│   │
│   ├── pages/                    # Páginas principales
│   │   ├── HomePage.jsx         # ✅ Página de inicio
│   │   ├── MenuPage.jsx         # ✅ Menú del restaurante
│   │   ├── PerfilPage.jsx       # ✅ Perfil del usuario
│   │   └── ConfiguracionPage.jsx # ✅ Configuración
│   │
│   ├── contexts/                 # Contextos de React
│   │   └── AuthContext.jsx      # ✅ Gestión de autenticación
│   │
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Punto de entrada
│   └── config.js                 # Configuración de API
│
├── api/                          # 🔧 API Backend PHP
│   ├── auth/                     # Endpoints de autenticación
│   │   ├── login.php            # ✅ POST: Login
│   │   ├── register.php         # ✅ POST: Registro
│   │   ├── logout.php           # ✅ POST: Logout
│   │   └── me.php               # ✅ GET/PUT/POST: Usuario actual
│   │
│   └── productos.php            # ✅ CRUD productos
│
├── includes/                     # Utilidades PHP
│   ├── db.php                   # ✅ Conexión a DB
│   └── auth.php                 # ✅ Funciones de auth
│
├── sql/                          # Scripts de base de datos
│   ├── database.sql             # ✅ Estructura completa
│   └── sessions_table.sql       # ✅ Tabla de sesiones
│
├── index.html                    # Entrada de React
├── package.json                  # Dependencias npm
├── vite.config.js               # Configuración de Vite
│
├── README.md                    # 📖 Este archivo
├── INSTRUCCIONES_REACT.md       # 📘 Guía detallada de uso
└── ARCHIVOS_LEGACY.md           # 📦 Archivos obsoletos
```

### ⚠️ Archivos Legacy (No Usar)

Los siguientes archivos PHP son **obsoletos** y están **reemplazados por React**:

- ❌ `index.php` → Use `HomePage.jsx`
- ❌ `login.php` → Use `Login.jsx`
- ❌ `registro.php` → Use `Register.jsx`
- ❌ `perfil.php` → Use `PerfilPage.jsx`
- ❌ `configuracion.php` → Use `ConfiguracionPage.jsx`
- ❌ `includes/header.php` → Use `Navbar.jsx`

Ver `ARCHIVOS_LEGACY.md` para más detalles.

---

## 🔐 Autenticación

### Flujo de Autenticación

1. Usuario ingresa credenciales en `Login.jsx`
2. React envía `POST` a `/api/auth/login.php`
3. PHP valida y crea un token de sesión
4. Token se guarda en `localStorage`
5. Peticiones subsecuentes incluyen: `Authorization: Bearer {token}`

### Endpoints de API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login.php` | Iniciar sesión |
| `POST` | `/api/auth/register.php` | Registrar usuario |
| `POST` | `/api/auth/logout.php` | Cerrar sesión |
| `GET` | `/api/auth/me.php` | Obtener usuario actual |
| `PUT` | `/api/auth/me.php` | Actualizar perfil |
| `POST` | `/api/auth/me.php` | Cambiar contraseña |

---

## 🛣️ Rutas de la Aplicación

| Ruta | Componente | Protegida | Descripción |
|------|------------|-----------|-------------|
| `/` | `HomePage` | No | Página principal |
| `/menu` | `MenuPage` | No | Menú del restaurante |
| `/login` | `Login` | No | Iniciar sesión |
| `/register` | `Register` | No | Crear cuenta |
| `/perfil` | `PerfilPage` | ✅ Sí | Perfil del usuario |
| `/configuracion` | `ConfiguracionPage` | ✅ Sí | Configuración de cuenta |
| `/carrito` | _Pendiente_ | ✅ Sí | Carrito de compras |
| `/mis-ordenes` | _Pendiente_ | ✅ Sí | Historial de órdenes |
| `/dashboard` | _Pendiente_ | ✅ Admin | Panel administrativo |

---

## 🧪 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Linter (ESLint)
npm run lint
```

### Variables de Entorno

Edita `src/config.js` para configurar la URL de tu API:

```javascript
const XAMPP_PROJECT_PATH = '/codigos-ika%20XAMPP/proyecto_restaurante_react'
```

---

## 📚 Documentación Adicional

- 📘 [INSTRUCCIONES_REACT.md](INSTRUCCIONES_REACT.md) - Guía completa de uso
- 📦 [ARCHIVOS_LEGACY.md](ARCHIVOS_LEGACY.md) - Archivos obsoletos
- 🔧 [api/README.md](api/README.md) - Documentación de la API

---

## 🐛 Solución de Problemas

### El dropdown no funciona
**Solución**: Verifica que Bootstrap JS esté cargado en `index.html`

### Error de CORS
**Solución**: Los headers CORS deben estar en cada archivo PHP de la API

### Token inválido
**Solución**: Limpia el localStorage y vuelve a iniciar sesión

### Más soluciones: [INSTRUCCIONES_REACT.md](INSTRUCCIONES_REACT.md#solución-de-problemas)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**  
[GitHub](https://github.com/TU_USUARIO) | [Email](mailto:tu@email.com)

---

## ⭐ Agradecimientos

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Bootstrap](https://getbootstrap.com)
- [Font Awesome](https://fontawesome.com)

---

<div align="center">
  <p>Hecho con ❤️ y ☕</p>
  <p>⭐ Si te gustó el proyecto, dale una estrella!</p>
</div>
