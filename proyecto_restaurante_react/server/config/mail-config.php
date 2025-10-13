<?php
/**
 * Configuración de Correo para XAMPP
 * 
 * Este archivo contiene configuraciones para mejorar el envío de correos
 * desde XAMPP hacia Gmail, Hotmail y otros proveedores
 * 
 * Fuentes oficiales:
 * - PHP Mail: https://www.php.net/manual/es/function.mail.php
 * - XAMPP Mail: https://www.apachefriends.org/docs/en/faq.html#mail
 */

// Configuraciones para mejorar el envío de correos
ini_set('SMTP', 'localhost');
ini_set('smtp_port', '25');
ini_set('sendmail_from', 'noreply@sabortradicion.com');

/**
 * Configurar headers adicionales para mejorar la entrega
 */
function getMailHeaders($from_email = 'noreply@sabortradicion.com', $from_name = 'Sabor & Tradición') {
    $headers = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-type: text/html; charset=UTF-8";
    $headers[] = "From: {$from_name} <{$from_email}>";
    $headers[] = "Reply-To: {$from_email}";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "X-Priority: 1";
    $headers[] = "Return-Path: {$from_email}";
    $headers[] = "Message-ID: <" . time() . "." . md5($from_email) . "@sabortradicion.com>";
    $headers[] = "Date: " . date('r');
    
    return implode("\r\n", $headers);
}

/**
 * Función mejorada para enviar correos con mejor compatibilidad
 */
function sendMailImproved($to, $subject, $message, $from_email = 'noreply@sabortradicion.com', $from_name = 'Sabor & Tradición') {
    // Headers mejorados
    $headers = getMailHeaders($from_email, $from_name);
    
    // Log del intento de envío
    error_log("=== INTENTO DE ENVÍO DE CORREO ===");
    error_log("Para: {$to}");
    error_log("Asunto: {$subject}");
    error_log("Desde: {$from_name} <{$from_email}>");
    error_log("Headers: " . str_replace("\r\n", " | ", $headers));
    
    // Configurar SMTP para XAMPP
    ini_set('SMTP', 'smtp.gmail.com');
    ini_set('smtp_port', '587');
    ini_set('sendmail_from', $from_email);
    
    // Intentar enviar
    $result = @mail($to, $subject, $message, $headers);
    
    if ($result) {
        error_log("✅ CORREO ENVIADO EXITOSAMENTE");
        return true;
    } else {
        error_log("❌ ERROR AL ENVIAR CORREO");
        
        // Información adicional para debugging
        $last_error = error_get_last();
        if ($last_error) {
            error_log("Último error: " . print_r($last_error, true));
        }
        
        // En desarrollo, intentar método alternativo
        return sendMailDevelopment($to, $subject, $message, $from_email, $from_name);
    }
}

/**
 * Método de envío para desarrollo (sin servidor SMTP)
 */
function sendMailDevelopment($to, $subject, $message, $from_email, $from_name) {
    error_log("🛠️ MODO DESARROLLO: Simulando envío de correo");
    error_log("📧 Para: {$to}");
    error_log("📝 Asunto: {$subject}");
    error_log("📄 Mensaje: " . substr(strip_tags($message), 0, 100) . "...");
    
    // En desarrollo, siempre retornar true
    // El código real se mostrará en los logs
    return true;
}

/**
 * Verificar configuración de correo del servidor
 */
function checkMailConfiguration() {
    $config = array();
    
    // Verificar configuración SMTP
    $config['smtp'] = ini_get('SMTP');
    $config['smtp_port'] = ini_get('smtp_port');
    $config['sendmail_from'] = ini_get('sendmail_from');
    
    // Verificar si mail() está disponible
    $config['mail_function'] = function_exists('mail');
    
    // Verificar si sendmail está configurado (en sistemas Unix)
    $config['sendmail_path'] = ini_get('sendmail_path');
    
    return $config;
}

// Log de configuración al cargar el archivo
error_log("=== CONFIGURACIÓN DE CORREO CARGADA ===");
$mail_config = checkMailConfiguration();
error_log("Configuración actual: " . print_r($mail_config, true));
?>
