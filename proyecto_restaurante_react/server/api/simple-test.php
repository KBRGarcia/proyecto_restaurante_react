<?php
/**
 * Script de Prueba Simple para Verificar Conectividad
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [
    'status' => 'success',
    'message' => 'Script funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
];

echo json_encode($response);
exit();
?>
