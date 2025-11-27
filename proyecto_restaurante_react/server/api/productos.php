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
    // Verificar si la tabla producto_sucursal existe
    $check_table = $conn->query("SHOW TABLES LIKE 'producto_sucursal'");
    $tabla_producto_sucursal_existe = $check_table && $check_table->num_rows > 0;
    
    // Obtener filtro de sucursales si existe
    $sucursales_filtro = isset($_GET['sucursales']) ? $_GET['sucursales'] : null;
    
    // Construir query base
    if ($sucursales_filtro && $tabla_producto_sucursal_existe) {
        // Filtrar por sucursales específicas (solo si la tabla existe)
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
                    p.name as nombre,
                    p.description as descripcion,
                    p.price as precio,
                    p.category_id as categoria_id,
                    p.image as imagen,
                    p.status as estado,
                    p.created_at as fecha_creacion,
                    p.preparation_time as tiempo_preparacion,
                    p.ingredients as ingredientes,
                    p.is_special as es_especial,
                    c.name as categoria_nombre,
                    GROUP_CONCAT(DISTINCT b.id) as sucursal_ids,
                    GROUP_CONCAT(DISTINCT b.name SEPARATOR ', ') as sucursal_nombres
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                INNER JOIN producto_sucursal ps ON p.id = ps.producto_id
                LEFT JOIN branches b ON ps.sucursal_id = b.id
                WHERE p.status = 'active' 
                    AND ps.disponible = TRUE
                    AND ps.sucursal_id IN ($placeholders)
                    AND b.active = TRUE
                GROUP BY p.id
                ORDER BY p.is_special DESC, p.id DESC";
        
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Error preparando consulta: ' . $conn->error);
        }
        
        // Bind parameters dinámicamente
        $types = str_repeat('i', count($sucursal_ids));
        $stmt->bind_param($types, ...$sucursal_ids);
        
        if (!$stmt->execute()) {
            throw new Exception('Error ejecutando consulta: ' . $stmt->error);
        }
        
        $result = $stmt->get_result();
        
    } else {
        // Sin filtro o tabla producto_sucursal no existe: mostrar todos los productos
        if ($tabla_producto_sucursal_existe) {
            // Query con JOIN a producto_sucursal (sin filtro)
            $sql = "SELECT DISTINCT
                        p.id,
                        p.name as nombre,
                        p.description as descripcion,
                        p.price as precio,
                        p.category_id as categoria_id,
                        p.image as imagen,
                        p.status as estado,
                        p.created_at as fecha_creacion,
                        p.preparation_time as tiempo_preparacion,
                        p.ingredients as ingredientes,
                        p.is_special as es_especial,
                        c.name as categoria_nombre,
                        GROUP_CONCAT(DISTINCT ps.sucursal_id) as sucursal_ids,
                        GROUP_CONCAT(DISTINCT b.name SEPARATOR ', ') as sucursal_nombres
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN producto_sucursal ps ON p.id = ps.producto_id
                    LEFT JOIN branches b ON ps.sucursal_id = b.id AND b.active = TRUE
                    WHERE p.status = 'active'
                    GROUP BY p.id
                    ORDER BY p.is_special DESC, p.id DESC";
        } else {
            // Query sin producto_sucursal (fallback)
            $sql = "SELECT 
                        p.id,
                        p.name as nombre,
                        p.description as descripcion,
                        p.price as precio,
                        p.category_id as categoria_id,
                        p.image as imagen,
                        p.status as estado,
                        p.created_at as fecha_creacion,
                        p.preparation_time as tiempo_preparacion,
                        p.ingredients as ingredientes,
                        p.is_special as es_especial,
                        c.name as categoria_nombre,
                        NULL as sucursal_ids,
                        NULL as sucursal_nombres
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE p.status = 'active'
                    ORDER BY p.is_special DESC, p.id DESC";
        }
        
        $result = $conn->query($sql);
        
        if (!$result) {
            throw new Exception('Error al obtener productos: ' . $conn->error);
        }
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
            $row['categoria_id'] = $row['categoria_id'] ? (int) $row['categoria_id'] : null;
            $row['tiempo_preparacion'] = (int) $row['tiempo_preparacion'];
            
            $productos[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $productos,
            'filtro_aplicado' => ($sucursales_filtro && $tabla_producto_sucursal_existe) ? true : false,
            'total' => count($productos),
            'warning' => !$tabla_producto_sucursal_existe ? 'La tabla producto_sucursal no existe. Ejecuta el script SQL: 27-11-2025_02-producto_sucursal_table.sql' : null
        ], JSON_UNESCAPED_UNICODE);
    } else {
        throw new Exception('Error al obtener productos: ' . $conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_detail' => $conn->error ?? null,
        'sql_state' => $conn->sqlstate ?? null
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>

