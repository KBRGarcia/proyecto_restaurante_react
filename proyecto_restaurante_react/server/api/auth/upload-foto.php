<?php
/**
 * API para subir foto de perfil
 * POST: Subir foto de perfil (en base64)
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

// Incluir conexión
require_once '../../includes/db.php';

// Función para verificar el token y obtener el usuario
function verificarToken($conn, $token) {
    $stmt = $conn->prepare("
        SELECT u.id, u.name as nombre, u.last_name as apellido, u.email as correo, u.role as rol, u.status as estado
        FROM api_tokens s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        throw new Exception('Token inválido o expirado');
    }
    
    $usuario = $result->fetch_assoc();
    $stmt->close();
    
    if ($usuario['estado'] !== 'active') {
        throw new Exception('Cuenta inactiva');
    }
    
    return $usuario;
}

try {
    // Solo permitir POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Obtener token del header Authorization
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (empty($authHeader)) {
        throw new Exception('Token no proporcionado');
    }
    
    // Extraer token (formato: "Bearer TOKEN")
    $token = str_replace('Bearer ', '', $authHeader);
    
    // Verificar token
    $usuario = verificarToken($conn, $token);
    
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['foto_perfil'])) {
        throw new Exception('No se proporcionó la imagen');
    }
    
    $foto_base64 = $input['foto_perfil'];
    
    // Validar que sea una imagen en base64 válida
    if (!preg_match('/^data:image\/(jpeg|jpg|png|gif|webp);base64,/', $foto_base64)) {
        throw new Exception('Formato de imagen inválido. Solo se permiten JPEG, PNG, GIF y WEBP');
    }
    
    // Validar tamaño (máximo 5MB en base64, aproximadamente 3.75MB original)
    $tamano_base64 = strlen($foto_base64);
    $tamano_max = 5 * 1024 * 1024; // 5MB
    
    if ($tamano_base64 > $tamano_max) {
        throw new Exception('La imagen es demasiado grande. Tamaño máximo: 5MB');
    }
    
    // Actualizar foto de perfil en la base de datos
    $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $stmt->bind_param("si", $foto_base64, $usuario['id']);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar la foto de perfil');
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Foto de perfil actualizada exitosamente',
        'foto_perfil' => $foto_base64
    ]);
    
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

