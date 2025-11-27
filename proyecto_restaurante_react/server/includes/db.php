<?php
/**
 * Configuración de conexión a la base de datos
 * Fuente: https://www.php.net/manual/es/book.mysqli.php
 */

$host = "localhost";
$user = "root";
$pass = "";
$db   = "proyecto_restaurante_filament_react";

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    // En APIs, devolver JSON en lugar de die()
    if (php_sapi_name() === 'cli') {
        die("Error en la conexión: " . $conn->connect_error);
    } else {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error de conexión a la base de datos',
            'error' => $conn->connect_error
        ]);
        exit();
    }
}

// Configurar charset UTF-8
$conn->set_charset("utf8mb4");

// Deshabilitar autocommit para transacciones (opcional)
// $conn->autocommit(FALSE);

?>