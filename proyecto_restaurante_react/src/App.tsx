import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import Navbar from './components/Navbar.tsx'
import FloatingCartButton from './components/FloatingCartButton.tsx'
import { publicRoutes, protectedRoutes, adminRoutes, notFoundRoute } from './routes/routes.tsx'
import './App.css'
import './styles/themes.css'

/**
 * Componente Principal de la Aplicación
 * 
 * Configura el enrutamiento y provee los contextos globales de la aplicación.
 * Todas las rutas están centralizadas en src/routes/routes.tsx para 
 * facilitar el mantenimiento y escalabilidad.
 * 
 * Estructura:
 * - Router: Proveedor de navegación de React Router
 * - AuthProvider: Contexto de autenticación global
 * - CartProvider: Contexto del carrito de compras
 * - Routes: Sistema de rutas importado desde routes.tsx
 * 
 * Fuentes:
 * - https://reactrouter.com/en/main/start/tutorial
 * - https://react.dev/learn/passing-data-deeply-with-context
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
                <div className="app">
                  <Navbar />
                  
                  <Routes>
                    {/* Rutas públicas - accesibles sin autenticación */}
                    {publicRoutes}
                    
                    {/* Rutas protegidas - requieren autenticación */}
                    {protectedRoutes}
                    
                    {/* Rutas admin - requieren rol de administrador */}
                    {adminRoutes}
                    
                    {/* Ruta 404 - página no encontrada */}
                    {notFoundRoute}
                  </Routes>
                  
                  {/* Botón flotante del carrito */}
                  <FloatingCartButton />
                </div>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App

