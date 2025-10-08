# 📚 Documentación del Proyecto - Sistema de Restaurante

Bienvenido a la documentación completa del **Sistema de Gestión de Restaurante** construido con React + TypeScript + Vite y API PHP.

---

## 📋 Índice de Documentación

### 🏠 Documentación Principal
- **[README.md del Proyecto](../README.md)** - Descripción general, instalación y uso

### 📖 Guías Técnicas

| Documento | Descripción | Fecha |
|-----------|-------------|-------|
| [**04-10-2025-GUIA_TYPESCRIPT.md**](04-10-2025-GUIA_TYPESCRIPT.md) | Guía completa de uso de TypeScript en el proyecto | 04/10/2025 |
| [**04-10-2025-ARQUITECTURA_RUTAS.md**](04-10-2025-ARQUITECTURA_RUTAS.md) | Arquitectura y manejo centralizado de rutas | 04/10/2025 |

### 🎯 Funcionalidades Implementadas

| Documento | Descripción | Fecha |
|-----------|-------------|-------|
| [**04-10-2025-FEATURE_ORDENES.md**](04-10-2025-FEATURE_ORDENES.md) | Sistema completo de órdenes e historial | 04/10/2025 |
| [**04-10-2025-FEATURE_PAGOS.md**](04-10-2025-FEATURE_PAGOS.md) | Pasarela de pago con múltiples métodos | 04/10/2025 |

### 📜 Registro de Cambios

| Documento | Descripción | Fecha |
|-----------|-------------|-------|
| [**04-10-2025-HISTORIAL_CAMBIOS.md**](04-10-2025-HISTORIAL_CAMBIOS.md) | Historial consolidado de todos los cambios del proyecto | 04/10/2025 |

---

## 🎯 Inicio Rápido

Si es tu primera vez con este proyecto:

1. **Lee primero**: [README.md del Proyecto](../README.md)
2. **Instalación**: Sigue los pasos en el README principal
3. **TypeScript**: Consulta [04-10-2025-GUIA_TYPESCRIPT.md](04-10-2025-GUIA_TYPESCRIPT.md)
4. **Rutas**: Entiende la arquitectura en [04-10-2025-ARQUITECTURA_RUTAS.md](04-10-2025-ARQUITECTURA_RUTAS.md)

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (React + TypeScript)         │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │   Components │  │    Pages    │             │
│  └─────────────┘  └─────────────┘             │
│         │                │                      │
│         └────────┬───────┘                      │
│                  │                              │
│         ┌────────▼────────┐                     │
│         │   Contexts      │                     │
│         │  (Auth, Cart)   │                     │
│         └────────┬────────┘                     │
│                  │                              │
│         ┌────────▼────────┐                     │
│         │  Router + Rutas │                     │
│         └────────┬────────┘                     │
└──────────────────┼──────────────────────────────┘
                   │ HTTP/JSON
         ┌─────────▼─────────┐
         │   API PHP (REST)  │
         │                   │
         │  ┌─────────────┐  │
         │  │  Endpoints  │  │
         │  └─────────────┘  │
         │         │          │
         └─────────┼──────────┘
                   │
         ┌─────────▼─────────┐
         │   MySQL Database  │
         └───────────────────┘
