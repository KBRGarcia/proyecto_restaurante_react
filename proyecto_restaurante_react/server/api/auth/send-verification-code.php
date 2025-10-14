<?php
/**
 * API para Envío de Código de Verificación
 * 
 * Este endpoint maneja el envío de códigos de verificación por correo
 * para el registro de nuevos usuarios con verificación de 2 pasos
 * 
 * Endpoint: POST /api/auth/send-verification-code.php
 * 
 * Fuentes oficiales:
 * - PHP Security: https://www.php.net/manual/es/security.php
 * - MySQL Prepared Statements: https://dev.mysql.com/doc/refman/8.0/en/sql-prepared-statements.html
 */

// Configurar headers CORS y manejo de errores
require_once '../config/verification-mail-simple.php';
setCorsHeaders();

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Método no permitido'], 405);
}

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir conexión a base de datos
require_once '../../includes/db.php';

try {
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $nombre = trim($input['nombre'] ?? '');
    $apellido = trim($input['apellido'] ?? '');
    $codigo_area = trim($input['codigo_area'] ?? '');
    $numero_telefono = trim($input['numero_telefono'] ?? '');
    
    // Validaciones básicas
    if (empty($email) || empty($password) || empty($nombre) || empty($apellido)) {
        jsonResponse(['success' => false, 'message' => 'Todos los campos obligatorios son requeridos'], 400);
    }
    
    // Validar formato de correo
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Formato de correo electrónico inválido'], 400);
    }
    
    // Validar longitud de contraseña
    if (strlen($password) < 4 || strlen($password) > 10) {
        jsonResponse(['success' => false, 'message' => 'La contraseña debe tener entre 4 y 10 caracteres'], 400);
    }
    
    // Validar nombre y apellido
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/', $nombre)) {
        jsonResponse(['success' => false, 'message' => 'El nombre solo puede contener letras, acentos y ñ (2-16 caracteres)'], 400);
    }
    
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,16}$/', $apellido)) {
        jsonResponse(['success' => false, 'message' => 'El apellido solo puede contener letras, acentos y ñ (2-16 caracteres)'], 400);
    }
    
    // Validar código de área si se proporciona
    $codigos_validos = ['0414', '0424', '0412', '0416', '0426'];
    if (!empty($codigo_area) && !in_array($codigo_area, $codigos_validos)) {
        jsonResponse(['success' => false, 'message' => 'Código de área inválido'], 400);
    }
    
    // Validar número telefónico si se proporciona
    if (!empty($numero_telefono) && !preg_match('/^[0-9]{7}$/', $numero_telefono)) {
        jsonResponse(['success' => false, 'message' => 'El número telefónico debe tener exactamente 7 dígitos'], 400);
    }
    
    $config = getMailConfig();
    
    // 1) Verificar si ya existe usuario con ese email
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'El correo ya está registrado'], 409);
    }
    
    // 2) Comprobar registro pendiente existente
    $stmt = $conn->prepare("SELECT * FROM pending_registrations WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing = $result->fetch_assoc();
    
    // Generar código y configurar expiración
    $code = generateCode($config['verification']['code_length']);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $expiresAt = date('Y-m-d H:i:s', time() + $config['verification']['code_ttl_seconds']);
    
    if ($existing) {
        // Verificar cooldown
        $lastSent = strtotime($existing['created_at']);
        $cooldown = $config['verification']['resend_cooldown_seconds'];
        
        if (time() - $lastSent < $cooldown) {
            $remaining = $cooldown - (time() - $lastSent);
            jsonResponse([
                'success' => false, 
                'message' => "Espera {$remaining} segundos antes de reenviar el código"
            ], 429);
        }
        
        // Actualizar registro pendiente
        $stmt = $conn->prepare("
            UPDATE pending_registrations 
            SET code = ?, code_expires_at = ?, attempts = 0, created_at = NOW(), 
                password_hash = ?, nombre = ?, apellido = ?, codigo_area = ?, numero_telefono = ?
            WHERE email = ?
        ");
        $stmt->bind_param("ssisssss", $code, $expiresAt, $hashedPassword, $nombre, $apellido, $codigo_area, $numero_telefono, $email);
        
    } else {
        // Crear nuevo registro pendiente
        $stmt = $conn->prepare("
            INSERT INTO pending_registrations 
            (email, password_hash, nombre, apellido, codigo_area, numero_telefono, code, code_expires_at, attempts, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
        ");
        $stmt->bind_param("ssssssss", $email, $hashedPassword, $nombre, $apellido, $codigo_area, $numero_telefono, $code, $expiresAt);
    }
    
    if (!$stmt->execute()) {
        throw new Exception('Error al procesar el registro pendiente');
    }
    
    // 3) Enviar correo de verificación
    $sent = sendVerificationEmail($email, $nombre, $code);
    
    if (!$sent) {
        // Si falla el envío, limpiar el registro pendiente
        $stmt = $conn->prepare("DELETE FROM pending_registrations WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        jsonResponse([
            'success' => false, 
            'message' => 'No se pudo enviar el correo de verificación. Revisa la configuración SMTP.'
        ], 500);
    }
    
    // Respuesta exitosa
    jsonResponse([
        'success' => true, 
        'message' => 'Código de verificación enviado a tu correo electrónico',
        'expires_in' => $config['verification']['code_ttl_seconds'],
        'cooldown' => $config['verification']['resend_cooldown_seconds']
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error en send-verification-code: " . $e->getMessage());
    jsonResponse([
        'success' => false, 
        'message' => 'Error interno del servidor'
    ], 500);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
