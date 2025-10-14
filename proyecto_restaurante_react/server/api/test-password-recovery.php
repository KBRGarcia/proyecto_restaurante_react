<?php
/**
 * Script de Prueba para Endpoint de Recuperación de Contraseña
 * 
 * Este script prueba específicamente el endpoint request-password-recovery.php
 */

// Configurar headers para JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$checks = [];

// 1. Verificar que el endpoint existe
$endpointPath = __DIR__ . '/auth/request-password-recovery.php';
$checks['endpoint_exists'] = [
    'path' => $endpointPath,
    'exists' => file_exists($endpointPath),
    'readable' => is_readable($endpointPath)
];

// 2. Verificar archivos de dependencias
$dependencies = [
    'config' => __DIR__ . '/../config/verification-mail-simple.php',
    'database' => __DIR__ . '/../includes/db.php'
];

foreach ($dependencies as $name => $path) {
    $checks["dependency_{$name}"] = [
        'path' => $path,
        'exists' => file_exists($path),
        'readable' => is_readable($path)
    ];
}

// 3. Intentar cargar dependencias
try {
    require_once $dependencies['config'];
    $checks['config_load'] = [
        'status' => 'success',
        'functions' => [
            'sendPasswordRecoveryEmail' => function_exists('sendPasswordRecoveryEmail'),
            'generateCode' => function_exists('generateCode'),
            'getMailConfig' => function_exists('getMailConfig')
        ]
    ];
} catch (Exception $e) {
    $checks['config_load'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

try {
    require_once $dependencies['database'];
    $checks['database_load'] = [
        'status' => 'success',
        'connection_exists' => isset($conn),
        'ping' => isset($conn) ? $conn->ping() : false
    ];
} catch (Exception $e) {
    $checks['database_load'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// 4. Verificar tabla de recuperación
if (isset($conn)) {
    try {
        $result = $conn->query("SHOW TABLES LIKE 'password_reset_codes'");
        $checks['recovery_table'] = [
            'exists' => $result->num_rows > 0,
            'count' => $result->num_rows
        ];
        
        if ($result->num_rows > 0) {
            $desc = $conn->query("DESCRIBE password_reset_codes");
            $checks['recovery_table']['structure'] = $desc->fetch_all(MYSQLI_ASSOC);
        }
    } catch (Exception $e) {
        $checks['recovery_table'] = [
            'error' => $e->getMessage()
        ];
    }
}

// 5. Simular una llamada al endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Simular datos de entrada
        $testEmail = 'test@example.com';
        
        // Verificar si el email existe en la base de datos
        if (isset($conn)) {
            $stmt = $conn->prepare("SELECT id, correo FROM usuarios WHERE correo = ? LIMIT 1");
            $stmt->bind_param("s", $testEmail);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $checks['email_check'] = [
                'email' => $testEmail,
                'exists' => $result->num_rows > 0,
                'user_data' => $result->num_rows > 0 ? $result->fetch_assoc() : null
            ];
        }
        
        // Simular generación de código
        if (function_exists('generateCode')) {
            $testCode = generateCode();
            $checks['code_generation'] = [
                'status' => 'success',
                'code' => $testCode,
                'length' => strlen($testCode)
            ];
        }
        
        // Simular envío de correo (sin enviar realmente)
        if (function_exists('sendPasswordRecoveryEmail')) {
            $checks['email_send_simulation'] = [
                'status' => 'ready',
                'function_available' => true
            ];
        }
        
    } catch (Exception $e) {
        $checks['simulation_error'] = [
            'error' => $e->getMessage()
        ];
    }
}

// Respuesta final
echo json_encode([
    'success' => true,
    'message' => 'Diagnóstico de recuperación de contraseña completado',
    'checks' => $checks,
    'timestamp' => date('Y-m-d H:i:s'),
    'method' => $_SERVER['REQUEST_METHOD']
], JSON_PRETTY_PRINT);
?>
