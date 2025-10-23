-- =====================================================
-- ACTUALIZACIÓN DE MÉTODOS DE PAGO NACIONALES E INTERNACIONALES
-- Fecha: 11-10-2025
-- Descripción: Agregar soporte para métodos de pago nacionales e internacionales
-- =====================================================

-- 1. Agregar columna para tipo de moneda en la tabla ordenes
ALTER TABLE ordenes 
ADD COLUMN tipo_moneda ENUM('nacional', 'internacional') DEFAULT 'internacional' AFTER metodo_pago;

-- 2. Agregar columna para datos específicos de pago nacional
ALTER TABLE ordenes 
ADD COLUMN datos_pago_nacional JSON NULL AFTER tipo_moneda;

-- 3. Crear tabla para configuración de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo_moneda ENUM('nacional', 'internacional') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    configuracion JSON NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Insertar métodos de pago internacionales existentes
INSERT INTO metodos_pago (codigo, nombre, tipo_moneda, configuracion) VALUES
('tarjeta', 'Tarjeta de Crédito/Débito', 'internacional', '{"tipos": ["visa", "mastercard"], "requiere_cvv": true}'),
('paypal', 'PayPal', 'internacional', '{"redireccion": true, "requiere_password": true}'),
('zinli', 'Zinli', 'internacional', '{"requiere_pin": true, "longitud_pin": 4}'),
('zelle', 'Zelle', 'internacional', '{"requiere_nombre_completo": true}');

-- 5. Insertar métodos de pago nacionales
INSERT INTO metodos_pago (codigo, nombre, tipo_moneda, configuracion) VALUES
('pago_movil', 'Pago Móvil', 'nacional', '{"requiere_cedula": true, "requiere_referencia": true, "bancos_disponibles": ["provincial", "mercantil", "banesco", "bnc", "bdv", "venezolano"]}'),
('transferencia', 'Transferencia Bancaria', 'nacional', '{"requiere_cedula": true, "requiere_referencia": true, "bancos_disponibles": ["provincial", "mercantil", "banesco", "bnc", "bdv", "venezolano"]}'),
('fisico', 'Pago Físico', 'nacional', '{"solo_recoger": true, "limite_horas": 3, "requiere_confirmacion_admin": true}');

-- 6. Crear tabla para configuración de bancos venezolanos
CREATE TABLE IF NOT EXISTS bancos_venezuela (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    datos_sistema JSON NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insertar datos de bancos venezolanos
INSERT INTO bancos_venezuela (codigo, nombre, datos_sistema) VALUES
('0108', 'BBVA Banco Provincial', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0105', 'Banco Mercantil', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0134', 'Banesco', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0191', 'Banco Nacional de Crédito', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0102', 'Banco de Venezuela', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}'),
('0104', 'Venezolano de Crédito', '{"cedula": "C.I- V-25478369", "telefono": "04142583614", "tipo_cuenta": "Cuenta Corriente"}');

-- 8. Crear tabla para órdenes pendientes de pago físico
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
);

-- 9. Crear evento para cancelación automática de órdenes de pago físico
DELIMITER $$

CREATE EVENT IF NOT EXISTS cancelar_ordenes_pago_fisico_vencidas
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    -- Cancelar órdenes de pago físico que han excedido el límite de tiempo
    UPDATE ordenes o
    JOIN ordenes_pago_fisico opf ON o.id = opf.orden_id
    SET o.estado = 'cancelada'
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

-- 10. Habilitar el scheduler de eventos si no está habilitado
SET GLOBAL event_scheduler = ON;

-- 11. Crear vista para órdenes con información de pago completa
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
    o.fecha_creacion,
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

-- 12. Crear índices para optimizar consultas
CREATE INDEX idx_ordenes_tipo_moneda ON ordenes(tipo_moneda);
CREATE INDEX idx_ordenes_metodo_pago ON ordenes(metodo_pago);
CREATE INDEX idx_ordenes_estado_fecha ON ordenes(estado, fecha_creacion);

-- 13. Agregar comentarios a las tablas
ALTER TABLE ordenes COMMENT = 'Tabla de órdenes con soporte para métodos de pago nacionales e internacionales';
ALTER TABLE metodos_pago COMMENT = 'Configuración de métodos de pago disponibles';
ALTER TABLE bancos_venezuela COMMENT = 'Información de bancos venezolanos para pagos nacionales';
ALTER TABLE ordenes_pago_fisico COMMENT = 'Control de órdenes con pago físico y límites de tiempo';

-- =====================================================
-- VERIFICACIÓN DE LA ACTUALIZACIÓN
-- =====================================================

-- Mostrar estructura actualizada de la tabla ordenes
DESCRIBE ordenes;

-- Mostrar métodos de pago disponibles
SELECT * FROM metodos_pago ORDER BY tipo_moneda, nombre;

-- Mostrar bancos venezolanos configurados
SELECT * FROM bancos_venezuela ORDER BY codigo;

-- Verificar que el evento esté creado
SHOW EVENTS LIKE 'cancelar_ordenes_pago_fisico_vencidas';

-- Mostrar configuración del scheduler
SHOW VARIABLES LIKE 'event_scheduler';

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. La columna tipo_moneda permite distinguir entre pagos nacionales e internacionales
2. La columna datos_pago_nacional almacena información específica de métodos nacionales en formato JSON
3. La tabla metodos_pago centraliza la configuración de todos los métodos disponibles
4. La tabla bancos_venezuela contiene los datos del sistema para cada banco
5. La tabla ordenes_pago_fisico controla las órdenes que requieren pago físico
6. El evento automático cancela órdenes de pago físico que excedan el límite de tiempo
7. La vista vista_ordenes_pago_completo facilita consultas complejas sobre órdenes y pagos

FORMATO DE datos_pago_nacional JSON:
{
  "pago_movil": {
    "cedula": "V-12345678",
    "telefono": "04142583614",
    "banco": "provincial",
    "numero_referencia": "REF123456",
    "fecha_pago": "2025-10-11T10:30:00"
  },
  "transferencia": {
    "cedula": "V-12345678",
    "telefono": "04142583614",
    "banco": "provincial",
    "numero_referencia": "REF123456",
    "fecha_pago": "2025-10-11T10:30:00"
  },
  "fisico": {
    "horario_atencion": "Lunes a Domingo: 7:00 AM - 10:00 PM",
    "direccion_restaurante": "Av. Principal #123, Centro, Caracas",
    "limite_tiempo": 3
  }
}
*/
