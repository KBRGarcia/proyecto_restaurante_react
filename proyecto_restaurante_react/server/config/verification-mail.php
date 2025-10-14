<?php
/**
 * Configuración de PHPMailer para Envío de Correos
 * 
 * Este archivo configura PHPMailer para envío confiable de correos
 * Compatible con Gmail, Hotmail, Yahoo y otros proveedores
 * 
 * Fuentes oficiales:
 * - PHPMailer: https://github.com/PHPMailer/PHPMailer
 * - Documentación: https://phpmailer.github.io/PHPMailer/
 */

// Verificar si PHPMailer está disponible
if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    // Si no está instalado, usar la función mail() nativa como fallback
    error_log("⚠️ PHPMailer no está instalado. Usando función mail() nativa.");
}

/**
 * Configuración de correo
 */
function getMailConfig() {
    return [
        // Configuración SMTP
        'smtp' => [
            'host' => 'smtp.gmail.com',           // Cambiar según proveedor
            'username' => 'tu-email@gmail.com',   // Tu email
            'password' => 'tu-contraseña-app',     // Contraseña de aplicación
            'port' => 587,
            'secure' => 'tls',                    // 'tls' o 'ssl' o ''
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
 * Enviar correo usando PHPMailer (si está disponible) o mail() como fallback
 */
function sendVerificationEmail($to, $name, $code) {
    $config = getMailConfig();
    
    // Intentar usar PHPMailer primero
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendWithPHPMailer($to, $name, $code, $config);
    } else {
        // Fallback a función mail() nativa
        return sendWithNativeMail($to, $name, $code, $config);
    }
}

/**
 * Envío usando PHPMailer
 */
function sendWithPHPMailer($to, $name, $code, $config) {
    try {
        $mail = new PHPMailer(true);
        
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host = $config['smtp']['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp']['username'];
        $mail->Password = $config['smtp']['password'];
        $mail->SMTPSecure = $config['smtp']['secure'];
        $mail->Port = $config['smtp']['port'];
        
        // Configuración de charset
        $mail->CharSet = 'UTF-8';
        
        // Remitente
        $mail->setFrom($config['smtp']['from_email'], $config['smtp']['from_name']);
        $mail->addReplyTo($config['smtp']['from_email'], $config['smtp']['from_name']);
        
        // Destinatario
        $mail->addAddress($to, $name);
        
        // Contenido
        $mail->isHTML(true);
        $mail->Subject = 'Código de Verificación - Sabor & Tradición';
        
        // Plantilla HTML del correo
        $mail->Body = getEmailTemplate($name, $code);
        $mail->AltBody = "Hola {$name}, tu código de verificación es: {$code}. Este código expira en 10 minutos.";
        
        // Enviar
        $result = $mail->send();
        
        if ($result) {
            error_log("✅ Correo enviado con PHPMailer a: {$to}");
            return true;
        } else {
            error_log("❌ Error al enviar con PHPMailer a: {$to}");
            return false;
        }
        
    } catch (Exception $e) {
        error_log("❌ Error PHPMailer: " . $e->getMessage());
        return false;
    }
}

/**
 * Envío usando función mail() nativa (fallback)
 */
function sendWithNativeMail($to, $name, $code, $config) {
    $subject = 'Código de Verificación - Sabor & Tradición';
    $message = getEmailTemplate($name, $code);
    
    // Headers mejorados
    $headers = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-type: text/html; charset=UTF-8";
    $headers[] = "From: {$config['smtp']['from_name']} <{$config['smtp']['from_email']}>";
    $headers[] = "Reply-To: {$config['smtp']['from_email']}";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "X-Priority: 1";
    
    $headers_string = implode("\r\n", $headers);
    
    // Configurar SMTP para XAMPP
    ini_set('SMTP', $config['smtp']['host']);
    ini_set('smtp_port', $config['smtp']['port']);
    ini_set('sendmail_from', $config['smtp']['from_email']);
    
    $result = @mail($to, $subject, $message, $headers_string);
    
    if ($result) {
        error_log("✅ Correo enviado con mail() nativo a: {$to}");
        return true;
    } else {
        error_log("❌ Error al enviar con mail() nativo a: {$to}");
        return false;
    }
}

/**
 * Plantilla HTML para el correo de verificación
 */
function getEmailTemplate($name, $code) {
    return "
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
                background: linear-gradient(135deg, #007bff, #0056b3); 
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
                border: 3px dashed #007bff; 
                padding: 30px; 
                text-align: center; 
                margin: 30px 0; 
                border-radius: 10px; 
            }
            .code { 
                font-size: 48px; 
                font-weight: bold; 
                color: #007bff; 
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
            .security-note {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🔐 Verificación de Cuenta</h1>
                <p>Sabor & Tradición</p>
            </div>
            <div class='content'>
                <h2>Hola {$name},</h2>
                <p>Gracias por registrarte en nuestro sistema. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>
                
                <div class='code-box'>
                    <p style='margin: 0 0 15px 0; font-size: 18px; color: #666;'>Tu código de verificación es:</p>
                    <div class='code'>{$code}</div>
                </div>
                
                <div class='warning'>
                    <strong>⚠️ Importante:</strong> Este código expira en <strong>10 minutos</strong>.
                </div>
                
                <div class='security-note'>
                    <strong>🔒 Seguridad:</strong> Nunca compartas este código con nadie. Nuestro equipo nunca te pedirá tu código de verificación.
                </div>
                
                <p>Si no solicitaste este registro, puedes ignorar este correo de forma segura.</p>
                
                <p>¡Bienvenido a Sabor & Tradición!</p>
            </div>
            <div class='footer'>
                <p>Sabor & Tradición - Sistema de Restaurante</p>
                <p>Este es un correo automático, no respondas a este mensaje.</p>
                <p>Si tienes problemas, contacta a nuestro soporte técnico.</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

/**
 * Generar código de verificación
 */
function generateCode($length = 6) {
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= random_int(0, 9);
    return $code;
}

/**
 * Enviar correo de recuperación de contraseña
 * 
 * @param string $toEmail Correo del destinatario
 * @param string $toName Nombre del destinatario
 * @param string $code Código de verificación
 * @param string $subject Asunto del correo
 * @param string $message Mensaje HTML
 * @return bool True si se envió correctamente
 */
function sendPasswordRecoveryEmail($toEmail, $toName, $code, $subject, $message) {
    $config = getMailConfig();
    
    // Intentar usar PHPMailer primero
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendRecoveryWithPHPMailer($toEmail, $toName, $code, $subject, $message, $config);
    } else {
        // Fallback a función mail() nativa
        return sendRecoveryWithNativeMail($toEmail, $toName, $code, $subject, $message, $config);
    }
}

/**
 * Envío de recuperación usando PHPMailer
 */
function sendRecoveryWithPHPMailer($to, $name, $code, $subject, $message, $config) {
    try {
        $mail = new PHPMailer(true);
        
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host = $config['smtp']['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp']['username'];
        $mail->Password = $config['smtp']['password'];
        $mail->SMTPSecure = $config['smtp']['secure'];
        $mail->Port = $config['smtp']['port'];
        
        // Configuración de correo
        $mail->setFrom($config['smtp']['from_email'], $config['smtp']['from_name']);
        $mail->addAddress($to, $name);
        
        // Contenido
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = strip_tags($message);
        
        $mail->send();
        error_log("✅ Correo de recuperación enviado con PHPMailer a: {$to}");
        return true;
        
    } catch (Exception $e) {
        error_log("❌ Error PHPMailer en recuperación: " . $e->getMessage());
        return false;
    }
}

/**
 * Envío de recuperación usando función mail() nativa
 */
function sendRecoveryWithNativeMail($to, $name, $code, $subject, $message, $config) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $config['smtp']['from_name'] . ' <' . $config['smtp']['from_email'] . '>',
        'Reply-To: ' . $config['smtp']['from_email'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $result = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($result) {
        error_log("✅ Correo de recuperación enviado con mail() nativo a: {$to}");
        return true;
    } else {
        error_log("❌ Error al enviar correo de recuperación con mail() nativo a: {$to}");
        return false;
    }
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
    
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
}

/**
 * Respuesta JSON estandarizada
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Log de configuración
error_log("📧 Configuración de correo cargada - PHPMailer: " . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? 'Disponible' : 'No disponible'));
?>
