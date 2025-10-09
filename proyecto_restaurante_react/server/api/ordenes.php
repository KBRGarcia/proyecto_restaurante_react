<?php
/**
 * API para Gestión de Órdenes
 * 
 * Endpoints:
 * GET    /api/ordenes.php                    - Obtener órdenes del usuario autenticado
 * GET    /api/ordenes.php?id={id}           - Obtener detalle de una orden específica
 * POST   /api/ordenes.php                    - Crear nueva orden
 * PUT    /api/ordenes.php?id={id}           - Actualizar estado de orden (admin/empleado)
 * DELETE /api/ordenes.php?id={id}           - Cancelar orden
 * 
 * Fuentes oficiales:
 * - PHP MySQLi: https://www.php.net/manual/es/book.mysqli.php
 * - PHP JSON: https://www.php.net/manual/es/ref.json.php
 * - REST API Best Practices: https://restfulapi.net/
 */

// Configurar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Buffer de salida
ob_start();

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivos necesarios
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';

// Verificar autenticación
$auth_result = verificarAuth();
if (!$auth_result['success']) {
    ob_clean();
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => $auth_result['message']]);
    ob_end_flush();
    exit();
}

$usuario = $auth_result['usuario'];
$metodo = $_SERVER['REQUEST_METHOD'];
$orden_id = $_GET['id'] ?? null;

try {
    switch ($metodo) {
        case 'GET':
            if ($orden_id) {
                obtenerOrdenDetalle($conn, $usuario, $orden_id);
            } else {
                obtenerOrdenesUsuario($conn, $usuario);
            }
            break;
        
        case 'POST':
            crearOrden($conn, $usuario);
            break;
        
        case 'PUT':
            actualizarOrden($conn, $usuario, $orden_id);
            break;
        
        case 'DELETE':
            cancelarOrden($conn, $usuario, $orden_id);
            break;
        
        default:
            ob_clean();
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            ob_end_flush();
            break;
    }
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
    ob_end_flush();
}

/**
 * Obtener todas las órdenes del usuario autenticado
 */
function obtenerOrdenesUsuario($conn, $usuario) {
    try {
        $usuario_id = $usuario['id'];
        
        // Query para obtener órdenes del usuario
        $sql = "SELECT 
                    id,
                    usuario_id,
                    estado,
                    tipo_servicio,
                    subtotal,
                    impuestos,
                    total,
                    direccion_entrega,
                    telefono_contacto,
                    notas_especiales,
                    fecha_orden,
                    fecha_entrega_estimada,
                    empleado_asignado_id
                FROM ordenes
                WHERE usuario_id = ?
                ORDER BY fecha_orden DESC";
        
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Error preparando consulta: ' . $conn->error);
        }
        
        $stmt->bind_param("i", $usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $ordenes = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Convertir números a float
                $row['subtotal'] = (float)$row['subtotal'];
                $row['impuestos'] = (float)$row['impuestos'];
                $row['total'] = (float)$row['total'];
                $ordenes[] = $row;
            }
        }
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $ordenes,
            'total' => count($ordenes)
        ]);
        ob_end_flush();
        
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener órdenes',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Obtener detalle de una orden específica con sus productos
 */
function obtenerOrdenDetalle($conn, $usuario, $orden_id) {
    try {
        if (!$orden_id) {
            throw new Exception('ID de orden requerido');
        }
        
        $usuario_id = $usuario['id'];
        
        // Obtener información de la orden
        $sql = "SELECT 
                    o.id,
                    o.usuario_id,
                    o.estado,
                    o.tipo_servicio,
                    o.subtotal,
                    o.impuestos,
                    o.total,
                    o.direccion_entrega,
                    o.telefono_contacto,
                    o.notas_especiales,
                    o.fecha_orden,
                    o.fecha_entrega_estimada,
                    o.empleado_asignado_id
                FROM ordenes o
                WHERE o.id = ? AND o.usuario_id = ?";
        
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Error preparando consulta');
        }
        
        $stmt->bind_param("ii", $orden_id, $usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            ob_clean();
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Orden no encontrada'
            ]);
            ob_end_flush();
            return;
        }
        
        $orden = $result->fetch_assoc();
        $orden['subtotal'] = (float)$orden['subtotal'];
        $orden['impuestos'] = (float)$orden['impuestos'];
        $orden['total'] = (float)$orden['total'];
        
        // Obtener detalles de productos
        $sql_detalles = "SELECT 
                            od.id,
                            od.producto_id,
                            od.cantidad,
                            od.precio_unitario,
                            od.subtotal,
                            od.notas_producto,
                            p.nombre as producto_nombre,
                            p.descripcion as producto_descripcion,
                            p.imagen as producto_imagen
                        FROM orden_detalles od
                        JOIN productos p ON od.producto_id = p.id
                        WHERE od.orden_id = ?";
        
        $stmt_detalles = $conn->prepare($sql_detalles);
        $stmt_detalles->bind_param("i", $orden_id);
        $stmt_detalles->execute();
        $result_detalles = $stmt_detalles->get_result();
        
        $detalles = [];
        if ($result_detalles && $result_detalles->num_rows > 0) {
            while ($row = $result_detalles->fetch_assoc()) {
                $row['precio_unitario'] = (float)$row['precio_unitario'];
                $row['subtotal'] = (float)$row['subtotal'];
                $row['cantidad'] = (int)$row['cantidad'];
                $detalles[] = $row;
            }
        }
        
        $orden['detalles'] = $detalles;
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $orden
        ]);
        ob_end_flush();
        
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener detalle de orden',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Crear nueva orden
 */
