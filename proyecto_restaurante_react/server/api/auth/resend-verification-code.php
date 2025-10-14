<?php
/**
 * API para Reenviar Código de Verificación
 * 
 * Este endpoint permite reenviar el código de verificación
 * respetando el cooldown configurado
 * 
 * Endpoint: POST /api/auth/resend-verification-code.php
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
    
    // Validaciones básicas
    if (empty($email)) {
        jsonResponse(['success' => false, 'message' => 'El correo electrónico es requerido'], 400);
    }
    
    // Validar formato de correo
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Formato de correo electrónico inválido'], 400);
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
    
    // Verificar cooldown
    $lastSent = strtotime($pending['created_at']);
    $cooldown = $config['verification']['resend_cooldown_seconds'];
    
    if (time() - $lastSent < $cooldown) {
        $remaining = $cooldown - (time() - $lastSent);
        jsonResponse([
            'success' => false, 
            'message' => "Espera {$remaining} segundos antes de reenviar el código",
            'cooldown_remaining' => $remaining
        ], 429);
    }
    
    // Generar nuevo código
    $code = generateCode($config['verification']['code_length']);
    $expiresAt = date('Y-m-d H:i:s', time() + $config['verification']['code_ttl_seconds']);
    
    // Actualizar registro pendiente
    $stmt = $conn->prepare("
        UPDATE pending_registrations 
        SET code = ?, code_expires_at = ?, attempts = 0, created_at = NOW() 
        WHERE email = ?
    ");
    $stmt->bind_param("sss", $code, $expiresAt, $email);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar el código de verificación');
    }
    
    // Enviar nuevo correo
    $sent = sendVerificationEmail($email, $pending['nombre'], $code);
    
    if (!$sent) {
        jsonResponse([
            'success' => false, 
            'message' => 'No se pudo reenviar el correo de verificación'
        ], 500);
    }
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true, 
        'message' => 'Código de verificación reenviado',
        'expires_in' => $config['verification']['code_ttl_seconds'],
        'cooldown' => $config['verification']['resend_cooldown_seconds']
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error en resend-verification-code: " . $e->getMessage());
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
