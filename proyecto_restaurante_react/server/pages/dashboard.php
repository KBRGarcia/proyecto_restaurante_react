<?php
include("includes/db.php");
session_start();

// Verificar que el usuario esté logueado y sea admin
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'admin') {
    header("Location: login.php");
    exit();
}

// Obtener estadísticas del dashboard
$stats = [];

// Total de órdenes
$result = $conn->query("SELECT COUNT(*) as total FROM ordenes");
$stats['total_ordenes'] = $result->fetch_assoc()['total'];

// Órdenes de hoy
$result = $conn->query("SELECT COUNT(*) as total FROM ordenes WHERE DATE(fecha_orden) = CURDATE()");
$stats['ordenes_hoy'] = $result->fetch_assoc()['total'];

// Total de usuarios
$result = $conn->query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'cliente'");
$stats['total_clientes'] = $result->fetch_assoc()['total'];

// Ingresos del mes
$result = $conn->query("SELECT COALESCE(SUM(total), 0) as ingresos FROM ordenes WHERE MONTH(fecha_orden) = MONTH(CURDATE()) AND YEAR(fecha_orden) = YEAR(CURDATE()) AND estado IN ('entregado', 'listo')");
$stats['ingresos_mes'] = $result->fetch_assoc()['ingresos'];