```

---

## 🔧 Stack Tecnológico

### Frontend
- **React 19** con Hooks
- **TypeScript 5.8** para type safety
- **Vite 7** como build tool
- **React Router v7** para navegación
- **Bootstrap 5** para estilos
- **Font Awesome** para iconos

### Backend
- **PHP 8.x** para la API REST
- **MySQL 8.0** como base de datos
- **Apache** (XAMPP) como servidor web

### Herramientas
- **ESLint 9** para linting
- **Git** para control de versiones

---

## 📁 Estructura de Carpetas

```
proyecto_restaurante_react/
├── docs/                           # 📚 Esta carpeta
│   ├── README.md                   # Índice de documentación
│   ├── 04-10-2025-HISTORIAL_CAMBIOS.md
│   ├── 04-10-2025-GUIA_TYPESCRIPT.md
│   ├── 04-10-2025-ARQUITECTURA_RUTAS.md
│   ├── 04-10-2025-FEATURE_ORDENES.md
│   └── 04-10-2025-FEATURE_PAGOS.md
│
├── src/                            # Código fuente React
│   ├── components/                 # Componentes reutilizables
│   ├── pages/                      # Páginas/Vistas
│   ├── contexts/                   # Context API (Auth, Cart)
│   ├── routes/                     # Configuración de rutas
│   ├── types.ts                    # Tipos TypeScript
│   ├── config.ts                   # Configuración
│   ├── App.tsx                     # Componente raíz
│   └── main.tsx                    # Punto de entrada
│
├── server/                         # Backend PHP (legacy)
│   ├── api/                        # API REST endpoints
│   ├── includes/                   # Utilidades PHP
│   └── pages/                      # Páginas PHP legacy
│
├── database/                       # Scripts SQL
│
├── public/                         # Archivos estáticos
│
└── README.md                       # Documentación principal
```

---

## 🎓 Convención de Nombres de Documentación

A partir del **4 de octubre de 2025**, todos los archivos de documentación siguen esta convención:

```
dd-mm-aaaa-NOMBRE_DESCRIPTIVO.md
```

**Ejemplos:**
- `04-10-2025-GUIA_TYPESCRIPT.md`
- `04-10-2025-FEATURE_ORDENES.md`
- `04-10-2025-HISTORIAL_CAMBIOS.md`

**Excepciones:**
- `README.md` - Archivo índice (sin fecha)

**Criterios para crear documentación:**
- ✅ Solo para cambios **importantes** del proyecto
- ✅ Funcionalidades nuevas completas
- ✅ Migraciones o refactorizaciones mayores
- ✅ Guías técnicas relevantes
- ❌ No crear un .md para cada pequeño cambio

---

## 📖 Guía de Lectura por Perfil

### 👨‍💻 Para Desarrolladores Nuevos

1. **Instalación y Setup**
   - [README.md del Proyecto](../README.md)
   
2. **Entender TypeScript**
   - [04-10-2025-GUIA_TYPESCRIPT.md](04-10-2025-GUIA_TYPESCRIPT.md)
   
3. **Arquitectura de Rutas**
   - [04-10-2025-ARQUITECTURA_RUTAS.md](04-10-2025-ARQUITECTURA_RUTAS.md)

4. **Historial de Cambios**
   - [04-10-2025-HISTORIAL_CAMBIOS.md](04-10-2025-HISTORIAL_CAMBIOS.md)

### 🎨 Para Diseñadores/Frontend

1. **Componentes y Páginas**
   - Ver: `src/components/` y `src/pages/`
   
2. **Sistema de Órdenes**
   - [04-10-2025-FEATURE_ORDENES.md](04-10-2025-FEATURE_ORDENES.md)
   
3. **Pasarela de Pago**
   - [04-10-2025-FEATURE_PAGOS.md](04-10-2025-FEATURE_PAGOS.md)

### 🔧 Para DevOps/Backend

1. **API REST**
   - Ver: `server/api/README.md`
   
2. **Base de Datos**
   - Ver: `database/database.sql`
   
3. **Configuración**
   - Ver: `server/includes/db.php`

---

## 🚀 Funcionalidades Principales

### ✅ Implementadas

- ✅ **Autenticación completa** (Login, registro, sesiones)
- ✅ **Gestión de usuarios** (Perfil, configuración, foto de perfil)
- ✅ **Menú de productos** (Visualización, filtros, búsqueda)
- ✅ **Carrito de compras** (Agregar, modificar, eliminar)
- ✅ **Sistema de pagos** (Tarjeta, PayPal, Zinli, Zelle)
- ✅ **Historial de órdenes** (Ver, filtrar, detalles)
- ✅ **Rutas protegidas** (Por autenticación y rol)
- ✅ **Lazy loading** (Optimización de carga)
- ✅ **Responsive design** (Mobile, tablet, desktop)

### 🔜 Por Implementar

- 🔜 **Dashboard administrativo**
- 🔜 **Reportes y estadísticas**
- 🔜 **Notificaciones en tiempo real**
- 🔜 **Chat de soporte**

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Preview del build
npm run preview
```

---

## 📞 Recursos Adicionales

### Documentación Oficial

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Bootstrap](https://getbootstrap.com/)

### Tutoriales Recomendados

- [React + TypeScript](https://react.dev/learn/typescript)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contribuir a la Documentación

Si agregas una funcionalidad importante o realizas un cambio significativo:

1. **Crea un nuevo archivo** siguiendo la convención: `dd-mm-aaaa-NOMBRE.md`
2. **Documenta detalladamente**:
   - ¿Qué se implementó?
   - ¿Por qué se hizo así?
   - ¿Cómo se usa?
   - Ejemplos de código
3. **Actualiza este README.md** agregando el link al nuevo documento
4. **Actualiza el HISTORIAL_CAMBIOS.md** con un resumen

---

## 📝 Notas Importantes

### Archivos Legacy

El proyecto tiene archivos PHP legacy en `server/pages/` que **NO deben usarse**. Todo el frontend ahora es React. Ver [04-10-2025-HISTORIAL_CAMBIOS.md](04-10-2025-HISTORIAL_CAMBIOS.md) para detalles.

### TypeScript Estricto

El proyecto usa TypeScript en modo estricto. Todos los componentes y funciones deben estar correctamente tipados. Consultar [04-10-2025-GUIA_TYPESCRIPT.md](04-10-2025-GUIA_TYPESCRIPT.md).

### Convención de Código

- **Componentes**: PascalCase (e.g., `HomePage.tsx`)
- **Archivos de utilidad**: camelCase (e.g., `config.ts`)
- **Tipos**: PascalCase (e.g., `type Usuario`)
- **Interfaces**: PascalCase con prefijo (e.g., `interface AuthContextType`)

---

## ✨ Estado del Proyecto

**Versión:** 2.0.0  
**Última actualización:** 04 de octubre de 2025  
**Estado:** ✅ En desarrollo activo  
**Migración a TypeScript:** ✅ Completada  
**Lazy Loading:** ✅ Funcional  
**Arquitectura de Rutas:** ✅ Centralizada

---

<div align="center">
  <p><strong>¿Tienes dudas?</strong></p>
  <p>Consulta la documentación específica o revisa el código fuente</p>
  <br>
  <p>Hecho con ❤️ y TypeScript</p>
</div>
