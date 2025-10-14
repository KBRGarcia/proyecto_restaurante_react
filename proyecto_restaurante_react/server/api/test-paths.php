<?php
/**
 * Script de Prueba Simple para Diagnóstico de Rutas
 * 
 * Este script verifica las rutas y archivos básicos
 */

// Configurar headers para JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$checks = [];

// 1. Verificar directorio actual
$checks['current_dir'] = [
    'path' => __DIR__,
    'realpath' => realpath(__DIR__)
];

// 2. Verificar archivo db.php
$dbPath = __DIR__ . '/../includes/db.php';
$checks['db_file'] = [
    'path' => $dbPath,
    'exists' => file_exists($dbPath),
    'readable' => is_readable($dbPath)
];

// 3. Verificar archivo de configuración
$configPath = __DIR__ . '/../config/verification-mail-simple.php';
$checks['config_file'] = [
    'path' => $configPath,
    'exists' => file_exists($configPath),
    'readable' => is_readable($configPath)
];

// 4. Intentar cargar db.php
try {
    require_once $dbPath;
    $checks['db_load'] = [
        'status' => 'success',
        'connection_exists' => isset($conn)
    ];
    
    if (isset($conn)) {
        $checks['db_load']['ping'] = $conn->ping();
    }
} catch (Exception $e) {
    $checks['db_load'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// 5. Intentar cargar configuración
try {
    require_once $configPath;
    $checks['config_load'] = [
        'status' => 'success',
        'functions_available' => [
            'getMailConfig' => function_exists('getMailConfig'),
            'sendVerificationEmail' => function_exists('sendVerificationEmail'),
            'generateCode' => function_exists('generateCode')
        ]
    ];
} catch (Exception $e) {
    $checks['config_load'] = [
        'status' => 'error',
        'error' => $e->getMessage()
    ];
}

// Respuesta final
echo json_encode([
    'success' => true,
    'message' => 'Diagnóstico de rutas completado',
    'checks' => $checks,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>
