<?php
/**
 * API para Validar Código de Verificación
 * 
 * Este endpoint valida el código de verificación enviado por correo
 * y completa el registro del usuario si el código es correcto
 * 
 * Endpoint: POST /api/auth/verify-code.php
 * 
 * Fuentes oficiales:
 * - PHP Security: https://www.php.net/manual/es/security.php
 * - Password Hashing: https://www.php.net/manual/es/password.php
 */

// Configurar headers CORS y manejo de errores
require_once '../config/verification-mail-simple.php';
setCorsHeaders();

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
}

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir conexión a base de datos
require_once '../../includes/db.php';

try {
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $code = trim($input['code'] ?? '');
    
    // Validaciones básicas
    if (empty($email) || empty($code)) {
        jsonResponse(['success' => false, 'message' => 'Correo y código son requeridos'], 400);
    }
    
    // Validar formato de correo
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Formato de correo electrónico inválido'], 400);
    }
    
    // Validar formato del código (6 dígitos)
    if (!preg_match('/^[0-9]{6}$/', $code)) {
        jsonResponse(['success' => false, 'message' => 'El código debe tener 6 dígitos'], 400);
    }
    
    $config = getMailConfig();
    
    // Buscar registro pendiente
    $stmt = $conn->prepare("SELECT * FROM pending_registrations WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $pending = $result->fetch_assoc();
    
    if (!$pending) {
        jsonResponse(['success' => false, 'message' => 'No hay un registro pendiente para este correo'], 404);
    }
    
    // Verificar límite de intentos
    $maxAttempts = $config['verification']['max_attempts'];
    if ((int)$pending['attempts'] >= $maxAttempts) {
        // Eliminar registro pendiente por demasiados intentos
        $stmt = $conn->prepare("DELETE FROM pending_registrations WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'Demasiados intentos incorrectos. Solicita un nuevo código de verificación'
        ], 429);
    }
    
    // Verificar expiración del código
    $expiresAt = strtotime($pending['code_expires_at']);
    if (time() > $expiresAt) {
        // Eliminar registro expirado
        $stmt = $conn->prepare("DELETE FROM pending_registrations WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'El código ha expirado. Solicita un nuevo código de verificación'
        ], 410);
    }
    
    // Comparar códigos usando comparación segura
    if (!hash_equals($pending['code'], $code)) {
        // Incrementar contador de intentos
        $stmt = $conn->prepare("UPDATE pending_registrations SET attempts = attempts + 1 WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        $remainingAttempts = $maxAttempts - ((int)$pending['attempts'] + 1);
        
        jsonResponse([
            'success' => false, 
            'message' => 'Código incorrecto',
            'remaining_attempts' => $remainingAttempts
        ], 400);
    }
    
    // Código correcto - Verificar que el usuario no existe (double check)
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Usuario ya existe, eliminar registro pendiente
        $stmt = $conn->prepare("DELETE FROM pending_registrations WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'El correo ya está registrado'
        ], 409);
    }
    
    // Crear usuario en la tabla principal
    $stmt = $conn->prepare("
        INSERT INTO usuarios 
        (nombre, apellido, correo, codigo_area, numero_telefono, password, rol, estado, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, 'cliente', 'activo', NOW())
    ");
    $stmt->bind_param(
        "ssssss", 
        $pending['nombre'], 
        $pending['apellido'], 
        $pending['email'], 
        $pending['codigo_area'], 
        $pending['numero_telefono'], 
        $pending['password_hash']
    );
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear el usuario');
    }
    
    $usuarioId = $conn->insert_id;
    
    // Eliminar registro pendiente
    $stmt = $conn->prepare("DELETE FROM pending_registrations WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    // Generar token de sesión
    $token = bin2hex(random_bytes(32));
    
    // Guardar token en sesión
    $stmt = $conn->prepare("
        INSERT INTO sessions (usuario_id, token, expires_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    ");
    $stmt->bind_param("is", $usuarioId, $token);
    $stmt->execute();
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true, 
        'message' => 'Registro completado exitosamente',
        'token' => $token,
        'usuario' => [
            'id' => $usuarioId,
            'nombre' => $pending['nombre'],
            'apellido' => $pending['apellido'],
            'correo' => $pending['email'],
            'codigo_area' => $pending['codigo_area'],
            'numero_telefono' => $pending['numero_telefono'],
            'rol' => 'cliente',
            'estado' => 'activo'
        ]
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error en verify-code: " . $e->getMessage());
    jsonResponse([
        'success' => false, 
        'message' => 'Error interno del servidor'
    ], 500);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
