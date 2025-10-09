<?php
/**
 * Script de Prueba de Conexión
 * 
 * Este archivo simple te ayuda a verificar:
 * 1. Que Apache está corriendo
 * 2. Que PHP funciona correctamente
 * 3. Que CORS está configurado
 * 4. Que la base de datos se puede conectar
 */

// Headers CORS - Permitir cualquier puerto de localhost
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:3000');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Información del sistema
$resultado = [
    'success' => true,
    'message' => '¡Servidor PHP funcionando correctamente!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'],
];

// Probar conexión a base de datos
try {
    require_once __DIR__ . '/../includes/db.php';
    
    // Verificar que $conn existe
    if (isset($conn) && $conn->ping()) {
        $resultado['database'] = [
            'status' => 'Conectada',
            'host' => $conn->host_info
        ];
        
        // Contar productos
        $countQuery = $conn->query("SELECT COUNT(*) as total FROM productos");
        if ($countQuery) {
            $count = $countQuery->fetch_assoc();
            $resultado['database']['productos_count'] = $count['total'];
        }
        
        // Contar categorías
        $catQuery = $conn->query("SELECT COUNT(*) as total FROM categorias");
        if ($catQuery) {
            $count = $catQuery->fetch_assoc();
            $resultado['database']['categorias_count'] = $count['total'];
        }
        
        $conn->close();
    } else {
        $resultado['database'] = [
            'status' => 'No conectada',
            'error' => 'Ping falló'
        ];
    }
} catch (Exception $e) {
    $resultado['database'] = [
        'status' => 'Error',
        'error' => $e->getMessage()
    ];
}

// Verificar archivos necesarios
$resultado['files'] = [
    'db.php' => file_exists(__DIR__ . '/../includes/db.php') ? '✅ Existe' : '❌ Faltante',
    'auth.php' => file_exists(__DIR__ . '/../includes/auth.php') ? '✅ Existe' : '❌ Faltante',
    'productos-admin.php' => file_exists(__DIR__ . '/admin/productos-admin.php') ? '✅ Existe' : '❌ Faltante'
];

echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>

