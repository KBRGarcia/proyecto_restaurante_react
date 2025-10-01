<?php
// API REST para que React consuma los datos
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Solo para desarrollo
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar que el archivo de conexión existe
if (!file_exists("../includes/db.php")) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: Archivo de conexión no encontrado',
        'debug' => 'Ruta: ' . __DIR__ . '/../includes/db.php'
    ]);
    exit();
}

include("../includes/db.php");

// Verificar conexión a la base de datos
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos',
        'debug' => isset($conn) ? $conn->connect_error : 'Variable $conn no definida'
    ]);
    exit();
}

try {
    $sql = "SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.estado = 'activo' 
            ORDER BY p.id DESC";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $productos = [];
        while($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $productos
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener productos'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>

