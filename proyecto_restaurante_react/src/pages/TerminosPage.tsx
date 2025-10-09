import { Link } from 'react-router-dom'

/**
 * Página de Términos y Condiciones
 * 
 * Describe las condiciones de uso del servicio del restaurante,
 * políticas de privacidad, uso de datos y responsabilidades.
 * 
 * @component
 * Fuentes:
 * - https://react.dev/learn/typescript
 * - https://reactrouter.com/en/main/components/link
 */
function TerminosPage() {
  // Fecha de última actualización
  const fechaActualizacion = '9 de Octubre, 2025'

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <i className="fas fa-file-contract fa-4x text-primary mb-3"></i>
            <h1 className="display-4 mb-3">Términos y Condiciones</h1>
            <p className="lead text-muted">
              Sabor & Tradición
            </p>
            <p className="text-muted">
              <small>
                <i className="fas fa-calendar-alt me-2"></i>
                Última actualización: {fechaActualizacion}
              </small>
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              
              {/* Introducción */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-info-circle me-2"></i>
                  1. Introducción
                </h2>
                <p className="text-justify">
                  Bienvenido a <strong>Sabor & Tradición</strong>. Al acceder y utilizar 
                  nuestro sitio web y servicios de pedidos en línea, usted acepta estar 
                  sujeto a estos términos y condiciones de uso. Si no está de acuerdo con 
                  alguna parte de estos términos, no debe utilizar nuestros servicios.
                </p>
                <p className="text-justify">
                  Estos términos se aplican a todos los usuarios del sitio, incluyendo sin 
                  limitación los usuarios que naveguen, realicen pedidos o contribuyan con 
                  contenido e información al servicio.
                </p>
              </section>

              {/* Servicios */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-utensils me-2"></i>
                  2. Servicios Ofrecidos
                </h2>
                <p className="text-justify">
                  Sabor & Tradición ofrece servicios de pedido de alimentos en línea, 
                  incluyendo pero no limitado a:
                </p>
                <ul className="mb-3">
                  <li>Visualización del menú y productos disponibles</li>
                  <li>Realización de pedidos en línea</li>
                  <li>Opciones de pago seguro (efectivo, tarjeta, transferencia)</li>
                  <li>Seguimiento del estado de pedidos</li>
                  <li>Gestión de perfil de usuario y preferencias</li>
                </ul>
                <p className="text-justify">
                  Nos reservamos el derecho de modificar, suspender o descontinuar 
                  cualquier aspecto de nuestros servicios en cualquier momento sin 
                  previo aviso.
                </p>
              </section>

              {/* Registro y Cuenta */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-user-plus me-2"></i>
                  3. Registro y Cuenta de Usuario
                </h2>
                <p className="text-justify">
                  Para realizar pedidos, debe crear una cuenta proporcionando 
                  información precisa y completa. Usted es responsable de:
                </p>
                <ul className="mb-3">
                  <li>Mantener la confidencialidad de su contraseña</li>
                  <li>Todas las actividades que ocurran bajo su cuenta</li>
                  <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                  <li>Actualizar su información personal cuando sea necesario</li>
                </ul>
                <div className="alert alert-info" role="alert">
                  <i className="fas fa-shield-alt me-2"></i>
                  <strong>Seguridad:</strong> Nunca compartiremos su información personal 
                  con terceros sin su consentimiento explícito.
                </div>
              </section>

              {/* Pedidos y Pagos */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-shopping-cart me-2"></i>
                  4. Pedidos y Pagos
                </h2>
                <h4 className="h5 mb-2">4.1 Realización de Pedidos</h4>
                <p className="text-justify">
                  Al realizar un pedido, usted acepta pagar el precio indicado más 
                  cualquier cargo adicional aplicable. Todos los precios están sujetos 
                  a cambios sin previo aviso.
                </p>
                
                <h4 className="h5 mb-2 mt-3">4.2 Métodos de Pago</h4>
                <p className="text-justify">
                  Aceptamos los siguientes métodos de pago:
                </p>
                <ul className="mb-3">
                  <li><strong>Efectivo:</strong> Pago al momento de la entrega o recogida</li>
                  <li><strong>Tarjeta de Crédito/Débito:</strong> Procesamiento seguro en línea</li>
                  <li><strong>Transferencia Bancaria:</strong> Con confirmación previa</li>
                </ul>

                <h4 className="h5 mb-2 mt-3">4.3 Confirmación y Cancelación</h4>
                <p className="text-justify">
                  Recibirá una confirmación por correo electrónico después de realizar 
                  su pedido. Nos reservamos el derecho de rechazar o cancelar pedidos 
                  por las siguientes razones:
                </p>
                <ul className="mb-3">
                  <li>Disponibilidad limitada de productos</li>
                  <li>Errores en el precio o descripción del producto</li>
                  <li>Problemas identificados con su pedido</li>
                  <li>Sospecha de fraude o actividad no autorizada</li>
                </ul>
              </section>

              {/* Entregas */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-truck me-2"></i>
                  5. Entregas y Tiempos de Preparación
                </h2>
                <p className="text-justify">
                  Los tiempos de entrega son estimaciones y pueden variar debido a 
                  factores fuera de nuestro control, como condiciones climáticas o 
                  tráfico. Haremos nuestro mejor esfuerzo para entregar dentro del 
                  tiempo estimado.
                </p>
                <ul className="mb-3">
                  <li>Los pedidos se confirman según disponibilidad</li>
                  <li>Los tiempos de preparación varían según el volumen de pedidos</li>
                  <li>Debe estar disponible para recibir el pedido en el momento de la entrega</li>
                  <li>No nos hacemos responsables por pedidos no recibidos por ausencia del cliente</li>
                </ul>
              </section>

              {/* Privacidad y Datos */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-lock me-2"></i>
                  6. Privacidad y Protección de Datos
                </h2>
                <p className="text-justify">
                  Nos comprometemos a proteger su privacidad y datos personales de 
                  acuerdo con las leyes aplicables de protección de datos.
                </p>
                
                <h4 className="h5 mb-2">6.1 Recopilación de Datos</h4>
                <p className="text-justify">
                  Recopilamos la siguiente información:
                </p>
                <ul className="mb-3">
                  <li>Nombre y apellido</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de entrega</li>
                  <li>Historial de pedidos</li>
                </ul>

                <h4 className="h5 mb-2 mt-3">6.2 Uso de Datos</h4>
                <p className="text-justify">
                  Utilizamos sus datos para:
                </p>
                <ul className="mb-3">
                  <li>Procesar y entregar sus pedidos</li>
                  <li>Comunicarnos con usted sobre su cuenta y pedidos</li>
                  <li>Mejorar nuestros servicios</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>

                <div className="alert alert-warning" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Importante:</strong> Nunca venderemos su información personal 
                  a terceros. Sus datos están seguros con nosotros.
                </div>
              </section>

              {/* Responsabilidades */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-balance-scale me-2"></i>
                  7. Responsabilidades del Usuario
                </h2>
                <p className="text-justify">
                  Al utilizar nuestros servicios, usted acepta:
                </p>
                <ul className="mb-3">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>No utilizar el servicio para actividades ilegales o no autorizadas</li>
                  <li>No intentar acceder sin autorización a nuestros sistemas</li>
                  <li>Respetar los derechos de propiedad intelectual</li>
                  <li>No abusar del sistema de pedidos o promociones</li>
                </ul>
              </section>

              {/* Limitación de Responsabilidad */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  8. Limitación de Responsabilidad
                </h2>
                <p className="text-justify">
                  Sabor & Tradición no será responsable por:
                </p>
                <ul className="mb-3">
                  <li>Daños indirectos, incidentales o consecuentes</li>
                  <li>Pérdida de datos o interrupciones del servicio</li>
                  <li>Alergias alimentarias no comunicadas previamente</li>
                  <li>Retrasos causados por factores fuera de nuestro control</li>
                  <li>Errores tipográficos en el menú o precios</li>
                </ul>
                
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-allergens me-2"></i>
                  <strong>Alergias:</strong> Si tiene alergias alimentarias, por favor 
                  infórmenos antes de realizar su pedido. Consulte la información de 
                  alérgenos en nuestro menú.
                </div>
              </section>

              {/* Propiedad Intelectual */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-copyright me-2"></i>
                  9. Propiedad Intelectual
                </h2>
                <p className="text-justify">
                  Todo el contenido de este sitio web, incluyendo pero no limitado a 
                  textos, gráficos, logos, imágenes, videos y software, es propiedad de 
                  Sabor & Tradición y está protegido por las leyes de propiedad intelectual.
                </p>
                <p className="text-justify">
                  Queda prohibida la reproducción, distribución o modificación de cualquier 
                  contenido sin nuestra autorización expresa por escrito.
                </p>
              </section>

              {/* Modificaciones */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-edit me-2"></i>
                  10. Modificaciones de los Términos
                </h2>
                <p className="text-justify">
                  Nos reservamos el derecho de modificar estos términos y condiciones en 
                  cualquier momento. Las modificaciones entrarán en vigor inmediatamente 
                  después de su publicación en el sitio web.
                </p>
                <p className="text-justify">
                  Es su responsabilidad revisar periódicamente estos términos. El uso 
                  continuado del servicio después de la publicación de cambios constituye 
                  su aceptación de dichos cambios.
                </p>
              </section>

              {/* Ley Aplicable */}
              <section className="mb-5">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-gavel me-2"></i>
                  11. Ley Aplicable y Jurisdicción
                </h2>
                <p className="text-justify">
                  Estos términos y condiciones se rigen por las leyes aplicables en la 
                  jurisdicción donde opera Sabor & Tradición. Cualquier disputa será 
                  resuelta en los tribunales competentes de dicha jurisdicción.
                </p>
              </section>

              {/* Contacto */}
              <section className="mb-4">
                <h2 className="h3 mb-3 text-primary">
                  <i className="fas fa-envelope me-2"></i>
                  12. Contacto
                </h2>
                <p className="text-justify mb-3">
                  Si tiene preguntas sobre estos términos y condiciones, puede contactarnos:
                </p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p className="mb-2">
                      <i className="fas fa-building me-2 text-primary"></i>
                      <strong>Sabor & Tradición</strong>
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      Email: <a href="mailto:info@saborytradicion.com">info@saborytradicion.com</a>
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-phone me-2 text-primary"></i>
                      Teléfono: +1 (555) 123-4567
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      Horario de atención: Lunes a Domingo, 9:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </section>

              {/* Aceptación */}
              <section className="mt-5 pt-4 border-top">
                <div className="alert alert-success" role="alert">
                  <h4 className="alert-heading">
                    <i className="fas fa-check-circle me-2"></i>
                    Aceptación de Términos
                  </h4>
                  <p className="mb-0">
                    Al crear una cuenta y utilizar nuestros servicios, usted confirma que 
                    ha leído, comprendido y aceptado estos términos y condiciones en su totalidad.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Botones de Acción */}
          <div className="text-center mt-4 mb-5">
            <Link 
              to="/register" 
              className="btn btn-primary btn-lg me-3"
            >
              <i className="fas fa-user-plus me-2"></i>
              Crear Cuenta
            </Link>
            <Link 
              to="/" 
              className="btn btn-outline-secondary btn-lg"
            >
              <i className="fas fa-home me-2"></i>
              Volver al Inicio
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center text-muted">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              Documento legal vinculante • Sabor & Tradición © 2025
            </small>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TerminosPage

