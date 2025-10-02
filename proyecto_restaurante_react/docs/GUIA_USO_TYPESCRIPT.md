# 📘 Guía de Uso - Proyecto con TypeScript

## 🎯 Comandos Principales

### Iniciar Desarrollo
```bash
npm run dev
```
- Inicia Vite en modo desarrollo
- Abre tu navegador en `http://localhost:3000`
- Recarga automática al guardar cambios

### Compilar para Producción
```bash
npm run build
```
- Verifica tipos con TypeScript
- Compila y optimiza la aplicación
- Genera archivos en la carpeta `/dist`

### Previsualizar Build de Producción
```bash
npm run preview
```
- Sirve la versión compilada localmente
- Útil para probar antes de deployment

### Linting de Código
```bash
npm run lint
```
- Revisa el código con ESLint
- Detecta errores de estilo y patrones

---

## 📂 Estructura del Proyecto (TypeScript)

```
proyecto_restaurante_react/
├── src/
│   ├── main.tsx                    # ✅ Punto de entrada (TypeScript)
│   ├── App.tsx                     # ✅ Componente principal
│   ├── vite-env.d.ts               # 🆕 Tipos de Vite
│   ├── types.ts                    # 🆕 Definiciones de tipos globales
│   ├── config.ts                   # ✅ Configuración (ahora tipada)
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── Navbar.tsx              # ✅ Barra de navegación
│   │   ├── Login.tsx               # ✅ Formulario de login
│   │   ├── Register.tsx            # ✅ Formulario de registro
│   │   ├── ProtectedRoute.tsx      # ✅ HOC para rutas protegidas
│   │   ├── ProductCard.tsx         # ✅ Card de producto
│   │   ├── FilterBar.tsx           # ✅ Barra de filtros
│   │   ├── LoadingSpinner.tsx      # ✅ Spinner de carga
│   │   └── ErrorMessage.tsx        # ✅ Mensaje de error
│   │
│   ├── contexts/                   # Contextos de React
│   │   └── AuthContext.tsx         # ✅ Context de autenticación
│   │
│   ├── pages/                      # Páginas/Vistas
│   │   ├── HomePage.tsx            # ✅ Landing page
│   │   ├── MenuPage.tsx            # ✅ Página de menú
│   │   ├── PerfilPage.jsx          # ⚠️ Pendiente migrar
│   │   └── ConfiguracionPage.jsx  # ⚠️ Pendiente migrar
│   │
│   ├── App.css                     # Estilos de la app
│   └── index.css                   # Estilos globales
│
├── api/                            # Backend PHP (REST API)
│   ├── auth/
│   │   ├── login.php               # Login endpoint
│   │   ├── register.php            # Registro endpoint
│   │   ├── logout.php              # Logout endpoint
│   │   └── me.php                  # Usuario actual
│   ├── productos.php               # Productos endpoint
│   └── test.php                    # Test de conexión
│
├── sql/                            # Base de datos
│   ├── database.sql                # Estructura completa
│   └── sessions_table.sql          # Tabla de sesiones
│
├── public/                         # Archivos estáticos
├── dist/                           # Build de producción (generado)
│
├── tsconfig.json                   # 🆕 Config principal de TS
├── tsconfig.app.json               # 🆕 Config de la aplicación
├── tsconfig.node.json              # 🆕 Config de Node
├── vite.config.ts                  # ✅ Config de Vite (TypeScript)
├── eslint.config.js                # 🆕 Config de ESLint 9
├── package.json                    # Dependencias
└── index.html                      # HTML principal
```

---

## 🔷 Cómo Usar TypeScript en el Proyecto

### 1. Importar Tipos

```typescript
// Importar tipos desde types.ts
import type { Usuario, Producto, AuthContextType } from './types.ts'

// Usar en componentes
interface MiComponenteProps {
  usuario: Usuario
  productos: Producto[]
}
```

### 2. Tipar Props de Componentes

```typescript
import type { ProductCardProps } from '../types.ts'

function ProductCard({ producto, onAddToCart }: ProductCardProps) {
  // TypeScript sabe qué propiedades tiene 'producto'
  return <div>{producto.nombre}</div>
}
```

### 3. Tipar Estados (useState)

```typescript
import { useState } from 'react'
import type { Usuario } from '../types.ts'

function MiComponente() {
  // Estado con tipo explícito
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  
  // Estado con tipo inferido
  const [loading, setLoading] = useState(false) // TypeScript infiere boolean
}
```

### 4. Tipar Funciones

```typescript
// Función con tipos en parámetros y retorno
const login = async (correo: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify({ correo, password })
  })
  
  return await response.json()
}
```

### 5. Tipar Eventos

```typescript
import { FormEvent, ChangeEvent } from 'react'

function MiForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ...
  }
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
}
```

### 6. Tipar Respuestas de API

