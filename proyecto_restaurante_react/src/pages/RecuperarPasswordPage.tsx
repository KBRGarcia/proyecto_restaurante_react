import { useNavigate, Link } from 'react-router-dom'
import RecuperarPassword from '../components/RecuperarPassword.tsx'

/**
 * Página de Recuperación de Contraseña
 * 
 * Esta página utiliza el componente RecuperarPassword para evitar
 * duplicación de código. El componente maneja toda la lógica de
 * recuperación de contraseña.
 * 
 * Fuentes oficiales:
 * - React Router: https://reactrouter.com/en/main/start/tutorial
 * - Componentes reutilizables: https://react.dev/learn/your-first-component
 */

function RecuperarPasswordPage() {
  const navigate = useNavigate()

  /**
   * Volver al login
   */
  const handleVolver = () => {
    navigate('/login')
  }

  /**
   * Callback cuando la recuperación es exitosa
   */
  const handleSuccess = () => {
    navigate('/login')
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <RecuperarPassword 
                onVolver={handleVolver}
                onSuccess={handleSuccess}
              />

              <hr className="my-4" />

              {/* Enlace adicional */}
              <div className="text-center">
                <Link to="/login" className="text-decoration-none">
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver al Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecuperarPasswordPage
