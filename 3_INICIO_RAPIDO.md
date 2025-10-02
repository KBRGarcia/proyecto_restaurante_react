# ⚡ Inicio Rápido - Sistema React

## 🎯 ¿Qué hacer primero?

Sigue estos pasos **en orden** para poner en marcha el proyecto.

---

## 📋 Checklist de Inicio

### 1️⃣ Configurar Base de Datos

- [ ] **Iniciar XAMPP**
  - Abrir XAMPP Control Panel
  - Iniciar **Apache** ✅
  - Iniciar **MySQL** ✅

- [ ] **Crear Base de Datos**
  - Ir a: `http://localhost/phpmyadmin`
  - Click en "Nueva" (izquierda)
  - Nombre: `proyecto_restaurante_react`
  - Click en "Crear"

- [ ] **Importar SQL**
  - Seleccionar la base de datos creada
  - Click en pestaña "Importar"
  - Archivo 1: `sql/database.sql` → Ejecutar
  - Archivo 2: `sql/sessions_table.sql` → Ejecutar

### 2️⃣ Instalar Dependencias

```bash
# En la carpeta del proyecto
npm install
```

### 3️⃣ Iniciar Aplicación

```bash
npm run dev
```

### 4️⃣ Abrir en el Navegador

La aplicación se abrirá automáticamente en:
```
http://localhost:3000
```

---

## 🧪 Verificar que Todo Funciona

### ✅ Checklist de Verificación

1. **Backend PHP**
   - Visita: `http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php`
   - Deberías ver: `{"success":true,"message":"API funcionando correctamente"}`

2. **React App**
   - Visita: `http://localhost:3000`
   - Deberías ver: Página de inicio del restaurante

3. **Consola del Navegador** (F12 → Console)
   - Deberías ver: `✅ Bootstrap inicializado correctamente`
   - **NO** deberías ver errores rojos

4. **Navbar**
   - Click en "Iniciar Sesión"
   - Deberías navegar a: `/login` sin recargar la página

5. **Login**
   - Email: `admin@restaurante.com`
   - Password: `password`
   - Deberías ver tu nombre en la esquina superior derecha

6. **Dropdown del Usuario**
   - Click en tu nombre (esquina superior derecha)
   - Deberías ver el menú:
     - 👤 Mi Perfil
     - ⚙️ Configuración
     - 🚪 Cerrar Sesión

---

## 🚦 Puertos Usados

| Servicio | Puerto | URL |
|----------|--------|-----|
| React (Vite) | 3000 | `http://localhost:3000` |
| Apache (XAMPP) | 80 | `http://localhost` |
| MySQL | 3306 | localhost:3306 |
| phpMyAdmin | 80 | `http://localhost/phpmyadmin` |

---

## 🎨 Páginas Disponibles

### Públicas (No requieren login)

| Página | URL | Descripción |
|--------|-----|-------------|
| Inicio | `/` | Página principal |
| Menú | `/menu` | Productos del restaurante |
| Login | `/login` | Iniciar sesión |
| Registro | `/register` | Crear cuenta nueva |

### Protegidas (Requieren login)

| Página | URL | Descripción |
|--------|-----|-------------|
| Perfil | `/perfil` | Ver y editar perfil |
| Configuración | `/configuracion` | Cambiar contraseña, preferencias |
| Carrito | `/carrito` | Carrito de compras (pendiente) |
| Mis Órdenes | `/mis-ordenes` | Historial de pedidos (pendiente) |

### Admin (Requieren rol de administrador)

| Página | URL | Descripción |
|--------|-----|-------------|
| Dashboard | `/dashboard` | Panel administrativo (pendiente) |

---

