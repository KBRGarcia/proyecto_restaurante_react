<?php
/**
 * API de Login
 * Permite a los usuarios iniciar sesión
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

// Incluir conexión
require_once '../../includes/db.php';

try {
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    $correo = $input['correo'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validar campos
    if (empty($correo) || empty($password)) {
        throw new Exception('Correo y contraseña son requeridos');
    }
    
    // Buscar usuario en la base de datos
    $stmt = $conn->prepare("
        SELECT id, nombre, apellido, correo, password, rol, telefono, estado 
        FROM usuarios 
        WHERE correo = ? 
        LIMIT 1
    ");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Credenciales incorrectas');
    }
    
    $usuario = $result->fetch_assoc();
    
    // Verificar contraseña
    if (!password_verify($password, $usuario['password'])) {
        throw new Exception('Credenciales incorrectas');
    }
    
    // Verificar que la cuenta esté activa
    if ($usuario['estado'] !== 'activo') {
        throw new Exception('Cuenta inactiva. Contacta al administrador');
    }
    
    // Generar token simple (en producción usar JWT)
    $token = bin2hex(random_bytes(32));
    
    // Guardar token en base de datos (crear tabla sessions si no existe)
    $stmt = $conn->prepare("
        INSERT INTO sessions (usuario_id, token, expires_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
        ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)
    ");
    $stmt->bind_param("is", $usuario['id'], $token);
    $stmt->execute();
    
    // No enviar el password al cliente
    unset($usuario['password']);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'token' => $token,
        'usuario' => $usuario
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>

