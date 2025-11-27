<?php
/**
 * API REST para Gestión de Sucursales
 * 
 * Endpoints disponibles:
 * - GET: Obtener todas las sucursales activas
 * - GET con id: Obtener una sucursal específica
 * 
 * Fuente: https://www.php.net/manual/es/language.oop5.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivo de conexión
if (!file_exists("../includes/db.php")) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: Archivo de conexión no encontrado'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

require_once("../includes/db.php");

// Verificar conexión a la base de datos
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Establecer charset UTF-8
$conn->set_charset("utf8mb4");

/**
 * Manejo de peticiones GET
 * Obtiene todas las sucursales o una específica por ID
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Verificar si se solicita una sucursal específica
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        
        if ($id) {
            // Obtener sucursal específica
            $stmt = $conn->prepare("
                SELECT 
                    id,
                    name as nombre,
                    address as direccion,
                    city as ciudad,
                    state as estado,
                    postal_code as codigo_postal,
                    phone as telefono,
                    email,
                    TIME_FORMAT(opening_time, '%H:%i') as horario_apertura,
                    TIME_FORMAT(closing_time, '%H:%i') as horario_cierre,
                    operation_days as dias_operacion,
                    latitude as latitud,
                    longitude as longitud,
                    is_main as es_principal,
                    has_delivery as tiene_delivery,
                    has_parking as tiene_estacionamiento,
                    capacity_people as capacidad_personas,
                    image as imagen,
                    description as descripcion,
                    active as activo,
                    DATE_FORMAT(opening_date, '%Y-%m-%d') as fecha_apertura,
                    manager as gerente,
                    DATE_FORMAT(creation_date, '%Y-%m-%d %H:%i:%s') as fecha_creacion
                FROM branches 
                WHERE id = ? AND active = TRUE
            ");
            
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $sucursal = $result->fetch_assoc();
                
                // Convertir valores booleanos
                $sucursal['es_principal'] = (bool) $sucursal['es_principal'];
                $sucursal['tiene_delivery'] = (bool) $sucursal['tiene_delivery'];
                $sucursal['tiene_estacionamiento'] = (bool) $sucursal['tiene_estacionamiento'];
                $sucursal['activo'] = (bool) $sucursal['activo'];
                
                // Convertir valores numéricos
                $sucursal['id'] = (int) $sucursal['id'];
                $sucursal['capacidad_personas'] = $sucursal['capacidad_personas'] ? (int) $sucursal['capacidad_personas'] : null;
                $sucursal['latitud'] = $sucursal['latitud'] ? (float) $sucursal['latitud'] : null;
                $sucursal['longitud'] = $sucursal['longitud'] ? (float) $sucursal['longitud'] : null;
                
                echo json_encode([
                    'success' => true,
                    'data' => $sucursal
                ], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Sucursal no encontrada'
                ], JSON_UNESCAPED_UNICODE);
            }
            
            $stmt->close();
        } else {
            // Obtener todas las sucursales activas
            $sql = "
                SELECT 
                    id,
                    name as nombre,
                    address as direccion,
                    city as ciudad,
                    state as estado,
                    postal_code as codigo_postal,
                    phone as telefono,
                    email,
                    TIME_FORMAT(opening_time, '%H:%i') as horario_apertura,
                    TIME_FORMAT(closing_time, '%H:%i') as horario_cierre,
                    operation_days as dias_operacion,
                    latitude as latitud,
                    longitude as longitud,
                    is_main as es_principal,
                    has_delivery as tiene_delivery,
                    has_parking as tiene_estacionamiento,
                    capacity_people as capacidad_personas,
                    image as imagen,
                    description as descripcion,
                    active as activo,
                    DATE_FORMAT(opening_date, '%Y-%m-%d') as fecha_apertura,
                    manager as gerente,
                    DATE_FORMAT(creation_date, '%Y-%m-%d %H:%i:%s') as fecha_creacion
                FROM branches 
                WHERE active = TRUE
                ORDER BY is_main DESC, city ASC, name ASC
            ";
            
            $result = $conn->query($sql);
            
            if ($result) {
                $sucursales = [];
                
                while ($row = $result->fetch_assoc()) {
                    // Convertir valores booleanos
                    $row['es_principal'] = (bool) $row['es_principal'];
                    $row['tiene_delivery'] = (bool) $row['tiene_delivery'];
                    $row['tiene_estacionamiento'] = (bool) $row['tiene_estacionamiento'];
                    $row['activo'] = (bool) $row['activo'];
                    
                    // Convertir valores numéricos
                    $row['id'] = (int) $row['id'];
                    $row['capacidad_personas'] = $row['capacidad_personas'] ? (int) $row['capacidad_personas'] : null;
                    $row['latitud'] = $row['latitud'] ? (float) $row['latitud'] : null;
                    $row['longitud'] = $row['longitud'] ? (float) $row['longitud'] : null;
                    
                    $sucursales[] = $row;
                }
                
                echo json_encode([
                    'success' => true,
                    'data' => $sucursales,
                    'total' => count($sucursales)
                ], JSON_UNESCAPED_UNICODE);
            } else {
                throw new Exception('Error al obtener las sucursales: ' . $conn->error);
            }
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error del servidor',
            'error' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Solo se acepta GET'
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>

