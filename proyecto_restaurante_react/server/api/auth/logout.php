<?php
/**
 * API de Logout
 * Cierra la sesión del usuario
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

try {
    // Obtener token del header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!empty($authHeader)) {
        $token = str_replace('Bearer ', '', $authHeader);
        
        // Eliminar sesión de la base de datos
        $stmt = $conn->prepare("DELETE FROM api_tokens WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $stmt->close();
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Sesión cerrada exitosamente'
    ]);
    
} catch (Exception $e) {
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

