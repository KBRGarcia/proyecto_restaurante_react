import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Página de Inicio
 * Landing page del restaurante
 * 
 * Fuente: https://react.dev/reference/react/useEffect
 */
function HomePage() {
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)

  /**
   * Verificar si hay notificación de pago exitoso
   */
  useEffect(() => {
    const paymentSuccess = localStorage.getItem('paymentSuccess')
    if (paymentSuccess === 'true') {
      setMostrarNotificacion(true)
      localStorage.removeItem('paymentSuccess')
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setMostrarNotificacion(false)
      }, 5000)
    }
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-danger text-white py-5">
        <div className="container text-center py-5">
          <h1 className="display-3 mb-4">
            Bienvenido a Sabor & Tradición
          </h1>
          <p className="lead mb-4">
            Descubre los sabores más exquisitos en un ambiente acogedor.
            <br />
            La mejor experiencia gastronómica te espera.
          </p>
          <div className="mt-4">
            <Link to="/menu" className="btn btn-light btn-lg me-3">
              <i className="fas fa-book-open me-2"></i>
              Ver Nuestro Menú
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="container my-5">
        <div className="text-center mb-5">
          <h2 className="display-5">Nuestros Servicios</h2>
          <p className="lead text-muted">
            Todo lo que necesitas para una experiencia perfecta
          </p>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-utensils fa-2x"></i>
                </div>
                <h5 className="card-title">Para Llevar</h5>
                <p className="card-text">
                  Disfruta de nuestra comida en la comodidad de tu hogar.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-motorcycle fa-2x"></i>
                </div>
                <h5 className="card-title">Entrega a Domicilio</h5>
                <p className="card-text">
                  Llevamos la mejor comida directamente a tu hogar o al lugar de tu preferencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h3 className="mb-4">
                <i className="fas fa-map-marker-alt me-3 text-danger"></i>
                Encuéntranos
              </h3>
              <p className="mb-3"><strong>Dirección:</strong> Calle Principal #123, Ciudad</p>
              <p className="mb-3"><strong>Teléfono:</strong> +1 (555) 123-4567</p>
              <p className="mb-3"><strong>Email:</strong> contacto@sabortradicion.com</p>
              <p className="mb-3"><strong>Horarios:</strong></p>
              <ul className="list-unstyled ms-3">
                <li>Lunes a Viernes: 11:00 AM - 10:00 PM</li>
                <li>Sábado y Domingo: 10:00 AM - 11:00 PM</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <h3 className="mb-4">
                <i className="fas fa-star me-3 text-danger"></i>
                ¿Por qué elegirnos?
              </h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-check text-success me-3"></i>
                  Ingredientes frescos y de calidad
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-3"></i>
                  Chefs con más de 15 años de experiencia
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-3"></i>
                  Ambiente familiar y acogedor
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-3"></i>
                  Precios justos y porciones generosas
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-3"></i>
                  Servicio al cliente excepcional
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2025 Sabor & Tradición. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Notificación de pago exitoso */}
      {mostrarNotificacion && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3" 
          style={{ zIndex: 9999 }}
        >
          <div className="alert alert-success alert-dismissible fade show shadow-lg payment-success-notification" role="alert">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-check-circle fa-3x text-success"></i>
              </div>
              <div className="flex-grow-1">
                <h4 className="alert-heading mb-1">
                  <i className="fas fa-party-horn me-2"></i>
                  ¡Pago Exitoso!
                </h4>
                <p className="mb-1">
                  <strong>El pago se procesó con éxito</strong>
                </p>
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Tu pedido está siendo preparado. Recibirás una confirmación por correo.
                </small>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setMostrarNotificacion(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="progress mt-2" style={{ height: '3px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ 
                  animation: 'progressBar 5s linear forwards',
                  width: '100%'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage

