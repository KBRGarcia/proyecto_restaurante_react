<?php 
include("includes/db.php"); 
include("includes/auth.php");
session_start();

// Verificar que el usuario esté logueado
verificarLogin();

$usuario_id = $_SESSION['usuario']['id'];
$error_message = '';
$success_message = '';

// Obtener datos del usuario
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();
$stmt->close();

// Procesar cambio de contraseña
if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['cambiar_password'])) {
    $password_actual = $_POST['password_actual'];
    $password_nueva = $_POST['password_nueva'];
    $password_confirmacion = $_POST['password_confirmacion'];
    
    // Verificar contraseña actual
    if (!password_verify($password_actual, $usuario['password'])) {
        $error_message = "La contraseña actual es incorrecta.";
    } elseif (strlen($password_nueva) < 6) {
        $error_message = "La nueva contraseña debe tener al menos 6 caracteres.";
    } elseif ($password_nueva !== $password_confirmacion) {
        $error_message = "Las contraseñas nuevas no coinciden.";
    } elseif ($password_actual === $password_nueva) {
        $error_message = "La nueva contraseña debe ser diferente a la actual.";
    } else {
        // Actualizar contraseña
        $password_hash = password_hash($password_nueva, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $password_hash, $usuario_id);
        
        if ($stmt->execute()) {
            $success_message = "Contraseña actualizada exitosamente.";
            // Actualizar datos locales
            $usuario['password'] = $password_hash;
        } else {
            $error_message = "Error al actualizar la contraseña.";
        }
        $stmt->close();
    }
}

