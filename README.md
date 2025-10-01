# 🍽️ Sistema de Restaurante - Sabor & Tradición

Un sistema completo de gestión de restaurante desarrollado con PHP, MySQL, Bootstrap y **React**.

## 🚀 Características Principales

- ✅ **Sistema de usuarios** con 3 niveles (Admin, Empleado, Cliente)
- ✅ **Menú interactivo** con carrito de compras
- ✅ **Dashboard administrativo** con estadísticas
- ✅ **Integración React + PHP** para interfaces modernas
- ✅ **Diseño responsive** moderno
- ✅ **Sistema de seguridad** robusto
- ✅ **Base de datos** normalizada

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

4. **Iniciar servidor de desarrollo React:**
   ```bash
   npm run dev
   ```
   - Abre `http://localhost:3000` para React standalone
   - O integra en páginas PHP (ver `GUIA_REACT_INTEGRACION.md`)

5. **Usuario por defecto:**
   - **Email:** admin@restaurante.com
   - **Password:** password

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

## 📱 Páginas Disponibles

### Versión PHP Tradicional
- **🏠 Inicio** - Landing page moderna (`index.php`)
- **📖 Menú** - Catálogo de productos con filtros (`menu.php`)
- **🔐 Login/Registro** - Autenticación de usuarios (`login.php`, `registro.php`)
- **📊 Dashboard** - Panel administrativo (`dashboard.php`)

### Versión React (Nueva)
- **⚛️ React App** - `http://localhost:3000` (modo desarrollo)
- **🔌 React + PHP** - Ver `ejemplo_integracion.php`

## 🎯 Comandos Disponibles

```bash
# Desarrollo React
npm run dev        # Inicia servidor Vite en http://localhost:3000

# Compilar para producción
npm run build      # Genera archivos optimizados en /dist

# Vista previa de producción
npm run preview    # Previsualiza el build de producción
```

## 🔧 Solución de Problemas

### ❌ Error: "ECONNREFUSED" o "Error de conexión con el servidor"

**Solución rápida:**
1. Asegúrate que Apache y MySQL estén corriendo en XAMPP
2. Prueba la API: `http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php`
3. Lee: **`SIGUE_ESTOS_PASOS.md`** para solución paso a paso

**Documentación completa:**
- `SIGUE_ESTOS_PASOS.md` - Solución paso a paso
- `COMO_RESOLVER_ERROR.md` - Guía detallada de errores
- `SOLUCION_ERROR_CONEXION.md` - Troubleshooting avanzado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

Para más información detallada, consulta [README_MEJORAS.md](README_MEJORAS.md)
