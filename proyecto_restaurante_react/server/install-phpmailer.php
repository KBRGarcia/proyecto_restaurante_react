<?php
/**
 * Script de Instalación de PHPMailer
 * 
 * Este script instala PHPMailer automáticamente usando Composer
 * o descarga los archivos necesarios si Composer no está disponible
 * 
 * Uso: http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/install-phpmailer.php
 */

// Configurar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalación de PHPMailer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .log-container {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        .log-success { color: #28a745; }
        .log-error { color: #dc3545; }
        .log-info { color: #007bff; }
        .log-warning { color: #ffc107; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">
                        <h3>📧 Instalación de PHPMailer</h3>
                        <p class="mb-0">Para envío confiable de correos electrónicos</p>
                    </div>
                    <div class="card-body">
                        
                        <?php
                        $installMethod = $_POST['method'] ?? '';
                        $logMessages = [];
                        
                        function logMessage($type, $message) {
                            global $logMessages;
                            $timestamp = date('H:i:s');
                            $logMessages[] = "<div class='log-{$type}'>[{$timestamp}] {$message}</div>";
                        }
                        
                        if ($installMethod === 'composer') {
                            logMessage('info', 'Iniciando instalación con Composer...');
                            
                            // Verificar si Composer está disponible
                            $composerPath = '';
                            $possiblePaths = [
                                'composer',
                                'C:\\xampp\\composer\\composer.bat',
                                'C:\\ProgramData\\ComposerSetup\\bin\\composer.bat',
                                '/usr/local/bin/composer',
                                '/usr/bin/composer'
                            ];
                            
                            foreach ($possiblePaths as $path) {
                                if (is_executable($path) || (PHP_OS_FAMILY === 'Windows' && file_exists($path))) {
                                    $composerPath = $path;
                                    break;
                                }
                            }
                            
                            if ($composerPath) {
                                logMessage('success', "Composer encontrado en: {$composerPath}");
                                
                                // Crear composer.json si no existe
                                $composerJson = [
                                    'require' => [
                                        'phpmailer/phpmailer' => '^6.8'
                                    ]
                                ];
                                
                                if (!file_exists('composer.json')) {
                                    file_put_contents('composer.json', json_encode($composerJson, JSON_PRETTY_PRINT));
                                    logMessage('info', 'Archivo composer.json creado');
                                }
                                
                                // Ejecutar composer install
                                $command = "{$composerPath} install --no-dev --optimize-autoloader";
                                logMessage('info', "Ejecutando: {$command}");
                                
                                $output = [];
                                $returnCode = 0;
                                exec($command . ' 2>&1', $output, $returnCode);
                                
                                foreach ($output as $line) {
                                    logMessage('info', $line);
                                }
                                
                                if ($returnCode === 0) {
                                    logMessage('success', 'PHPMailer instalado exitosamente con Composer');
                                } else {
                                    logMessage('error', 'Error al instalar con Composer');
                                }
                                
                            } else {
                                logMessage('warning', 'Composer no encontrado, intentando método manual...');
                                $installMethod = 'manual';
                            }
                        }
                        
                        if ($installMethod === 'manual') {
                            logMessage('info', 'Iniciando instalación manual...');
                            
                            // Crear directorio vendor si no existe
                            if (!is_dir('vendor')) {
                                mkdir('vendor', 0755, true);
                                logMessage('info', 'Directorio vendor creado');
                            }
                            
                            // Crear estructura de directorios
                            $directories = [
                                'vendor/phpmailer',
                                'vendor/phpmailer/phpmailer',
                                'vendor/phpmailer/phpmailer/src',
                                'vendor/phpmailer/phpmailer/src/PHPMailer',
                                'vendor/phpmailer/phpmailer/src/PHPMailer/SMTP',
                                'vendor/phpmailer/phpmailer/src/PHPMailer/Exception'
                            ];
                            
                            foreach ($directories as $dir) {
                                if (!is_dir($dir)) {
                                    mkdir($dir, 0755, true);
                                    logMessage('info', "Directorio creado: {$dir}");
                                }
                            }
                            
                            // URLs de descarga de PHPMailer
                            $files = [
                                'vendor/phpmailer/phpmailer/src/PHPMailer/PHPMailer.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/PHPMailer.php',
                                'vendor/phpmailer/phpmailer/src/PHPMailer/SMTP/SMTP.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/SMTP.php',
                                'vendor/phpmailer/phpmailer/src/PHPMailer/Exception/Exception.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/Exception.php'
                            ];
                            
                            foreach ($files as $file => $url) {
                                if (!file_exists($file)) {
                                    logMessage('info', "Descargando: {$file}");
                                    
                                    $content = @file_get_contents($url);
                                    if ($content !== false) {
                                        file_put_contents($file, $content);
                                        logMessage('success', "Archivo descargado: {$file}");
                                    } else {
                                        logMessage('error', "Error al descargar: {$file}");
                                    }
                                } else {
                                    logMessage('info', "Archivo ya existe: {$file}");
                                }
                            }
                            
                            // Crear autoloader simple
                            $autoloader = '<?php
// Autoloader simple para PHPMailer
spl_autoload_register(function ($class) {
    $prefix = "PHPMailer\\\\PHPMailer\\\\";
    $base_dir = __DIR__ . "/vendor/phpmailer/phpmailer/src/";
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace("\\\\", "/", $relative_class) . ".php";
    
    if (file_exists($file)) {
        require $file;
    }
});
';
                            
                            file_put_contents('vendor/autoload.php', $autoloader);
                            logMessage('success', 'Autoloader creado');
                        }
                        
                        // Verificar instalación
                        if ($installMethod) {
                            logMessage('info', 'Verificando instalación...');
                            
                            if (file_exists('vendor/autoload.php')) {
                                require_once 'vendor/autoload.php';
                                
                                if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
                                    logMessage('success', '✅ PHPMailer instalado correctamente');
                                    
                                    // Probar funcionalidad básica
                                    try {
                                        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
                                        logMessage('success', '✅ PHPMailer se puede instanciar correctamente');
                                    } catch (Exception $e) {
                                        logMessage('error', '❌ Error al instanciar PHPMailer: ' . $e->getMessage());
                                    }
                                } else {
                                    logMessage('error', '❌ PHPMailer no se puede cargar');
                                }
                            } else {
                                logMessage('error', '❌ Autoloader no encontrado');
                            }
                        }
                        ?>
                        
                        <!-- Log de instalación -->
                        <?php if (!empty($logMessages)): ?>
                        <div class="mb-4">
                            <h5>📋 Log de Instalación</h5>
                            <div class="log-container">
                                <?php echo implode('', $logMessages); ?>
                            </div>
                        </div>
                        <?php endif; ?>
                        
                        <!-- Métodos de instalación -->
                        <div class="mb-4">
                            <h5>🔧 Métodos de Instalación</h5>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>📦 Con Composer (Recomendado)</h6>
                                            <p class="text-muted">Instala PHPMailer usando Composer para mejor gestión de dependencias.</p>
                                            <form method="POST">
                                                <input type="hidden" name="method" value="composer">
                                                <button type="submit" class="btn btn-primary">
                                                    <i class="fas fa-download me-2"></i>
                                                    Instalar con Composer
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>📁 Instalación Manual</h6>
                                            <p class="text-muted">Descarga los archivos necesarios directamente desde GitHub.</p>
                                            <form method="POST">
                                                <input type="hidden" name="method" value="manual">
                                                <button type="submit" class="btn btn-outline-primary">
                                                    <i class="fas fa-download me-2"></i>
                                                    Instalación Manual
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Verificación de estado -->
                        <div class="mb-4">
                            <h5>🔍 Estado Actual</h5>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td><strong>Composer disponible:</strong></td>
                                            <td>
                                                <?php
                                                $composerAvailable = false;
                                                $possiblePaths = [
                                                    'composer',
                                                    'C:\\xampp\\composer\\composer.bat',
                                                    'C:\\ProgramData\\ComposerSetup\\bin\\composer.bat',
                                                    '/usr/local/bin/composer',
                                                    '/usr/bin/composer'
                                                ];
                                                
                                                foreach ($possiblePaths as $path) {
                                                    if (is_executable($path) || (PHP_OS_FAMILY === 'Windows' && file_exists($path))) {
                                                        $composerAvailable = true;
                                                        break;
                                                    }
                                                }
                                                
                                                if ($composerAvailable) {
                                                    echo '<span class="badge bg-success">✅ Disponible</span>';
                                                } else {
                                                    echo '<span class="badge bg-warning">⚠️ No encontrado</span>';
                                                }
                                                ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>PHPMailer instalado:</strong></td>
                                            <td>
                                                <?php
                                                if (file_exists('vendor/autoload.php')) {
                                                    require_once 'vendor/autoload.php';
                                                    if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
                                                        echo '<span class="badge bg-success">✅ Instalado</span>';
                                                    } else {
                                                        echo '<span class="badge bg-danger">❌ Error</span>';
                                                    }
                                                } else {
                                                    echo '<span class="badge bg-secondary">❌ No instalado</span>';
                                                }
                                                ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Directorio vendor:</strong></td>
                                            <td>
                                                <?php
                                                if (is_dir('vendor')) {
                                                    echo '<span class="badge bg-success">✅ Existe</span>';
                                                } else {
                                                    echo '<span class="badge bg-secondary">❌ No existe</span>';
                                                }
                                                ?>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- Instrucciones -->
                        <div class="mb-4">
                            <h5>📝 Instrucciones</h5>
                            <ol>
                                <li>Selecciona un método de instalación</li>
                                <li>Espera a que se complete la instalación</li>
                                <li>Verifica que PHPMailer esté instalado correctamente</li>
                                <li>Configura las credenciales SMTP en <code>config/verification-mail.php</code></li>
                                <li>Prueba el envío de correos</li>
                            </ol>
                            
                            <div class="alert alert-info">
                                <strong>Nota:</strong> Después de la instalación, necesitarás configurar las credenciales SMTP 
                                en el archivo <code>config/verification-mail.php</code> para que funcione el envío de correos.
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
