# 🍽️ Sistema de Restaurante - Sabor & Tradición

Un sistema completo de gestión de restaurante desarrollado con PHP, MySQL, Bootstrap y **React**.

## 🚀 Características Principales

### ✅ Ya Implementado
- ✅ **Sistema de autenticación** completo (Login/Register/Logout)
- ✅ **React Router** para navegación SPA
- ✅ **Context API** para gestión de estado global
- ✅ **Rutas protegidas** por autenticación y roles
- ✅ **Menú de productos** con filtros por categoría
- ✅ **API REST** en PHP con tokens de sesión
- ✅ **Navbar dinámico** según estado de usuario
- ✅ **Diseño responsive** moderno con Bootstrap 5

### 🔜 Por Implementar
- 🔜 **Carrito de compras** completo
- 🔜 **Sistema de órdenes** y historial
- 🔜 **Dashboard administrativo** React
- 🔜 **Gestión de productos** (CRUD)

## 🛠️ Tecnologías

- **Backend:** PHP 8.x, MySQL
- **Frontend:** HTML5, CSS3, JavaScript ES6+, Bootstrap 5, **React 19**
- **Build Tools:** Vite 6.x (bundler ultrarrápido)
- **Seguridad:** Prepared Statements, Password Hashing, Validaciones

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/proyecto-restaurante.git
   ```

2. **Configurar base de datos:**
   - Importar `sql/database.sql` en MySQL
   - Configurar conexión en `includes/db.php`

3. **Instalar dependencias Node (para React):**
   ```bash
   npm install
   ```

4. **Crear tabla de sesiones en MySQL:**
   - Abre phpMyAdmin (`http://localhost/phpmyadmin`)
   - Selecciona `restaurante_db`
   - Ejecuta el SQL de `sql/sessions_table.sql`

5. **Iniciar servidor de desarrollo React:**
   ```bash
   npm run dev
   ```

6. **Abrir la aplicación:**
   - React App: `http://localhost:3000`
   - Backend PHP: Tu servidor XAMPP

7. **Usuarios de prueba:**
   - **Admin:** admin@restaurante.com / password
   - **Cliente:** Crea tu cuenta en `/register`

## 📁 Estructura del Proyecto

```
proyecto_restaurante/
├── src/                      # 🆕 Código fuente React
│   ├── main.jsx             # Punto de entrada React
│   ├── App.jsx              # Componente principal
│   └── *.css                # Estilos React
├── api/                      # 🆕 APIs REST para React
│   └── productos.php        # Endpoint de ejemplo
├── css/styles.css           # Estilos personalizados
├── js/scripts.js            # JavaScript interactivo
├── includes/                # Archivos de configuración PHP
├── sql/database.sql         # Base de datos
├── *.php                    # Páginas principales PHP
├── vite.config.js           # 🆕 Configuración Vite
├── package.json             # 🆕 Dependencias Node
└── GUIA_REACT_INTEGRACION.md # 🆕 Guía de integración React
```

## 📱 Rutas de la Aplicación React

### Rutas Públicas (No requieren login)
- **`/`** - Página de inicio (Landing page)
- **`/menu`** - Menú de productos con filtros
- **`/login`** - Iniciar sesión
- **`/register`** - Crear cuenta

### Rutas Protegidas (Requieren autenticación)
- **`/carrito`** - Carrito de compras (en desarrollo)
- **`/mis-ordenes`** - Historial de órdenes (en desarrollo)
- **`/perfil`** - Perfil de usuario (en desarrollo)

### Rutas Admin (Solo rol admin)
- **`/dashboard`** - Panel administrativo (en desarrollo)

### Versión PHP Tradicional (Aún disponible)
- `index.php`, `menu.php`, `login.php`, `dashboard.php`, etc.

## 🎯 Comandos Disponibles

```bash
# Desarrollo React
npm run dev        # Inicia servidor Vite en http://localhost:3000

# Compilar para producción
npm run build      # Genera archivos optimizados en /dist

# Vista previa de producción
npm run preview    # Previsualiza el build de producción
```

## 🎯 Inicio Rápido

### Para empezar con el sistema de autenticación:

1. **Lee primero:** 📄 **`EMPEZAR_AQUI.md`** ⭐
2. Ejecuta: `npm install react-router-dom`
3. Crea la tabla `sessions` en MySQL
4. Ejecuta: `npm run dev`
5. Abre: `http://localhost:3000`

### Documentación completa:
- **`EMPEZAR_AQUI.md`** - ⭐ Inicio rápido de autenticación
- **`INSTRUCCIONES_IMPLEMENTACION.md`** - Guía paso a paso
- **`GUIA_IMPLEMENTACION_COMPLETA.md`** - Arquitectura completa

## 🔧 Solución de Problemas

### ❌ Error: "ECONNREFUSED"
**Solución:** Lee `SIGUE_ESTOS_PASOS.md`

### ❌ Error: "Cannot find module 'react-router-dom'"
**Solución:** `npm install react-router-dom`

### ❌ Error: "Table 'sessions' doesn't exist"
**Solución:** Ejecuta `sql/sessions_table.sql` en phpMyAdmin

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

Para más información detallada, consulta [README_MEJORAS.md](README_MEJORAS.md)