```typescript
import type { ApiResponse, Producto } from '../types.ts'

const fetchProductos = async () => {
  const response = await fetch(API_ENDPOINTS.productos)
  const data: ApiResponse<Producto[]> = await response.json()
  
  if (data.success && data.data) {
    setProductos(data.data) // TypeScript sabe que data es Producto[]
  }
}
```

---

## 🎨 Ejemplo Completo: Crear un Nuevo Componente

### 1. Definir Tipos (en `src/types.ts`)

```typescript
export interface MiComponenteProps {
  titulo: string
  items: string[]
  onItemClick: (item: string) => void
}
```

### 2. Crear el Componente

```typescript
// src/components/MiComponente.tsx
import type { MiComponenteProps } from '../types.ts'

function MiComponente({ titulo, items, onItemClick }: MiComponenteProps) {
  return (
    <div>
      <h2>{titulo}</h2>
      <ul>
        {items.map(item => (
          <li key={item} onClick={() => onItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MiComponente
```

### 3. Usar el Componente

```typescript
// En cualquier otra página/componente
import MiComponente from '../components/MiComponente.tsx'

function OtraPage() {
  const handleClick = (item: string) => {
    console.log('Clicked:', item)
  }
  
  return (
    <MiComponente 
      titulo="Mi Lista"
      items={['Item 1', 'Item 2', 'Item 3']}
      onItemClick={handleClick}
    />
  )
}
```

---

## 🔍 Debugging y Errores Comunes

### Error 1: "Cannot find module 'X' or its corresponding type declarations"

**Solución:** Instalar los tipos:
```bash
npm install --save-dev @types/X
```

### Error 2: "Type 'X' is not assignable to type 'Y'"

**Solución:** Verificar que los tipos coincidan. Ejemplo:
```typescript
// ❌ Error
const rol: RolUsuario = 'superadmin' // No existe en el tipo

// ✅ Correcto
const rol: RolUsuario = 'admin' // 'admin' | 'empleado' | 'cliente'
```

### Error 3: "Object is possibly 'null'"

**Solución:** Usar optional chaining o validar:
```typescript
// ❌ Error
const nombre = usuario.nombre // si usuario puede ser null

// ✅ Correcto
const nombre = usuario?.nombre // optional chaining
// o
if (usuario) {
  const nombre = usuario.nombre
}
```

### Error 4: "Property 'X' does not exist on type 'Y'"

**Solución:** Verificar que la propiedad exista en la interfaz:
```typescript
// Agregar la propiedad en types.ts
export interface Usuario {
  id: number
  nombre: string
  nuevaPropiedad: string // 🆕 Agregar aquí
}
```

---

## 📖 Recursos de Aprendizaje

### TypeScript Básico
- [TypeScript para Principiantes](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Cheatsheet](https://www.typescriptlang.org/cheatsheets)

### TypeScript + React
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Documentación Oficial React + TS](https://react.dev/learn/typescript)

### Vite
- [Guía de Vite](https://vite.dev/guide/)
- [Vite con TypeScript](https://vite.dev/guide/features.html#typescript)

---

## 🚀 Tips Pro

### 1. Usa `type` vs `interface` apropiadamente

```typescript
// Usar 'type' para unions y aliases
export type RolUsuario = 'admin' | 'empleado' | 'cliente'
export type ID = string | number

// Usar 'interface' para objetos que pueden extenderse
export interface Usuario {
  id: number
  nombre: string
}
```

### 2. Aprovecha la Inferencia de Tipos

```typescript
// TypeScript puede inferir tipos
const [count, setCount] = useState(0) // TypeScript infiere number

// No necesitas tiparlo a menos que sea ambiguo
const [usuario, setUsuario] = useState<Usuario | null>(null) // Aquí sí
```

### 3. Usa `as const` para valores constantes

```typescript
export const ROLES = {
  ADMIN: 'admin',
  EMPLEADO: 'empleado',
  CLIENTE: 'cliente'
} as const

// Ahora ROLES es readonly y los valores son literales
```

### 4. Crea Tipos Derivados

```typescript
// Crear tipo parcial
type UsuarioParcial = Partial<Usuario> // Todas las props son opcionales

// Crear tipo sin ciertas props
type UsuarioSinPassword = Omit<Usuario, 'password'>

// Crear tipo solo con ciertas props
type UsuarioBasico = Pick<Usuario, 'id' | 'nombre' | 'correo'>
```

---

## ✅ Checklist para Nuevas Features

Cuando agregues una nueva feature:

- [ ] Definir tipos/interfaces en `src/types.ts`
- [ ] Tipar props de componentes
- [ ] Tipar estados (useState)
- [ ] Tipar funciones y eventos
- [ ] Tipar respuestas de API
- [ ] Verificar que no hay errores de TypeScript: `npm run build`
- [ ] Ejecutar linting: `npm run lint`
- [ ] Probar en desarrollo: `npm run dev`

---

**¡Ahora estás listo para desarrollar con TypeScript! 🎉**

