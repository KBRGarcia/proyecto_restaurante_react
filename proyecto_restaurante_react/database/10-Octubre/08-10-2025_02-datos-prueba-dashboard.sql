-- Script de Datos de Prueba para Dashboard Administrativo
-- Fecha: 08 de Octubre de 2025
-- Propósito: Agregar datos de prueba para probar el dashboard admin

USE proyecto_restaurante_react;

-- Insertar usuarios de prueba (clientes)
INSERT INTO usuarios (nombre, apellido, correo, password, telefono, direccion, rol, estado, fecha_registro) VALUES 
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

-- Insertar órdenes de prueba (variadas en el tiempo)
-- Órdenes entregadas del mes pasado
INSERT INTO ordenes (usuario_id, estado, tipo_servicio, subtotal, impuestos, total, direccion_entrega, telefono_contacto, fecha_orden) VALUES
(2, 'entregado', 'domicilio', 45.50, 7.28, 52.78, 'Avenida 2 #456', '+1 555-0102', '2024-09-05 12:30:00'),
(3, 'entregado', 'recoger', 32.00, 5.12, 37.12, NULL, '+1 555-0103', '2024-09-08 14:15:00'),
(4, 'entregado', 'domicilio', 67.80, 10.85, 78.65, 'Calle 4 #321', '+1 555-0104', '2024-09-12 18:45:00'),
(5, 'entregado', 'recoger', 28.50, 4.56, 33.06, NULL, '+1 555-0105', '2024-09-15 11:20:00'),
(6, 'entregado', 'domicilio', 54.20, 8.67, 62.87, 'Boulevard 6 #987', '+1 555-0106', '2024-09-18 19:30:00'),

-- Órdenes entregadas de este mes
(2, 'entregado', 'domicilio', 41.00, 6.56, 47.56, 'Avenida 2 #456', '+1 555-0102', '2024-10-02 13:00:00'),
(4, 'entregado', 'recoger', 38.90, 6.22, 45.12, NULL, '+1 555-0104', '2024-10-03 17:15:00'),
(5, 'entregado', 'domicilio', 72.50, 11.60, 84.10, 'Avenida 5 #654', '+1 555-0105', '2024-10-04 20:00:00'),
(6, 'entregado', 'recoger', 29.80, 4.77, 34.57, NULL, '+1 555-0106', '2024-10-05 12:45:00'),
(7, 'entregado', 'domicilio', 55.60, 8.90, 64.50, 'Calle 7 #159', '+1 555-0107', '2024-10-06 15:30:00'),

-- Órdenes de hoy (cambiar fecha según necesites)
(2, 'entregado', 'domicilio', 48.90, 7.82, 56.72, 'Avenida 2 #456', '+1 555-0102', CURDATE()),
(8, 'listo', 'recoger', 35.00, 5.60, 40.60, NULL, '+1 555-0108', CURDATE()),
(9, 'preparando', 'domicilio', 62.30, 9.97, 72.27, 'Boulevard 9 #951', '+1 555-0109', CURDATE()),
(10, 'pendiente', 'recoger', 27.50, 4.40, 31.90, NULL, '+1 555-0110', CURDATE()),

-- Órdenes recientes (últimas horas)
(4, 'preparando', 'domicilio', 44.20, 7.07, 51.27, 'Calle 4 #321', '+1 555-0104', NOW() - INTERVAL 2 HOUR),
(5, 'listo', 'recoger', 33.80, 5.41, 39.21, NULL, '+1 555-0105', NOW() - INTERVAL 1 HOUR),
(7, 'pendiente', 'domicilio', 58.90, 9.42, 68.32, 'Calle 7 #159', '+1 555-0107', NOW() - INTERVAL 30 MINUTE);

-- Insertar detalles de algunas órdenes (opcional, para más realismo)
INSERT INTO orden_detalles (orden_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
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

-- Mostrar resumen de datos insertados
SELECT 'Usuarios insertados:' as Resumen, COUNT(*) as Total FROM usuarios WHERE rol = 'cliente';
SELECT 'Órdenes insertadas:' as Resumen, COUNT(*) as Total FROM ordenes;
SELECT 'Órdenes de hoy:' as Resumen, COUNT(*) as Total FROM ordenes WHERE DATE(fecha_orden) = CURDATE();
SELECT 'Total ingresos:' as Resumen, SUM(total) as Total FROM ordenes WHERE estado = 'entregado';

