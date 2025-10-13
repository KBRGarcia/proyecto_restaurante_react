<?php
/**
 * Script de Prueba para Verificar Conexión API
 * 
 * Este script permite probar la conectividad entre el frontend y backend
 * para el sistema de recuperación de contraseña
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Información del servidor
$server_info = [
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'host' => $_SERVER['HTTP_HOST'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'N/A',
    'server_name' => $_SERVER['SERVER_NAME'] ?? 'N/A',
    'server_port' => $_SERVER['SERVER_PORT'] ?? 'N/A',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'script_filename' => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A'
];

// Verificar archivos importantes
$files_to_check = [
    '../../includes/db.php' => 'Conexión a base de datos',
    '../../config/mail-config.php' => 'Configuración de correo',
    '../auth/recuperar-password.php' => 'API de recuperación de contraseña'
];

$files_status = [];
foreach ($files_to_check as $file => $description) {
    $full_path = __DIR__ . '/' . $file;
    $files_status[$file] = [
        'description' => $description,
        'exists' => file_exists($full_path),
        'readable' => is_readable($full_path),
        'path' => $full_path
    ];
}

// Verificar configuración de correo
$mail_config = [];
if (function_exists('checkMailConfiguration')) {
    $mail_config = checkMailConfiguration();
}

// Probar conexión a base de datos
$db_status = [];
try {
    require_once '../../includes/db.php';
    $db_status['connected'] = true;
    $db_status['server_info'] = $conn->server_info ?? 'N/A';
    $db_status['client_info'] = $conn->client_info ?? 'N/A';
    
    // Verificar tabla de códigos de recuperación
    $result = $conn->query("SHOW TABLES LIKE 'password_reset_codes'");
    $db_status['password_reset_table_exists'] = $result && $result->num_rows > 0;
    
    $conn->close();
} catch (Exception $e) {
    $db_status['connected'] = false;
    $db_status['error'] = $e->getMessage();
}

// Respuesta completa
$response = [
    'success' => true,
    'message' => 'Test de conectividad API',
    'server_info' => $server_info,
    'files_status' => $files_status,
    'mail_config' => $mail_config,
    'database_status' => $db_status,
    'test_endpoints' => [
        'recuperar_password' => 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/auth/recuperar-password.php?action=solicitar',
        'test_mail' => 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/test-mail.php'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
