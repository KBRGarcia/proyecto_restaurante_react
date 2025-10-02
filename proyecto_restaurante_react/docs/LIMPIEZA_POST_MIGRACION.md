# 🧹 Limpieza Post-Migración

## Archivos que Puedes Eliminar Ahora

Una vez que hayas verificado que todo funciona correctamente con TypeScript, puedes eliminar los siguientes archivos:

### 1. **Carpeta Anidada (Proyecto Duplicado)**

```bash
# Eliminar toda la carpeta anidada que Vite creó
Remove-Item -Recurse -Force "proyecto_restaurante_react"
```

Esta carpeta contiene el proyecto scaffold que Vite generó, pero ya migramos todo al proyecto principal.

---

### 2. **Archivos .jsx Antiguos**

Estos archivos fueron migrados a `.tsx`:

```bash
# Navegue al directorio src
cd src

# Eliminar archivos .jsx (SOLO después de verificar que todo funciona)
Remove-Item main.jsx -ErrorAction SilentlyContinue
Remove-Item App.jsx -ErrorAction SilentlyContinue

# Components
cd components
Remove-Item Navbar.jsx -ErrorAction SilentlyContinue
Remove-Item Login.jsx -ErrorAction SilentlyContinue
Remove-Item Register.jsx -ErrorAction SilentlyContinue
Remove-Item ProtectedRoute.jsx -ErrorAction SilentlyContinue
Remove-Item ProductCard.jsx -ErrorAction SilentlyContinue
Remove-Item FilterBar.jsx -ErrorAction SilentlyContinue
Remove-Item LoadingSpinner.jsx -ErrorAction SilentlyContinue
Remove-Item ErrorMessage.jsx -ErrorAction SilentlyContinue

# Contexts
cd ..\contexts
Remove-Item AuthContext.jsx -ErrorAction SilentlyContinue

# Pages
cd ..\pages
Remove-Item HomePage.jsx -ErrorAction SilentlyContinue
Remove-Item MenuPage.jsx -ErrorAction SilentlyContinue

# Volver a raíz
cd ..\..\..\
```

---

### 3. **vite.config.js (Antiguo)**

```bash
Remove-Item vite.config.js -ErrorAction SilentlyContinue
```

Ahora usamos `vite.config.ts` (TypeScript).

---

### 4. **Archivos Markdown Obsoletos** (Opcionales)

Si ya no los necesitas:

```bash
# Eliminar archivos de documentación antiguos
Remove-Item EJECUTAR_SERVIDOR_NPM.md -ErrorAction SilentlyContinue
Remove-Item README_MEJORAS.md -ErrorAction SilentlyContinue
Remove-Item RESUMEN_SISTEMA_AUTH.md -ErrorAction SilentlyContinue
```

**Nota:** Estos archivos ya aparecen como `deleted` en git según el git status.

---

## ✅ Checklist de Verificación ANTES de Eliminar

**NO elimines nada hasta que hayas:**

- [ ] Ejecutado `npm run dev` y verificado que la app funciona
- [ ] Probado login/registro en el navegador
- [ ] Navegado por todas las páginas sin errores
- [ ] Verificado que no hay errores de TypeScript: `npm run build`
- [ ] Verificado que la API PHP se conecta correctamente
- [ ] Probado el sistema de autenticación completo

---

## 📦 Script Automatizado de Limpieza

Si todo funciona correctamente, puedes ejecutar este script en PowerShell:

```powershell
# ADVERTENCIA: Solo ejecutar después de verificar que todo funciona

# Eliminar carpeta anidada
Write-Host "Eliminando carpeta anidada..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "proyecto_restaurante_react" -ErrorAction SilentlyContinue

# Eliminar archivos .jsx antiguos
Write-Host "Eliminando archivos .jsx antiguos..." -ForegroundColor Yellow
Get-ChildItem -Path "src" -Recurse -Filter "*.jsx" | Remove-Item -Force

# Eliminar vite.config.js antiguo
Write-Host "Eliminando vite.config.js..." -ForegroundColor Yellow
Remove-Item "vite.config.js" -ErrorAction SilentlyContinue

Write-Host "Limpieza completada!" -ForegroundColor Green
Write-Host "Archivos eliminados:" -ForegroundColor Cyan
Write-Host "  - proyecto_restaurante_react/ (carpeta anidada)"
Write-Host "  - src/**/*.jsx (archivos JavaScript antiguos)"
Write-Host "  - vite.config.js"
```

**Para ejecutar:**
1. Guarda esto en un archivo `limpieza.ps1`
2. Ejecuta: `.\limpieza.ps1`

---

## 🔄 Actualizar Git

Después de limpiar, actualiza tu repositorio:

```bash
# Ver qué archivos fueron eliminados
git status

# Agregar todos los cambios (nuevos .tsx y eliminados .jsx)
git add .

# Commit
git commit -m "Migración a TypeScript: Vite 7 + React 19 + TS 5.8"

# Ver diferencias
git log --oneline -5
```

