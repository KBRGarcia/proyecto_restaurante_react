<?php
/**
 * API para obtener el usuario actual
 * Verifica el token y devuelve la información del usuario
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir conexión
require_once '../../includes/db.php';

try {
    // Obtener token del header Authorization
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (empty($authHeader)) {
        throw new Exception('Token no proporcionado');
    }
    
    // Extraer token (formato: "Bearer TOKEN")
    $token = str_replace('Bearer ', '', $authHeader);
    
    // Verificar token en base de datos
    $stmt = $conn->prepare("
        SELECT u.id, u.nombre, u.apellido, u.correo, u.rol, u.telefono, u.estado
        FROM sessions s
        JOIN usuarios u ON s.usuario_id = u.id
        WHERE s.token = ? AND s.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Token inválido o expirado');
    }
    
    $usuario = $result->fetch_assoc();
    
    // Verificar que la cuenta esté activa
    if ($usuario['estado'] !== 'activo') {
        throw new Exception('Cuenta inactiva');
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'usuario' => $usuario
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(401);
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

