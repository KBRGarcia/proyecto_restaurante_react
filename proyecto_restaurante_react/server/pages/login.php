<?php 
include("includes/db.php"); 
session_start(); 

// Redirigir si ya está logueado
if (isset($_SESSION['usuario'])) {
    $rol = $_SESSION['usuario']['rol'];
    if ($rol == 'admin') {
        header("Location: dashboard.php");
    } else {
        header("Location: index.php");
    }
    exit();
}

$error_message = '';
$success_message = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Validar entrada
    if (empty($_POST['correo']) || empty($_POST['password'])) {
        $error_message = "Por favor, completa todos los campos.";
    } else {
        $correo = filter_var($_POST['correo'], FILTER_SANITIZE_EMAIL);
        $pass = $_POST['password'];
        
        // Validar formato de correo
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $error_message = "Formato de correo electrónico inválido.";
        } else {
            // Usar prepared statement para evitar SQL injection
            $stmt = $conn->prepare("SELECT id, nombre, apellido, correo, password, rol, estado FROM usuarios WHERE correo = ? AND estado = 'activo'");
            $stmt->bind_param("s", $correo);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $usuario = $result->fetch_assoc();
                
                if (password_verify($pass, $usuario['password'])) {
                    // Actualizar última conexión
                    $update_stmt = $conn->prepare("UPDATE usuarios SET ultima_conexion = NOW() WHERE id = ?");
                    $update_stmt->bind_param("i", $usuario['id']);
                    $update_stmt->execute();
                    
                    // Regenerar ID de sesión por seguridad
                    session_regenerate_id(true);
                    
                    // Guardar datos del usuario en sesión
                    $_SESSION['usuario'] = [
                        'id' => $usuario['id'],
                        'nombre' => $usuario['nombre'],
                        'apellido' => $usuario['apellido'],
                        'correo' => $usuario['correo'],
                        'rol' => $usuario['rol']
                    ];
                    
                    // Redirigir según el rol
                    switch ($usuario['rol']) {
                        case 'admin':
                            header("Location: dashboard.php");
                            break;
                        case 'empleado':
                            header("Location: ordenes.php");
                            break;
                        default:
                            header("Location: index.php");
                    }
                    exit();
                } else {
                    $error_message = "Contraseña incorrecta.";
                }
            } else {
                $error_message = "Usuario no encontrado o cuenta inactiva.";
            }
            $stmt->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Iniciar Sesión - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card shadow-custom">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="text-danger fw-bold">
                <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
              </h2>
              <p class="text-muted">Accede a tu cuenta para realizar pedidos</p>
            </div>

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

            <form method="POST" action="" id="loginForm" novalidate>
              <div class="mb-3">
                <label for="correo" class="form-label">
                  <i class="fas fa-envelope me-2"></i>Correo Electrónico
                </label>
                <input type="email" name="correo" id="correo" class="form-control" 
                       value="<?php echo isset($_POST['correo']) ? htmlspecialchars($_POST['correo']) : ''; ?>"
                       required>
                <div class="invalid-feedback">
                  Por favor, ingresa un correo electrónico válido.
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-2"></i>Contraseña
                </label>
                <div class="input-group">
                  <input type="password" name="password" id="password" class="form-control" required>
                  <button class="btn btn-outline-secondary" type="button" onclick="togglePassword()">
                    <i class="fas fa-eye" id="toggleIcon"></i>
                  </button>
                </div>
                <div class="invalid-feedback">
                  Por favor, ingresa tu contraseña.
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="recordarme">
                <label class="form-check-label" for="recordarme">
                  Recordarme
                </label>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="mb-2">¿No tienes una cuenta?</p>
              <a href="registro.php" class="btn btn-outline-primary">
                <i class="fas fa-user-plus me-2"></i>Registrarse
              </a>
            </div>

            <div class="text-center mt-3">
              <a href="#" class="text-muted text-decoration-none">
                <i class="fas fa-key me-1"></i>¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="text-center mt-4">
          <div class="row">
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-shopping-cart fa-2x text-primary mb-2"></i>
                  <h6>Pedidos Rápidos</h6>
                  <small class="text-muted">Realiza pedidos en segundos</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-calendar-alt fa-2x text-success mb-2"></i>
                  <h6>Reservaciones</h6>
                  <small class="text-muted">Reserva tu mesa favorita</small>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-star fa-2x text-warning mb-2"></i>
                  <h6>Ofertas Especiales</h6>
                  <small class="text-muted">Descuentos exclusivos</small>
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
    // Validación del formulario
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.classList.add('was-validated');
    });

    // Toggle de visibilidad de contraseña
    function togglePassword() {
        const passwordField = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    // Recordar usuario (localStorage)
    document.addEventListener('DOMContentLoaded', function() {
        const recordarCheckbox = document.getElementById('recordarme');
        const correoField = document.getElementById('correo');
        
        // Cargar correo guardado
        const correoGuardado = localStorage.getItem('correoRecordado');
        if (correoGuardado) {
            correoField.value = correoGuardado;
            recordarCheckbox.checked = true;
        }
        
        // Guardar/quitar correo según checkbox
        recordarCheckbox.addEventListener('change', function() {
            if (this.checked && correoField.value) {
                localStorage.setItem('correoRecordado', correoField.value);
            } else {
                localStorage.removeItem('correoRecordado');
            }
        });
        
        // Actualizar localStorage cuando cambie el correo
        correoField.addEventListener('input', function() {
            if (recordarCheckbox.checked) {
                localStorage.setItem('correoRecordado', this.value);
            }
        });
    });
  </script>
</body>
</html>