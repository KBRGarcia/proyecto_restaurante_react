import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import Navbar from './components/Navbar.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import MenuPage from './pages/MenuPage.tsx'
import HomePage from './pages/HomePage.tsx'
import PerfilPage from './pages/PerfilPage.tsx'
import ConfiguracionPage from './pages/ConfiguracionPage.tsx'
import CartPage from './pages/CartPage.tsx'
import MisOrdenesPage from './pages/MisOrdenesPage.tsx'
import './App.css'

/**
 * Componente Principal de la Aplicación
 * Configura el enrutamiento y provee el contexto de autenticación
 * 
 * Fuente: https://reactrouter.com/en/main/start/tutorial
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            
            <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <PerfilPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/configuracion" 
              element={
                <ProtectedRoute>
                  <ConfiguracionPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/carrito" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/mis-ordenes" 
              element={
                <ProtectedRoute>
                  <MisOrdenesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas admin */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <div className="container mt-5">
                    <h1>Dashboard Administrativo</h1>
                    <p>Próximamente...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="container mt-5 text-center">
                  <h1>404</h1>
                  <p>Página no encontrada</p>
                </div>
              } 
            />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

