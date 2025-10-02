<?php 
include("includes/db.php"); 
session_start();

// Obtener productos especiales para mostrar
$sql_especiales = "SELECT p.*, c.nombre as categoria_nombre FROM productos p 
                   JOIN categorias c ON p.categoria_id = c.id 
                   WHERE p.es_especial = 1 AND p.estado = 'activo' 
                   LIMIT 3";
$especiales = $conn->query($sql_especiales);

// Obtener categorías principales
$sql_categorias = "SELECT * FROM categorias WHERE estado = 'activo' ORDER BY orden_mostrar LIMIT 4";
$categorias = $conn->query($sql_categorias);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sabor & Tradición - Restaurante</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <!-- Sección Hero -->
  <section class="hero-section">
    <div class="container">
      <h1 class="fade-in-up">Bienvenido a Sabor & Tradición</h1>
      <p class="fade-in-up">Descubre los sabores más exquisitos en un ambiente acogedor. La mejor experiencia gastronómica te espera.</p>
      <div class="mt-4">
        <a href="menu.php" class="btn btn-primary btn-lg me-3">
          <i class="fas fa-book-open me-2"></i>Ver Nuestro Menú
        </a>
        <a href="reservaciones.php" class="btn btn-outline-primary btn-lg">
          <i class="fas fa-calendar-alt me-2"></i>Reservar Mesa
        </a>
      </div>
    </div>
  </section>

  <!-- Sección de Especialidades -->
  <?php if ($especiales && $especiales->num_rows > 0): ?>
  <section class="container my-5">
    <div class="text-center mb-5">
      <h2 class="display-4 text-shadow">Nuestras Especialidades</h2>
      <p class="lead text-muted">Los platos que nos hacen únicos</p>
    </div>
    
    <div class="row">
      <?php while($producto = $especiales->fetch_assoc()): ?>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="producto-card fade-in-up">
          <div class="producto-imagen" style="background-image: url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');">
            <div class="producto-precio">$<?php echo number_format($producto['precio'], 2); ?></div>
            <div class="producto-especial">Especialidad</div>
          </div>
          <div class="producto-info">
            <h3 class="producto-nombre"><?php echo htmlspecialchars($producto['nombre']); ?></h3>
            <p class="producto-descripcion"><?php echo htmlspecialchars($producto['descripcion']); ?></p>
            <div class="producto-meta">
              <span><i class="fas fa-clock me-1"></i><?php echo $producto['tiempo_preparacion']; ?> min</span>
              <span><i class="fas fa-tag me-1"></i><?php echo htmlspecialchars($producto['categoria_nombre']); ?></span>
            </div>
            <button class="btn btn-primary w-100" onclick="agregarAlCarrito(<?php echo $producto['id']; ?>)">
              <i class="fas fa-plus me-2"></i>Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
      <?php endwhile; ?>
    </div>
    
    <div class="text-center mt-4">
      <a href="menu.php" class="btn btn-outline-primary btn-lg">
        <i class="fas fa-eye me-2"></i>Ver Menú Completo
      </a>
    </div>
  </section>
  <?php endif; ?>

  <!-- Sección de Categorías -->
  <?php if ($categorias && $categorias->num_rows > 0): ?>
  <section class="bg-light py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="display-4 text-shadow">Explora Nuestras Categorías</h2>
        <p class="lead text-muted">Encuentra exactamente lo que tu paladar desea</p>
      </div>
      
      <div class="row">
        <?php while($categoria = $categorias->fetch_assoc()): ?>
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card h-100 shadow-custom fade-in-up">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                 class="card-img-top" alt="<?php echo htmlspecialchars($categoria['nombre']); ?>">
            <div class="card-body text-center">
              <h5 class="card-title"><?php echo htmlspecialchars($categoria['nombre']); ?></h5>
              <p class="card-text"><?php echo htmlspecialchars($categoria['descripcion']); ?></p>
              <a href="menu.php?categoria=<?php echo $categoria['id']; ?>" class="btn btn-primary">
                <i class="fas fa-arrow-right me-2"></i>Explorar
              </a>
            </div>
          </div>
        </div>
        <?php endwhile; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- Sección de Servicios -->
  <section class="container my-5">
    <div class="text-center mb-5">
      <h2 class="display-4 text-shadow">Nuestros Servicios</h2>
      <p class="lead text-muted">Todo lo que necesitas para una experiencia perfecta</p>
    </div>
    
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card text-center h-100 shadow-custom">
          <div class="card-body">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="fas fa-utensils fa-2x"></i>
            </div>
            <h5 class="card-title">Servicio en Mesa</h5>
            <p class="card-text">Disfruta de nuestro ambiente acogedor con atención personalizada de nuestro equipo.</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card text-center h-100 shadow-custom">
          <div class="card-body">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="fas fa-motorcycle fa-2x"></i>
            </div>
            <h5 class="card-title">Entrega a Domicilio</h5>
            <p class="card-text">Llevamos la mejor comida directamente a tu hogar. Rápido, caliente y delicioso.</p>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card text-center h-100 shadow-custom">
          <div class="card-body">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
              <i class="fas fa-calendar-check fa-2x"></i>
            </div>
            <h5 class="card-title">Reservaciones</h5>
            <p class="card-text">Asegura tu mesa para ocasiones especiales. Sistema de reservas fácil y rápido.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sección de Contacto/Información -->
  <section class="bg-danger text-white py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="mb-4"><i class="fas fa-map-marker-alt me-3"></i>Encuéntranos</h3>
          <p class="mb-3"><strong>Dirección:</strong> Calle Principal #123, Ciudad</p>
          <p class="mb-3"><strong>Teléfono:</strong> +1 (555) 123-4567</p>
          <p class="mb-3"><strong>Email:</strong> contacto@sabortradicion.com</p>
          <p class="mb-3"><strong>Horarios:</strong></p>
          <ul class="list-unstyled ms-3">
            <li>Lunes a Viernes: 11:00 AM - 10:00 PM</li>
            <li>Sábado y Domingo: 10:00 AM - 11:00 PM</li>
          </ul>
        </div>
        <div class="col-lg-6">
          <h3 class="mb-4"><i class="fas fa-star me-3"></i>¿Por qué elegirnos?</h3>
          <ul class="list-unstyled">
            <li class="mb-2"><i class="fas fa-check me-3"></i>Ingredientes frescos y de calidad</li>
            <li class="mb-2"><i class="fas fa-check me-3"></i>Chefs con más de 15 años de experiencia</li>
            <li class="mb-2"><i class="fas fa-check me-3"></i>Ambiente familiar y acogedor</li>
            <li class="mb-2"><i class="fas fa-check me-3"></i>Precios justos y porciones generosas</li>
            <li class="mb-2"><i class="fas fa-check me-3"></i>Servicio al cliente excepcional</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <h5><i class="fas fa-utensils me-2"></i>Sabor & Tradición</h5>
          <p>Sirviendo los mejores sabores desde 2010. Tu restaurante de confianza para momentos especiales.</p>
        </div>
        <div class="col-lg-4 mb-4">
          <h5>Enlaces Rápidos</h5>
          <ul class="list-unstyled">
            <li><a href="menu.php">Menú</a></li>
            <li><a href="reservaciones.php">Reservaciones</a></li>
            <li><a href="login.php">Iniciar Sesión</a></li>
            <li><a href="registro.php">Registrarse</a></li>
          </ul>
        </div>
        <div class="col-lg-4 mb-4">
          <h5>Síguenos</h5>
          <div class="d-flex">
            <a href="#" class="me-3"><i class="fab fa-facebook fa-2x"></i></a>
            <a href="#" class="me-3"><i class="fab fa-instagram fa-2x"></i></a>
            <a href="#" class="me-3"><i class="fab fa-twitter fa-2x"></i></a>
          </div>
        </div>
      </div>
      <hr class="my-4">
      <div class="text-center">
        <p>&copy; 2024 Sabor & Tradición. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>

  <!-- Carrito flotante -->
  <div class="carrito-flotante" onclick="toggleCarrito()">
    <i class="fas fa-shopping-cart fa-lg"></i>
    <span class="carrito-contador" id="carritoContador">0</span>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/scripts.js"></script>
</body>
</html>