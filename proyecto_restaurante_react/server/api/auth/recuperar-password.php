<?php
/**
 * API para Recuperación de Contraseña (Simplificada)
 * 
 * Endpoints:
 * POST /api/auth/recuperar-password.php?action=verificar-correo
 * POST /api/auth/recuperar-password.php?action=actualizar
 * 
 * Flujo simplificado:
 * 1. Verificar que el correo existe en la base de datos
 * 2. Permitir al usuario establecer nueva contraseña
 * 3. Actualizar la contraseña directamente
 * 
 * Fuentes oficiales:
 * - PHP MySQLi: https://www.php.net/manual/es/book.mysqli.php
 * - PHP password_hash: https://www.php.net/manual/es/function.password-hash.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Incluir conexión a la base de datos
require_once '../../includes/db.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'verificar-correo':
            verificarCorreo($conn);
            break;
            
        case 'actualizar':
            actualizarPassword($conn);
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
 * Verificar que el correo existe en la base de datos
 */
function verificarCorreo($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $correo = trim($input['correo'] ?? '');
    
    if (empty($correo)) {
        throw new Exception('Correo electrónico requerido');
    }
    
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido');
    }
    
    // Verificar que el correo existe en la base de datos
    $stmt = $conn->prepare("SELECT id, name as nombre FROM users WHERE email = ? AND status = 'active'");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'El correo no está registrado en el sistema'
        ]);
        return;
    }
    
    $usuario = $result->fetch_assoc();
    $stmt->close();
    
    // Correo encontrado, permitir continuar al siguiente paso
    echo json_encode([
        'success' => true,
        'message' => 'Correo verificado correctamente',
        'nombre' => $usuario['nombre']
    ]);
}

/**
 * Actualizar contraseña
 */
function actualizarPassword($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    $correo = trim($input['correo'] ?? '');
    $nueva_password = $input['nueva_password'] ?? '';
    
    if (empty($correo) || empty($nueva_password)) {
        throw new Exception('Correo y nueva contraseña requeridos');
    }
    
    // Validar correo electrónico
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido');
    }
    
    // Validar nueva contraseña
    if (strlen($nueva_password) < 4 || strlen($nueva_password) > 10) {
        throw new Exception('La contraseña debe tener entre 4 y 10 caracteres');
    }
    
    // Verificar que el correo existe en la base de datos
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND status = 'active'");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'El correo no está registrado en el sistema'
        ]);
        return;
    }
    
    $stmt->close();
    
    // Hash de la nueva contraseña
    $password_hash = password_hash($nueva_password, PASSWORD_DEFAULT);
    
    // Actualizar contraseña del usuario
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $password_hash, $correo);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar la contraseña');
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Contraseña actualizada exitosamente'
    ]);
}

?>