## 🛠️ Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Revisar código (linter)
npm run lint
```

---

## 🐛 Problemas Comunes

### ❌ Error: `npm: command not found`
**Solución**: Instala [Node.js](https://nodejs.org/)

### ❌ Error: "Conexión rechazada" al API
**Solución**: 
1. Verifica que XAMPP esté corriendo
2. Apache debe estar en verde ✅
3. MySQL debe estar en verde ✅

### ❌ Error: "Token inválido"
**Solución**:
1. Abre DevTools (F12)
2. Application → Local Storage
3. Elimina el item `token`
4. Vuelve a iniciar sesión

### ❌ El dropdown no funciona
**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores de Bootstrap
3. Verifica que veas: `✅ Bootstrap inicializado correctamente`
4. Si no, recarga la página (Ctrl + R)

### ❌ Error: "Failed to fetch"
**Solución**:
1. Verifica la URL de la API en `src/config.js`
2. Debe coincidir con la ruta de tu proyecto en XAMPP
3. Por defecto: `/codigos-ika%20XAMPP/proyecto_restaurante_react`

---

## 📱 Probar en Móvil

1. Encuentra tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Buscar "IPv4"
   # Ejemplo: 192.168.1.100
   ```

2. En tu móvil, visita:
   ```
   http://TU_IP:3000
   ```

3. Asegúrate de estar en la **misma red WiFi**

---

## 🎓 Siguientes Pasos

Una vez que todo funcione:

1. **Explora el código**
   - Lee `src/App.jsx` para entender las rutas
   - Revisa `src/components/Navbar.jsx` para ver cómo funciona el menú
   - Estudia `src/contexts/AuthContext.jsx` para entender la autenticación

2. **Personaliza el proyecto**
   - Cambia colores en `src/App.css`
   - Agrega tu logo en `public/`
   - Modifica el nombre en `src/config.js`

3. **Aprende más**
   - Lee [INSTRUCCIONES_REACT.md](INSTRUCCIONES_REACT.md) para documentación completa
   - Revisa [README.md](README.md) para información del proyecto
   - Consulta [ARCHIVOS_LEGACY.md](ARCHIVOS_LEGACY.md) para saber qué archivos NO usar

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa la documentación**
   - [INSTRUCCIONES_REACT.md](INSTRUCCIONES_REACT.md) - Guía completa
   - [README.md](README.md) - Información general
   - [ARCHIVOS_LEGACY.md](ARCHIVOS_LEGACY.md) - Archivos obsoletos

2. **Busca en el código**
   - Los componentes React están bien comentados
   - Usa Ctrl+F para buscar funciones específicas

3. **Depura con la consola**
   - F12 → Console: Ver mensajes de JavaScript
   - F12 → Network: Ver peticiones al servidor
   - F12 → Application → Local Storage: Ver el token guardado

---

## ✅ Todo Listo?

Si completaste todos los pasos y todo funciona:

- ✅ XAMPP corriendo (Apache + MySQL)
- ✅ Base de datos importada
- ✅ `npm install` ejecutado
- ✅ `npm run dev` corriendo
- ✅ Puedes ver la página en `http://localhost:3000`
- ✅ Puedes iniciar sesión
- ✅ El dropdown funciona

**¡Felicidades! 🎉 Tu aplicación React está funcionando correctamente.**

---

## 🚀 Desarrollo Productivo

Para trabajar eficientemente:

1. **Mantén dos consolas abiertas**:
   - Consola 1: `npm run dev` (no la cierres)
   - Consola 2: Para ejecutar otros comandos

2. **Usa Hot Reload**:
   - Guarda cualquier archivo en `src/`
   - La página se actualiza automáticamente
   - NO necesitas recargar manualmente

3. **Revisa los cambios inmediatamente**:
   - Edita un componente
   - Guarda (Ctrl+S)
   - Mira el navegador actualizarse solo

---

<div align="center">
  <p><strong>¿Todo funcionando?</strong></p>
  <p>🎉 ¡Comienza a desarrollar! 🚀</p>
  <br>
  <p>📚 Lee <a href="INSTRUCCIONES_REACT.md">INSTRUCCIONES_REACT.md</a> para más detalles</p>
</div>