function crearOrden($conn, $usuario) {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar datos requeridos
        if (!isset($data['tipo_servicio']) || !isset($data['productos']) || empty($data['productos'])) {
            throw new Exception('Datos incompletos para crear la orden');
        }
        
        $usuario_id = $usuario['id'];
        $tipo_servicio = $data['tipo_servicio'];
        $direccion_entrega = $data['direccion_entrega'] ?? null;
        $telefono_contacto = $data['telefono_contacto'] ?? null;
        $notas_especiales = $data['notas_especiales'] ?? null;
        
        // Calcular totales
        $subtotal = 0;
        foreach ($data['productos'] as $producto) {
            $subtotal += $producto['precio'] * $producto['cantidad'];
        }
        
        $impuestos = $subtotal * 0.16; // 16% IVA
        $total = $subtotal + $impuestos;
        
        // Iniciar transacción
        $conn->begin_transaction();
        
        // Insertar orden
        $sql = "INSERT INTO ordenes (
                    usuario_id, 
                    tipo_servicio, 
                    subtotal, 
                    impuestos, 
                    total, 
                    direccion_entrega, 
                    telefono_contacto, 
                    notas_especiales
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "isdddsss",
            $usuario_id,
            $tipo_servicio,
            $subtotal,
            $impuestos,
            $total,
            $direccion_entrega,
            $telefono_contacto,
            $notas_especiales
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Error al crear la orden');
        }
        
        $orden_id = $conn->insert_id;
        
        // Insertar detalles
        $sql_detalle = "INSERT INTO orden_detalles (
                            orden_id, 
                            producto_id, 
                            cantidad, 
                            precio_unitario, 
                            subtotal, 
                            notas_producto
                        ) VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt_detalle = $conn->prepare($sql_detalle);
        
        foreach ($data['productos'] as $producto) {
            $producto_subtotal = $producto['precio'] * $producto['cantidad'];
            $notas_producto = $producto['notas'] ?? null;
            
            $stmt_detalle->bind_param(
                "iiidds",
                $orden_id,
                $producto['id'],
                $producto['cantidad'],
                $producto['precio'],
                $producto_subtotal,
                $notas_producto
            );
            
            if (!$stmt_detalle->execute()) {
                throw new Exception('Error al insertar detalle de producto');
            }
        }
        
        // Confirmar transacción
        $conn->commit();
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Orden creada exitosamente',
            'orden_id' => $orden_id
        ]);
        ob_end_flush();
        
    } catch (Exception $e) {
        $conn->rollback();
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al crear orden',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Actualizar estado de orden (solo admin/empleado)
 */
function actualizarOrden($conn, $usuario, $orden_id) {
    try {
        if (!$orden_id) {
            throw new Exception('ID de orden requerido');
        }
        
        // Solo admin y empleado pueden actualizar órdenes
        if ($usuario['rol'] !== 'admin' && $usuario['rol'] !== 'empleado') {
            ob_clean();
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'No tienes permisos para actualizar órdenes'
            ]);
            ob_end_flush();
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $nuevo_estado = $data['estado'] ?? null;
        
        if (!$nuevo_estado) {
            throw new Exception('Estado requerido');
        }
        
        $sql = "UPDATE ordenes SET estado = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $nuevo_estado, $orden_id);
        
        if ($stmt->execute()) {
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Orden actualizada exitosamente'
            ]);
            ob_end_flush();
        } else {
            throw new Exception('Error al actualizar orden');
        }
        
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar orden',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Cancelar orden (solo si está pendiente)
 */
function cancelarOrden($conn, $usuario, $orden_id) {
    try {
        if (!$orden_id) {
            throw new Exception('ID de orden requerido');
        }
        
        $usuario_id = $usuario['id'];
        
        // Verificar que la orden pertenece al usuario y está pendiente
        $sql = "SELECT estado FROM ordenes WHERE id = ? AND usuario_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $orden_id, $usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            ob_clean();
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Orden no encontrada'
            ]);
            ob_end_flush();
            return;
        }
        
        $orden = $result->fetch_assoc();
        
        if ($orden['estado'] !== 'pendiente') {
            ob_clean();
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Solo se pueden cancelar órdenes pendientes'
            ]);
            ob_end_flush();
            return;
        }
        
        // Actualizar estado a cancelado
        $sql_update = "UPDATE ordenes SET estado = 'cancelado' WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("i", $orden_id);
        
        if ($stmt_update->execute()) {
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Orden cancelada exitosamente'
            ]);
            ob_end_flush();
        } else {
            throw new Exception('Error al cancelar orden');
        }
        
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al cancelar orden',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}
?>

