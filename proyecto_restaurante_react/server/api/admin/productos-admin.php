<?php
/**
 * API de Gestión de Productos (Admin)
 * 
 * Permite a los administradores:
 * - Crear nuevos productos
 * - Actualizar productos existentes
 * - Eliminar productos
 * 
 * Solo accesible para usuarios con rol 'admin'
 * 
 * @author Sistema Restaurante
 * @date 2025-10-09
 */

// Detectar el origen de la petición y permitir localhost en cualquier puerto
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:3000');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';

/**
 * Validar que el usuario sea admin
 */
function validarAdmin() {
    $resultado = verificarAuth();
    
    if (!$resultado['success']) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => $resultado['message']
        ]);
        exit();
    }
    
    $usuario = $resultado['usuario'];
    
    if ($usuario['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Acceso denegado. Solo administradores.'
        ]);
        exit();
    }
    
    return $usuario;
}

/**
 * Crear nuevo producto
 */
function crearProducto($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validaciones
    if (empty($input['nombre']) || empty($input['precio']) || empty($input['categoria_id'])) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Nombre, precio y categoría son obligatorios'
        ];
    }
    
    // Validar precio positivo
    if ($input['precio'] <= 0) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'El precio debe ser mayor a 0'
        ];
    }
    
    // Validar que se hayan seleccionado sucursales
    if (empty($input['sucursal_ids']) || !is_array($input['sucursal_ids'])) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Debes seleccionar al menos una sucursal'
        ];
    }
    
    try {
        // Iniciar transacción
        $conn->begin_transaction();
        
        $stmt = $conn->prepare("
            INSERT INTO products 
            (name, description, price, category_id, image, status, preparation_time, ingredients, is_special)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $nombre = $input['nombre'];
        $descripcion = $input['descripcion'] ?? '';
        $precio = $input['precio'];
        $categoria_id = $input['categoria_id'];
        $imagen = $input['imagen'] ?? null;
        $estado = $input['estado'] ?? 'active';
        // Convertir estado de español a inglés si es necesario
        if ($estado === 'activo') $estado = 'active';
        if ($estado === 'inactivo') $estado = 'inactive';
        if ($estado === 'agotado') $estado = 'out of stock';
        $tiempo_preparacion = $input['tiempo_preparacion'] ?? 15;
        $ingredientes = $input['ingredientes'] ?? '';
        $es_especial = isset($input['es_especial']) ? (int)$input['es_especial'] : 0;
        
        $stmt->bind_param(
            "ssdissisi",
            $nombre,
            $descripcion,
            $precio,
            $categoria_id,
            $imagen,
            $estado,
            $tiempo_preparacion,
            $ingredientes,
            $es_especial
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Error al crear el producto');
        }
        
        $producto_id = $conn->insert_id;
        
        // Asignar producto a sucursales
        $stmtSucursal = $conn->prepare("
            INSERT INTO producto_sucursal (producto_id, sucursal_id, disponible)
            VALUES (?, ?, TRUE)
        ");
        
        foreach ($input['sucursal_ids'] as $sucursal_id) {
            $sucursal_id = (int)$sucursal_id;
            $stmtSucursal->bind_param("ii", $producto_id, $sucursal_id);
            if (!$stmtSucursal->execute()) {
                throw new Exception('Error al asignar producto a sucursal');
            }
        }
        
        // Confirmar transacción
        $conn->commit();
        
        // Obtener el producto recién creado con el nombre de categoría
        $stmtGet = $conn->prepare("
            SELECT p.*, c.name as categoria_nombre 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");
        $stmtGet->bind_param("i", $producto_id);
        $stmtGet->execute();
        $result = $stmtGet->get_result();
        $producto = $result->fetch_assoc();
        
        return [
            'success' => true,
            'message' => 'Producto creado exitosamente',
            'data' => $producto
        ];
        
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $conn->rollback();
        
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Error al crear producto: ' . $e->getMessage()
        ];
    }
}

/**
 * Actualizar producto existente
 */
function actualizarProducto($conn, $id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar que el producto existe
    $stmtCheck = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmtCheck->bind_param("i", $id);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows === 0) {
        http_response_code(404);
        return [
            'success' => false,
            'message' => 'Producto no encontrado'
        ];
    }
    
    // Validaciones
    if (empty($input['nombre']) || empty($input['precio']) || empty($input['categoria_id'])) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Nombre, precio y categoría son obligatorios'
        ];
    }
    
    if ($input['precio'] <= 0) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'El precio debe ser mayor a 0'
        ];
    }
    
    // Validar sucursales si se proporcionan
    if (isset($input['sucursal_ids'])) {
        if (empty($input['sucursal_ids']) || !is_array($input['sucursal_ids'])) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'Debes seleccionar al menos una sucursal'
            ];
        }
    }
    
    try {
        // Iniciar transacción
        $conn->begin_transaction();
        
        $stmt = $conn->prepare("
            UPDATE products 
            SET name = ?, 
                description = ?, 
                price = ?, 
                category_id = ?, 
                image = ?, 
                status = ?, 
                preparation_time = ?,
                ingredients = ?,
                is_special = ?
            WHERE id = ?
        ");
        
        $nombre = $input['nombre'];
        $descripcion = $input['descripcion'] ?? '';
        $precio = $input['precio'];
        $categoria_id = $input['categoria_id'];
        $imagen = $input['imagen'] ?? null;
        $estado = $input['estado'] ?? 'active';
        // Convertir estado de español a inglés si es necesario
        if ($estado === 'activo') $estado = 'active';
        if ($estado === 'inactivo') $estado = 'inactive';
        if ($estado === 'agotado') $estado = 'out of stock';
        $tiempo_preparacion = $input['tiempo_preparacion'] ?? 15;
        $ingredientes = $input['ingredientes'] ?? '';
        $es_especial = isset($input['es_especial']) ? (int)$input['es_especial'] : 0;
        
        $stmt->bind_param(
            "ssdissisii",
            $nombre,
            $descripcion,
            $precio,
            $categoria_id,
            $imagen,
            $estado,
            $tiempo_preparacion,
            $ingredientes,
            $es_especial,
            $id
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Error al actualizar el producto');
        }
        
        // Actualizar asignación de sucursales si se proporcionan
        if (isset($input['sucursal_ids'])) {
            // Eliminar asignaciones anteriores
            $stmtDelete = $conn->prepare("DELETE FROM producto_sucursal WHERE producto_id = ?");
            $stmtDelete->bind_param("i", $id);
            $stmtDelete->execute();
            
            // Insertar nuevas asignaciones
            $stmtSucursal = $conn->prepare("
                INSERT INTO producto_sucursal (producto_id, sucursal_id, disponible)
                VALUES (?, ?, TRUE)
            ");
            
            foreach ($input['sucursal_ids'] as $sucursal_id) {
                $sucursal_id = (int)$sucursal_id;
                $stmtSucursal->bind_param("ii", $id, $sucursal_id);
                if (!$stmtSucursal->execute()) {
                    throw new Exception('Error al asignar producto a sucursal');
                }
            }
        }
        
        // Confirmar transacción
        $conn->commit();
        
        // Obtener el producto actualizado con el nombre de categoría
        $stmtGet = $conn->prepare("
            SELECT p.*, c.name as categoria_nombre 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        ");
        $stmtGet->bind_param("i", $id);
        $stmtGet->execute();
        $result = $stmtGet->get_result();
        $producto = $result->fetch_assoc();
        
        return [
            'success' => true,
            'message' => 'Producto actualizado exitosamente',
            'data' => $producto
        ];
        
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $conn->rollback();
        
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Error al actualizar producto: ' . $e->getMessage()
        ];
    }
}

/**
 * Eliminar producto
 */
function eliminarProducto($conn, $id) {
    // Validar que el producto existe
    $stmtCheck = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmtCheck->bind_param("i", $id);
    $stmtCheck->execute();
    if ($stmtCheck->get_result()->num_rows === 0) {
        http_response_code(404);
        return [
            'success' => false,
            'message' => 'Producto no encontrado'
        ];
    }
    
    try {
        // En lugar de eliminar, cambiar estado a 'inactive' (soft delete)
        $stmt = $conn->prepare("UPDATE products SET status = 'inactive' WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ];
        } else {
            throw new Exception('Error al eliminar el producto');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        return [
            'success' => false,
            'message' => 'Error al eliminar producto: ' . $e->getMessage()
        ];
    }
}

// ============================================
// MAIN - Enrutamiento de peticiones
// ============================================

try {
    // Validar que el usuario sea admin
    $usuario = validarAdmin();
    
    // Obtener ID del producto de la URL si existe
    $producto_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    // Enrutar según el método HTTP
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            // Crear nuevo producto
            $response = crearProducto($conn);
            break;
            
        case 'PUT':
            // Actualizar producto existente
            if (!$producto_id) {
                http_response_code(400);
                $response = [
                    'success' => false,
                    'message' => 'ID de producto requerido'
                ];
            } else {
                $response = actualizarProducto($conn, $producto_id);
            }
            break;
            
        case 'DELETE':
            // Eliminar producto
            if (!$producto_id) {
                http_response_code(400);
                $response = [
                    'success' => false,
                    'message' => 'ID de producto requerido'
                ];
            } else {
                $response = eliminarProducto($conn, $producto_id);
            }
            break;
            
        default:
            http_response_code(405);
            $response = [
                'success' => false,
                'message' => 'Método no permitido'
            ];
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>

