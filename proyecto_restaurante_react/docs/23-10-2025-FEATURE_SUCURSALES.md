# Feature: Sistema de Sucursales

**Fecha de implementación:** 23 de Octubre de 2025  
**Autor:** Sistema de Gestión de Restaurante  
**Versión:** 1.0.0

## 📋 Descripción

Se ha implementado un sistema completo de gestión y visualización de sucursales para el restaurante "Sabor & Tradición". Los usuarios pueden visualizar todas las sucursales disponibles con información detallada sobre ubicación, horarios, servicios y contacto.

## 🎯 Características Principales

### 1. **Base de Datos**
- ✅ Nueva tabla `branches` con estructura completa
- ✅ 5 sucursales ficticias pre-cargadas
- ✅ Campos para información detallada (ubicación, horarios, servicios)
- ✅ Soporte para coordenadas GPS (latitud/longitud)
- ✅ Sistema de sucursal principal

### 2. **API REST**
- ✅ Endpoint para obtener todas las sucursales activas
- ✅ Endpoint para obtener una sucursal específica por ID
- ✅ Soporte CORS completo
- ✅ Manejo de errores robusto
- ✅ Codificación UTF-8 para caracteres especiales

### 3. **Interfaz de Usuario**
- ✅ Página de sucursales responsive
- ✅ Cards con información resumida de cada sucursal
- ✅ Modal con detalles completos
- ✅ Integración con Google Maps
- ✅ Badges visuales para servicios disponibles
- ✅ Diseño moderno con animaciones

### 4. **Navegación**
- ✅ Enlace en el navbar principal
- ✅ Acceso público (no requiere autenticación)
- ✅ Ruta: `/sucursales`

## 📁 Estructura de Archivos

```
proyecto_restaurante_react/
├── database/
│   └── 10-Octubre/
│       └── 23-10-2025-branches.sql         # Script SQL con tabla y datos
├── server/
│   └── api/
│       └── branches.php                     # API REST para sucursales
├── src/
│   ├── pages/
│   │   └── SucursalesPage.tsx              # Página principal de sucursales
│   ├── components/
│   │   └── Navbar.tsx                       # Actualizado con enlace
│   ├── routes/
│   │   └── routes.tsx                       # Actualizado con ruta
│   ├── types.ts                             # Nuevo tipo Sucursal
│   └── config.ts                            # Nuevos endpoints
└── docs/
    └── 23-10-2025-FEATURE_SUCURSALES.md    # Esta documentación
```

## 🗄️ Modelo de Datos

### Tabla `branches`

```sql
CREATE TABLE `branches` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(100) NOT NULL,
  `codigo_postal` VARCHAR(20) DEFAULT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `horario_apertura` TIME NOT NULL DEFAULT '09:00:00',
  `horario_cierre` TIME NOT NULL DEFAULT '22:00:00',
  `dias_operacion` VARCHAR(100) DEFAULT 'Lunes a Domingo',
  `latitud` DECIMAL(10, 8) DEFAULT NULL,
  `longitud` DECIMAL(11, 8) DEFAULT NULL,
  `es_principal` BOOLEAN DEFAULT FALSE,
  `tiene_delivery` BOOLEAN DEFAULT TRUE,
  `tiene_estacionamiento` BOOLEAN DEFAULT FALSE,
  `capacidad_personas` INT(11) DEFAULT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  `fecha_apertura` DATE DEFAULT NULL,
  `gerente` VARCHAR(100) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

### Interface TypeScript

```typescript
export interface Sucursal {
  id: number
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  codigo_postal?: string
  telefono: string
  email?: string
  horario_apertura: string
  horario_cierre: string
  dias_operacion: string
  latitud?: number
  longitud?: number
  es_principal: boolean
  tiene_delivery: boolean
  tiene_estacionamiento: boolean
  capacidad_personas?: number
  imagen?: string
  descripcion?: string
  activo: boolean
  fecha_apertura?: string
  gerente?: string
  fecha_creacion?: string
}
```

## 🌐 API Endpoints

### Obtener todas las sucursales
```
GET /api/branches.php
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Sabor & Tradición - Centro",
      "direccion": "Av. Principal, Edificio Centro Plaza, Local 5",
      "ciudad": "Caracas",
      "estado": "Distrito Capital",
      "telefono": "0212-555-1234",
      "email": "centro@sabortradicion.com",
      "horario_apertura": "09:00",
      "horario_cierre": "23:00",
      "dias_operacion": "Lunes a Domingo",
      "es_principal": true,
      "tiene_delivery": true,
      "tiene_estacionamiento": true,
      ...
    }
  ],
  "total": 5
}
```

### Obtener sucursal específica
```
GET /api/branches.php?id=1
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Sabor & Tradición - Centro",
    ...
  }
}
```

## 📍 Sucursales Pre-cargadas

1. **Sabor & Tradición - Centro** (Principal)
   - Ubicación: Caracas, Distrito Capital
   - Características: Estacionamiento, Delivery, 120 personas

2. **Sabor & Tradición - Las Mercedes**
   - Ubicación: Caracas, Distrito Capital
   - Características: Estacionamiento, Delivery, 80 personas

3. **Sabor & Tradición - Altamira**
   - Ubicación: Caracas, Distrito Capital
   - Características: Delivery, 60 personas

4. **Sabor & Tradición - Valencia**
   - Ubicación: Valencia, Carabobo
   - Características: Estacionamiento, Delivery, 100 personas

5. **Sabor & Tradición - Maracaibo**
   - Ubicación: Maracaibo, Zulia
   - Características: Estacionamiento, Delivery, 90 personas

## 🎨 Características de la UI

### Página Principal (`/sucursales`)

1. **Header**
   - Título con icono
   - Contador de sucursales
   - Badge de sucursal principal disponible

2. **Cards de Sucursales**
   - Imagen destacada
   - Información de contacto
   - Horarios de operación
   - Badges de servicios disponibles
   - Botones de acción (Ver en Mapa, Detalles)
   - Fecha de apertura

3. **Modal de Detalles**
   - Imagen a tamaño completo
   - Descripción detallada
   - Toda la información organizada
   - Integración con Google Maps

4. **Características Visuales**
   - Diseño responsive (mobile-first)
   - Animaciones al hacer hover
   - Bootstrap 5 para layout
   - Font Awesome para iconos
   - Borde especial para sucursal principal

### Integración con Google Maps

- Click en "Ver en Mapa" abre Google Maps en nueva pestaña
- Si existen coordenadas GPS, usa ubicación exacta
- Si no hay coordenadas, busca por dirección

## 🔧 Instalación y Configuración

### 1. Ejecutar Script SQL

```bash
# Conectarse a MySQL
mysql -u root -p