// Productos más vendidos
$productos_populares = $conn->query("
    SELECT p.nombre, COUNT(od.producto_id) as veces_pedido 
    FROM orden_detalles od 
    JOIN productos p ON od.producto_id = p.id 
    GROUP BY od.producto_id 
    ORDER BY veces_pedido DESC 
    LIMIT 5
");

// Órdenes pendientes
$ordenes_pendientes = $conn->query("
    SELECT o.*, u.nombre, u.apellido 
    FROM ordenes o 
    JOIN usuarios u ON o.usuario_id = u.id 
    WHERE o.estado IN ('pendiente', 'preparando') 
    ORDER BY o.fecha_orden DESC 
    LIMIT 10
");

// Últimos usuarios registrados
$nuevos_usuarios = $conn->query("
    SELECT nombre, apellido, correo, fecha_registro 
    FROM usuarios 
    WHERE rol = 'cliente' 
    ORDER BY fecha_registro DESC 
    LIMIT 5
");
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Admin - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-lg-2 col-md-3">
        <div class="card">
          <div class="card-header bg-gradient-primary text-white">
            <h6 class="mb-0"><i class="fas fa-cog me-2"></i>Panel Admin</h6>
          </div>
          <div class="list-group list-group-flush">
            <a href="dashboard.php" class="list-group-item list-group-item-action active">
              <i class="fas fa-chart-line me-2"></i>Dashboard
            </a>
            <a href="admin_productos.php" class="list-group-item list-group-item-action">
              <i class="fas fa-hamburger me-2"></i>Productos
            </a>
            <a href="admin_categorias.php" class="list-group-item list-group-item-action">
              <i class="fas fa-tags me-2"></i>Categorías
            </a>
            <a href="ordenes.php" class="list-group-item list-group-item-action">
              <i class="fas fa-clipboard-list me-2"></i>Órdenes
            </a>
            <a href="admin_usuarios.php" class="list-group-item list-group-item-action">
              <i class="fas fa-users me-2"></i>Usuarios
            </a>
            <a href="admin_mesas.php" class="list-group-item list-group-item-action">
              <i class="fas fa-table me-2"></i>Mesas
            </a>
            <a href="reportes.php" class="list-group-item list-group-item-action">
              <i class="fas fa-file-alt me-2"></i>Reportes
            </a>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="col-lg-10 col-md-9">
        <!-- Header del dashboard -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-gradient-primary">
            <i class="fas fa-chart-line me-2"></i>Dashboard Administrativo
          </h2>
          <div class="text-muted">
            <i class="fas fa-calendar me-1"></i>
            <?php echo date('d/m/Y H:i'); ?>
          </div>
        </div>

        <!-- Tarjetas de estadísticas -->
        <div class="row mb-4">
          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card bg-primary text-white shadow-custom">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="text-uppercase">Órdenes Totales</h6>
                    <h2 class="mb-0"><?php echo number_format($stats['total_ordenes']); ?></h2>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-shopping-cart fa-3x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card bg-success text-white shadow-custom">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="text-uppercase">Órdenes Hoy</h6>
                    <h2 class="mb-0"><?php echo number_format($stats['ordenes_hoy']); ?></h2>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-calendar-day fa-3x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card bg-info text-white shadow-custom">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="text-uppercase">Clientes</h6>
                    <h2 class="mb-0"><?php echo number_format($stats['total_clientes']); ?></h2>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-users fa-3x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-3">
            <div class="card bg-warning text-white shadow-custom">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="text-uppercase">Ingresos Mes</h6>
                    <h2 class="mb-0">$<?php echo number_format($stats['ingresos_mes'], 2); ?></h2>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-dollar-sign fa-3x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos y tablas -->
        <div class="row">
          <!-- Productos más vendidos -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow-custom">
              <div class="card-header bg-gradient-primary text-white">
                <h6 class="mb-0"><i class="fas fa-trophy me-2"></i>Productos Más Vendidos</h6>
              </div>
              <div class="card-body">
                <?php if ($productos_populares->num_rows > 0): ?>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th class="text-center">Pedidos</th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php while($producto = $productos_populares->fetch_assoc()): ?>
                        <tr>
                          <td><?php echo htmlspecialchars($producto['nombre']); ?></td>
                          <td class="text-center">
                            <span class="badge bg-primary"><?php echo $producto['veces_pedido']; ?></span>
                          </td>
                        </tr>
                        <?php endwhile; ?>
                      </tbody>
                    </table>
                  </div>
                <?php else: ?>
                  <p class="text-muted mb-0">No hay datos disponibles</p>
                <?php endif; ?>
              </div>
            </div>
          </div>

          <!-- Órdenes pendientes -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow-custom">
              <div class="card-header bg-gradient-primary text-white">
                <h6 class="mb-0"><i class="fas fa-clock me-2"></i>Órdenes Pendientes</h6>
              </div>
              <div class="card-body">
                <?php if ($ordenes_pendientes->num_rows > 0): ?>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php while($orden = $ordenes_pendientes->fetch_assoc()): ?>
                        <tr>
                          <td>#<?php echo $orden['id']; ?></td>
                          <td><?php echo htmlspecialchars($orden['nombre'] . ' ' . $orden['apellido']); ?></td>
                          <td>
                            <span class="badge bg-<?php echo $orden['estado'] == 'pendiente' ? 'warning' : 'info'; ?>">
                              <?php echo ucfirst($orden['estado']); ?>
                            </span>
                          </td>
                          <td>$<?php echo number_format($orden['total'], 2); ?></td>
                        </tr>
                        <?php endwhile; ?>
                      </tbody>
                    </table>
                  </div>
                  <div class="text-center">
                    <a href="ordenes.php" class="btn btn-primary btn-sm">
                      <i class="fas fa-eye me-1"></i>Ver Todas
                    </a>
                  </div>
                <?php else: ?>
                  <p class="text-muted mb-0">No hay órdenes pendientes</p>
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>

        <!-- Nuevos usuarios -->
        <div class="row">
          <div class="col-12">
            <div class="card shadow-custom">
              <div class="card-header bg-gradient-primary text-white">
                <h6 class="mb-0"><i class="fas fa-user-plus me-2"></i>Últimos Usuarios Registrados</h6>
              </div>
              <div class="card-body">
                <?php if ($nuevos_usuarios->num_rows > 0): ?>
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Correo</th>
                          <th>Fecha de Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php while($usuario = $nuevos_usuarios->fetch_assoc()): ?>
                        <tr>
                          <td><?php echo htmlspecialchars($usuario['nombre'] . ' ' . $usuario['apellido']); ?></td>
                          <td><?php echo htmlspecialchars($usuario['correo']); ?></td>
                          <td><?php echo date('d/m/Y H:i', strtotime($usuario['fecha_registro'])); ?></td>
                          <td>
                            <a href="admin_usuarios.php" class="btn btn-sm btn-outline-primary">
                              <i class="fas fa-eye me-1"></i>Ver
                            </a>
                          </td>
                        </tr>
                        <?php endwhile; ?>
                      </tbody>
                    </table>
                  </div>
                <?php else: ?>
                  <p class="text-muted mb-0">No hay usuarios recientes</p>
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="card shadow-custom">
              <div class="card-header bg-gradient-primary text-white">
                <h6 class="mb-0"><i class="fas fa-rocket me-2"></i>Accesos Rápidos</h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <a href="admin_productos.php" class="btn btn-outline-primary d-block">
                      <i class="fas fa-plus-circle fa-2x d-block mb-2"></i>
                      Nuevo Producto
                    </a>
                  </div>
                  <div class="col-md-3 mb-3">
                    <a href="admin_categorias.php" class="btn btn-outline-success d-block">
                      <i class="fas fa-tags fa-2x d-block mb-2"></i>
                      Gestionar Categorías
                    </a>
                  </div>
                  <div class="col-md-3 mb-3">
                    <a href="ordenes.php" class="btn btn-outline-warning d-block">
                      <i class="fas fa-clipboard-list fa-2x d-block mb-2"></i>
                      Ver Órdenes
                    </a>
                  </div>
                  <div class="col-md-3 mb-3">
                    <a href="reportes.php" class="btn btn-outline-info d-block">
                      <i class="fas fa-chart-bar fa-2x d-block mb-2"></i>
                      Generar Reporte
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/scripts.js"></script>
  
  <script>
    // Auto-refresh cada 60 segundos
    setTimeout(function() {
        location.reload();
    }, 60000);
    
    // Mostrar notificación de bienvenida
    document.addEventListener('DOMContentLoaded', function() {
        mostrarNotificacion('Bienvenido al panel administrativo, <?php echo htmlspecialchars($_SESSION['usuario']['nombre']); ?>!', 'success');
    });
  </script>
</body>
</html>
