<?php
/**
 * API para Verificar Código de Recuperación de Contraseña
 * 
 * Este endpoint valida el código de recuperación enviado por correo
 * y permite al usuario cambiar su contraseña
 * 
 * Endpoint: POST /api/auth/verify-recovery-code.php
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
    
    // Buscar usuario
    $stmt = $conn->prepare("SELECT id, nombre, apellido FROM usuarios WHERE correo = ? AND estado = 'activo' LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    
    if (!$usuario) {
        jsonResponse(['success' => false, 'message' => 'Usuario no encontrado'], 404);
    }
    
    // Buscar código de recuperación
    $stmt = $conn->prepare("SELECT * FROM password_reset_codes WHERE usuario_id = ? AND expires_at > NOW() LIMIT 1");
    $stmt->bind_param("i", $usuario['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $recoveryCode = $result->fetch_assoc();
    
    if (!$recoveryCode) {
        jsonResponse(['success' => false, 'message' => 'No hay una solicitud de recuperación válida para este correo'], 404);
    }
    
    // Verificar límite de intentos
    $maxAttempts = $config['verification']['max_attempts'];
    if ((int)$recoveryCode['attempts'] >= $maxAttempts) {
        // Eliminar código por demasiados intentos
        $stmt = $conn->prepare("DELETE FROM password_reset_codes WHERE usuario_id = ?");
        $stmt->bind_param("i", $usuario['id']);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'Demasiados intentos incorrectos. Solicita un nuevo código de recuperación'
        ], 429);
    }
    
    // Verificar expiración del código
    $expiresAt = strtotime($recoveryCode['expires_at']);
    if (time() > $expiresAt) {
        // Eliminar código expirado
        $stmt = $conn->prepare("DELETE FROM password_reset_codes WHERE usuario_id = ?");
        $stmt->bind_param("i", $usuario['id']);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'El código ha expirado. Solicita un nuevo código de recuperación'
        ], 410);
    }
    
    // Comparar códigos usando comparación segura
    if (!hash_equals($recoveryCode['code'], $code)) {
        // Incrementar contador de intentos
        $stmt = $conn->prepare("UPDATE password_reset_codes SET attempts = attempts + 1 WHERE usuario_id = ?");
        $stmt->bind_param("i", $usuario['id']);
        $stmt->execute();
        
        $remainingAttempts = $maxAttempts - ((int)$recoveryCode['attempts'] + 1);
        
        jsonResponse([
            'success' => false, 
            'message' => 'Código incorrecto',
            'remaining_attempts' => $remainingAttempts
        ], 400);
    }
    
    // Código correcto - Generar token temporal para cambio de contraseña
    $resetToken = bin2hex(random_bytes(32));
    $tokenExpiresAt = date('Y-m-d H:i:s', time() + 300); // 5 minutos para cambiar contraseña
    
    // Actualizar código con token de reset
    $stmt = $conn->prepare("
        UPDATE password_reset_codes 
        SET reset_token = ?, token_expires_at = ?, verified = TRUE 
        WHERE usuario_id = ?
    ");
    $stmt->bind_param("ssi", $resetToken, $tokenExpiresAt, $usuario['id']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al procesar la verificación');
    }
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true, 
        'message' => 'Código verificado correctamente',
        'reset_token' => $resetToken,
        'token_expires_in' => 300, // 5 minutos
        'usuario' => [
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'apellido' => $usuario['apellido'],
            'correo' => $email
        ]
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error en verify-recovery-code: " . $e->getMessage());
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