---

## 📊 Comparación Antes/Después

### Antes (JavaScript)
```
src/
├── main.jsx              # 226 bytes
├── App.jsx               # 2.1 KB
├── config.js             # 1.2 KB
├── components/           # 8 archivos .jsx
├── contexts/             # 1 archivo .jsx
└── pages/                # 4 archivos .jsx
```

### Después (TypeScript)
```
src/
├── main.tsx              # 250 bytes  (+type safety)
├── App.tsx               # 2.2 KB    (+type safety)
├── config.ts             # 1.3 KB    (+type safety)
├── types.ts              # 3.8 KB    (🆕 tipos globales)
├── vite-env.d.ts         # 39 bytes  (🆕 tipos de Vite)
├── components/           # 8 archivos .tsx ✅
├── contexts/             # 1 archivo .tsx ✅
└── pages/                # 4 archivos .tsx ✅
```

**Beneficios:**
- ✅ Type safety en todo el proyecto
- ✅ Mejor IntelliSense
- ✅ Detección de errores en desarrollo
- ✅ Código más mantenible
- ✅ Documentación automática con tipos

---

## ⚠️ Advertencias Importantes

### 1. **NO elimines archivos PHP**

Los archivos PHP del backend **NO** deben eliminarse:
- `api/` - Mantener
- `includes/` - Mantener
- `sql/` - Mantener
- `*.php` - Mantener

### 2. **NO elimines node_modules**

Nunca elimines `node_modules/`. Si necesitas reinstalar:
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

### 3. **Backup antes de eliminar**

Si tienes dudas, crea un backup:
```bash
# Crear branch de backup en git
git checkout -b backup-pre-limpieza
git add .
git commit -m "Backup antes de limpiar archivos .jsx"

# Volver a main
git checkout main
```

---

## 🎯 Resultado Final Esperado

Después de la limpieza, tu estructura debe verse así:

```
proyecto_restaurante_react/
├── api/                       # ✅ Backend PHP
├── css/                       # ✅ Estilos globales
├── includes/                  # ✅ Utilidades PHP
├── js/                        # ✅ Scripts vanilla JS (para PHP pages)
├── sql/                       # ✅ Base de datos
├── src/                       # ✅ React + TypeScript
│   ├── components/            # ✅ Solo .tsx
│   ├── contexts/              # ✅ Solo .tsx
│   ├── pages/                 # ✅ Solo .tsx
│   ├── main.tsx               # ✅ TypeScript
│   ├── App.tsx                # ✅ TypeScript
│   ├── config.ts              # ✅ TypeScript
│   ├── types.ts               # ✅ Tipos globales
│   └── vite-env.d.ts          # ✅ Tipos de Vite
├── *.php                      # ✅ Páginas PHP legacy
├── index.html                 # ✅ HTML principal
├── vite.config.ts             # ✅ Config TypeScript
├── tsconfig.json              # ✅ Config TS
├── tsconfig.app.json          # ✅ Config TS app
├── tsconfig.node.json         # ✅ Config TS node
├── eslint.config.js           # ✅ ESLint moderno
├── package.json               # ✅ Dependencias
└── package-lock.json          # ✅ Lock file
```

**NO debe haber:**
- ❌ `proyecto_restaurante_react/proyecto_restaurante_react/` (carpeta anidada)
- ❌ Archivos `.jsx` en `src/`
- ❌ `vite.config.js` (usar `.ts`)

---

## 📝 Registro de Cambios para Git

Cuando hagas commit, documenta los cambios:

```
Migración completa a TypeScript

- Actualizado a Vite 7.1.8
- Actualizado a TypeScript 5.8.3
- Migrados todos los componentes .jsx → .tsx
- Migradas todas las páginas .jsx → .tsx
- Creado sistema de tipos en types.ts
- Configurado ESLint 9 con TypeScript
- Actualizado vite.config.js → vite.config.ts
- Eliminados archivos .jsx obsoletos
- Eliminada carpeta anidada de Vite scaffold

Archivos migrados:
- src/main.tsx
- src/App.tsx
- src/config.ts
- src/contexts/AuthContext.tsx
- src/components/*.tsx (8 componentes)
- src/pages/*.tsx (2 páginas)

Archivos nuevos:
- src/types.ts (tipos globales)
- src/vite-env.d.ts (tipos de Vite)
- tsconfig.json, tsconfig.app.json, tsconfig.node.json
- eslint.config.js
- MIGRACION_TYPESCRIPT.md
- GUIA_USO_TYPESCRIPT.md
- LIMPIEZA_POST_MIGRACION.md
```

---

**¡Listo! Tu proyecto ahora está 100% en TypeScript y optimizado con Vite 7! 🚀**

