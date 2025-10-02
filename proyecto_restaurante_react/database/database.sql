CREATE DATABASE IF NOT EXISTS proyecto_restaurante_react;
USE proyecto_restaurante_react;

-- Tabla de usuarios con campos adicionales
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  rol ENUM('admin','empleado','cliente') DEFAULT 'cliente',
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL
);

-- Tabla de categorías de productos
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  orden_mostrar INT DEFAULT 0
);

-- Tabla de productos del menú
CREATE TABLE productos (
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
);

-- Tabla de mesas del restaurante
CREATE TABLE mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_mesa INT NOT NULL UNIQUE,
  capacidad INT NOT NULL,
  estado ENUM('libre','ocupada','reservada','mantenimiento') DEFAULT 'libre',
  ubicacion VARCHAR(100)
);

-- Tabla de órdenes principales
CREATE TABLE ordenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  mesa_id INT NULL,
  estado ENUM('pendiente','preparando','listo','entregado','cancelado') DEFAULT 'pendiente',
  tipo_servicio ENUM('mesa','domicilio','recoger') DEFAULT 'mesa',
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
  FOREIGN KEY (mesa_id) REFERENCES mesas(id),
  FOREIGN KEY (empleado_asignado_id) REFERENCES usuarios(id)
);

-- Tabla de detalles de órdenes
CREATE TABLE orden_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orden_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  notas_producto TEXT,
  FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de reservaciones
CREATE TABLE reservaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mesa_id INT,
  fecha_reserva DATETIME NOT NULL,
  numero_personas INT NOT NULL,
  estado ENUM('pendiente','confirmada','cancelada','completada') DEFAULT 'pendiente',
  notas TEXT,
  telefono_contacto VARCHAR(20),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (mesa_id) REFERENCES mesas(id)
);

-- Tabla de evaluaciones y comentarios
CREATE TABLE evaluaciones (
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
);

-- Insertar datos de ejemplo

-- Usuario administrador por defecto
INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES 
('Admin', 'Principal', 'admin@restaurante.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Categorías de ejemplo
INSERT INTO categorias (nombre, descripcion, imagen, orden_mostrar) VALUES 
('Entradas', 'Deliciosos aperitivos para comenzar', 'entradas.jpg', 1),
('Platos Principales', 'Nuestros platos más sustanciosos', 'principales.jpg', 2),
('Postres', 'Dulces tentaciones para terminar', 'postres.jpg', 3),
('Bebidas', 'Refrescos, jugos y bebidas calientes', 'bebidas.jpg', 4),
('Especialidades', 'Los platos únicos de la casa', 'especialidades.jpg', 5);

-- Productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria_id, tiempo_preparacion, es_especial) VALUES 
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

-- Mesas de ejemplo
INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES 
(1, 2, 'Terraza'),
(2, 4, 'Salón Principal'),
(3, 4, 'Salón Principal'),
(4, 6, 'Salón Principal'),
(5, 2, 'Terraza'),
(6, 8, 'Salón VIP'),
(7, 4, 'Terraza'),
(8, 2, 'Salón Principal');