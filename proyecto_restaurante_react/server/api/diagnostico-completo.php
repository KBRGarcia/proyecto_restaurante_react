<?php
/**
 * Script de diagnóstico completo del sistema
 * Verifica base de datos, tablas, conexiones y APIs
 */
header('Content-Type: text/html; charset=utf-8');

$host = "localhost";
$user = "root";
$pass = "";

echo "<h1>🔍 Diagnóstico Completo del Sistema</h1>";
echo "<style>
body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
.success { color: #28a745; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; margin: 5px 0; border-radius: 4px; }
.error { color: #dc3545; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; margin: 5px 0; border-radius: 4px; }
.warning { color: #856404; padding: 10px; background: #fff3cd; border: 1px solid #ffeeba; margin: 5px 0; border-radius: 4px; }
.info { color: #004085; padding: 10px; background: #d1ecf1; border: 1px solid #bee5eb; margin: 5px 0; border-radius: 4px; }
h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-top: 30px; }
pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
</style>";

// 1. Verificar conexión MySQL
echo "<h2>1. Conexión MySQL</h2>";
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    echo "<div class='error'>❌ Error de conexión: " . $conn->connect_error . "</div>";
    exit();
}
echo "<div class='success'>✅ Conexión a MySQL exitosa</div>";

// 2. Verificar bases de datos
echo "<h2>2. Bases de Datos Disponibles</h2>";
$db_correcta = 'proyecto_restaurante_filament_react'; // ÚNICA base de datos permitida
$db_antigua = 'proyecto_restaurante_react'; // Base de datos antigua a eliminar

// Verificar base de datos correcta
$result = $conn->query("SHOW DATABASES LIKE '$db_correcta'");
if ($result && $result->num_rows > 0) {
    echo "<div class='success'>✅ Base de datos '$db_correcta' existe (CORRECTA)</div>";
    $db_encontrada = $db_correcta;
} else {
    echo "<div class='error'>❌ Base de datos '$db_correcta' NO existe</div>";
    echo "<div class='warning'>⚠️ Debes ejecutar el archivo SQL: proyecto_restaurante_filament_react.sql</div>";
    $db_encontrada = null;
}

// Verificar si existe la base de datos antigua
$result_antigua = $conn->query("SHOW DATABASES LIKE '$db_antigua'");
if ($result_antigua && $result_antigua->num_rows > 0) {
    echo "<div class='warning'>⚠️ Base de datos '$db_antigua' existe (ANTIGUA - DEBE ELIMINARSE)</div>";
    echo "<div class='info'>ℹ️ Ejecuta el script SQL: <code>01-12-2025-eliminar_bd_antigua.sql</code> para eliminarla</div>";
}

if (!$db_encontrada) {
    echo "<div class='error'>❌ CRÍTICO: La base de datos correcta no existe</div>";
    exit();
}

echo "<div class='info'>ℹ️ Usando base de datos: <strong>$db_encontrada</strong></div>";
$conn->select_db($db_encontrada);

// 3. Verificar archivo de configuración
echo "<h2>3. Configuración de Base de Datos (db.php)</h2>";
$db_config_file = __DIR__ . '/../includes/db.php';
$db_esperada = 'proyecto_restaurante_filament_react';

if (file_exists($db_config_file)) {
    $db_config_content = file_get_contents($db_config_file);
    if (strpos($db_config_content, $db_esperada) !== false) {
        echo "<div class='success'>✅ db.php configurado correctamente con '$db_esperada'</div>";
    } else {
        echo "<div class='error'>❌ db.php NO está configurado con '$db_esperada'</div>";
        echo "<div class='warning'>⚠️ Debe actualizarse la línea \$db en db.php</div>";
        echo "<div class='info'>Contenido actual de db.php:</div>";
        echo "<pre>" . htmlspecialchars($db_config_content) . "</pre>";
    }
} else {
    echo "<div class='error'>❌ Archivo db.php no encontrado en: $db_config_file</div>";
}

// 4. Verificar tablas críticas
echo "<h2>4. Tablas del Sistema</h2>";
$tablas_esperadas = [
    'users' => 'Tabla de usuarios',
    'orders' => 'Tabla de órdenes',
    'order_details' => 'Detalles de órdenes',
    'products' => 'Tabla de productos',
    'categories' => 'Categorías de productos',
    'api_tokens' => 'Tokens de autenticación (CRÍTICA)',
    'branches' => 'Sucursales',
    'payment_methods' => 'Métodos de pago'
];

$tablas_faltantes = [];
foreach ($tablas_esperadas as $tabla => $descripcion) {
    $result = $conn->query("SHOW TABLES LIKE '$tabla'");
    if ($result && $result->num_rows > 0) {
        echo "<div class='success'>✅ $tabla - $descripcion</div>";
        
        // Contar registros
        $count_result = $conn->query("SELECT COUNT(*) as total FROM $tabla");
        if ($count_result) {
            $count = $count_result->fetch_assoc()['total'];
            echo "<div class='info'>  └─ Registros: $count</div>";
        }
    } else {
        echo "<div class='error'>❌ $tabla - $descripcion (FALTA)</div>";
        $tablas_faltantes[] = $tabla;
    }
}

// 5. Verificar estructura de tablas principales
echo "<h2>5. Estructura de Tablas Principales</h2>";

// Tabla users
echo "<h3>Tabla 'users'</h3>";
$result = $conn->query("DESCRIBE users");
if ($result) {
    echo "<pre>";
    echo str_pad("Campo", 30) . str_pad("Tipo", 30) . "Null\n";
    echo str_repeat("-", 70) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo str_pad($row['Field'], 30) . str_pad($row['Type'], 30) . $row['Null'] . "\n";
    }
    echo "</pre>";
} else {
    echo "<div class='error'>❌ No se pudo obtener estructura de 'users'</div>";
}

// Tabla orders
echo "<h3>Tabla 'orders'</h3>";
$result = $conn->query("DESCRIBE orders");
if ($result) {
    echo "<pre>";
    echo str_pad("Campo", 30) . str_pad("Tipo", 30) . "Null\n";
    echo str_repeat("-", 70) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo str_pad($row['Field'], 30) . str_pad($row['Type'], 30) . $row['Null'] . "\n";
    }
    echo "</pre>";
} else {
    echo "<div class='error'>❌ No se pudo obtener estructura de 'orders'</div>";
}

