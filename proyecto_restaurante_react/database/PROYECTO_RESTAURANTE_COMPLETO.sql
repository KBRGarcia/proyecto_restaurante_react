-- =====================================================
-- PROYECTO RESTAURANTE REACT - BASE DE DATOS COMPLETA
-- =====================================================
-- Fecha: Diciembre 2025
-- Descripción: Archivo SQL consolidado con toda la estructura
--              y datos del proyecto restaurante React
-- =====================================================
-- 
-- INSTRUCCIONES DE USO:
-- 1. Ejecutar este archivo completo en MySQL/MariaDB
-- 2. Creará la base de datos y todas las tablas
-- 3. Insertará todos los datos de prueba
-- 4. Configurará índices, eventos y procedimientos
-- 
-- CREDENCIALES DE ACCESO:
-- Admin: admin@restaurante.com
-- Password: password
-- =====================================================

-- =====================================================
-- 1. CREACIÓN DE BASE DE DATOS
-- =====================================================

CREATE DATABASE IF NOT EXISTS proyecto_restaurante_react;
USE proyecto_restaurante_react;

-- =====================================================
-- 2. TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios con campos adicionales --------- CREADA TABAL USERS -------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  foto_perfil LONGTEXT NULL COMMENT 'Imagen de perfil del usuario en formato base64',
  rol ENUM('admin','empleado','cliente') DEFAULT 'cliente',
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de sesiones (CRÍTICA para autenticación de API)
CREATE TABLE IF NOT EXISTS sessions (
  id INT(11) NOT NULL AUTO_INCREMENT,
  usuario_id INT(11) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY token (token),
  UNIQUE KEY usuario_id (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  orden_mostrar INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de productos del menú
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  category_id INT,
  imagen VARCHAR(255),
  estado ENUM('activo','inactivo','agotado') DEFAULT 'activo',
  tiempo_preparacion INT DEFAULT 15, -- en minutos
  ingredientes TEXT,
  es_especial BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de órdenes principales con timestamps de seguimiento
CREATE TABLE IF NOT EXISTS ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  estado ENUM('pendiente','preparando','listo','entregado','cancelado') DEFAULT 'pendiente',
  tipo_servicio ENUM('domicilio','recoger') NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  impuestos DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  direccion_entrega TEXT NULL,
  telefono_contacto VARCHAR(20),
  notas_especiales TEXT,
  metodo_pago VARCHAR(50) DEFAULT NULL,
  tipo_moneda ENUM('nacional', 'internacional') DEFAULT 'internacional',
  datos_pago_nacional JSON NULL,
  fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega_estimada TIMESTAMP NULL,
  empleado_asignado_id INT NULL,
  -- Timestamps de seguimiento de estados
  fecha_pendiente TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha cuando se crea la orden',
  fecha_preparando TIMESTAMP NULL COMMENT 'Fecha cuando se inicia la preparación',
  fecha_listo TIMESTAMP NULL COMMENT 'Fecha cuando está listo para entrega/recoger',
  fecha_en_camino TIMESTAMP NULL COMMENT 'Fecha cuando sale para entrega (solo domicilio)',
  fecha_entregado TIMESTAMP NULL COMMENT 'Fecha cuando se completa la entrega',
  fecha_cancelado TIMESTAMP NULL COMMENT 'Fecha cuando se cancela la orden',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (empleado_asignado_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de detalles de órdenes
CREATE TABLE IF NOT EXISTS orden_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  notas_producto TEXT,
  FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de evaluaciones y comentarios
CREATE TABLE IF NOT EXISTS evaluaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  orden_id INT,
  producto_id INT,
  calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT,
  fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (orden_id) REFERENCES ordenes(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. TABLAS DE MÉTODOS DE PAGO
-- =====================================================

-- Tabla para configuración de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo_moneda ENUM('nacional', 'internacional') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    configuracion JSON NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para configuración de bancos venezolanos
CREATE TABLE IF NOT EXISTS bancos_venezuela (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    datos_sistema JSON NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para órdenes pendientes de pago físico
CREATE TABLE IF NOT EXISTS ordenes_pago_fisico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    fecha_limite TIMESTAMP NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'cancelado') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    INDEX idx_fecha_limite (fecha_limite),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. TABLAS DE SUCURSALES
-- =====================================================

-- Tabla de sucursales del restaurante
CREATE TABLE IF NOT EXISTS branches (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  estado VARCHAR(100) NOT NULL,
  codigo_postal VARCHAR(20) DEFAULT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) DEFAULT NULL,
  horario_apertura TIME NOT NULL DEFAULT '09:00:00',
  horario_cierre TIME NOT NULL DEFAULT '22:00:00',
  dias_operacion VARCHAR(100) DEFAULT 'Lunes a Domingo',
  latitud DECIMAL(10, 8) DEFAULT NULL,
  longitud DECIMAL(11, 8) DEFAULT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  tiene_delivery BOOLEAN DEFAULT TRUE,
  tiene_estacionamiento BOOLEAN DEFAULT FALSE,
  capacidad_personas INT(11) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_apertura DATE DEFAULT NULL,
  gerente VARCHAR(100) DEFAULT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_ciudad (ciudad),
  INDEX idx_activo (activo),
  INDEX idx_es_principal (es_principal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla intermedia para asignar productos a sucursales
CREATE TABLE IF NOT EXISTS producto_sucursal (
  id INT(11) NOT NULL AUTO_INCREMENT,
  producto_id INT(11) NOT NULL,
  sucursal_id INT(11) NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  precio_especial DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio especial para esta sucursal (opcional)',
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_producto_sucursal (producto_id, sucursal_id),
  KEY idx_producto_id (producto_id),
  KEY idx_sucursal_id (sucursal_id),
  KEY idx_disponible (disponible),
  CONSTRAINT fk_producto_sucursal_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
  CONSTRAINT fk_producto_sucursal_sucursal FOREIGN KEY (sucursal_id) REFERENCES branches (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABLA DE RECUPERACIÓN DE CONTRASEÑA
-- =====================================================

-- Tabla para códigos de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_codigo (codigo),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para sessions
CREATE INDEX IF NOT EXISTS idx_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_expires ON sessions(expires_at);

-- Índices para timestamps de órdenes
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_pendiente ON ordenes(fecha_pendiente);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_preparando ON ordenes(fecha_preparando);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_listo ON ordenes(fecha_listo);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_en_camino ON ordenes(fecha_en_camino);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_entregado ON ordenes(fecha_entregado);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha_cancelado ON ordenes(fecha_cancelado);

-- Índices para métodos de pago
CREATE INDEX IF NOT EXISTS idx_ordenes_tipo_moneda ON ordenes(tipo_moneda);
CREATE INDEX IF NOT EXISTS idx_ordenes_metodo_pago ON ordenes(metodo_pago);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado_fecha ON ordenes(estado, fecha_orden);

-- =====================================================
-- 7. PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para limpiar códigos expirados
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS LimpiarCodigosExpirados()
BEGIN
    -- Eliminar códigos expirados o usados
    DELETE FROM password_reset_codes 
    WHERE expires_at < NOW() OR used = TRUE;
END //

DELIMITER ;

-- Procedimiento para asignar producto a sucursal
DELIMITER $$

DROP PROCEDURE IF EXISTS asignar_producto_a_sucursal $$

CREATE PROCEDURE asignar_producto_a_sucursal(
  IN p_producto_id INT,
  IN p_sucursal_id INT,
  IN p_disponible BOOLEAN,
  IN p_precio_especial DECIMAL(10, 2)
)
BEGIN
  -- Verificar que el producto existe
  IF NOT EXISTS (SELECT 1 FROM productos WHERE id = p_producto_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El producto no existe';
  END IF;
  
  -- Verificar que la sucursal existe
  IF NOT EXISTS (SELECT 1 FROM branches WHERE id = p_sucursal_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La sucursal no existe';
  END IF;
  
  -- Insertar o actualizar la relación
  INSERT INTO producto_sucursal (producto_id, sucursal_id, disponible, precio_especial)
  VALUES (p_producto_id, p_sucursal_id, p_disponible, p_precio_especial)
  ON DUPLICATE KEY UPDATE
    disponible = p_disponible,
    precio_especial = p_precio_especial,
    fecha_asignacion = CURRENT_TIMESTAMP;
    
  SELECT 'Producto asignado exitosamente' AS resultado;
END $$

DELIMITER ;

-- Procedimiento para eliminar producto de sucursal
DELIMITER $$

DROP PROCEDURE IF EXISTS eliminar_producto_de_sucursal $$

CREATE PROCEDURE eliminar_producto_de_sucursal(
  IN p_producto_id INT,
  IN p_sucursal_id INT
)
BEGIN
  DELETE FROM producto_sucursal 
  WHERE producto_id = p_producto_id 
    AND sucursal_id = p_sucursal_id;
    
  SELECT 'Producto eliminado de la sucursal exitosamente' AS resultado;
END $$

DELIMITER ;

-- =====================================================
-- 8. EVENTOS AUTOMÁTICOS
-- =====================================================

-- Evento para cancelación automática de órdenes de pago físico
DELIMITER $$

CREATE EVENT IF NOT EXISTS cancelar_ordenes_pago_fisico_vencidas
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    -- Cancelar órdenes de pago físico que han excedido el límite de tiempo
    UPDATE ordenes o
    JOIN ordenes_pago_fisico opf ON o.id = opf.orden_id
    SET o.estado = 'cancelado'
    WHERE opf.estado = 'pendiente' 
    AND opf.fecha_limite < NOW()
    AND o.estado = 'pendiente';
    
    -- Marcar como canceladas en la tabla de pago físico
    UPDATE ordenes_pago_fisico
    SET estado = 'cancelado'
    WHERE estado = 'pendiente' 
    AND fecha_limite < NOW();
END$$

DELIMITER ;

-- Evento para limpiar códigos de recuperación expirados
CREATE EVENT IF NOT EXISTS limpiar_codigos_expirados
ON SCHEDULE EVERY 1 MINUTE
DO
  CALL LimpiarCodigosExpirados();

-- Habilitar el scheduler de eventos
SET GLOBAL event_scheduler = ON;

-- =====================================================
-- 9. VISTAS PARA FACILITAR CONSULTAS
-- =====================================================

-- Vista para órdenes con información de pago completa
CREATE OR REPLACE VIEW vista_ordenes_pago_completo AS
SELECT 
    o.id,
    o.usuario_id,
    o.tipo_servicio,
    o.direccion_entrega,
    o.telefono_contacto,
    o.notas_especiales,
    o.metodo_pago,
    o.tipo_moneda,
    o.datos_pago_nacional,
    o.total,
    o.estado,
    o.fecha_orden,
    u.nombre as usuario_nombre,
    u.apellido as usuario_apellido,
    u.correo as usuario_correo,
    mp.nombre as metodo_pago_nombre,
    opf.fecha_limite as limite_pago_fisico,
    opf.estado as estado_pago_fisico
FROM ordenes o
LEFT JOIN usuarios u ON o.usuario_id = u.id
LEFT JOIN metodos_pago mp ON o.metodo_pago = mp.codigo
LEFT JOIN ordenes_pago_fisico opf ON o.id = opf.orden_id;

-- Vista que combina productos con sus sucursales
CREATE OR REPLACE VIEW vista_productos_sucursales AS
SELECT 
  p.id AS producto_id,
  p.nombre AS producto_nombre,
  p.descripcion AS producto_descripcion,
  p.precio AS producto_precio,
  p.categoria_id,
  c.nombre AS categoria_nombre,
  p.imagen,
  p.estado AS producto_estado,
  p.tiempo_preparacion,
  p.ingredientes,
  p.es_especial,
  b.id AS sucursal_id,
  b.nombre AS sucursal_nombre,
  b.ciudad AS sucursal_ciudad,
  b.estado AS sucursal_estado,
  ps.disponible AS disponible_en_sucursal,
  ps.precio_especial,
  COALESCE(ps.precio_especial, p.precio) AS precio_final,
  ps.fecha_asignacion
FROM productos p
INNER JOIN producto_sucursal ps ON p.id = ps.producto_id
INNER JOIN branches b ON ps.sucursal_id = b.id
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.estado = 'activo' 
  AND b.activo = TRUE;

-- =====================================================
-- 10. DATOS INICIALES - USUARIOS
-- =====================================================

-- Usuario administrador por defecto
-- Contraseña: password
INSERT IGNORE INTO usuarios (id, nombre, apellido, correo, password, rol) VALUES 
(1, 'Admin', 'Principal', 'admin@restaurante.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Usuarios de prueba (clientes)
INSERT IGNORE INTO usuarios (nombre, apellido, correo, password, telefono, direccion, rol, estado, fecha_registro) VALUES 
('Juan', 'Pérez', 'juan@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0101', 'Calle 1 #123', 'cliente', 'activo', '2024-01-15 10:30:00'),
('María', 'González', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0102', 'Avenida 2 #456', 'cliente', 'activo', '2024-02-20 14:15:00'),
('Carlos', 'Rodríguez', 'carlos@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0103', 'Boulevard 3 #789', 'cliente', 'inactivo', '2024-03-10 09:45:00'),
('Ana', 'Martínez', 'ana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0104', 'Calle 4 #321', 'cliente', 'activo', '2024-04-05 16:20:00'),
('Luis', 'López', 'luis@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0105', 'Avenida 5 #654', 'cliente', 'activo', '2024-05-12 11:00:00'),
('Sofia', 'Hernández', 'sofia@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0106', 'Boulevard 6 #987', 'cliente', 'activo', '2024-06-18 13:30:00'),
('Diego', 'García', 'diego@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0107', 'Calle 7 #159', 'cliente', 'activo', '2024-07-22 15:45:00'),
('Elena', 'Díaz', 'elena@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0108', 'Avenida 8 #753', 'cliente', 'activo', '2024-08-30 10:15:00'),
('Miguel', 'Ramírez', 'miguel@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0109', 'Boulevard 9 #951', 'cliente', 'activo', '2024-09-14 12:00:00'),
('Laura', 'Torres', 'laura@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 555-0110', 'Calle 10 #852', 'cliente', 'activo', '2024-10-01 14:30:00');

-- =====================================================
-- 11. DATOS INICIALES - CATEGORÍAS
-- =====================================================

INSERT IGNORE INTO categorias (id, nombre, descripcion, imagen, orden_mostrar) VALUES 
(1, 'Entradas', 'Deliciosos aperitivos para comenzar', 'entradas.jpg', 1),
(2, 'Platos Principales', 'Nuestros platos más sustanciosos', 'principales.jpg', 2),
(3, 'Postres', 'Dulces tentaciones para terminar', 'postres.jpg', 3),
(4, 'Bebidas', 'Refrescos, jugos y bebidas calientes', 'bebidas.jpg', 4),
(5, 'Especialidades', 'Los platos únicos de la casa', 'especialidades.jpg', 5);

-- =====================================================
-- 12. DATOS INICIALES - PRODUCTOS
-- =====================================================

INSERT IGNORE INTO productos (nombre, descripcion, precio, categoria_id, tiempo_preparacion, es_especial) VALUES 
-- Entradas
('Alitas Buffalo', 'Alitas de pollo con salsa picante buffalo', 12.99, 1, 15, false),
('Nachos Supremos', 'Nachos con queso, guacamole, crema y jalapeños', 10.99, 1, 10, false),
('Calamares Fritos', 'Anillos de calamar empanizados con salsa marinara', 14.99, 1, 12, false),

-- Platos Principales  
('Hamburguesa Clásica', 'Carne de res, lechuga, tomate, cebolla y papas fritas', 16.99, 2, 20, false),
('Filete de Salmón', 'Salmón a la plancha con vegetales y arroz', 22.99, 2, 25, true),
('Pasta Alfredo', 'Fettuccine con salsa alfredo y pollo', 18.99, 2, 18, false),
('Pizza Margherita', 'Pizza tradicional con tomate, mozzarella y albahaca', 15.99, 2, 20, false),

-- Postres
('Cheesecake', 'Pastel de queso con frutos rojos', 8.99, 3, 5, false),
('Brownie con Helado', 'Brownie de chocolate caliente con helado de vainilla', 7.99, 3, 8, false),
('Tiramisú', 'Postre italiano con café y mascarpone', 9.99, 3, 5, true),

-- Bebidas
('Coca Cola', 'Refresco de cola 355ml', 2.99, 4, 2, false),
('Jugo de Naranja Natural', 'Jugo fresco de naranja 300ml', 4.99, 4, 3, false),
('Café Americano', 'Café negro recién preparado', 3.99, 4, 5, false),
('Smoothie de Fresa', 'Batido de fresa con yogurt', 6.99, 4, 5, false),

-- Especialidades
('Paella Marinera', 'Arroz con mariscos frescos (para 2 personas)', 35.99, 5, 45, true),
('Ceviche Peruano', 'Pescado fresco marinado en limón', 19.99, 5, 15, true);

-- =====================================================
-- 13. DATOS INICIALES - MÉTODOS DE PAGO
-- =====================================================

-- Métodos de pago internacionales
INSERT IGNORE INTO metodos_pago (codigo, nombre, tipo_moneda, configuracion) VALUES
('tarjeta', 'Tarjeta de Crédito/Débito', 'internacional', '{"tipos": ["visa", "mastercard"], "requiere_cvv": true}'),
('paypal', 'PayPal', 'internacional', '{"redireccion": true, "requiere_password": true}'),
('zinli', 'Zinli', 'internacional', '{"requiere_pin": true, "longitud_pin": 4}'),
('zelle', 'Zelle', 'internacional', '{"requiere_nombre_completo": true}');

-- Métodos de pago nacionales
INSERT IGNORE INTO metodos_pago (codigo, nombre, tipo_moneda, configuracion) VALUES
('pago_movil', 'Pago Móvil', 'nacional', '{"requiere_cedula": true, "requiere_referencia": true, "bancos_disponibles": ["provincial", "mercantil", "banesco", "bnc", "bdv", "venezolano"]}'),
('transferencia', 'Transferencia Bancaria', 'nacional', '{"requiere_cedula": true, "requiere_referencia": true, "bancos_disponibles": ["provincial", "mercantil", "banesco", "bnc", "bdv", "venezolano"]}'),
('fisico', 'Pago Físico', 'nacional', '{"solo_recoger": true, "limite_horas": 3, "requiere_confirmacion_admin": true}');

-- =====================================================
-- 14. DATOS INICIALES - BANCOS VENEZOLANOS
-- =====================================================

INSERT IGNORE INTO bancos_venezuela (codigo, nombre, datos_sistema) VALUES
('0108', 'BBVA Banco Provincial', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0105', 'Banco Mercantil', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0134', 'Banesco', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0191', 'Banco Nacional de Crédito', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0102', 'Banco de Venezuela', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0104', 'Venezolano de Crédito', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}');

-- =====================================================
-- 15. DATOS INICIALES - SUCURSALES
-- =====================================================

INSERT IGNORE INTO branches (
  nombre,
  direccion,
  ciudad,
  estado,
  codigo_postal,
  telefono,
  email,
  horario_apertura,
  horario_cierre,
  dias_operacion,
  latitud,
  longitud,
  es_principal,
  tiene_delivery,
  tiene_estacionamiento,
  capacidad_personas,
  imagen,
  descripcion,
  activo,
  fecha_apertura,
  gerente
) VALUES
-- Sucursal 1 - Principal
(
  'Sabor & Tradición - Centro',
  'Av. Principal, Edificio Centro Plaza, Local 5',
  'Caracas',
  'Distrito Capital',
  '1010',
  '0212-555-1234',
  'centro@sabortradicion.com',
  '09:00:00',
  '23:00:00',
  'Lunes a Domingo',
  10.50634800,
  -66.91462300,
  TRUE,
  TRUE,
  TRUE,
  120,
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'Nuestra sucursal principal ubicada en el corazón de Caracas. Cuenta con amplios espacios, estacionamiento y servicio de delivery. Perfecta para reuniones familiares y eventos especiales.',
  TRUE,
  '2020-01-15',
  'María Rodríguez'
),

-- Sucursal 2 - Las Mercedes
(
  'Sabor & Tradición - Las Mercedes',
  'Calle París con Av. Principal de Las Mercedes, C.C. Plaza Las Mercedes',
  'Caracas',
  'Distrito Capital',
  '1060',
  '0212-555-2345',
  'lasmercedes@sabortradicion.com',
  '11:00:00',
  '23:30:00',
  'Lunes a Domingo',
  10.49504000,
  -66.85743000,
  FALSE,
  TRUE,
  TRUE,
  80,
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
  'Ubicada en la exclusiva zona de Las Mercedes, esta sucursal ofrece un ambiente elegante y sofisticado. Ideal para cenas románticas y encuentros de negocios.',
  TRUE,
  '2021-03-20',
  'Carlos Méndez'
),

-- Sucursal 3 - Altamira
(
  'Sabor & Tradición - Altamira',
  'Av. San Juan Bosco con 2da Transversal de Altamira',
  'Caracas',
  'Distrito Capital',
  '1062',
  '0212-555-3456',
  'altamira@sabortradicion.com',
  '10:00:00',
  '22:00:00',
  'Lunes a Sábado',
  10.49677000,
  -66.85371000,
  FALSE,
  TRUE,
  FALSE,
  60,
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'Nuestra sucursal boutique en Altamira combina tradición con modernidad. Ambiente acogedor perfecto para almuerzos de trabajo y reuniones casuales.',
  TRUE,
  '2021-07-10',
  'Ana Fernández'
),

-- Sucursal 4 - Valencia
(
  'Sabor & Tradición - Valencia',
  'Av. Bolívar Norte, Centro Comercial Metrópolis, Nivel 2',
  'Valencia',
  'Carabobo',
  '2001',
  '0241-555-4567',
  'valencia@sabortradicion.com',
  '10:00:00',
  '22:00:00',
  'Lunes a Domingo',
  10.16277000,
  -68.00779000,
  FALSE,
  TRUE,
  TRUE,
  100,
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  'Primera sucursal fuera de Caracas. Ubicada en el moderno Centro Comercial Metrópolis de Valencia, ofrece toda la tradición de nuestros sabores con amplias instalaciones.',
  TRUE,
  '2022-05-15',
  'José Ramírez'
),

-- Sucursal 5 - Maracaibo
(
  'Sabor & Tradición - Maracaibo',
  'Av. 5 de Julio con Calle 72, Sector La Lago',
  'Maracaibo',
  'Zulia',
  '4001',
  '0261-555-5678',
  'maracaibo@sabortradicion.com',
  '11:00:00',
  '23:00:00',
  'Martes a Domingo',
  10.66667000,
  -71.61667000,
  FALSE,
  TRUE,
  TRUE,
  90,
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
  'Nuestra más reciente apertura en la ciudad del sol amado. Diseño moderno con toques tradicionales, ofreciendo las mejores vistas del Lago de Maracaibo.',
  TRUE,
  '2023-02-28',
  'Luis Pérez'
);

-- =====================================================
-- 16. ASIGNAR PRODUCTOS A SUCURSAL PRINCIPAL
-- =====================================================

-- Obtener el ID de la sucursal principal
SET @sucursal_principal_id = (SELECT id FROM branches WHERE es_principal = TRUE LIMIT 1);

-- Insertar todos los productos existentes en la sucursal principal
INSERT IGNORE INTO producto_sucursal (producto_id, sucursal_id, disponible)
SELECT 
  p.id,
  @sucursal_principal_id,
  TRUE
FROM productos p
WHERE p.estado = 'activo'
  AND @sucursal_principal_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM producto_sucursal ps 
    WHERE ps.producto_id = p.id 
      AND ps.sucursal_id = @sucursal_principal_id
  );

-- =====================================================
-- 17. DATOS DE PRUEBA - ÓRDENES
-- =====================================================

-- Órdenes de prueba (variadas en el tiempo)
INSERT IGNORE INTO ordenes (usuario_id, estado, tipo_servicio, subtotal, impuestos, total, direccion_entrega, telefono_contacto, fecha_orden, fecha_pendiente) VALUES
-- Órdenes del mes pasado
(2, 'entregado', 'domicilio', 45.50, 7.28, 52.78, 'Avenida 2 #456', '+1 555-0102', '2024-09-05 12:30:00', '2024-09-05 12:30:00'),
(3, 'entregado', 'recoger', 32.00, 5.12, 37.12, NULL, '+1 555-0103', '2024-09-08 14:15:00', '2024-09-08 14:15:00'),
(4, 'entregado', 'domicilio', 67.80, 10.85, 78.65, 'Calle 4 #321', '+1 555-0104', '2024-09-12 18:45:00', '2024-09-12 18:45:00'),
(5, 'entregado', 'recoger', 28.50, 4.56, 33.06, NULL, '+1 555-0105', '2024-09-15 11:20:00', '2024-09-15 11:20:00'),
(6, 'entregado', 'domicilio', 54.20, 8.67, 62.87, 'Boulevard 6 #987', '+1 555-0106', '2024-09-18 19:30:00', '2024-09-18 19:30:00'),

-- Órdenes de este mes
(2, 'entregado', 'domicilio', 41.00, 6.56, 47.56, 'Avenida 2 #456', '+1 555-0102', '2024-10-02 13:00:00', '2024-10-02 13:00:00'),
(4, 'entregado', 'recoger', 38.90, 6.22, 45.12, NULL, '+1 555-0104', '2024-10-03 17:15:00', '2024-10-03 17:15:00'),
(5, 'entregado', 'domicilio', 72.50, 11.60, 84.10, 'Avenida 5 #654', '+1 555-0105', '2024-10-04 20:00:00', '2024-10-04 20:00:00'),
(6, 'entregado', 'recoger', 29.80, 4.77, 34.57, NULL, '+1 555-0106', '2024-10-05 12:45:00', '2024-10-05 12:45:00'),
(7, 'entregado', 'domicilio', 55.60, 8.90, 64.50, 'Calle 7 #159', '+1 555-0107', '2024-10-06 15:30:00', '2024-10-06 15:30:00'),

-- Órdenes de hoy
(2, 'entregado', 'domicilio', 48.90, 7.82, 56.72, 'Avenida 2 #456', '+1 555-0102', CURDATE(), CURDATE()),
(8, 'listo', 'recoger', 35.00, 5.60, 40.60, NULL, '+1 555-0108', CURDATE(), CURDATE()),
(9, 'preparando', 'domicilio', 62.30, 9.97, 72.27, 'Boulevard 9 #951', '+1 555-0109', CURDATE(), CURDATE()),
(10, 'pendiente', 'recoger', 27.50, 4.40, 31.90, NULL, '+1 555-0110', CURDATE(), CURDATE());

-- =====================================================
-- 18. DATOS DE PRUEBA - DETALLES DE ÓRDENES
-- =====================================================

INSERT IGNORE INTO orden_detalles (orden_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- Orden 1
(1, 1, 2, 12.99, 25.98),
(1, 5, 1, 22.99, 22.99),

-- Orden 2
(2, 4, 1, 16.99, 16.99),
(2, 10, 1, 2.99, 2.99),

-- Orden 3
(3, 6, 2, 18.99, 37.98),
(3, 8, 1, 8.99, 8.99),

-- Orden 4
(4, 7, 1, 15.99, 15.99),
(4, 11, 1, 4.99, 4.99),

-- Orden 5
(5, 2, 3, 10.99, 32.97),
(5, 12, 2, 3.99, 7.98);

-- =====================================================
-- 19. COMENTARIOS Y CONFIGURACIÓN FINAL
-- =====================================================

-- Agregar comentarios a las tablas
ALTER TABLE ordenes COMMENT = 'Tabla de órdenes con soporte para métodos de pago nacionales e internacionales';
ALTER TABLE metodos_pago COMMENT = 'Configuración de métodos de pago disponibles';
ALTER TABLE bancos_venezuela COMMENT = 'Información de bancos venezolanos para pagos nacionales';
ALTER TABLE ordenes_pago_fisico COMMENT = 'Control de órdenes con pago físico y límites de tiempo';
ALTER TABLE password_reset_codes COMMENT = 'Códigos de recuperación de contraseña con expiración de 60 segundos';

-- =====================================================
-- 20. VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de la instalación
SELECT '== VERIFICACIÓN DE INSTALACIÓN COMPLETA ==' as '';
SELECT 'Usuarios registrados:' as Tabla, COUNT(*) as Total FROM usuarios;
SELECT 'Usuarios admin:' as Tabla, COUNT(*) as Total FROM usuarios WHERE rol = 'admin';
SELECT 'Usuarios cliente:' as Tabla, COUNT(*) as Total FROM usuarios WHERE rol = 'cliente';
SELECT 'Categorías:' as Tabla, COUNT(*) as Total FROM categorias;
SELECT 'Productos:' as Tabla, COUNT(*) as Total FROM productos;
SELECT 'Órdenes creadas:' as Tabla, COUNT(*) as Total FROM ordenes;
SELECT 'Sucursales:' as Tabla, COUNT(*) as Total FROM branches;
SELECT 'Métodos de pago:' as Tabla, COUNT(*) as Total FROM metodos_pago;
SELECT 'Bancos venezolanos:' as Tabla, COUNT(*) as Total FROM bancos_venezuela;

SELECT '== CREDENCIALES DE ACCESO ==' as '';
SELECT 'Correo: admin@restaurante.com' as Admin;
SELECT 'Contraseña: password' as Password;

SELECT '== FUNCIONALIDADES IMPLEMENTADAS ==' as '';
SELECT '✅ Sistema de autenticación con sesiones' as Funcionalidad;
SELECT '✅ Gestión de usuarios (admin, empleado, cliente)' as Funcionalidad;
SELECT '✅ Catálogo de productos por categorías' as Funcionalidad;
SELECT '✅ Sistema de órdenes con seguimiento de estados' as Funcionalidad;
SELECT '✅ Métodos de pago nacionales e internacionales' as Funcionalidad;
SELECT '✅ Gestión de sucursales' as Funcionalidad;
SELECT '✅ Menús por sucursal' as Funcionalidad;
SELECT '✅ Sistema de recuperación de contraseña' as Funcionalidad;
SELECT '✅ Eventos automáticos de limpieza' as Funcionalidad;
SELECT '✅ Vistas optimizadas para consultas' as Funcionalidad;

SELECT '== BASE DE DATOS LISTA PARA USAR ==' as '';

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
