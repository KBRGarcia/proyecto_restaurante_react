<?php
/**
 * API REST para Productos
 * Soporta filtrado por sucursales
 * 
 * Parámetros GET:
 * - sucursales: IDs de sucursales separados por coma (ej: 1,2,3)
 * 
 * Fuente: https://www.php.net/manual/es/language.oop5.php
 */

header('Content-Type: application/json; charset=utf-8');
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
    ], JSON_UNESCAPED_UNICODE);
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
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Establecer charset UTF-8
$conn->set_charset("utf8mb4");

try {
    // Obtener filtro de sucursales si existe
    $sucursales_filtro = isset($_GET['sucursales']) ? $_GET['sucursales'] : null;
    
    // Construir query base
    if ($sucursales_filtro) {
        // Filtrar por sucursales específicas
        // Convertir string de IDs a array y validar
        $sucursal_ids = array_filter(
            array_map('intval', explode(',', $sucursales_filtro)),
            function($id) { return $id > 0; }
        );
        
        if (empty($sucursal_ids)) {
            throw new Exception('IDs de sucursales no válidos');
        }
        
        // Crear placeholders para prepared statement
        $placeholders = implode(',', array_fill(0, count($sucursal_ids), '?'));
        
        // Query con JOIN a producto_sucursal
        $sql = "SELECT DISTINCT 
                    p.id,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.categoria_id,
                    p.imagen,
                    p.estado,
                    p.fecha_creacion,
                    p.tiempo_preparacion,
                    p.ingredientes,
                    p.es_especial,
                    c.nombre as categoria_nombre,
                    GROUP_CONCAT(DISTINCT b.id) as sucursal_ids,
                    GROUP_CONCAT(DISTINCT b.nombre SEPARATOR ', ') as sucursal_nombres
                FROM productos p 
                LEFT JOIN categorias c ON p.categoria_id = c.id
                INNER JOIN producto_sucursal ps ON p.id = ps.producto_id
                LEFT JOIN branches b ON ps.sucursal_id = b.id
                WHERE p.estado = 'activo' 
                    AND ps.disponible = TRUE
                    AND ps.sucursal_id IN ($placeholders)
                    AND b.activo = TRUE
                GROUP BY p.id
                ORDER BY p.es_especial DESC, p.id DESC";
        
        $stmt = $conn->prepare($sql);
        
        // Bind parameters dinámicamente
        $types = str_repeat('i', count($sucursal_ids));
        $stmt->bind_param($types, ...$sucursal_ids);
        
        $stmt->execute();
        $result = $stmt->get_result();
        
    } else {
        // Sin filtro: mostrar todos los productos con sus sucursales
        $sql = "SELECT DISTINCT
                    p.id,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.categoria_id,
                    p.imagen,
                    p.estado,
                    p.fecha_creacion,
                    p.tiempo_preparacion,
                    p.ingredientes,
                    p.es_especial,
                    c.nombre as categoria_nombre,
                    GROUP_CONCAT(DISTINCT ps.sucursal_id) as sucursal_ids,
                    GROUP_CONCAT(DISTINCT b.nombre SEPARATOR ', ') as sucursal_nombres
                FROM productos p 
                LEFT JOIN categorias c ON p.categoria_id = c.id
                LEFT JOIN producto_sucursal ps ON p.id = ps.producto_id
                LEFT JOIN branches b ON ps.sucursal_id = b.id AND b.activo = TRUE
                WHERE p.estado = 'activo'
                GROUP BY p.id
                ORDER BY p.es_especial DESC, p.id DESC";
        
        $result = $conn->query($sql);
    }
    
    if ($result) {
        $productos = [];
        while($row = $result->fetch_assoc()) {
            // Convertir sucursal_ids de string a array de números
            if (!empty($row['sucursal_ids'])) {
                $row['sucursal_ids'] = array_map('intval', explode(',', $row['sucursal_ids']));
            } else {
                $row['sucursal_ids'] = [];
            }
            
            // Convertir valores booleanos
            $row['es_especial'] = (bool) $row['es_especial'];
            
            // Convertir valores numéricos
            $row['id'] = (int) $row['id'];
            $row['precio'] = (float) $row['precio'];
            $row['categoria_id'] = (int) $row['categoria_id'];
            $row['tiempo_preparacion'] = (int) $row['tiempo_preparacion'];
            
            $productos[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $productos,
            'filtro_aplicado' => $sucursales_filtro ? true : false,
            'total' => count($productos)
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('Error al obtener productos: ' . $conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>

