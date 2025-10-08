import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'

/**
 * Layout Principal de la Aplicación
 * Envuelve todas las páginas con elementos comunes como el Navbar
 * 
 * El componente Outlet renderiza las rutas hijas según la ruta actual
 * 
 * Fuente: https://reactrouter.com/en/main/components/outlet
 */
function MainLayout() {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout

