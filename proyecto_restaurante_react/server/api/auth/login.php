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
        SELECT id, name, last_name, email, password, role, phone_number, status 
        FROM users 
        WHERE email = ? 
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
    if ($usuario['status'] !== 'active') {
        throw new Exception('Cuenta inactiva. Contacta al administrador');
    }
    
    // Verificar si la tabla api_tokens existe
    $check_table = $conn->query("SHOW TABLES LIKE 'api_tokens'");
    $tabla_api_tokens_existe = $check_table && $check_table->num_rows > 0;
    $error_token = null;
    
    if ($tabla_api_tokens_existe) {
        // Generar token simple (en producción usar JWT)
        $token = bin2hex(random_bytes(32));
        
        // Guardar token en base de datos (usar tabla api_tokens)
        $stmt_token = $conn->prepare("
            INSERT INTO api_tokens (user_id, token, expires_at, created_at) 
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())
            ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at), updated_at = NOW()
        ");
        
        if ($stmt_token) {
            $stmt_token->bind_param("is", $usuario['id'], $token);
            
            if (!$stmt_token->execute()) {
                // No lanzar excepción, solo registrar el error
                $error_token = 'Error guardando token: ' . $stmt_token->error;
                error_log($error_token);
            }
            
            $stmt_token->close();
        } else {
            $error_token = 'Error preparando consulta de token: ' . $conn->error;
            error_log($error_token);
        }
    } else {
        // Si la tabla no existe, generar token codificado con información del usuario
        // Formato: {user_id}:{email_hash}:{random_token}
        // Esto permite validar el token sin necesidad de la tabla api_tokens
        $email_hash = md5($usuario['email']);
        $random_token = bin2hex(random_bytes(16));
        $token = $usuario['id'] . ':' . $email_hash . ':' . $random_token;
        
        $error_token = 'La tabla api_tokens no existe. Usando token codificado temporal. Ejecuta el script: 27-11-2025_01-api_tokens_table.sql para mayor seguridad.';
        error_log('ADVERTENCIA: ' . $error_token);
    }
    
    // No enviar el password al cliente
    unset($usuario['password']);
    
    // Mapear campos nuevos a formato esperado por el frontend
    $usuario_response = [
        'id' => $usuario['id'],
        'nombre' => $usuario['name'],
        'apellido' => $usuario['last_name'],
        'correo' => $usuario['email'],
        'rol' => $usuario['role'],
        'estado' => $usuario['status'],
        'telefono' => $usuario['phone_number'] ?? null
    ];
    
    // Respuesta exitosa
    $response = [
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'token' => $token,
        'usuario' => $usuario_response
    ];
    
    // Advertencia si hay problemas con la tabla
    if ($error_token) {
        $response['warning'] = $error_token;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_detail' => isset($conn) ? $conn->error : null,
        'sql_state' => isset($conn) ? $conn->sqlstate : null
    ], JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>

