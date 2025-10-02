import { Link } from 'react-router-dom'

/**
 * Página de Inicio
 * Landing page del restaurante
 */
function HomePage() {
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
        
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-utensils fa-2x"></i>
                </div>
                <h5 className="card-title">Servicio en Mesa</h5>
                <p className="card-text">
                  Disfruta de nuestro ambiente acogedor con atención personalizada.
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
                  Llevamos la mejor comida directamente a tu hogar.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-calendar-check fa-2x"></i>
                </div>
                <h5 className="card-title">Reservaciones</h5>
                <p className="card-text">
                  Asegura tu mesa para ocasiones especiales.
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
    </div>
  )
}

export default HomePage

