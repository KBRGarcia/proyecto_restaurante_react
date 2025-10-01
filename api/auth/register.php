<?php
/**
 * API de Registro
 * Permite a nuevos usuarios crear una cuenta
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
    
    $nombre = trim($input['nombre'] ?? '');
    $apellido = trim($input['apellido'] ?? '');
    $correo = trim($input['correo'] ?? '');
    $telefono = trim($input['telefono'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validaciones
    if (empty($nombre) || empty($correo) || empty($password)) {
        throw new Exception('Nombre, correo y contraseña son requeridos');
    }
    
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido');
    }
    
    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Verificar si el correo ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception('El correo electrónico ya está registrado');
    }
    
    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $rol = 'cliente'; // Rol por defecto
    $estado = 'activo';
    
    $stmt = $conn->prepare("
        INSERT INTO usuarios (nombre, apellido, correo, telefono, password, rol, estado, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("sssssss", $nombre, $apellido, $correo, $telefono, $passwordHash, $rol, $estado);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear la cuenta');
    }
    
    $usuarioId = $conn->insert_id;
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Cuenta creada exitosamente',
        'usuario_id' => $usuarioId
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

