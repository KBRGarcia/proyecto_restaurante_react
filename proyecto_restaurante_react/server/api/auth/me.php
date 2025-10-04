<?php
/**
 * API para gestionar el usuario actual
 * GET: Obtener información del usuario
 * PUT: Actualizar perfil
 * POST: Cambiar contraseña (ruta: /cambiar-password)
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS');
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
        SELECT u.id, u.nombre, u.apellido, u.correo, u.rol, u.telefono, u.direccion, u.foto_perfil, u.estado, u.fecha_registro, u.password
        FROM sessions s
        JOIN usuarios u ON s.usuario_id = u.id
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
    
    if ($usuario['estado'] !== 'activo') {
        throw new Exception('Cuenta inactiva');
    }
    
    return $usuario;
}

try {
    // Obtener token del header Authorization
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (empty($authHeader)) {
        throw new Exception('Token no proporcionado');
    }
    
    // Extraer token (formato: "Bearer TOKEN")
    $token = str_replace('Bearer ', '', $authHeader);
    
    // Obtener el método HTTP
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Procesar según el método
    switch ($method) {
        case 'GET':
            // Obtener información del usuario
            $usuario = verificarToken($conn, $token);
            
            // No enviar el password
            unset($usuario['password']);
            
            echo json_encode([
                'success' => true,
                'usuario' => $usuario
            ]);
            break;
            
        case 'PUT':
            // Actualizar perfil
            $usuario = verificarToken($conn, $token);
            
            // Obtener datos del body
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Datos inválidos');
            }
            
            // Validar campos obligatorios
            if (empty($input['nombre']) || empty($input['apellido'])) {
                throw new Exception('El nombre y apellido son obligatorios');
            }
            
            // Sanitizar datos
            $nombre = trim($input['nombre']);
            $apellido = trim($input['apellido']);
            $telefono = isset($input['telefono']) ? trim($input['telefono']) : null;
            $direccion = isset($input['direccion']) ? trim($input['direccion']) : null;
            
            // Actualizar en base de datos
            $stmt = $conn->prepare("
                UPDATE usuarios 
                SET nombre = ?, apellido = ?, telefono = ?, direccion = ?
                WHERE id = ?
            ");
            $stmt->bind_param("ssssi", $nombre, $apellido, $telefono, $direccion, $usuario['id']);
            
            if (!$stmt->execute()) {
                throw new Exception('Error al actualizar el perfil');
            }
            
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'message' => 'Perfil actualizado exitosamente',
                'usuario' => [
                    'nombre' => $nombre,
                    'apellido' => $apellido,
                    'telefono' => $telefono,
                    'direccion' => $direccion
                ]
            ]);
            break;
            
        case 'POST':
            // Cambiar contraseña
            $usuario = verificarToken($conn, $token);
            
            // Obtener datos del body
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Datos inválidos');
            }
            
            // Validar campos
            if (empty($input['passwordActual']) || empty($input['passwordNueva'])) {
                throw new Exception('Todos los campos son obligatorios');
            }
            
            // Verificar contraseña actual
            if (!password_verify($input['passwordActual'], $usuario['password'])) {
                throw new Exception('La contraseña actual es incorrecta');
            }
            
            // Validar longitud de nueva contraseña
            if (strlen($input['passwordNueva']) < 6) {
                throw new Exception('La nueva contraseña debe tener al menos 6 caracteres');
            }
            
            // Verificar que la nueva contraseña sea diferente
            if ($input['passwordActual'] === $input['passwordNueva']) {
                throw new Exception('La nueva contraseña debe ser diferente a la actual');
            }
            
            // Hash de la nueva contraseña
            $passwordHash = password_hash($input['passwordNueva'], PASSWORD_DEFAULT);
            
            // Actualizar en base de datos
            $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $passwordHash, $usuario['id']);
            
            if (!$stmt->execute()) {
                throw new Exception('Error al actualizar la contraseña');
            }
            
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'message' => 'Contraseña actualizada exitosamente'
            ]);
            break;
            
        default:
            throw new Exception('Método no permitido');
    }
    
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