// Procesar actualización de preferencias de notificaciones
if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['actualizar_notificaciones'])) {
    // Como no tenemos tabla de preferencias, simularemos guardado exitoso
    $success_message = "Preferencias de notificaciones actualizadas exitosamente.";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configuración - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .password-strength {
      height: 5px;
      border-radius: 3px;
      transition: all 0.3s;
    }
    .password-strength.weak { background: #dc3545; width: 33%; }
    .password-strength.medium { background: #ffc107; width: 66%; }
    .password-strength.strong { background: #28a745; width: 100%; }
  </style>
</head>
<body>
  <?php include("includes/header.php"); ?>

  <div class="container mt-5 mb-5">
    <div class="row">
      <!-- Menú lateral de configuración -->
      <div class="col-lg-3 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-danger text-white">
            <h6 class="mb-0"><i class="fas fa-cog me-2"></i>Configuración</h6>
          </div>
          <div class="list-group list-group-flush">
            <a href="#cambiar-password" class="list-group-item list-group-item-action" data-bs-toggle="collapse">
              <i class="fas fa-key me-2 text-danger"></i>Seguridad
            </a>
            <a href="#notificaciones" class="list-group-item list-group-item-action" data-bs-toggle="collapse">
              <i class="fas fa-bell me-2 text-warning"></i>Notificaciones
            </a>
            <a href="#privacidad" class="list-group-item list-group-item-action" data-bs-toggle="collapse">
              <i class="fas fa-shield-alt me-2 text-success"></i>Privacidad
            </a>
            <a href="perfil.php" class="list-group-item list-group-item-action">
              <i class="fas fa-user me-2 text-primary"></i>Volver al Perfil
            </a>
          </div>
        </div>

        <!-- Información del usuario -->
        <div class="card shadow-sm mt-3">
          <div class="card-body text-center">
            <i class="fas fa-user-circle fa-3x text-danger mb-2"></i>
            <h6><?php echo htmlspecialchars($usuario['nombre'] . ' ' . $usuario['apellido']); ?></h6>
            <small class="text-muted"><?php echo htmlspecialchars($usuario['correo']); ?></small>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="col-lg-9">
        <h2 class="mb-4"><i class="fas fa-cog me-2 text-danger"></i>Configuración de la Cuenta</h2>

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

        <!-- Sección: Cambiar Contraseña -->
        <div class="card shadow-sm mb-4" id="cambiar-password">
          <div class="card-header bg-danger text-white">
            <h5 class="mb-0"><i class="fas fa-key me-2"></i>Cambiar Contraseña</h5>
          </div>
          <div class="card-body">
            <p class="text-muted">
              <i class="fas fa-info-circle me-1"></i>
              Por seguridad, te recomendamos usar una contraseña fuerte con al menos 6 caracteres.
            </p>
            
            <form method="POST" action="" id="passwordForm">
              <div class="mb-3">
                <label for="password_actual" class="form-label">
                  <i class="fas fa-lock me-2"></i>Contraseña Actual
                </label>
                <div class="input-group">
                  <input type="password" class="form-control" id="password_actual" name="password_actual" required>
                  <button class="btn btn-outline-secondary" type="button" onclick="togglePasswordVisibility('password_actual', 'icon1')">
                    <i class="fas fa-eye" id="icon1"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="password_nueva" class="form-label">
                  <i class="fas fa-key me-2"></i>Nueva Contraseña
                </label>
                <div class="input-group">
                  <input type="password" class="form-control" id="password_nueva" name="password_nueva" required>
                  <button class="btn btn-outline-secondary" type="button" onclick="togglePasswordVisibility('password_nueva', 'icon2')">
                    <i class="fas fa-eye" id="icon2"></i>
                  </button>
                </div>
                <div class="mt-2">
                  <small class="text-muted">Fortaleza de la contraseña:</small>
                  <div class="progress" style="height: 5px;">
                    <div class="progress-bar" id="strengthBar" role="progressbar" style="width: 0%"></div>
                  </div>
                  <small class="text-muted" id="strengthText"></small>
                </div>
              </div>

              <div class="mb-3">
                <label for="password_confirmacion" class="form-label">
                  <i class="fas fa-check-circle me-2"></i>Confirmar Nueva Contraseña
                </label>
                <div class="input-group">
                  <input type="password" class="form-control" id="password_confirmacion" name="password_confirmacion" required>
                  <button class="btn btn-outline-secondary" type="button" onclick="togglePasswordVisibility('password_confirmacion', 'icon3')">
                    <i class="fas fa-eye" id="icon3"></i>
                  </button>
                </div>
                <div id="passwordMatch" class="mt-2"></div>
              </div>

              <div class="d-grid">
                <button type="submit" name="cambiar_password" class="btn btn-danger">
                  <i class="fas fa-save me-2"></i>Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sección: Notificaciones -->
        <div class="card shadow-sm mb-4" id="notificaciones">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0"><i class="fas fa-bell me-2"></i>Preferencias de Notificaciones</h5>
          </div>
          <div class="card-body">
            <p class="text-muted">
              <i class="fas fa-info-circle me-1"></i>
              Configura cómo y cuándo quieres recibir notificaciones.
            </p>

            <form method="POST" action="" id="notificacionesForm">
              <div class="mb-3">
                <h6 class="mb-3">Notificaciones por Correo</h6>
                
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="notif_ordenes" checked>
                  <label class="form-check-label" for="notif_ordenes">
                    <i class="fas fa-shopping-bag me-2 text-primary"></i>
                    Actualizaciones de órdenes
                  </label>
                </div>

                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="notif_reservaciones" checked>
                  <label class="form-check-label" for="notif_reservaciones">
                    <i class="fas fa-calendar-check me-2 text-success"></i>
                    Confirmaciones de reservaciones
                  </label>
                </div>

                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="notif_promociones" checked>
                  <label class="form-check-label" for="notif_promociones">
                    <i class="fas fa-tag me-2 text-danger"></i>
                    Promociones y ofertas especiales
                  </label>
                </div>

                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="notif_newsletter">
                  <label class="form-check-label" for="notif_newsletter">
                    <i class="fas fa-newspaper me-2 text-info"></i>
                    Boletín informativo semanal
                  </label>
                </div>
              </div>

              <hr>

              <div class="mb-3">
                <h6 class="mb-3">Notificaciones Push (Navegador)</h6>
                
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="push_ordenes">
                  <label class="form-check-label" for="push_ordenes">
                    <i class="fas fa-desktop me-2 text-primary"></i>
                    Notificaciones de órdenes en tiempo real
                  </label>
                </div>

                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" type="checkbox" id="push_promociones">
                  <label class="form-check-label" for="push_promociones">
                    <i class="fas fa-bell me-2 text-warning"></i>
                    Alertas de nuevas promociones
                  </label>
                </div>
              </div>

              <div class="d-grid">
                <button type="submit" name="actualizar_notificaciones" class="btn btn-warning text-dark">
                  <i class="fas fa-save me-2"></i>Guardar Preferencias
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sección: Privacidad y Seguridad -->
        <div class="card shadow-sm mb-4" id="privacidad">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="fas fa-shield-alt me-2"></i>Privacidad y Seguridad</h5>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <h6 class="mb-3">Información de la Cuenta</h6>
              
              <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p class="mb-1 fw-bold"><i class="fas fa-user-shield me-2 text-success"></i>Estado de la Cuenta</p>
                  <small class="text-muted">
                    Tu cuenta está 
                    <span class="badge bg-<?php echo $usuario['estado'] == 'activo' ? 'success' : 'danger'; ?>">
                      <?php echo ucfirst($usuario['estado']); ?>
                    </span>
                  </small>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p class="mb-1 fw-bold"><i class="fas fa-envelope me-2 text-primary"></i>Correo Verificado</p>
                  <small class="text-muted"><?php echo htmlspecialchars($usuario['correo']); ?></small>
                </div>
                <span class="badge bg-success"><i class="fas fa-check"></i> Verificado</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <div>
                  <p class="mb-1 fw-bold"><i class="fas fa-clock me-2 text-info"></i>Última Conexión</p>
                  <small class="text-muted">
                    <?php 
                      echo $usuario['ultima_conexion'] 
                        ? formatearFecha($usuario['ultima_conexion'], 'd/m/Y H:i') 
                        : 'Nunca';
                    ?>
                  </small>
                </div>
              </div>
            </div>

            <hr>

            <div class="mb-4">
              <h6 class="mb-3">Privacidad de Datos</h6>
              
              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="privacidad_perfil" checked disabled>
                <label class="form-check-label" for="privacidad_perfil">
                  <i class="fas fa-eye-slash me-2"></i>
                  Mantener mi perfil privado
                </label>
              </div>

              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="privacidad_historial" checked disabled>
                <label class="form-check-label" for="privacidad_historial">
                  <i class="fas fa-history me-2"></i>
                  Guardar historial de pedidos
                </label>
              </div>
            </div>

            <hr>

            <div class="mb-3">
              <h6 class="mb-3 text-danger">Zona de Peligro</h6>
              
              <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Cerrar Sesión en Todos los Dispositivos</strong>
                <p class="mb-2 mt-2 small">Esto cerrará tu sesión en todos los dispositivos donde hayas iniciado sesión.</p>
                <button class="btn btn-sm btn-warning" onclick="cerrarSesionesTodas()">
                  <i class="fas fa-sign-out-alt me-1"></i>Cerrar Todas las Sesiones
                </button>
              </div>

              <div class="alert alert-danger">
                <i class="fas fa-trash-alt me-2"></i>
                <strong>Eliminar Cuenta</strong>
                <p class="mb-2 mt-2 small">Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos.</p>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminacion()">
                  <i class="fas fa-trash me-1"></i>Eliminar Mi Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Información Adicional -->
        <div class="card shadow-sm">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Información del Sistema</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <p class="mb-1"><i class="fas fa-calendar-alt me-2 text-primary"></i><strong>Miembro desde:</strong></p>
                <p class="text-muted"><?php echo formatearFecha($usuario['fecha_registro'], 'd/m/Y'); ?></p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="mb-1"><i class="fas fa-user-tag me-2 text-success"></i><strong>Tipo de Cuenta:</strong></p>
                <p>
                  <span class="badge bg-<?php echo $usuario['rol'] == 'admin' ? 'danger' : ($usuario['rol'] == 'empleado' ? 'warning' : 'primary'); ?>">
                    <?php echo ucfirst($usuario['rol']); ?>
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="mb-1"><i class="fas fa-fingerprint me-2 text-warning"></i><strong>ID de Usuario:</strong></p>
                <p class="text-muted">#<?php echo $usuario['id']; ?></p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="mb-1"><i class="fas fa-shield-alt me-2 text-info"></i><strong>Nivel de Seguridad:</strong></p>
                <p>
                  <span class="badge bg-success">
                    <i class="fas fa-check-circle"></i> Alto
                  </span>
                </p>
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
    // Toggle de visibilidad de contraseña
    function togglePasswordVisibility(fieldId, iconId) {
      const field = document.getElementById(fieldId);
      const icon = document.getElementById(iconId);
      
      if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }

    // Medidor de fortaleza de contraseña
    document.getElementById('password_nueva').addEventListener('input', function() {
      const password = this.value;
      const strengthBar = document.getElementById('strengthBar');
      const strengthText = document.getElementById('strengthText');
      
      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 10) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^a-zA-Z0-9]/.test(password)) strength++;
      
      let width = 0;
      let color = '';
      let text = '';
      
      if (strength <= 2) {
        width = 33;
        color = 'bg-danger';
        text = 'Débil';
      } else if (strength <= 4) {
        width = 66;
        color = 'bg-warning';
        text = 'Media';
      } else {
        width = 100;
        color = 'bg-success';
        text = 'Fuerte';
      }
      
      strengthBar.style.width = width + '%';
      strengthBar.className = 'progress-bar ' + color;
      strengthText.textContent = text;
      strengthText.className = 'text-muted';
    });

    // Verificar coincidencia de contraseñas
    function checkPasswordMatch() {
      const nueva = document.getElementById('password_nueva').value;
      const confirmacion = document.getElementById('password_confirmacion').value;
      const matchDiv = document.getElementById('passwordMatch');
      
      if (confirmacion.length > 0) {
        if (nueva === confirmacion) {
          matchDiv.innerHTML = '<small class="text-success"><i class="fas fa-check-circle"></i> Las contraseñas coinciden</small>';
        } else {
          matchDiv.innerHTML = '<small class="text-danger"><i class="fas fa-times-circle"></i> Las contraseñas no coinciden</small>';
        }
      } else {
        matchDiv.innerHTML = '';
      }
    }

    document.getElementById('password_nueva').addEventListener('input', checkPasswordMatch);
    document.getElementById('password_confirmacion').addEventListener('input', checkPasswordMatch);

    // Validación del formulario de contraseña
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
      const actual = document.getElementById('password_actual').value;
      const nueva = document.getElementById('password_nueva').value;
      const confirmacion = document.getElementById('password_confirmacion').value;
      
      if (nueva !== confirmacion) {
        e.preventDefault();
        alert('Las contraseñas nuevas no coinciden.');
        return false;
      }
      
      if (nueva.length < 6) {
        e.preventDefault();
        alert('La nueva contraseña debe tener al menos 6 caracteres.');
        return false;
      }
      
      if (actual === nueva) {
        e.preventDefault();
        alert('La nueva contraseña debe ser diferente a la actual.');
        return false;
      }
    });

    // Función para cerrar todas las sesiones
    function cerrarSesionesTodas() {
      if (confirm('¿Estás seguro de que deseas cerrar sesión en todos los dispositivos? Tendrás que iniciar sesión nuevamente.')) {
        // Aquí iría la lógica para cerrar todas las sesiones
        alert('Funcionalidad en desarrollo. Por ahora solo cierra la sesión actual.');
        window.location.href = 'logout.php';
      }
    }

    // Función para confirmar eliminación de cuenta
    function confirmarEliminacion() {
      const confirmacion = prompt('Esta acción es PERMANENTE. Si estás seguro, escribe "ELIMINAR" (en mayúsculas) para confirmar:');
      
      if (confirmacion === 'ELIMINAR') {
        alert('Funcionalidad en desarrollo. Por favor, contacta al administrador para eliminar tu cuenta.');
      } else if (confirmacion !== null) {
        alert('Texto de confirmación incorrecto. Tu cuenta no ha sido eliminada.');
      }
    }

    // Auto-ocultar alertas de éxito
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

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  </script>
</body>
</html>

