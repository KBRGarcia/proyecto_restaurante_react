-- ============================================
-- SCRIPT DE CONFIGURACIÓN COMPLETA
-- Para Dashboard Administrativo con Datos Reales
-- ============================================
-- Fecha: 09 de Octubre de 2025
-- Incluye: BD, Tablas, Sessions, Datos de prueba
-- ============================================

CREATE DATABASE IF NOT EXISTS proyecto_restaurante_react;
USE proyecto_restaurante_react;

-- ============================================
-- 1. TABLAS PRINCIPALES
-- ============================================

-- Tabla de usuarios con campos adicionales
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  foto_perfil TEXT,
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

-- Índices para mejorar performance de sessions
CREATE INDEX IF NOT EXISTS idx_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_expires ON sessions(expires_at);

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
  categoria_id INT,
  imagen VARCHAR(255),
  estado ENUM('activo','inactivo','agotado') DEFAULT 'activo',
  tiempo_preparacion INT DEFAULT 15, -- en minutos
  ingredientes TEXT,
  es_especial BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de órdenes principales
-- Solo soporta tipo_servicio: 'domicilio' y 'recoger' (take away)
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
  fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega_estimada TIMESTAMP NULL,
  empleado_asignado_id INT NULL,
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

-- ============================================
-- 2. DATOS INICIALES
-- ============================================

-- Usuario administrador por defecto
-- Contraseña: password
INSERT IGNORE INTO usuarios (id, nombre, apellido, correo, password, rol) VALUES 
(1, 'Admin', 'Principal', 'admin@restaurante.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Categorías de ejemplo
INSERT IGNORE INTO categorias (id, nombre, descripcion, imagen, orden_mostrar) VALUES 
(1, 'Entradas', 'Deliciosos aperitivos para comenzar', 'entradas.jpg', 1),
(2, 'Platos Principales', 'Nuestros platos más sustanciosos', 'principales.jpg', 2),
(3, 'Postres', 'Dulces tentaciones para terminar', 'postres.jpg', 3),
(4, 'Bebidas', 'Refrescos, jugos y bebidas calientes', 'bebidas.jpg', 4),
(5, 'Especialidades', 'Los platos únicos de la casa', 'especialidades.jpg', 5);

-- Productos de ejemplo
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

-- ============================================
-- 3. DATOS DE PRUEBA PARA DASHBOARD
-- ============================================

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

-- Órdenes de prueba (variadas en el tiempo)
-- Nota: Asegúrate de que los IDs de usuario existan
INSERT INTO ordenes (usuario_id, estado, tipo_servicio, subtotal, impuestos, total, direccion_entrega, telefono_contacto, fecha_orden) VALUES
-- Órdenes del mes pasado
(2, 'entregado', 'domicilio', 45.50, 7.28, 52.78, 'Avenida 2 #456', '+1 555-0102', '2024-09-05 12:30:00'),
(3, 'entregado', 'recoger', 32.00, 5.12, 37.12, NULL, '+1 555-0103', '2024-09-08 14:15:00'),
(4, 'entregado', 'domicilio', 67.80, 10.85, 78.65, 'Calle 4 #321', '+1 555-0104', '2024-09-12 18:45:00'),
(5, 'entregado', 'recoger', 28.50, 4.56, 33.06, NULL, '+1 555-0105', '2024-09-15 11:20:00'),
(6, 'entregado', 'domicilio', 54.20, 8.67, 62.87, 'Boulevard 6 #987', '+1 555-0106', '2024-09-18 19:30:00'),

-- Órdenes de este mes
(2, 'entregado', 'domicilio', 41.00, 6.56, 47.56, 'Avenida 2 #456', '+1 555-0102', '2024-10-02 13:00:00'),
(4, 'entregado', 'recoger', 38.90, 6.22, 45.12, NULL, '+1 555-0104', '2024-10-03 17:15:00'),
(5, 'entregado', 'domicilio', 72.50, 11.60, 84.10, 'Avenida 5 #654', '+1 555-0105', '2024-10-04 20:00:00'),
(6, 'entregado', 'recoger', 29.80, 4.77, 34.57, NULL, '+1 555-0106', '2024-10-05 12:45:00'),
(7, 'entregado', 'domicilio', 55.60, 8.90, 64.50, 'Calle 7 #159', '+1 555-0107', '2024-10-06 15:30:00'),

-- Órdenes de hoy
(2, 'entregado', 'domicilio', 48.90, 7.82, 56.72, 'Avenida 2 #456', '+1 555-0102', CURDATE()),
(8, 'listo', 'recoger', 35.00, 5.60, 40.60, NULL, '+1 555-0108', CURDATE()),
(9, 'preparando', 'domicilio', 62.30, 9.97, 72.27, 'Boulevard 9 #951', '+1 555-0109', CURDATE()),
(10, 'pendiente', 'recoger', 27.50, 4.40, 31.90, NULL, '+1 555-0110', CURDATE());

-- ============================================
-- 4. VERIFICACIÓN
-- ============================================

SELECT '== VERIFICACIÓN DE INSTALACIÓN ==' as '';
SELECT 'Usuarios registrados:' as Tabla, COUNT(*) as Total FROM usuarios;
SELECT 'Usuarios admin:' as Tabla, COUNT(*) as Total FROM usuarios WHERE rol = 'admin';
SELECT 'Usuarios cliente:' as Tabla, COUNT(*) as Total FROM usuarios WHERE rol = 'cliente';
SELECT 'Órdenes creadas:' as Tabla, COUNT(*) as Total FROM ordenes;
SELECT 'Órdenes de hoy:' as Tabla, COUNT(*) as Total FROM ordenes WHERE DATE(fecha_orden) = CURDATE();
SELECT 'Total ingresos:' as Tabla, CONCAT('$', FORMAT(SUM(total), 2)) as Total FROM ordenes WHERE estado = 'entregado';

SELECT '== CREDENCIALES DE ACCESO ==' as '';
SELECT 'Correo: admin@restaurante.com' as Admin;
SELECT 'Contraseña: password' as Password;

