<?php 
include("includes/db.php");
session_start();

// Obtener categoría seleccionada
$categoria_seleccionada = isset($_GET['categoria']) ? intval($_GET['categoria']) : null;

// Obtener todas las categorías
$sql_categorias = "SELECT * FROM categorias WHERE estado = 'activo' ORDER BY orden_mostrar";
$categorias = $conn->query($sql_categorias);

// Obtener productos (filtrados por categoría si se especifica)
$sql_productos = "SELECT p.*, c.nombre as categoria_nombre 
                  FROM productos p 
                  JOIN categorias c ON p.categoria_id = c.id 
                  WHERE p.estado = 'activo'";

if ($categoria_seleccionada) {
    $sql_productos .= " AND p.categoria_id = " . $categoria_seleccionada;
}

$sql_productos .= " ORDER BY c.orden_mostrar, p.es_especial DESC, p.nombre";
$productos = $conn->query($sql_productos);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menú - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <!-- Sección Hero del Menú -->
  <section class="bg-gradient-primary text-white py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <h1 class="display-4 fw-bold mb-3">
            <i class="fas fa-book-open me-3"></i>Nuestro Menú
          </h1>
          <p class="lead mb-4">
            Descubre una experiencia culinaria única con nuestros platos preparados con los mejores ingredientes y mucho amor.
          </p>
        </div>
        <div class="col-lg-4 text-center">
          <div class="position-relative">
            <input type="text" id="busquedaProductos" class="form-control form-control-lg" 
                   placeholder="🔍 Buscar platos...">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Navegación de Categorías -->
  <?php if ($categorias && $categorias->num_rows > 0): ?>
  <section class="container my-4">
    <div class="categoria-nav text-center">
      <h5 class="mb-3"><i class="fas fa-tags me-2"></i>Categorías</h5>
      <div class="d-flex flex-wrap justify-content-center">
        <button class="categoria-btn <?php echo !$categoria_seleccionada ? 'active' : ''; ?>" 
                onclick="window.location.href='menu.php'">
          <i class="fas fa-th-large me-2"></i>Todos
        </button>
        
        <?php 
        $categorias->data_seek(0); // Reset pointer
        while($categoria = $categorias->fetch_assoc()): 
        ?>
        <button class="categoria-btn <?php echo $categoria_seleccionada == $categoria['id'] ? 'active' : ''; ?>" 
                onclick="window.location.href='menu.php?categoria=<?php echo $categoria['id']; ?>'">
          <i class="fas fa-utensils me-2"></i><?php echo htmlspecialchars($categoria['nombre']); ?>
        </button>
        <?php endwhile; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- Productos del Menú -->
  <section class="container mb-5">
    <?php if ($productos && $productos->num_rows > 0): ?>
    
    <!-- Título de la sección -->
    <div class="text-center mb-5">
      <?php if ($categoria_seleccionada): ?>
        <?php 
        $categorias->data_seek(0);
        while($cat = $categorias->fetch_assoc()) {
            if ($cat['id'] == $categoria_seleccionada) {
                echo '<h2 class="display-5 text-shadow">' . htmlspecialchars($cat['nombre']) . '</h2>';
                echo '<p class="lead text-muted">' . htmlspecialchars($cat['descripcion']) . '</p>';
                break;
            }
        }
        ?>
      <?php else: ?>
        <h2 class="display-5 text-shadow">Nuestros Deliciosos Platos</h2>
        <p class="lead text-muted">Cada plato es una obra maestra culinaria</p>
      <?php endif; ?>
    </div>

    <!-- Grid de Productos -->
    <div class="row" id="productosContainer">
      <?php 
      $categoria_actual = '';
      while($producto = $productos->fetch_assoc()): 
        // Si no hay filtro de categoría, mostrar separadores por categoría
        if (!$categoria_seleccionada && $categoria_actual != $producto['categoria_nombre']):
          if ($categoria_actual != '') echo '</div>'; // Cerrar row anterior
          $categoria_actual = $producto['categoria_nombre'];
      ?>
          <div class="col-12 mt-5 mb-3">
            <h3 class="text-center text-danger fw-bold">
              <i class="fas fa-utensils me-2"></i><?php echo htmlspecialchars($categoria_actual); ?>
            </h3>
            <hr class="w-50 mx-auto">
          </div>
          <div class="row">
      <?php endif; ?>

      <div class="col-lg-4 col-md-6 mb-4">
        <div class="producto-card fade-in-up" data-categoria-id="<?php echo $producto['categoria_id']; ?>">
          <!-- Imagen del producto -->
          <div class="producto-imagen" style="background-image: url('<?php 
            // URLs de imágenes específicas por tipo de producto
            $imagenes_por_categoria = [
                'Entradas' => 'https://images.unsplash.com/photo-1541014741259-de529411b96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'Platos Principales' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'Postres' => 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'Bebidas' => 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'Especialidades' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ];
            
            echo $imagenes_por_categoria[$producto['categoria_nombre']] ?? $imagenes_por_categoria['Platos Principales'];
          ?>');">
            
            <!-- Precio -->
            <div class="producto-precio">
              $<?php echo number_format($producto['precio'], 2); ?>
            </div>
            
            <!-- Badge de especial -->
            <?php if ($producto['es_especial']): ?>
            <div class="producto-especial">
              <i class="fas fa-star me-1"></i>Especial
            </div>
            <?php endif; ?>
            
            <!-- Estado del producto -->
            <?php if ($producto['estado'] == 'agotado'): ?>
            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                 style="background: rgba(0,0,0,0.7);">
              <span class="badge bg-warning fs-6">
                <i class="fas fa-exclamation-triangle me-2"></i>Agotado
              </span>
            </div>
            <?php endif; ?>
          </div>
          
          <!-- Información del producto -->
          <div class="producto-info">
            <h3 class="producto-nombre"><?php echo htmlspecialchars($producto['nombre']); ?></h3>
            <p class="producto-descripcion"><?php echo htmlspecialchars($producto['descripcion']); ?></p>
            
            <!-- Metadatos -->
            <div class="producto-meta">
              <span title="Tiempo de preparación">
                <i class="fas fa-clock me-1"></i><?php echo $producto['tiempo_preparacion']; ?> min
              </span>
              <span title="Categoría">
                <i class="fas fa-tag me-1"></i><?php echo htmlspecialchars($producto['categoria_nombre']); ?>
              </span>
            </div>
            
            <!-- Ingredientes (si están disponibles) -->
            <?php if (!empty($producto['ingredientes'])): ?>
            <div class="mb-3">
              <small class="text-muted">
                <i class="fas fa-leaf me-1"></i>
                <strong>Ingredientes:</strong> <?php echo htmlspecialchars($producto['ingredientes']); ?>
              </small>
            </div>
            <?php endif; ?>
            
            <!-- Botones de acción -->
            <div class="d-grid gap-2">
              <?php if ($producto['estado'] != 'agotado'): ?>
              <button class="btn btn-primary" onclick="agregarAlCarrito(<?php echo $producto['id']; ?>)">
                <i class="fas fa-plus me-2"></i>Agregar al Carrito
              </button>
              <?php else: ?>
              <button class="btn btn-secondary" disabled>
                <i class="fas fa-ban me-2"></i>No Disponible
              </button>
              <?php endif; ?>
            </div>
          </div>
        </div>
      </div>

      <?php endwhile; ?>
      
      <?php if (!$categoria_seleccionada && $categoria_actual != ''): ?>
      </div> <!-- Cerrar último row de categoría -->
      <?php endif; ?>
    </div>

    <?php else: ?>
    <!-- Sin productos -->
    <div class="text-center py-5">
      <i class="fas fa-utensils fa-4x text-muted mb-4"></i>
      <h3 class="text-muted">No hay productos disponibles</h3>
      <p class="text-muted">Lo sentimos, no encontramos productos en esta categoría.</p>
      <a href="menu.php" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i>Ver Todo el Menú
      </a>
    </div>
    <?php endif; ?>
  </section>

  <!-- Sección de Información Adicional -->
  <section class="bg-light py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="text-center">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style="width: 80px; height: 80px;">
              <i class="fas fa-leaf fa-2x"></i>
            </div>
            <h5>Ingredientes Frescos</h5>
            <p class="text-muted">Seleccionamos cuidadosamente los mejores ingredientes locales y orgánicos.</p>
          </div>
        </div>
        
        <div class="col-lg-4 mb-4">
          <div class="text-center">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style="width: 80px; height: 80px;">
              <i class="fas fa-clock fa-2x"></i>
            </div>
            <h5>Preparación Rápida</h5>
            <p class="text-muted">Nuestro equipo de chefs expertos prepara cada plato con eficiencia y calidad.</p>
          </div>
        </div>
        
        <div class="col-lg-4 mb-4">
          <div class="text-center">
            <div class="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style="width: 80px; height: 80px;">
              <i class="fas fa-heart fa-2x"></i>
            </div>
            <h5>Hecho con Amor</h5>
            <p class="text-muted">Cada plato es preparado con pasión y dedicación para tu satisfacción total.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h5><i class="fas fa-utensils me-2"></i>Sabor & Tradición</h5>
          <p>Sirviendo los mejores sabores desde 2010. Tu restaurante de confianza para momentos especiales.</p>
        </div>
        <div class="col-lg-6">
          <h5>Horarios de Atención</h5>
          <ul class="list-unstyled">
            <li><i class="fas fa-clock me-2"></i>Lunes a Viernes: 11:00 AM - 10:00 PM</li>
            <li><i class="fas fa-clock me-2"></i>Sábado y Domingo: 10:00 AM - 11:00 PM</li>
            <li><i class="fas fa-phone me-2"></i>Reservas: +1 (555) 123-4567</li>
          </ul>
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
  
  <script>
    // Funcionalidad específica del menú
    document.addEventListener('DOMContentLoaded', function() {
        // Configurar búsqueda en tiempo real
        const campoBusqueda = document.getElementById('busquedaProductos');
        if (campoBusqueda) {
            campoBusqueda.addEventListener('input', function() {
                const busqueda = this.value.toLowerCase().trim();
                const productos = document.querySelectorAll('.producto-card');
                
                productos.forEach(producto => {
                    const nombre = producto.querySelector('.producto-nombre')?.textContent.toLowerCase() || '';
                    const descripcion = producto.querySelector('.producto-descripcion')?.textContent.toLowerCase() || '';
                    const ingredientes = producto.querySelector('.producto-info small')?.textContent.toLowerCase() || '';
                    
                    if (nombre.includes(busqueda) || descripcion.includes(busqueda) || ingredientes.includes(busqueda)) {
                        producto.closest('.col-lg-4').style.display = 'block';
                    } else {
                        producto.closest('.col-lg-4').style.display = 'none';
                    }
                });
                
                // Mostrar mensaje si no hay resultados
                const productosVisibles = document.querySelectorAll('.col-lg-4[style="display: block"], .col-lg-4:not([style*="none"])').length;
                if (productosVisibles === 0 && busqueda !== '') {
                    mostrarMensajeSinResultados();
                } else {
                    ocultarMensajeSinResultados();
                }
            });
        }
    });
    
    function mostrarMensajeSinResultados() {
        let mensaje = document.getElementById('sinResultados');
        if (!mensaje) {
            mensaje = document.createElement('div');
            mensaje.id = 'sinResultados';
            mensaje.className = 'col-12 text-center py-5';
            mensaje.innerHTML = `
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No encontramos resultados</h4>
                <p class="text-muted">Intenta con otros términos de búsqueda</p>
            `;
            document.getElementById('productosContainer').appendChild(mensaje);
        }
    }
    
    function ocultarMensajeSinResultados() {
        const mensaje = document.getElementById('sinResultados');
        if (mensaje) {
            mensaje.remove();
        }
    }
  </script>
</body>
</html>
