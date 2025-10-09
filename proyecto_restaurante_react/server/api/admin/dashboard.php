<?php
/**
 * API para Dashboard Administrativo
 * 
 * Endpoints:
 * GET  /api/admin/dashboard.php?action=estadisticas
 * GET  /api/admin/dashboard.php?action=usuarios
 * GET  /api/admin/dashboard.php?action=top-usuarios
 * GET  /api/admin/dashboard.php?action=ordenes-recientes
 * POST /api/admin/dashboard.php?action=banear-usuario
 * POST /api/admin/dashboard.php?action=eliminar-usuario
 * 
 * Fuentes oficiales:
 * - PHP MySQLi: https://www.php.net/manual/es/book.mysqli.php
 * - PHP JSON: https://www.php.net/manual/es/ref.json.php
 */

// Configurar reporte de errores para desarrollo
// En producción, usar error_reporting(0) y log_errors
error_reporting(E_ALL);
ini_set('display_errors', '0'); // No mostrar errores en pantalla (solo en logs)
ini_set('log_errors', '1');

// Iniciar buffer de salida para capturar cualquier output
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
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/auth.php';

// Verificar autenticación y rol de administrador
$auth_result = verificarAuth();
if (!$auth_result['success']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => $auth_result['message']]);
    exit();
}

// Verificar que sea administrador
if ($auth_result['usuario']['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requiere rol de administrador.']);
    exit();
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'estadisticas':
            obtenerEstadisticas($conn);
            break;
        
        case 'usuarios':
            obtenerUsuarios($conn);
            break;
        
        case 'top-usuarios':
            obtenerTopUsuarios($conn);
            break;
        
        case 'ordenes-recientes':
            obtenerOrdenesRecientes($conn);
            break;
        
        case 'banear-usuario':
            banearUsuario($conn);
            break;
        
        case 'eliminar-usuario':
            eliminarUsuario($conn);
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}

/**
 * Obtener estadísticas generales del dashboard
 */
function obtenerEstadisticas($conn) {
    try {
        // Total de usuarios (solo clientes)
        $sql = "SELECT COUNT(*) as total FROM usuarios WHERE rol = 'cliente'";
        $result = $conn->query($sql);
        $totalUsuarios = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Total de órdenes
        $sql = "SELECT COUNT(*) as total FROM ordenes";
        $result = $conn->query($sql);
        $totalOrdenes = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Total de ingresos (solo órdenes entregadas)
        $sql = "SELECT COALESCE(SUM(total), 0) as total FROM ordenes WHERE estado = 'entregado'";
        $result = $conn->query($sql);
        $totalIngresos = $result ? (float)$result->fetch_assoc()['total'] : 0;
        
        // Órdenes de hoy
        $sql = "SELECT COUNT(*) as total FROM ordenes WHERE DATE(fecha_orden) = CURDATE()";
        $result = $conn->query($sql);
        $ordenesHoy = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Ingresos de hoy
        $sql = "SELECT COALESCE(SUM(total), 0) as total FROM ordenes 
                WHERE DATE(fecha_orden) = CURDATE() AND estado = 'entregado'";
        $result = $conn->query($sql);
        $ingresosHoy = $result ? (float)$result->fetch_assoc()['total'] : 0;
        
        // Nuevos usuarios este mes
        $sql = "SELECT COUNT(*) as total FROM usuarios 
                WHERE MONTH(fecha_registro) = MONTH(CURDATE()) 
                AND YEAR(fecha_registro) = YEAR(CURDATE())
                AND rol = 'cliente'";
        $result = $conn->query($sql);
        $nuevosUsuarios = $result ? $result->fetch_assoc()['total'] : 0;
        
        // Promedio por orden (solo entregadas)
        $promedioOrden = $totalOrdenes > 0 ? $totalIngresos / $totalOrdenes : 0;
        
        // Limpiar buffer de salida
        ob_clean();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'totalUsuarios' => (int)$totalUsuarios,
                'totalOrdenes' => (int)$totalOrdenes,
                'totalIngresos' => round($totalIngresos, 2),
                'ordenesHoy' => (int)$ordenesHoy,
                'ingresosHoy' => round($ingresosHoy, 2),
                'nuevosusuarios' => (int)$nuevosUsuarios,
                'promedioOrden' => round($promedioOrden, 2)
            ]
        ]);
        
        ob_end_flush();
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener estadísticas',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Obtener lista de usuarios con totales
 */
