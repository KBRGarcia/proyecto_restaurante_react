<?php
// Funciones de autenticación y autorización

/**
 * Verificar autenticación mediante token JWT (Bearer token)
 * Para uso en APIs REST
 */
function verificarAuth() {
    // Obtener el header de autorización
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader)) {
        return [
            'success' => false,
            'message' => 'No se proporcionó token de autenticación'
        ];
    }
    
    // Extraer el token (formato: "Bearer TOKEN")
    $token = str_replace('Bearer ', '', $authHeader);
    
    if (empty($token)) {
        return [
            'success' => false,
            'message' => 'Token inválido'
        ];
    }
    
    // Validar el token (simple validación por ahora)
    // En producción, usar JWT real con firma y expiración
    global $conn;
    
    // Buscar sesión activa con este token
    $stmt = $conn->prepare("SELECT s.*, u.id, u.nombre, u.apellido, u.correo, u.rol, u.estado, u.codigo_area, u.numero_telefono, u.direccion, u.foto_perfil, u.fecha_registro 
                            FROM sessions s 
                            JOIN usuarios u ON s.usuario_id = u.id 
                            WHERE s.token = ? AND s.expires_at > NOW()");
    
    if (!$stmt) {
        return [
            'success' => false,
            'message' => 'Error en la consulta: ' . $conn->error
        ];
    }
    
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return [
            'success' => false,
            'message' => 'Token inválido o expirado'
        ];
    }
    
    $session = $result->fetch_assoc();
    
    // Verificar que el usuario esté activo
    if ($session['estado'] !== 'activo') {
        return [
            'success' => false,
            'message' => 'Usuario inactivo'
        ];
    }
    
    // Retornar datos del usuario
    return [
        'success' => true,
        'usuario' => [
            'id' => $session['id'],
            'nombre' => $session['nombre'],
            'apellido' => $session['apellido'],
            'correo' => $session['correo'],
            'rol' => $session['rol'],
            'estado' => $session['estado'],
            'telefono' => $session['codigo_area'] . $session['numero_telefono'],
            'direccion' => $session['direccion'],
            'foto_perfil' => $session['foto_perfil'],
            'fecha_registro' => $session['fecha_registro']
        ]
    ];
}

function verificarLogin() {
    if (!isset($_SESSION['usuario'])) {
        header("Location: login.php");
        exit();
    }
}

function verificarAdmin() {
    verificarLogin();
    if ($_SESSION['usuario']['rol'] !== 'admin') {
        header("Location: index.php");
        exit();
    }
}

function verificarEmpleadoOAdmin() {
    verificarLogin();
    $rol = $_SESSION['usuario']['rol'];
    if ($rol !== 'admin' && $rol !== 'empleado') {
        header("Location: index.php");
        exit();
    }
}

function esAdmin() {
    return isset($_SESSION['usuario']) && $_SESSION['usuario']['rol'] === 'admin';
}

function esEmpleado() {
    return isset($_SESSION['usuario']) && $_SESSION['usuario']['rol'] === 'empleado';
}

function esCliente() {
    return isset($_SESSION['usuario']) && $_SESSION['usuario']['rol'] === 'cliente';
}

function obtenerUsuarioActual() {
    return $_SESSION['usuario'] ?? null;
}

function obtenerNombreUsuario() {
    $usuario = obtenerUsuarioActual();
    if ($usuario) {
        return $usuario['nombre'] . ' ' . ($usuario['apellido'] ?? '');
    }
    return 'Invitado';
}

// Función para limpiar y validar datos de entrada
function limpiarDatos($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Función para validar correo electrónico
function validarCorreo($correo) {
    return filter_var($correo, FILTER_VALIDATE_EMAIL);
}

// Función para validar contraseña
function validarPassword($password) {
    return strlen($password) >= 6;
}

// Función para generar token CSRF
function generarTokenCSRF() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Función para verificar token CSRF
function verificarTokenCSRF($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Función para formatear fechas
function formatearFecha($fecha, $formato = 'd/m/Y H:i') {
    return date($formato, strtotime($fecha));
}

// Función para formatear precios
function formatearPrecio($precio) {
    return '$' . number_format($precio, 2);
}

// Función para registrar actividad del usuario
function registrarActividad($conn, $usuario_id, $accion, $descripcion = '') {
    $stmt = $conn->prepare("INSERT INTO logs_actividad (usuario_id, accion, descripcion, fecha) VALUES (?, ?, ?, NOW())");
    if ($stmt) {
        $stmt->bind_param("iss", $usuario_id, $accion, $descripcion);
        $stmt->execute();
        $stmt->close();
    }
}

// Función para verificar permisos específicos
function tienePermiso($permiso) {
    $usuario = obtenerUsuarioActual();
    if (!$usuario) return false;
    
    $permisos_admin = ['crear_productos', 'editar_productos', 'eliminar_productos', 'gestionar_usuarios', 'ver_reportes', 'gestionar_categorias', 'gestionar_mesas'];
    $permisos_empleado = ['ver_ordenes', 'actualizar_ordenes', 'ver_mesas'];
    $permisos_cliente = ['hacer_pedidos', 'ver_menu', 'hacer_reservaciones'];
    
    switch ($usuario['rol']) {
        case 'admin':
            return in_array($permiso, array_merge($permisos_admin, $permisos_empleado, $permisos_cliente));
        case 'empleado':
            return in_array($permiso, array_merge($permisos_empleado, $permisos_cliente));
        case 'cliente':
            return in_array($permiso, $permisos_cliente);
        default:
            return false;
    }
}

// Función para redirigir según el rol del usuario
function redirigirSegunRol() {
    $usuario = obtenerUsuarioActual();
    if (!$usuario) {
        header("Location: login.php");
        exit();
    }
    
    switch ($usuario['rol']) {
        case 'admin':
            header("Location: dashboard.php");
            break;
        case 'empleado':
            header("Location: ordenes.php");
            break;
        case 'cliente':
            header("Location: index.php");
            break;
        default:
            header("Location: index.php");
    }
    exit();
}

// Función para obtener el estado de la sesión
function obtenerEstadoSesion() {
    return [
        'logueado' => isset($_SESSION['usuario']),
        'usuario' => obtenerUsuarioActual(),
        'rol' => isset($_SESSION['usuario']) ? $_SESSION['usuario']['rol'] : null,
        'permisos' => isset($_SESSION['usuario']) ? obtenerPermisosUsuario($_SESSION['usuario']['rol']) : []
    ];
}

// Función para obtener permisos de un rol
function obtenerPermisosUsuario($rol) {
    $permisos = [];
    
    switch ($rol) {
        case 'admin':
            $permisos = ['all']; // Administrador tiene todos los permisos
            break;
        case 'empleado':
            $permisos = ['ver_ordenes', 'actualizar_ordenes', 'ver_mesas', 'hacer_pedidos', 'ver_menu'];
            break;
        case 'cliente':
            $permisos = ['hacer_pedidos', 'ver_menu', 'hacer_reservaciones'];
            break;
    }
    
    return $permisos;
}

// Función para verificar si el usuario está activo
function verificarUsuarioActivo($conn, $usuario_id) {
    $stmt = $conn->prepare("SELECT estado FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        return $usuario['estado'] === 'activo';
    }
    
    return false;
}
?>