# Seleccionar base de datos
USE nombre_de_tu_base_de_datos;

# Ejecutar script
source database/10-Octubre/23-10-2025-branches.sql;
```

O usar phpMyAdmin:
1. Abrir phpMyAdmin
2. Seleccionar la base de datos
3. Ir a "Importar"
4. Seleccionar el archivo `23-10-2025-branches.sql`
5. Ejecutar

### 2. Verificar Instalación

1. Visitar: `http://localhost/tu-proyecto/server/api/branches.php`
2. Deberías ver un JSON con 5 sucursales

### 3. Acceder a la Página

1. Iniciar el servidor de desarrollo: `npm run dev`
2. Navegar a: `http://localhost:5173/sucursales`

## 📱 Responsive Design

La página de sucursales está optimizada para:
- 📱 Mobile (< 576px): 1 columna
- 📱 Tablet (≥ 576px): 1 columna
- 💻 Desktop (≥ 768px): 2 columnas
- 🖥️ Large Desktop (≥ 992px): 2 columnas

## 🚀 Futuras Mejoras Sugeridas

1. **Panel de Administración**
   - CRUD completo para gestionar sucursales
   - Subir imágenes desde la interfaz
   - Activar/desactivar sucursales

2. **Mapa Interactivo**
   - Integrar Google Maps directamente en la página
   - Mostrar todas las sucursales en un mapa
   - Filtrar por ciudad o estado

3. **Búsqueda y Filtros**
   - Buscar por ciudad
   - Filtrar por servicios (delivery, estacionamiento)
   - Ordenar por distancia

4. **Funcionalidades Adicionales**
   - Reservaciones por sucursal
   - Horarios especiales (festivos)
   - Calificaciones y reseñas por sucursal
   - Comparador de sucursales

## 🐛 Solución de Problemas

### Error: "Tabla branches no existe"
**Solución:** Ejecutar el script SQL `23-10-2025-branches.sql`

### Error: "Cannot read properties of undefined"
**Solución:** Verificar que la API esté respondiendo correctamente

### Las imágenes no cargan
**Solución:** Las imágenes usan URLs de Unsplash. Verificar conexión a internet.

### Error 404 en la ruta /sucursales
**Solución:** Verificar que se haya importado correctamente `SucursalesPage` en `routes.tsx`

## 📚 Referencias

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome Icons](https://fontawesome.com/)
- [Google Maps API](https://developers.google.com/maps)

## ✅ Checklist de Implementación

- [x] Crear tabla `branches` en la base de datos
- [x] Insertar 5 sucursales ficticias
- [x] Crear API endpoint `branches.php`
- [x] Definir tipo TypeScript `Sucursal`
- [x] Actualizar `config.ts` con nuevos endpoints
- [x] Crear página `SucursalesPage.tsx`
- [x] Actualizar `Navbar.tsx` con enlace
- [x] Actualizar `routes.tsx` con nueva ruta
- [x] Integración con Google Maps
- [x] Diseño responsive
- [x] Documentación completa

## 📝 Notas Adicionales

- Todas las sucursales son ficticias
- Las coordenadas GPS son aproximadas para las ciudades mencionadas
- Las imágenes provienen de Unsplash (servicio gratuito de imágenes)
- La funcionalidad es completamente pública (no requiere login)

---

**Última actualización:** 23 de Octubre de 2025  
**Estado:** ✅ Completado