function obtenerUsuarios($conn) {
    try {
        $sql = "SELECT 
                    u.id,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    u.telefono,
                    u.rol,
                    u.estado,
                    u.fecha_registro,
                    COALESCE(SUM(o.total), 0) as total_gastado,
                    COUNT(DISTINCT o.id) as total_ordenes
                FROM usuarios u
                LEFT JOIN ordenes o ON u.id = o.usuario_id AND o.estado = 'entregado'
                WHERE u.rol = 'cliente'
                GROUP BY u.id, u.nombre, u.apellido, u.correo, u.telefono, u.rol, u.estado, u.fecha_registro
                ORDER BY total_gastado DESC";
        
        $result = $conn->query($sql);
        $usuarios = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['total_gastado'] = (float)$row['total_gastado'];
                $row['total_ordenes'] = (int)$row['total_ordenes'];
                $usuarios[] = $row;
            }
        }
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $usuarios
        ]);
        ob_end_flush();
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener usuarios',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Obtener top 3 usuarios por gasto
 */
function obtenerTopUsuarios($conn) {
    try {
        $sql = "SELECT 
                    u.id,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    COALESCE(SUM(o.total), 0) as total_gastado,
                    COUNT(DISTINCT o.id) as total_ordenes
                FROM usuarios u
                LEFT JOIN ordenes o ON u.id = o.usuario_id AND o.estado = 'entregado'
                WHERE u.rol = 'cliente'
                GROUP BY u.id, u.nombre, u.apellido, u.correo
                HAVING total_gastado > 0
                ORDER BY total_gastado DESC
                LIMIT 3";
        
        $result = $conn->query($sql);
        $topUsuarios = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['total_gastado'] = (float)$row['total_gastado'];
                $row['total_ordenes'] = (int)$row['total_ordenes'];
                $topUsuarios[] = $row;
            }
        }
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $topUsuarios
        ]);
        ob_end_flush();
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener top usuarios',
            'error' => $e->getMessage()
        ]);
        ob_end_flush();
    }
}

/**
 * Obtener órdenes recientes
 */
function obtenerOrdenesRecientes($conn) {
    try {
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
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido
                FROM ordenes o
                JOIN usuarios u ON o.usuario_id = u.id
                ORDER BY o.fecha_orden DESC
                LIMIT 10";
        
        $result = $conn->query($sql);
        $ordenes = [];
        
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['subtotal'] = (float)$row['subtotal'];
                $row['impuestos'] = (float)$row['impuestos'];
                $row['total'] = (float)$row['total'];
                $ordenes[] = $row;
            }
        }
        
        ob_clean();
        echo json_encode([
            'success' => true,
            'data' => $ordenes
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
 * Banear o desbanear usuario
 */
function banearUsuario($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $usuario_id = $data['usuario_id'] ?? null;
    
    if (!$usuario_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
        return;
    }
    
    // Verificar que el usuario existe y no es admin
    $sql = "SELECT estado, rol FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        return;
    }
    
    $usuario = $result->fetch_assoc();
    
    if ($usuario['rol'] === 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No se puede banear a un administrador']);
        return;
    }
    
    // Cambiar estado
    $nuevoEstado = $usuario['estado'] === 'activo' ? 'inactivo' : 'activo';
    
    $sql = "UPDATE usuarios SET estado = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $nuevoEstado, $usuario_id);
    
    if ($stmt->execute()) {
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Estado del usuario actualizado correctamente',
            'nuevo_estado' => $nuevoEstado
        ]);
        ob_end_flush();
    } else {
        ob_clean();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado']);
        ob_end_flush();
    }
}

/**
 * Eliminar usuario
 */
function eliminarUsuario($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $usuario_id = $data['usuario_id'] ?? null;
    
    if (!$usuario_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
        return;
    }
    
    // Verificar que el usuario existe y no es admin
    $sql = "SELECT rol FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        return;
    }
    
    $usuario = $result->fetch_assoc();
    
    if ($usuario['rol'] === 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'No se puede eliminar a un administrador']);
        return;
    }
    
    // Eliminar usuario (las órdenes se mantienen por integridad referencial)
    // En producción, considerar hacer un soft delete o mover a tabla de usuarios eliminados
    $sql = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $usuario_id);
    
    if ($stmt->execute()) {
        ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
        ob_end_flush();
    } else {
        ob_clean();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario']);
        ob_end_flush();
    }
}
?>

