<?php
/**
 * API para Cambiar Contraseña después de Verificación
 * 
 * Este endpoint permite cambiar la contraseña después de verificar
 * el código de recuperación
 * 
 * Endpoint: POST /api/auth/change-password.php
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
    
    $resetToken = trim($input['reset_token'] ?? '');
    $newPassword = $input['new_password'] ?? '';
    $confirmPassword = $input['confirm_password'] ?? '';
    
    // Validaciones básicas
    if (empty($resetToken) || empty($newPassword) || empty($confirmPassword)) {
        jsonResponse(['success' => false, 'message' => 'Todos los campos son requeridos'], 400);
    }
    
    // Validar que las contraseñas coincidan
    if ($newPassword !== $confirmPassword) {
        jsonResponse(['success' => false, 'message' => 'Las contraseñas no coinciden'], 400);
    }
    
    // Validar longitud de contraseña
    if (strlen($newPassword) < 4 || strlen($newPassword) > 10) {
        jsonResponse(['success' => false, 'message' => 'La contraseña debe tener entre 4 y 10 caracteres'], 400);
    }
    
    // Buscar código de recuperación válido
    $stmt = $conn->prepare("
        SELECT prc.*, u.correo, u.nombre, u.apellido 
        FROM password_reset_codes prc
        JOIN usuarios u ON prc.usuario_id = u.id
        WHERE prc.reset_token = ? 
        AND prc.verified = TRUE 
        AND prc.token_expires_at > NOW()
        LIMIT 1
    ");
    $stmt->bind_param("s", $resetToken);
    $stmt->execute();
    $result = $stmt->get_result();
    $recoveryData = $result->fetch_assoc();
    
    if (!$recoveryData) {
        jsonResponse([
            'success' => false, 
            'message' => 'Token de recuperación inválido o expirado'
        ], 410);
    }
    
    // Verificar que el usuario aún existe y está activo
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE id = ? AND estado = 'activo' LIMIT 1");
    $stmt->bind_param("i", $recoveryData['usuario_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse([
            'success' => false, 
            'message' => 'Usuario no encontrado o inactivo'
        ], 404);
    }
    
    // Hash de la nueva contraseña
    $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Actualizar contraseña del usuario
    $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $passwordHash, $recoveryData['usuario_id']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar la contraseña');
    }
    
    // Eliminar código de recuperación usado
    $stmt = $conn->prepare("DELETE FROM password_reset_codes WHERE usuario_id = ?");
    $stmt->bind_param("i", $recoveryData['usuario_id']);
    $stmt->execute();
    
    // Generar nuevo token de sesión
    $sessionToken = bin2hex(random_bytes(32));
    
    // Guardar token en sesión
    $stmt = $conn->prepare("
        INSERT INTO sessions (usuario_id, token, expires_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
        ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)
    ");
    $stmt->bind_param("is", $recoveryData['usuario_id'], $sessionToken);
    $stmt->execute();
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true, 
        'message' => 'Contraseña actualizada exitosamente',
        'token' => $sessionToken,
        'usuario' => [
            'id' => $recoveryData['usuario_id'],
            'nombre' => $recoveryData['nombre'],
            'apellido' => $recoveryData['apellido'],
            'correo' => $recoveryData['correo'],
            'rol' => 'cliente', // Asumimos cliente por defecto
            'estado' => 'activo'
        ]
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error en change-password: " . $e->getMessage());
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
