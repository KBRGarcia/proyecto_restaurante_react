<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
$usuario_logueado = isset($_SESSION['usuario']);
$es_admin = $usuario_logueado && $_SESSION['usuario']['rol'] == 'admin';
$es_empleado = $usuario_logueado && $_SESSION['usuario']['rol'] == 'empleado';
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
  <div class="container">
    <a class="navbar-brand fw-bold" href="index.php">
      <i class="fas fa-utensils me-2"></i>Sabor & Tradición
    </a>
    
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>" href="index.php">
            <i class="fas fa-home me-1"></i>Inicio
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'menu.php' ? 'active' : ''; ?>" href="menu.php">
            <i class="fas fa-book-open me-1"></i>Menú
          </a>
        </li>
        <?php if ($usuario_logueado): ?>
        <li class="nav-item">
          <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'mis_pedidos.php' ? 'active' : ''; ?>" href="mis_pedidos.php">
            <i class="fas fa-shopping-cart me-1"></i>Mis Pedidos
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'reservaciones.php' ? 'active' : ''; ?>" href="reservaciones.php">
            <i class="fas fa-calendar-alt me-1"></i>Reservaciones
          </a>
        </li>
        <?php endif; ?>
        
        <?php if ($es_empleado || $es_admin): ?>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="empleadosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-users me-1"></i>Panel Empleado
          </a>
          <ul class="dropdown-menu" aria-labelledby="empleadosDropdown">
            <li><a class="dropdown-item" href="ordenes.php"><i class="fas fa-clipboard-list me-2"></i>Gestionar Órdenes</a></li>
            <li><a class="dropdown-item" href="mesas.php"><i class="fas fa-table me-2"></i>Estado de Mesas</a></li>
            <li><a class="dropdown-item" href="reservaciones_admin.php"><i class="fas fa-calendar-check me-2"></i>Reservaciones</a></li>
          </ul>
        </li>
        <?php endif; ?>
        
        <?php if ($es_admin): ?>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-cog me-1"></i>Administración
          </a>
          <ul class="dropdown-menu" aria-labelledby="adminDropdown">
            <li><a class="dropdown-item" href="dashboard.php"><i class="fas fa-chart-line me-2"></i>Dashboard</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="admin_productos.php"><i class="fas fa-hamburger me-2"></i>Gestionar Productos</a></li>
            <li><a class="dropdown-item" href="admin_categorias.php"><i class="fas fa-tags me-2"></i>Categorías</a></li>
            <li><a class="dropdown-item" href="admin_usuarios.php"><i class="fas fa-users-cog me-2"></i>Usuarios</a></li>
            <li><a class="dropdown-item" href="admin_mesas.php"><i class="fas fa-table me-2"></i>Mesas</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="reportes.php"><i class="fas fa-file-alt me-2"></i>Reportes</a></li>
          </ul>
        </li>
        <?php endif; ?>
      </ul>
      
      <ul class="navbar-nav">
        <?php if ($usuario_logueado): ?>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="perfilDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-user-circle me-1"></i><?php echo htmlspecialchars($_SESSION['usuario']['nombre']); ?>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="perfilDropdown">
            <li><a class="dropdown-item" href="perfil.php"><i class="fas fa-user me-2"></i>Mi Perfil</a></li>
            <li><a class="dropdown-item" href="configuracion.php"><i class="fas fa-cog me-2"></i>Configuración</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="logout.php"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
          </ul>
        </li>
        <?php else: ?>
        <li class="nav-item">
          <a class="nav-link" href="login.php">
            <i class="fas fa-sign-in-alt me-1"></i>Iniciar Sesión
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="registro.php">
            <i class="fas fa-user-plus me-1"></i>Registrarse
          </a>
        </li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
</nav>