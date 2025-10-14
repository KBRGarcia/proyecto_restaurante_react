<?php
/**
 * Script de Prueba para Verificar APIs de Verificación
 * 
 * Este script prueba las APIs de verificación para diagnosticar problemas
 */

// Configurar headers para pruebas
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar archivos de configuración
$checks = [];

// 1. Verificar archivo de configuración de correo
$mailConfigPath = __DIR__ . '/../config/verification-mail-simple.php';
if (file_exists($mailConfigPath)) {
    $checks['mail_config'] = [
        'status' => 'exists',
        'path' => $mailConfigPath,
        'size' => filesize($mailConfigPath) . ' bytes'
    ];
} else {
    $checks['mail_config'] = [
        'status' => 'missing',
        'path' => $mailConfigPath
    ];
}

// 2. Verificar archivo de base de datos
$dbPath = __DIR__ . '/../includes/db.php';
if (file_exists($dbPath)) {
    $checks['database_config'] = [
        'status' => 'exists',
        'path' => $dbPath,
        'size' => filesize($dbPath) . ' bytes'
    ];
} else {
    $checks['database_config'] = [
        'status' => 'missing',
        'path' => $dbPath
    ];
}

// 3. Verificar APIs de verificación
$apis = [
    'send-verification-code.php',
    'verify-code.php',
    'resend-verification-code.php'
];

foreach ($apis as $api) {
    $apiPath = __DIR__ . '/auth/' . $api;
    if (file_exists($apiPath)) {
        $checks['api_' . str_replace('.php', '', $api)] = [
            'status' => 'exists',
            'path' => $apiPath,
            'size' => filesize($apiPath) . ' bytes'
        ];
    } else {
        $checks['api_' . str_replace('.php', '', $api)] = [
            'status' => 'missing',
            'path' => $apiPath
        ];
    }
}

// 4. Verificar si PHPMailer está disponible
if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    $checks['phpmailer'] = [
        'status' => 'available',
        'version' => 'Installed'
    ];
} else {
    $checks['phpmailer'] = [
        'status' => 'not_available',
        'fallback' => 'mail() function'
    ];
}

// 5. Verificar conexión a base de datos
try {
    require_once __DIR__ . '/../includes/db.php';
    if (isset($conn) && $conn->ping()) {
        $checks['database_connection'] = [
            'status' => 'connected',
            'host' => 'localhost',
            'database' => 'proyecto_restaurante_react'
        ];
        
        // Verificar si la tabla pending_registrations existe
        $result = $conn->query("SHOW TABLES LIKE 'pending_registrations'");
        if ($result && $result->num_rows > 0) {
            $checks['pending_table'] = ['status' => 'exists'];
        } else {
            $checks['pending_table'] = ['status' => 'missing'];
        }
    } else {
        $checks['database_connection'] = [
            'status' => 'failed',
            'error' => 'Connection failed'
        ];
    }
} catch (Exception $e) {
    $checks['database_connection'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// Respuesta final
$response = [
    'status' => 'success',
    'message' => 'Diagnóstico completado',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown'
    ],
    'checks' => $checks,
    'recommendations' => []
];

// Generar recomendaciones basadas en los checks
if (isset($checks['database_connection']) && $checks['database_connection']['status'] !== 'connected') {
    $response['recommendations'][] = 'Verificar la conexión a la base de datos';
}

if (isset($checks['mail_config']) && $checks['mail_config']['status'] === 'missing') {
    $response['recommendations'][] = 'Verificar el archivo de configuración de correo';
}

if (isset($checks['pending_table']) && $checks['pending_table']['status'] === 'missing') {
    $response['recommendations'][] = 'Ejecutar el script SQL para crear la tabla pending_registrations';
}

// Enviar respuesta JSON limpia
echo json_encode($response);
exit();
?>