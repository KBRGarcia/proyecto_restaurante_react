<?php
/**
 * Prueba Directa del Sistema de Recuperación de Contraseña
 * 
 * Este script prueba directamente la funcionalidad sin pasar por el frontend
 */

// Configurar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivos necesarios
require_once 'config/mail-config.php';
require_once 'includes/db.php';

echo "<h2>🧪 Prueba Directa del Sistema de Recuperación</h2>";

// Simular datos de entrada
$correo = 'test@ejemplo.com';
$nombre = 'Usuario de Prueba';

echo "<h3>📧 Datos de Prueba:</h3>";
echo "<p><strong>Correo:</strong> {$correo}</p>";
echo "<p><strong>Nombre:</strong> {$nombre}</p>";

// Generar código
$codigo = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
echo "<p><strong>Código generado:</strong> {$codigo}</p>";

// Probar función de envío de correo
echo "<h3>📤 Probando envío de correo:</h3>";

$asunto = "Código de Recuperación - Sabor & Tradición";
$mensaje = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Código de Recuperación</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .code-box { background: white; border: 2px dashed #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔐 Código de Recuperación</h1>
            <p>Sabor & Tradición</p>
        </div>
        <div class='content'>
            <h2>Hola {$nombre},</h2>
            <p>Tu código de verificación es:</p>
            <div class='code-box'>
                <div class='code'>{$codigo}</div>
            </div>
            <p><strong>Este código expira en 60 segundos.</strong></p>
        </div>
        <div class='footer'>
            <p>Sabor & Tradición - Sistema de Restaurante</p>
        </div>
    </div>
</body>
</html>
";

try {
    $resultado = sendMailImproved($correo, $asunto, $mensaje);
    
    if ($resultado) {
        echo "<div style='color: green; font-weight: bold;'>✅ Correo enviado exitosamente (modo desarrollo)</div>";
        echo "<p><strong>Código para usar:</strong> <span style='font-size: 24px; color: #007bff; font-weight: bold;'>{$codigo}</span></p>";
    } else {
        echo "<div style='color: red; font-weight: bold;'>❌ Error al enviar correo</div>";
    }
} catch (Exception $e) {
    echo "<div style='color: red; font-weight: bold;'>❌ Excepción: " . $e->getMessage() . "</div>";
}

// Probar conexión a base de datos
echo "<h3>🗄️ Probando base de datos:</h3>";

try {
    // Verificar si la tabla existe
    $result = $conn->query("SHOW TABLES LIKE 'password_reset_codes'");
    if ($result && $result->num_rows > 0) {
        echo "<div style='color: green;'>✅ Tabla password_reset_codes existe</div>";
        
        // Insertar código de prueba
        $expires_at = date('Y-m-d H:i:s', strtotime('+60 seconds'));
        $stmt = $conn->prepare("INSERT INTO password_reset_codes (usuario_id, code, expires_at) VALUES (1, ?, ?)");
        $stmt->bind_param("ss", $codigo, $expires_at);
        
        if ($stmt->execute()) {
            echo "<div style='color: green;'>✅ Código insertado en base de datos</div>";
            echo "<p><strong>Código en BD:</strong> {$codigo}</p>";
            echo "<p><strong>Expira:</strong> {$expires_at}</p>";
        } else {
            echo "<div style='color: red;'>❌ Error al insertar código</div>";
        }
        
        $stmt->close();
    } else {
        echo "<div style='color: red;'>❌ Tabla password_reset_codes NO existe</div>";
        echo "<p>Ejecuta el archivo SQL: 11-10-2025-recuperacion_password.sql</p>";
    }
} catch (Exception $e) {
    echo "<div style='color: red;'>❌ Error de base de datos: " . $e->getMessage() . "</div>";
}

// Información del servidor
echo "<h3>🖥️ Información del Servidor:</h3>";
$config = checkMailConfiguration();
echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Configuración</th><th>Valor</th></tr>";
foreach ($config as $key => $value) {
    echo "<tr><td>" . ucfirst(str_replace('_', ' ', $key)) . "</td><td>" . ($value ?: 'No configurado') . "</td></tr>";
}
echo "</table>";

$conn->close();
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h2 { color: #007bff; }
h3 { color: #28a745; margin-top: 30px; }
table { margin-top: 10px; }
th, td { padding: 8px; text-align: left; }
th { background-color: #f8f9fa; }
</style>
