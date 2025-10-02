<?php 
include("includes/db.php"); 
include("includes/auth.php");
session_start();

// Verificar que el usuario esté logueado
verificarLogin();

$usuario_id = $_SESSION['usuario']['id'];
$error_message = '';
$success_message = '';

// Obtener datos completos del usuario
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();
$stmt->close();

// Obtener estadísticas del usuario
$stmt_ordenes = $conn->prepare("SELECT COUNT(*) as total_ordenes, COALESCE(SUM(total), 0) as total_gastado FROM ordenes WHERE usuario_id = ?");
$stmt_ordenes->bind_param("i", $usuario_id);
$stmt_ordenes->execute();
$stats_ordenes = $stmt_ordenes->get_result()->fetch_assoc();
$stmt_ordenes->close();

$stmt_reservaciones = $conn->prepare("SELECT COUNT(*) as total_reservaciones FROM reservaciones WHERE usuario_id = ?");
$stmt_reservaciones->bind_param("i", $usuario_id);
$stmt_reservaciones->execute();
$stats_reservaciones = $stmt_reservaciones->get_result()->fetch_assoc();
$stmt_reservaciones->close();

// Procesar actualización del perfil
if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['actualizar_perfil'])) {
    // Validar entrada
    $nombre = trim($_POST['nombre']);
    $apellido = trim($_POST['apellido']);
    $telefono = trim($_POST['telefono']);
    $direccion = trim($_POST['direccion']);
    
    if (empty($nombre) || empty($apellido)) {
        $error_message = "El nombre y apellido son obligatorios.";
    } else {
        // Actualizar datos del usuario
        $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $nombre, $apellido, $telefono, $direccion, $usuario_id);
        
        if ($stmt->execute()) {
            $success_message = "Perfil actualizado exitosamente.";
            
            // Actualizar datos en la sesión
            $_SESSION['usuario']['nombre'] = $nombre;
            $_SESSION['usuario']['apellido'] = $apellido;
            
            // Recargar datos del usuario
            $usuario['nombre'] = $nombre;
            $usuario['apellido'] = $apellido;
            $usuario['telefono'] = $telefono;
            $usuario['direccion'] = $direccion;
        } else {
            $error_message = "Error al actualizar el perfil.";
        }
        $stmt->close();
    }
}

