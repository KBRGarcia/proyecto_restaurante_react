import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.tsx'
import LoadingSpinner from '../components/LoadingSpinner.tsx'

/**
 * Lazy Loading de Componentes
 * Optimiza el rendimiento dividiendo el código en chunks más pequeños
 * 
 * Fuente: https://react.dev/reference/react/lazy
 * Fuente: https://reactrouter.com/en/main/guides/lazy-loading
 */

// Páginas públicas
const HomePage = lazy(() => import('../pages/HomePage.tsx'))
const MenuPage = lazy(() => import('../pages/MenuPage.tsx'))
const Login = lazy(() => import('../components/Login.tsx'))
const Register = lazy(() => import('../components/Register.tsx'))

// Páginas protegidas
const PerfilPage = lazy(() => import('../pages/PerfilPage.tsx'))
const ConfiguracionPage = lazy(() => import('../pages/ConfiguracionPage.tsx'))
const CartPage = lazy(() => import('../pages/CartPage.tsx'))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage.tsx'))
const MisOrdenesPage = lazy(() => import('../pages/MisOrdenesPage.tsx'))

// Páginas de error
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx'))

// Páginas admin
const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'))

/**
 * Componente de Loading para Suspense
 */
const SuspenseLoader = () => (
  <div className="container mt-5">
    <LoadingSpinner mensaje="Cargando..." />
  </div>
)

/**
 * Wrapper para rutas protegidas con lazy loading
 */
const LazyProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode
  requiredRole?: string 
}) => (
  <ProtectedRoute requiredRole={requiredRole}>
    <Suspense fallback={<SuspenseLoader />}>
      {children}
    </Suspense>
  </ProtectedRoute>
)

/**
 * Configuración centralizada de rutas
 * Todas las rutas de la aplicación están definidas aquí
 * 
 * Estructura:
 * - Rutas públicas: accesibles sin autenticación
 * - Rutas protegidas: requieren autenticación
 * - Rutas admin: requieren autenticación + rol admin
 * - Ruta 404: para páginas no encontradas
 * 
 * Fuente: https://reactrouter.com/en/main/route/route
 */
export const routes: RouteObject[] = [
  // ==================== RUTAS PÚBLICAS ====================
  {
    path: '/',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/menu',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <MenuPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <Register />
      </Suspense>
    ),
  },

  // ==================== RUTAS PROTEGIDAS ====================
  {
    path: '/perfil',
    element: (
      <LazyProtectedRoute>
        <PerfilPage />
      </LazyProtectedRoute>
    ),
  },
  {
    path: '/configuracion',
    element: (
      <LazyProtectedRoute>
        <ConfiguracionPage />
      </LazyProtectedRoute>
    ),
  },
  {
    path: '/carrito',
    element: (
      <LazyProtectedRoute>
        <CartPage />
      </LazyProtectedRoute>
    ),
  },
  {
    path: '/checkout',
    element: (
      <LazyProtectedRoute>
        <CheckoutPage />
      </LazyProtectedRoute>
    ),
  },
  {
    path: '/mis-ordenes',
    element: (
      <LazyProtectedRoute>
        <MisOrdenesPage />
      </LazyProtectedRoute>
    ),
  },

  // ==================== RUTAS ADMIN ====================
  {
    path: '/dashboard',
    element: (
      <LazyProtectedRoute requiredRole="admin">
        <DashboardPage />
      </LazyProtectedRoute>
    ),
  },

  // ==================== RUTA 404 ====================
  {
    path: '*',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]

