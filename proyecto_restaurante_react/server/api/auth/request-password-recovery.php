<?php
/**
 * API para Solicitar Recuperación de Contraseña
 * 
 * Este endpoint maneja la solicitud de recuperación de contraseña
 * enviando un código de verificación por correo
 * 
 * Endpoint: POST /api/auth/request-password-recovery.php
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
    
    // Verificar si el usuario existe
    $stmt = $conn->prepare("SELECT id, nombre, apellido FROM usuarios WHERE correo = ? AND estado = 'activo' LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        jsonResponse(['success' => false, 'message' => 'No se encontró una cuenta activa con este correo electrónico'], 404);
    }
    
    $usuario = $result->fetch_assoc();
    
    // Verificar si ya existe un código pendiente
    $stmt = $conn->prepare("
        SELECT id, created_at, attempts 
        FROM password_reset_codes 
        WHERE usuario_id = ? AND expires_at > NOW() AND verified = FALSE
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->bind_param("i", $usuario['id']);
    $stmt->execute();
    $existingCode = $stmt->get_result()->fetch_assoc();
    
    // Verificar cooldown (60 segundos entre solicitudes)
    if ($existingCode) {
        $lastRequest = strtotime($existingCode['created_at']);
        $cooldownTime = $config['verification']['resend_cooldown_seconds'];
        
        if ((time() - $lastRequest) < $cooldownTime) {
            $remainingTime = $cooldownTime - (time() - $lastRequest);
            jsonResponse([
                'success' => false, 
                'message' => "Debes esperar {$remainingTime} segundos antes de solicitar otro código"
            ], 429);
        }
        
        // Actualizar código existente
        $code = generateCode($config['verification']['code_length']);
        $expiresAt = date('Y-m-d H:i:s', time() + $config['verification']['code_ttl_seconds']);
        
        $stmt = $conn->prepare("
            UPDATE password_reset_codes 
            SET code = ?, expires_at = ?, attempts = 0, created_at = NOW() 
            WHERE usuario_id = ?
        ");
        $stmt->bind_param("si", $code, $expiresAt, $usuario['id']);
        
    } else {
        // Crear nuevo código de recuperación
        $code = generateCode($config['verification']['code_length']);
        $expiresAt = date('Y-m-d H:i:s', time() + $config['verification']['code_ttl_seconds']);
        
        $stmt = $conn->prepare("
            INSERT INTO password_reset_codes 
            (usuario_id, code, expires_at, attempts, created_at) 
            VALUES (?, ?, ?, 0, NOW())
        ");
        $stmt->bind_param("iss", $usuario['id'], $code, $expiresAt);
    }
    
    if (!$stmt->execute()) {
        throw new Exception('Error al procesar la solicitud de recuperación');
    }
    
    // Preparar datos para el correo
    $subject = "Recuperación de Contraseña - Sabor & Tradición";
    $message = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Recuperación de Contraseña</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f4f4f4; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .header { 
                background: linear-gradient(135deg, #dc3545, #c82333); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
                border-radius: 10px 10px 0 0; 
            }
            .content { 
                background: white; 
                padding: 40px; 
                border-radius: 0 0 10px 10px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            }
            .code-box { 
                background: #f8f9fa; 
                border: 3px dashed #dc3545; 
                padding: 30px; 
                text-align: center; 
                margin: 30px 0; 
                border-radius: 10px; 
            }
            .code { 
                font-size: 48px; 
                font-weight: bold; 
                color: #dc3545; 
                letter-spacing: 12px; 
                font-family: 'Courier New', monospace; 
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                color: #666; 
                font-size: 12px; 
            }
            .warning { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 20px 0; 
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🔐 Recuperación de Contraseña</h1>
                <p>Sabor & Tradición</p>
            </div>
            <div class='content'>
                <h2>Hola {$usuario['nombre']},</h2>
                <p>Recibimos una solicitud para recuperar tu contraseña. Si fuiste tú quien solicitó este cambio, utiliza el código de verificación a continuación:</p>
                
                <div class='code-box'>
                    <p style='margin: 0 0 15px 0; font-size: 18px; color: #666;'>Tu código de recuperación es:</p>
                    <div class='code'>{$code}</div>
                </div>
                
                <div class='warning'>
                    <strong>⚠️ Importante:</strong> Este código expira en <strong>10 minutos</strong>.
                </div>
                
                <p>Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá sin cambios.</p>
            </div>
            <div class='footer'>
                <p>Sabor & Tradición - Sistema de Restaurante</p>
                <p>Este es un correo automático, no respondas a este mensaje.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Enviar correo de recuperación
    $sent = sendPasswordRecoveryEmail($email, $usuario['nombre'], $code, $subject, $message);
    
    if (!$sent) {
        // Si falla el envío, limpiar el código
        $stmt = $conn->prepare("DELETE FROM password_reset_codes WHERE usuario_id = ?");
        $stmt->bind_param("i", $usuario['id']);
        $stmt->execute();
        
        throw new Exception('Error al enviar el correo de recuperación');
    }
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true,
        'message' => 'Código de recuperación enviado exitosamente',
        'expires_in' => $config['verification']['code_ttl_seconds']
    ]);
    
} catch (Exception $e) {
    error_log("Error en recuperación de contraseña: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>