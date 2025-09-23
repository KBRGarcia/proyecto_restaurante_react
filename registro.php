<?php 
include("includes/db.php");
session_start();

// Redirigir si ya está logueado
if (isset($_SESSION['usuario'])) {
    header("Location: index.php");
    exit();
}

$error_message = '';
$success_message = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Validar que todos los campos estén presentes
    $nombre = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $telefono = trim($_POST['telefono'] ?? '');
    $direccion = trim($_POST['direccion'] ?? '');
    
    // Validaciones
    if (empty($nombre) || empty($apellido) || empty($correo) || empty($password)) {
        $error_message = "Todos los campos obligatorios deben ser completados.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $error_message = "Formato de correo electrónico inválido.";
    } elseif (strlen($password) < 6) {
        $error_message = "La contraseña debe tener al menos 6 caracteres.";
    } elseif ($password !== $confirm_password) {
        $error_message = "Las contraseñas no coinciden.";
    } elseif (!empty($telefono) && !preg_match('/^[\d\s\-\+\(\)]+$/', $telefono)) {
        $error_message = "Formato de teléfono inválido.";
    } else {
        // Verificar si el correo ya existe
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $error_message = "Ya existe una cuenta con este correo electrónico.";
        } else {
            // Crear nuevo usuario
            $password_hash = password_hash($password, PASSWORD_BCRYPT);
            
            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, password, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, 'cliente')");
            $stmt->bind_param("ssssss", $nombre, $apellido, $correo, $password_hash, $telefono, $direccion);
            
            if ($stmt->execute()) {
                $success_message = "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.";
                
                // Limpiar campos después del éxito
                $nombre = $apellido = $correo = $telefono = $direccion = '';
            } else {
                $error_message = "Error al crear la cuenta. Inténtalo de nuevo.";
            }
        }
        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">
        <div class="card shadow-custom">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="text-danger fw-bold">
                <i class="fas fa-user-plus me-2"></i>Crear Cuenta
              </h2>
              <p class="text-muted">Únete a nuestra familia gastronómica</p>
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

            <form method="POST" action="" id="registroForm" novalidate>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="nombre" class="form-label">
                      <i class="fas fa-user me-2"></i>Nombre *
                    </label>
                    <input type="text" name="nombre" id="nombre" class="form-control" 
                           value="<?php echo htmlspecialchars($nombre ?? ''); ?>" required>
                    <div class="invalid-feedback">
                      Por favor, ingresa tu nombre.
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="apellido" class="form-label">
                      <i class="fas fa-user me-2"></i>Apellido *
                    </label>
                    <input type="text" name="apellido" id="apellido" class="form-control" 
                           value="<?php echo htmlspecialchars($apellido ?? ''); ?>" required>
                    <div class="invalid-feedback">
                      Por favor, ingresa tu apellido.
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="correo" class="form-label">
                  <i class="fas fa-envelope me-2"></i>Correo Electrónico *
                </label>
                <input type="email" name="correo" id="correo" class="form-control" 
                       value="<?php echo htmlspecialchars($correo ?? ''); ?>" required>
                <div class="invalid-feedback">
                  Por favor, ingresa un correo electrónico válido.
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="password" class="form-label">
                      <i class="fas fa-lock me-2"></i>Contraseña *
                    </label>
                    <div class="input-group">
                      <input type="password" name="password" id="password" class="form-control" 
                             minlength="6" required>
                      <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('password', 'toggleIcon1')">
                        <i class="fas fa-eye" id="toggleIcon1"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback">
                      La contraseña debe tener al menos 6 caracteres.
                    </div>
                    <div class="form-text">
                      Mínimo 6 caracteres. Se recomienda incluir números y símbolos.
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="confirm_password" class="form-label">
                      <i class="fas fa-lock me-2"></i>Confirmar Contraseña *
                    </label>
                    <div class="input-group">
                      <input type="password" name="confirm_password" id="confirm_password" class="form-control" 
                             minlength="6" required>
                      <button class="btn btn-outline-secondary" type="button" onclick="togglePassword('confirm_password', 'toggleIcon2')">
                        <i class="fas fa-eye" id="toggleIcon2"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback">
                      Las contraseñas deben coincidir.
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="telefono" class="form-label">
                      <i class="fas fa-phone me-2"></i>Teléfono
                    </label>
                    <input type="tel" name="telefono" id="telefono" class="form-control" 
                           value="<?php echo htmlspecialchars($telefono ?? ''); ?>"
                           placeholder="Ej: +1 (555) 123-4567">
                    <div class="invalid-feedback">
                      Formato de teléfono inválido.
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="direccion" class="form-label">
                      <i class="fas fa-map-marker-alt me-2"></i>Dirección
                    </label>
                    <input type="text" name="direccion" id="direccion" class="form-control" 
                           value="<?php echo htmlspecialchars($direccion ?? ''); ?>"
                           placeholder="Para entregas a domicilio">
                  </div>
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terminos" required>
                <label class="form-check-label" for="terminos">
                  Acepto los <a href="#" class="text-decoration-none">términos y condiciones</a> y la 
                  <a href="#" class="text-decoration-none">política de privacidad</a> *
                </label>
                <div class="invalid-feedback">
                  Debes aceptar los términos y condiciones.
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="newsletter">
                <label class="form-check-label" for="newsletter">
                  Deseo recibir ofertas especiales y noticias por correo electrónico
                </label>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fas fa-user-plus me-2"></i>Crear Cuenta
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">¿Ya tienes una cuenta?</p>
              <a href="login.php" class="btn btn-outline-primary">
                <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
              </a>
            </div>
          </div>
        </div>

        <!-- Beneficios de registrarse -->
        <div class="row mt-4">
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="fas fa-shipping-fast fa-2x text-primary mb-3"></i>
                <h6>Pedidos Más Rápidos</h6>
                <small class="text-muted">Guarda tu información para pedidos express</small>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="fas fa-star fa-2x text-warning mb-3"></i>
                <h6>Ofertas Exclusivas</h6>
                <small class="text-muted">Accede a descuentos y promociones especiales</small>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <i class="fas fa-history fa-2x text-success mb-3"></i>
                <h6>Historial de Pedidos</h6>
                <small class="text-muted">Reordena tus platos favoritos fácilmente</small>
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
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Validar que las contraseñas coincidan
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (password !== confirmPassword) {
            e.preventDefault();
            document.getElementById('confirm_password').setCustomValidity('Las contraseñas no coinciden');
        } else {
            document.getElementById('confirm_password').setCustomValidity('');
        }
        
        this.classList.add('was-validated');
    });

    // Validar contraseñas en tiempo real
    document.getElementById('confirm_password').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        
        if (password !== confirmPassword) {
            this.setCustomValidity('Las contraseñas no coinciden');
        } else {
            this.setCustomValidity('');
        }
    });

    // Toggle de visibilidad de contraseña
    function togglePassword(fieldId, iconId) {
        const passwordField = document.getElementById(fieldId);
        const toggleIcon = document.getElementById(iconId);
        
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

    // Validar formato de teléfono
    document.getElementById('telefono').addEventListener('input', function() {
        const telefono = this.value;
        const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
        
        if (telefono && !telefonoRegex.test(telefono)) {
            this.setCustomValidity('Formato de teléfono inválido');
        } else {
            this.setCustomValidity('');
        }
    });

    // Indicador de fortaleza de contraseña
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        // Remover indicador anterior
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        if (password.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'password-strength mt-1';
            
            let strengthText = '';
            let strengthClass = '';
            
            if (strength < 2) {
                strengthText = 'Débil';
                strengthClass = 'text-danger';
            } else if (strength < 4) {
                strengthText = 'Media';
                strengthClass = 'text-warning';
            } else {
                strengthText = 'Fuerte';
                strengthClass = 'text-success';
            }
            
            indicator.innerHTML = `<small class="${strengthClass}">Fortaleza: ${strengthText}</small>`;
            this.parentNode.parentNode.appendChild(indicator);
        }
    });
  </script>
</body>
</html>