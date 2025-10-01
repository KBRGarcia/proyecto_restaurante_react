<?php
/**
 * Script de Prueba de API
 * Úsalo para verificar que XAMPP y la API están funcionando
 * Accede a: http://localhost/codigos-ika%20XAMPP/proyecto_restaurante_react/api/test.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Información del servidor
$info = [
    'success' => true,
    'message' => '✅ API funcionando correctamente!',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => [
        'PHP_VERSION' => PHP_VERSION,
        'SERVER_SOFTWARE' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconocido',
        'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'],
        'SCRIPT_FILENAME' => __FILE__,
    ],
    'paths' => [
        'current_dir' => __DIR__,
        'db_file_exists' => file_exists("../includes/db.php"),
        'db_file_path' => realpath("../includes/db.php") ?: 'No encontrado',
    ]
];

// Probar conexión a base de datos
if (file_exists("../includes/db.php")) {
    include("../includes/db.php");
    
    if (isset($conn)) {
        if ($conn->connect_error) {
            $info['database'] = [
                'connected' => false,
                'error' => $conn->connect_error
            ];
        } else {
            // Probar consulta simple
            $result = $conn->query("SELECT COUNT(*) as total FROM productos");
            
            if ($result) {
                $row = $result->fetch_assoc();
                $info['database'] = [
                    'connected' => true,
                    'total_productos' => $row['total']
                ];
            } else {
                $info['database'] = [
                    'connected' => true,
                    'query_error' => $conn->error
                ];
            }
            
            $conn->close();
        }
    } else {
        $info['database'] = [
            'connected' => false,
            'error' => 'Variable $conn no definida en db.php'
        ];
    }
} else {
    $info['database'] = [
        'connected' => false,
        'error' => 'Archivo db.php no encontrado'
    ];
}

echo json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>

