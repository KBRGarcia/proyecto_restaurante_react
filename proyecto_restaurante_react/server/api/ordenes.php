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
                    user_id as usuario_id,
                    status as estado,
                    service_type as tipo_servicio,
                    subtotal,
                    taxes as impuestos,
                    total,
                    delivery_address as direccion_entrega,
                    contact_phone as telefono_contacto,
                    special_notes as notas_especiales,
                    order_date as fecha_orden,
                    estimated_delivery_date as fecha_entrega_estimada,
                    assigned_employee_id as empleado_asignado_id,
                    pending_date as fecha_pendiente,
                    preparing_date as fecha_preparando,
                    ready_date as fecha_listo,
                    on_the_way_date as fecha_en_camino,
                    delivered_date as fecha_entregado,
                    canceled_date as fecha_cancelado
                FROM orders
                WHERE user_id = ?
                ORDER BY order_date DESC";
        
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
                    o.user_id as usuario_id,
                    o.status as estado,
                    o.service_type as tipo_servicio,
                    o.subtotal,
                    o.taxes as impuestos,
                    o.total,
                    o.delivery_address as direccion_entrega,
                    o.contact_phone as telefono_contacto,
                    o.special_notes as notas_especiales,
                    o.order_date as fecha_orden,
                    o.estimated_delivery_date as fecha_entrega_estimada,
                    o.assigned_employee_id as empleado_asignado_id,
                    o.pending_date as fecha_pendiente,
                    o.preparing_date as fecha_preparando,
                    o.ready_date as fecha_listo,
                    o.on_the_way_date as fecha_en_camino,
                    o.delivered_date as fecha_entregado,
                    o.canceled_date as fecha_cancelado
                FROM orders o
                WHERE o.id = ? AND o.user_id = ?";
        
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
                            od.product_id as producto_id,
                            od.quantity as cantidad,
                            od.unit_price as precio_unitario,
                            od.subtotal,
                            od.product_notes as notas_producto,
                            p.name as producto_nombre,
                            p.description as producto_descripcion,
                            p.image as producto_imagen
                        FROM order_details od
                        JOIN products p ON od.product_id = p.id
                        WHERE od.order_id = ?";
        
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
        
        // Convertir tipo_servicio de español a inglés
        $service_type = ($tipo_servicio === 'domicilio') ? 'delivery' : (($tipo_servicio === 'recoger') ? 'pickup' : $tipo_servicio);
        
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
        $sql = "INSERT INTO orders (
                    user_id, 
                    service_type, 
                    subtotal, 
                    taxes, 
                    total, 
                    delivery_address, 
                    contact_phone, 
                    special_notes,
                    pending_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "isdddsss",
            $usuario_id,
            $service_type,
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
        $sql_detalle = "INSERT INTO order_details (
                            order_id, 
                            product_id, 
                            quantity, 
                            unit_price, 
                            subtotal, 
                            product_notes
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
        if ($usuario['rol'] !== 'admin' && $usuario['rol'] !== 'employee') {
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
        
        // Convertir estado de español a inglés
        $estado_map = [
            'pendiente' => 'pending',
            'preparando' => 'preparing',
            'listo' => 'ready',
            'en_camino' => 'on_the_way',
            'entregado' => 'delivered',
            'cancelado' => 'canceled'
        ];
        $nuevo_estado_en = $estado_map[$nuevo_estado] ?? $nuevo_estado;
        
        // Actualizar estado y timestamp correspondiente
        $campo_timestamp = '';
        switch ($nuevo_estado_en) {
            case 'preparing':
                $campo_timestamp = 'preparing_date';
                break;
            case 'ready':
                $campo_timestamp = 'ready_date';
                break;
            case 'on_the_way':
                $campo_timestamp = 'on_the_way_date';
                break;
            case 'delivered':
                $campo_timestamp = 'delivered_date';
                break;
            case 'canceled':
                $campo_timestamp = 'canceled_date';
                break;
        }
        
        if ($campo_timestamp) {
            $sql = "UPDATE orders SET status = ?, $campo_timestamp = NOW() WHERE id = ?";
        } else {
            $sql = "UPDATE orders SET status = ? WHERE id = ?";
        }
        
        $nuevo_estado = $nuevo_estado_en;
        
        $stmt = $conn->prepare($sql);
        if ($campo_timestamp) {
            $stmt->bind_param("si", $nuevo_estado, $orden_id);
        } else {
            $stmt->bind_param("si", $nuevo_estado, $orden_id);
        }
        
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
 * Cancelar orden
 * - Usuarios: Solo pueden cancelar órdenes pendientes o preparando
 * - Admin/Empleado: Pueden cancelar en cualquier estado excepto entregado
 */
function cancelarOrden($conn, $usuario, $orden_id) {
    try {
        if (!$orden_id) {
            throw new Exception('ID de orden requerido');
        }
        
        $usuario_id = $usuario['id'];
        $es_admin = ($usuario['rol'] === 'admin' || $usuario['rol'] === 'employee');
        
        // Verificar que la orden existe y pertenece al usuario (o es admin)
        if ($es_admin) {
            $sql = "SELECT status as estado, user_id as usuario_id FROM orders WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $orden_id);
        } else {
            $sql = "SELECT status as estado, user_id as usuario_id FROM orders WHERE id = ? AND user_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $orden_id, $usuario_id);
        }
        
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
        
        // Convertir estado de inglés a español para validación
        $estado_es = $orden['estado'];
        $estado_map_inv = [
            'pending' => 'pendiente',
            'preparing' => 'preparando',
            'ready' => 'listo',
            'on_the_way' => 'en_camino',
            'delivered' => 'entregado',
            'canceled' => 'cancelado'
        ];
        $estado_es = $estado_map_inv[$estado_es] ?? $estado_es;
        
        // Validar que se puede cancelar según el rol
        if ($es_admin) {
            // Admin puede cancelar cualquier orden excepto las ya entregadas
            if ($orden['estado'] === 'delivered') {
                ob_clean();
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'No se pueden cancelar órdenes ya entregadas'
                ]);
                ob_end_flush();
                return;
            }
        } else {
            // Usuario solo puede cancelar órdenes pendientes o preparando
            if (!in_array($orden['estado'], ['pending', 'preparing'])) {
                ob_clean();
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Solo se pueden cancelar órdenes pendientes o en preparación'
                ]);
                ob_end_flush();
                return;
            }
        }
        
        // Actualizar estado a cancelado con timestamp
        $sql_update = "UPDATE orders SET status = 'canceled', canceled_date = NOW() WHERE id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("i", $orden_id);
        
        if ($stmt_update->execute()) {
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Orden cancelada exitosamente',
                'orden_id' => $orden_id
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

