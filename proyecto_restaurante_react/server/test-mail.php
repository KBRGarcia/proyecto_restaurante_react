<?php
/**
 * Script de Prueba para Envío de Correos
 * 
 * Este script permite probar el envío de correos desde XAMPP
 * hacia Gmail, Hotmail y otros proveedores
 * 
 * Uso: http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/test-mail.php
 */

// Incluir configuración de correo
require_once 'config/mail-config.php';

// Configurar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prueba de Envío de Correos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h3>📧 Prueba de Envío de Correos</h3>
                        <p class="mb-0">Sistema de Recuperación de Contraseña</p>
                    </div>
                    <div class="card-body">
                        
                        <?php
                        // Procesar envío si se envió el formulario
                        if ($_POST) {
                            $correo = $_POST['correo'] ?? '';
                            $nombre = $_POST['nombre'] ?? 'Usuario de Prueba';
                            
                            if ($correo) {
                                // Generar código de prueba
                                $codigo = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
                                
                                echo "<div class='alert alert-info'>";
                                echo "<h5>🔄 Enviando correo de prueba...</h5>";
                                echo "<p><strong>Para:</strong> {$correo}</p>";
                                echo "<p><strong>Código generado:</strong> {$codigo}</p>";
                                echo "</div>";
                                
                                // Mensaje HTML de prueba
                                $asunto = "Prueba de Correo - Sabor & Tradición";
                                $mensaje = "
                                <!DOCTYPE html>
                                <html lang='es'>
                                <head>
                                    <meta charset='UTF-8'>
                                    <title>Prueba de Correo</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                        .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                                        .code-box { background: white; border: 2px dashed #28a745; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                                        .code { font-size: 36px; font-weight: bold; color: #28a745; letter-spacing: 8px; }
                                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                                    </style>
                                </head>
                                <body>
                                    <div class='container'>
                                        <div class='header'>
                                            <h1>✅ Prueba de Correo Exitosa</h1>
                                            <p>Sabor & Tradición</p>
                                        </div>
                                        <div class='content'>
                                            <h2>Hola {$nombre},</h2>
                                            <p>Este es un correo de prueba para verificar que el sistema de recuperación de contraseña funciona correctamente.</p>
                                            
                                            <div class='code-box'>
                                                <div class='code'>{$codigo}</div>
                                            </div>
                                            
                                            <p><strong>Si recibes este correo, el sistema está funcionando correctamente.</strong></p>
                                            
                                            <p>Puedes usar este código para probar la recuperación de contraseña.</p>
                                        </div>
                                        <div class='footer'>
                                            <p>Sabor & Tradición - Sistema de Restaurante</p>
                                            <p>Este es un correo de prueba.</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                                ";
                                
                                // Intentar enviar
                                $enviado = sendMailImproved($correo, $asunto, $mensaje);
                                
                                if ($enviado) {
                                    echo "<div class='alert alert-success'>";
                                    echo "<h5>✅ Correo enviado exitosamente</h5>";
                                    echo "<p>El correo ha sido enviado a <strong>{$correo}</strong></p>";
                                    echo "<p>Revisa tu bandeja de entrada (y spam) para confirmar la recepción.</p>";
                                    echo "</div>";
                                } else {
                                    echo "<div class='alert alert-danger'>";
                                    echo "<h5>❌ Error al enviar correo</h5>";
                                    echo "<p>No se pudo enviar el correo a <strong>{$correo}</strong></p>";
                                    echo "<p>Revisa los logs del servidor para más detalles.</p>";
                                    echo "</div>";
                                }
                                
                                echo "<hr>";
                            }
                        }
                        ?>
                        
                        <!-- Formulario de prueba -->
                        <form method="POST">
                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo Electrónico de Prueba</label>
                                <input type="email" class="form-control" id="correo" name="correo" 
                                       placeholder="tu@email.com" required>
                                <div class="form-text">
                                    Ingresa un correo de Gmail, Hotmail o cualquier otro proveedor para probar el envío.
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre (opcional)</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" 
                                       placeholder="Tu Nombre" value="Usuario de Prueba">
                            </div>
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane me-2"></i>
                                Enviar Correo de Prueba
                            </button>
                        </form>
                        
                        <hr>
                        
                        <!-- Información de configuración -->
                        <div class="mt-4">
                            <h5>📋 Configuración Actual del Servidor</h5>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <tbody>
                                        <?php
                                        $config = checkMailConfiguration();
                                        foreach ($config as $key => $value) {
                                            echo "<tr>";
                                            echo "<td><strong>" . ucfirst(str_replace('_', ' ', $key)) . ":</strong></td>";
                                            echo "<td>" . ($value ?: '<em>No configurado</em>') . "</td>";
                                            echo "</tr>";
                                        }
                                        ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Instrucciones -->
                        <div class="mt-4">
                            <h5>📝 Instrucciones</h5>
                            <ol>
                                <li>Ingresa un correo electrónico válido (Gmail, Hotmail, etc.)</li>
                                <li>Haz clic en "Enviar Correo de Prueba"</li>
                                <li>Revisa tu bandeja de entrada y carpeta de spam</li>
                                <li>Si recibes el correo, el sistema está funcionando correctamente</li>
                            </ol>
                            
                            <div class="alert alert-warning">
                                <strong>Nota:</strong> En algunos servidores locales, los correos pueden tardar unos minutos en llegar o pueden ir a la carpeta de spam.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