// Obtener últimas órdenes
$stmt_ultimas_ordenes = $conn->prepare("SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY fecha_orden DESC LIMIT 5");
$stmt_ultimas_ordenes->bind_param("i", $usuario_id);
$stmt_ultimas_ordenes->execute();
$ultimas_ordenes = $stmt_ultimas_ordenes->get_result();
$stmt_ultimas_ordenes->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Perfil - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <div class="container mt-5 mb-5">
    <div class="row">
      <!-- Sidebar del perfil -->
      <div class="col-lg-3 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <div class="mb-3">
              <i class="fas fa-user-circle fa-5x text-danger"></i>
            </div>
            <h5 class="card-title"><?php echo htmlspecialchars($usuario['nombre'] . ' ' . $usuario['apellido']); ?></h5>
            <p class="text-muted small mb-2">
              <i class="fas fa-envelope me-1"></i><?php echo htmlspecialchars($usuario['correo']); ?>
            </p>
            <span class="badge bg-<?php echo $usuario['rol'] == 'admin' ? 'danger' : ($usuario['rol'] == 'empleado' ? 'warning' : 'primary'); ?>">
              <?php echo ucfirst($usuario['rol']); ?>
            </span>
            <hr>
            <p class="text-muted small mb-1">
              <i class="fas fa-calendar-alt me-1"></i>Miembro desde
            </p>
            <p class="small"><?php echo formatearFecha($usuario['fecha_registro'], 'd/m/Y'); ?></p>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="card shadow-sm mt-3">
          <div class="card-body">
            <h6 class="card-title mb-3"><i class="fas fa-chart-bar me-2"></i>Estadísticas</h6>
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small"><i class="fas fa-shopping-bag me-1"></i>Órdenes</span>
                <span class="badge bg-primary"><?php echo $stats_ordenes['total_ordenes']; ?></span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small"><i class="fas fa-dollar-sign me-1"></i>Total Gastado</span>
                <span class="badge bg-success"><?php echo formatearPrecio($stats_ordenes['total_gastado']); ?></span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small"><i class="fas fa-calendar-check me-1"></i>Reservaciones</span>
                <span class="badge bg-warning text-dark"><?php echo $stats_reservaciones['total_reservaciones']; ?></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="col-lg-9">
        <h2 class="mb-4"><i class="fas fa-user me-2 text-danger"></i>Mi Perfil</h2>

        <?php if ($error_message): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i><?php echo htmlspecialchars($error_message); ?>
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        <?php endif; ?>

        <?php if ($success_message): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="fas fa-check-circle me-2"></i><?php echo htmlspecialchars($success_message); ?>
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        <?php endif; ?>

        <!-- Formulario de datos personales -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0"><i class="fas fa-id-card me-2"></i>Información Personal</h5>
          </div>
          <div class="card-body">
            <form method="POST" action="" id="perfilForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nombre" class="form-label"><i class="fas fa-user me-2"></i>Nombre</label>
                  <input type="text" class="form-control" id="nombre" name="nombre" 
                         value="<?php echo htmlspecialchars($usuario['nombre']); ?>" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="apellido" class="form-label"><i class="fas fa-user me-2"></i>Apellido</label>
                  <input type="text" class="form-control" id="apellido" name="apellido" 
                         value="<?php echo htmlspecialchars($usuario['apellido']); ?>" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="correo" class="form-label"><i class="fas fa-envelope me-2"></i>Correo Electrónico</label>
                <input type="email" class="form-control" id="correo" 
                       value="<?php echo htmlspecialchars($usuario['correo']); ?>" disabled>
                <small class="text-muted">El correo no se puede modificar. Contacta al administrador si necesitas cambiarlo.</small>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="telefono" class="form-label"><i class="fas fa-phone me-2"></i>Teléfono</label>
                  <input type="tel" class="form-control" id="telefono" name="telefono" 
                         value="<?php echo htmlspecialchars($usuario['telefono'] ?? ''); ?>" 
                         placeholder="Ej: +52 123 456 7890">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="rol" class="form-label"><i class="fas fa-user-tag me-2"></i>Rol</label>
                  <input type="text" class="form-control" id="rol" 
                         value="<?php echo ucfirst($usuario['rol']); ?>" disabled>
                </div>
              </div>

              <div class="mb-3">
                <label for="direccion" class="form-label"><i class="fas fa-map-marker-alt me-2"></i>Dirección</label>
                <textarea class="form-control" id="direccion" name="direccion" rows="3" 
                          placeholder="Calle, número, colonia, ciudad..."><?php echo htmlspecialchars($usuario['direccion'] ?? ''); ?></textarea>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="fas fa-info-circle me-1"></i>Última actualización: 
                  <?php echo formatearFecha($usuario['fecha_registro'], 'd/m/Y H:i'); ?>
                </small>
                <button type="submit" name="actualizar_perfil" class="btn btn-danger">
                  <i class="fas fa-save me-2"></i>Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Últimas órdenes -->
        <div class="card shadow-sm">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0"><i class="fas fa-history me-2"></i>Últimas Órdenes</h5>
          </div>
          <div class="card-body">
            <?php if ($ultimas_ordenes->num_rows > 0): ?>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th><i class="fas fa-hashtag me-1"></i>ID</th>
                    <th><i class="fas fa-calendar me-1"></i>Fecha</th>
                    <th><i class="fas fa-truck me-1"></i>Tipo</th>
                    <th><i class="fas fa-dollar-sign me-1"></i>Total</th>
                    <th><i class="fas fa-info-circle me-1"></i>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <?php while ($orden = $ultimas_ordenes->fetch_assoc()): ?>
                  <tr>
                    <td>#<?php echo $orden['id']; ?></td>
                    <td><?php echo formatearFecha($orden['fecha_orden'], 'd/m/Y H:i'); ?></td>
                    <td>
                      <span class="badge bg-info">
                        <?php echo ucfirst($orden['tipo_servicio']); ?>
                      </span>
                    </td>
                    <td class="fw-bold"><?php echo formatearPrecio($orden['total']); ?></td>
                    <td>
                      <?php 
                        $estado_color = [
                          'pendiente' => 'warning',
                          'preparando' => 'info',
                          'listo' => 'success',
                          'entregado' => 'primary',
                          'cancelado' => 'danger'
                        ];
                        $color = $estado_color[$orden['estado']] ?? 'secondary';
                      ?>
                      <span class="badge bg-<?php echo $color; ?>">
                        <?php echo ucfirst($orden['estado']); ?>
                      </span>
                    </td>
                    <td>
                      <a href="mis_pedidos.php?orden=<?php echo $orden['id']; ?>" 
                         class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-eye"></i> Ver
                      </a>
                    </td>
                  </tr>
                  <?php endwhile; ?>
                </tbody>
              </table>
            </div>
            <div class="text-center mt-3">
              <a href="mis_pedidos.php" class="btn btn-outline-danger">
                <i class="fas fa-list me-2"></i>Ver Todas las Órdenes
              </a>
            </div>
            <?php else: ?>
            <div class="text-center py-5">
              <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
              <p class="text-muted">Aún no has realizado ninguna orden.</p>
              <a href="menu.php" class="btn btn-danger">
                <i class="fas fa-utensils me-2"></i>Ver Menú
              </a>
            </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Información de seguridad -->
        <div class="card shadow-sm mt-4">
          <div class="card-body">
            <h6 class="card-title mb-3"><i class="fas fa-shield-alt me-2 text-success"></i>Seguridad de la Cuenta</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1"><i class="fas fa-key me-2"></i>Contraseña</p>
                <small class="text-muted">••••••••</small>
              </div>
              <a href="configuracion.php#cambiar-password" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-edit me-1"></i>Cambiar
              </a>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1"><i class="fas fa-clock me-2"></i>Última Conexión</p>
                <small class="text-muted">
                  <?php 
                    echo $usuario['ultima_conexion'] 
                      ? formatearFecha($usuario['ultima_conexion'], 'd/m/Y H:i') 
                      : 'Nunca';
                  ?>
                </small>
              </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1"><i class="fas fa-circle me-2 text-success"></i>Estado de Cuenta</p>
                <small class="text-muted">
                  <span class="badge bg-<?php echo $usuario['estado'] == 'activo' ? 'success' : 'danger'; ?>">
                    <?php echo ucfirst($usuario['estado']); ?>
                  </span>
                </small>
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
    // Validación del formulario
    document.getElementById('perfilForm').addEventListener('submit', function(e) {
      const nombre = document.getElementById('nombre').value.trim();
      const apellido = document.getElementById('apellido').value.trim();
      
      if (nombre === '' || apellido === '') {
        e.preventDefault();
        alert('El nombre y apellido son obligatorios.');
        return false;
      }
    });

    // Auto-guardar mensaje de éxito
    <?php if ($success_message): ?>
    setTimeout(function() {
      const alert = document.querySelector('.alert-success');
      if (alert) {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
      }
    }, 5000);
    <?php endif; ?>
  </script>
</body>
</html>

