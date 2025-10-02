import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import PerfilPage from './pages/PerfilPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
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
              path="/carrito" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5">
                    <h1>Carrito de Compras</h1>
                    <p>Próximamente...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/mis-ordenes" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5">
                    <h1>Mis Órdenes</h1>
                    <p>Próximamente...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
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
      </AuthProvider>
    </Router>
  )
}

export default App

