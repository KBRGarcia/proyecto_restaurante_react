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
    $codigo_area = trim($input['codigo_area'] ?? '');
    $numero_telefono = trim($input['numero_telefono'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validaciones de campos obligatorios
    if (empty($nombre) || empty($apellido) || empty($correo) || empty($password)) {
        throw new Exception('Nombre, apellido, correo y contraseña son requeridos');
    }
    
    // Validación de nombre (solo letras, acentos y ñ, 2-16 caracteres)
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/', $nombre)) {
        throw new Exception('El nombre solo puede contener letras, acentos y ñ (2-16 caracteres)');
    }
    
    // Validación de apellido (solo letras, acentos y ñ, 2-16 caracteres)
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/', $apellido)) {
        throw new Exception('El apellido solo puede contener letras, acentos y ñ (2-16 caracteres)');
    }
    
    // Validación de correo electrónico
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido');
    }
    
    // Validación de código de área
    $codigos_validos = ['0414', '0424', '0412', '0416', '0426'];
    if (!empty($codigo_area) && !in_array($codigo_area, $codigos_validos)) {
        throw new Exception('Código de área inválido');
    }
    
    // Validación de número telefónico (7 dígitos exactos)
    if (!empty($numero_telefono) && !preg_match('/^[0-9]{7}$/', $numero_telefono)) {
        throw new Exception('El número telefónico debe tener exactamente 7 dígitos');
    }
    
    // Validación de contraseña (4-10 caracteres)
    if (strlen($password) < 4 || strlen($password) > 10) {
        throw new Exception('La contraseña debe tener entre 4 y 10 caracteres');
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
        INSERT INTO usuarios (nombre, apellido, correo, codigo_area, numero_telefono, password, rol, estado, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("ssssssss", $nombre, $apellido, $correo, $codigo_area, $numero_telefono, $passwordHash, $rol, $estado);
    
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

