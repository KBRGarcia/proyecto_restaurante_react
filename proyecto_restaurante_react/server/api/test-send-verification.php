<?php
/**
 * Script de Prueba para send-verification-code.php
 * 
 * Este script simula una llamada al endpoint de envío de código
 * para diagnosticar problemas específicos
 */

// Configurar headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Verificar dependencias paso a paso
$checks = [];

// 1. Verificar archivo de configuración
try {
    require_once __DIR__ . '/../config/verification-mail-simple.php';
    $checks['config_file'] = ['status' => 'loaded'];
} catch (Exception $e) {
    $checks['config_file'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// 2. Verificar función setCorsHeaders
try {
    if (function_exists('setCorsHeaders')) {
        $checks['cors_function'] = ['status' => 'available'];
    } else {
        $checks['cors_function'] = ['status' => 'missing'];
    }
} catch (Exception $e) {
    $checks['cors_function'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// 3. Verificar función getMailConfig
try {
    if (function_exists('getMailConfig')) {
        $config = getMailConfig();
        $checks['mail_config'] = ['status' => 'available', 'config' => $config];
    } else {
        $checks['mail_config'] = ['status' => 'missing'];
    }
} catch (Exception $e) {
    $checks['mail_config'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// 4. Verificar función generateCode
try {
    if (function_exists('generateCode')) {
        $testCode = generateCode(6);
        $checks['generate_code'] = ['status' => 'available', 'test_code' => $testCode];
    } else {
        $checks['generate_code'] = ['status' => 'missing'];
    }
} catch (Exception $e) {
    $checks['generate_code'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// 5. Verificar conexión a base de datos
try {
    require_once __DIR__ . '/../includes/db.php';
    if (isset($conn) && $conn->ping()) {
        $checks['database'] = ['status' => 'connected'];
        
        // Verificar si la tabla existe
        $result = $conn->query("SHOW TABLES LIKE 'pending_registrations'");
        if ($result && $result->num_rows > 0) {
            $checks['pending_table'] = ['status' => 'exists'];
        } else {
            $checks['pending_table'] = ['status' => 'missing'];
        }
    } else {
        $checks['database'] = ['status' => 'failed'];
    }
} catch (Exception $e) {
    $checks['database'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// 6. Verificar función sendVerificationEmail
try {
    if (function_exists('sendVerificationEmail')) {
        $checks['send_email'] = ['status' => 'available'];
    } else {
        $checks['send_email'] = ['status' => 'missing'];
    }
} catch (Exception $e) {
    $checks['send_email'] = ['status' => 'error', 'error' => $e->getMessage()];
}

// Respuesta final
$response = [
    'status' => 'diagnostic_complete',
    'message' => 'Diagnóstico del endpoint completado',
    'timestamp' => date('Y-m-d H:i:s'),
    'checks' => $checks,
    'recommendations' => []
];

// Generar recomendaciones basadas en los checks
if (isset($checks['pending_table']) && $checks['pending_table']['status'] === 'missing') {
    $response['recommendations'][] = 'Ejecutar el script SQL para crear la tabla pending_registrations';
}

if (isset($checks['database']) && $checks['database']['status'] !== 'connected') {
    $response['recommendations'][] = 'Verificar la conexión a la base de datos';
}

if (isset($checks['config_file']) && $checks['config_file']['status'] === 'error') {
    $response['recommendations'][] = 'Verificar el archivo de configuración de correo';
}

echo json_encode($response);
exit();
?>