// 6. Probar consultas del dashboard
echo "<h2>6. Prueba de Consultas del Dashboard</h2>";

// Consulta de usuarios
echo "<h3>Consulta: Total de usuarios (clientes)</h3>";
$sql = "SELECT COUNT(*) as total FROM users WHERE role = 'client'";
$result = $conn->query($sql);
if ($result) {
    $total = $result->fetch_assoc()['total'];
    echo "<div class='success'>✅ Consulta exitosa: $total usuarios clientes</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
} else {
    echo "<div class='error'>❌ Error en consulta: " . $conn->error . "</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
}

// Consulta de órdenes
echo "<h3>Consulta: Total de órdenes</h3>";
$sql = "SELECT COUNT(*) as total FROM orders";
$result = $conn->query($sql);
if ($result) {
    $total = $result->fetch_assoc()['total'];
    echo "<div class='success'>✅ Consulta exitosa: $total órdenes</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
} else {
    echo "<div class='error'>❌ Error en consulta: " . $conn->error . "</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
}

// Consulta de ingresos
echo "<h3>Consulta: Total de ingresos</h3>";
$sql = "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status = 'delivered'";
$result = $conn->query($sql);
if ($result) {
    $total = $result->fetch_assoc()['total'];
    echo "<div class='success'>✅ Consulta exitosa: $" . number_format($total, 2) . " en ingresos</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
} else {
    echo "<div class='error'>❌ Error en consulta: " . $conn->error . "</div>";
    echo "<div class='info'>SQL: <code>$sql</code></div>";
}

// 7. Verificar datos de prueba
echo "<h2>7. Datos de Prueba</h2>";

// Usuarios admin
$result = $conn->query("SELECT id, name, last_name, email, role FROM users WHERE role = 'admin' LIMIT 5");
if ($result && $result->num_rows > 0) {
    echo "<h3>Usuarios Administradores:</h3>";
    echo "<pre>";
    echo str_pad("ID", 10) . str_pad("Nombre", 30) . str_pad("Email", 40) . "Rol\n";
    echo str_repeat("-", 90) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo str_pad($row['id'], 10) . str_pad($row['name'] . ' ' . $row['last_name'], 30) . str_pad($row['email'], 40) . $row['role'] . "\n";
    }
    echo "</pre>";
} else {
    echo "<div class='warning'>⚠️ No hay usuarios administradores</div>";
}

// 8. Resumen y acciones requeridas
echo "<h2>8. 📋 Resumen y Acciones Requeridas</h2>";

if (count($tablas_faltantes) > 0) {
    echo "<div class='error'>";
    echo "<h3>❌ Tablas Faltantes:</h3>";
    echo "<ul>";
    foreach ($tablas_faltantes as $tabla) {
        echo "<li><strong>$tabla</strong></li>";
    }
    echo "</ul>";
    
    if (in_array('api_tokens', $tablas_faltantes)) {
        echo "<div class='warning'>";
        echo "<h4>⚠️ ACCIÓN REQUERIDA: Crear tabla api_tokens</h4>";
        echo "<p>Ejecuta el siguiente SQL en tu base de datos:</p>";
        echo "<pre>USE $db_encontrada;\n\n";
        echo "CREATE TABLE IF NOT EXISTS `api_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  CONSTRAINT `api_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;</pre>";
        echo "</div>";
    }
    
    echo "</div>";
} else {
    echo "<div class='success'><h3>✅ Todas las tablas críticas están presentes</h3></div>";
}

$conn->close();

echo "<hr>";
echo "<p><strong>Diagnóstico completado:</strong> " . date('Y-m-d H:i:s') . "</p>";
?>

