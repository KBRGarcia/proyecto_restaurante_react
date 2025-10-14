<?php
/**
 * Configuración de Correo Simplificada
 * 
 * Versión simplificada que funciona sin PHPMailer
 * Usa la función mail() nativa de PHP
 */

/**
 * Configuración de correo
 */
function getMailConfig() {
    return [
        // Configuración SMTP básica
        'smtp' => [
            'host' => 'smtp.gmail.com',
            'username' => 'tu-email@gmail.com',
            'password' => 'tu-contraseña-app',
            'port' => 587,
            'secure' => 'tls',
            'from_email' => 'noreply@sabortradicion.com',
            'from_name' => 'Sabor & Tradición',
        ],
        
        // Configuración de verificación
        'verification' => [
            'code_length' => 6,
            'code_ttl_seconds' => 600,           // 10 minutos
            'max_attempts' => 5,                 // intentos de verificación permitidos
            'resend_cooldown_seconds' => 60,      // 60s entre reenvíos
        ],
        
        // CORS: ajusta origin o usa '*' en desarrollo
        'cors' => [
            'allowed_origins' => [
                'http://localhost:3000',
                'http://localhost:5173', 
                'http://localhost',
                'http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react'
            ],
        ],
    ];
}

/**
 * Enviar correo de verificación usando función mail() nativa
 */
function sendVerificationEmail($toEmail, $toName, $code) {
    $config = getMailConfig();
    
    $subject = "Código de Verificación - Sabor & Tradición";
    
    $message = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Código de Verificación</title>
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
                <h1>🔐 Código de Verificación</h1>
                <p>Sabor & Tradición</p>
            </div>
            <div class='content'>
                <h2>Hola {$toName},</h2>
                <p>Gracias por registrarte en nuestro sistema. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>
                
                <div class='code-box'>
                    <p style='margin: 0 0 15px 0; font-size: 18px; color: #666;'>Tu código de verificación es:</p>
                    <div class='code'>{$code}</div>
                </div>
                
                <div class='warning'>
                    <strong>⚠️ Importante:</strong> Este código expira en <strong>10 minutos</strong>.
                </div>
                
                <p>Si no solicitaste este registro, ignora este correo.</p>
            </div>
            <div class='footer'>
                <p>Sabor & Tradición - Sistema de Restaurante</p>
                <p>Este es un correo automático, no respondas a este mensaje.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendWithNativeMail($toEmail, $toName, $code, $subject, $message, $config);
}

/**
 * Envío usando función mail() nativa
 */
function sendWithNativeMail($to, $name, $code, $subject, $message, $config) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $config['smtp']['from_name'] . ' <' . $config['smtp']['from_email'] . '>',
        'Reply-To: ' . $config['smtp']['from_email'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $result = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($result) {
        error_log("✅ Correo de verificación enviado con mail() nativo a: {$to}");
        return true;
    } else {
        error_log("❌ Error al enviar correo de verificación con mail() nativo a: {$to}");
        return false;
    }
}

/**
 * Enviar correo de recuperación de contraseña
 */
function sendPasswordRecoveryEmail($toEmail, $toName, $code, $subject, $message) {
    $config = getMailConfig();
    return sendWithNativeMail($toEmail, $toName, $code, $subject, $message, $config);
}

/**
 * Generar código de verificación
 */
function generateCode($length = 6) {
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= random_int(0, 9);
    }
    return $code;
}

/**
 * Configurar headers CORS
 */
function setCorsHeaders() {
    $config = getMailConfig();
    $allowedOrigins = $config['cors']['allowed_origins'];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    
    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Función helper para respuestas JSON
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Log de carga
error_log("📧 Configuración de correo simplificada cargada correctamente");
?>
