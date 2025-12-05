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
    // Verificar si la tabla api_tokens existe
    $check_table = $conn->query("SHOW TABLES LIKE 'api_tokens'");
    $tabla_api_tokens_existe = $check_table && $check_table->num_rows > 0;
    
    if ($tabla_api_tokens_existe) {
        $stmt = $conn->prepare("
            SELECT u.id, u.name, u.last_name, u.email, u.role, u.phone_number, u.address, u.profile_picture, u.status, u.registration_date, u.password
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
    } else {
        // Fallback: Si la tabla no existe, usar token codificado
        // Formato: {user_id}:{email_hash}:{random_token}
        if (strlen($token) < 64) {
            throw new Exception('Token inválido');
        }
        
        $tokenParts = explode(':', $token);
        
        if (count($tokenParts) >= 2 && is_numeric($tokenParts[0])) {
            $user_id = (int)$tokenParts[0];
            $email_hash = $tokenParts[1] ?? '';
            
            // Buscar usuario directamente por ID
            $stmt = $conn->prepare("
                SELECT id, name, last_name, email, role, phone_number, address, profile_picture, status, registration_date, password
                FROM users 
                WHERE id = ? AND status = 'active'
                LIMIT 1
            ");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                $stmt->close();
                throw new Exception('Token inválido o usuario no encontrado');
            }
            
            $usuario = $result->fetch_assoc();
            $stmt->close();
            
            // Verificar que el hash del email coincida
            if (!empty($email_hash) && md5($usuario['email']) !== $email_hash) {
                throw new Exception('Token inválido');
            }
        } else {
            throw new Exception('Token inválido');
        }
    }
    
    if ($usuario['status'] !== 'active') {
        throw new Exception('Cuenta inactiva');
    }
    
    // Mapear campos nuevos a formato esperado por el frontend
    return [
        'id' => $usuario['id'],
        'nombre' => $usuario['name'],
        'apellido' => $usuario['last_name'],
        'correo' => $usuario['email'],
        'rol' => $usuario['role'],
        'codigo_area' => null, // Ya no existe, se combina en phone_number
        'numero_telefono' => $usuario['phone_number'],
        'direccion' => $usuario['address'],
        'foto_perfil' => $usuario['profile_picture'],
        'estado' => $usuario['status'],
        'fecha_registro' => $usuario['registration_date'],
        'password' => $usuario['password']
    ];
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
            $codigo_area = isset($input['codigo_area']) ? trim($input['codigo_area']) : null;
            $numero_telefono = isset($input['numero_telefono']) ? trim($input['numero_telefono']) : null;
            $direccion = isset($input['direccion']) ? trim($input['direccion']) : null;
            
            // Combinar código de área y número de teléfono si se proporcionan
            $phone_number = null;
            if (!empty($codigo_area) && !empty($numero_telefono)) {
                $phone_number = $codigo_area . $numero_telefono;
            } elseif (!empty($input['numero_telefono'])) {
                $phone_number = $input['numero_telefono'];
            }
            
            // Actualizar en base de datos
            $stmt = $conn->prepare("
                UPDATE users 
                SET name = ?, last_name = ?, phone_number = ?, address = ?
                WHERE id = ?
            ");
            $stmt->bind_param("ssssi", $nombre, $apellido, $phone_number, $direccion, $usuario['id']);
            
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
                    'codigo_area' => $codigo_area,
                    'numero_telefono' => $numero_telefono,
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
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
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
