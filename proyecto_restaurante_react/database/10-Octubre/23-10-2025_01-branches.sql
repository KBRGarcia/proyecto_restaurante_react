-- =====================================================
-- CREACIÓN DE TABLA DE SUCURSALES (BRANCHES)
-- Fecha: 23-10-2025
-- Descripción: Tabla para almacenar información de las sucursales del restaurante
-- =====================================================

-- Eliminar la tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS `branches`;

-- Crear tabla de sucursales
CREATE TABLE `branches` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(100) NOT NULL,
  `codigo_postal` VARCHAR(20) DEFAULT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `horario_apertura` TIME NOT NULL DEFAULT '09:00:00',
  `horario_cierre` TIME NOT NULL DEFAULT '22:00:00',
  `dias_operacion` VARCHAR(100) DEFAULT 'Lunes a Domingo',
  `latitud` DECIMAL(10, 8) DEFAULT NULL,
  `longitud` DECIMAL(11, 8) DEFAULT NULL,
  `es_principal` BOOLEAN DEFAULT FALSE,
  `tiene_delivery` BOOLEAN DEFAULT TRUE,
  `tiene_estacionamiento` BOOLEAN DEFAULT FALSE,
  `capacidad_personas` INT(11) DEFAULT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  `fecha_apertura` DATE DEFAULT NULL,
  `gerente` VARCHAR(100) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ciudad` (`ciudad`),
  INDEX `idx_activo` (`activo`),
  INDEX `idx_es_principal` (`es_principal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTAR DATOS DE SUCURSALES FICTICIAS
-- =====================================================

INSERT INTO `branches` (
  `nombre`,
  `direccion`,
  `ciudad`,
  `estado`,
  `codigo_postal`,
  `telefono`,
  `email`,
  `horario_apertura`,
  `horario_cierre`,
  `dias_operacion`,
  `latitud`,
  `longitud`,
  `es_principal`,
  `tiene_delivery`,
  `tiene_estacionamiento`,
  `capacidad_personas`,
  `imagen`,
  `descripcion`,
  `activo`,
  `fecha_apertura`,
  `gerente`
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
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

-- Consulta para verificar las sucursales creadas
SELECT 
  id,
  nombre,
  ciudad,
  estado,
  telefono,
  es_principal,
  activo
FROM branches
ORDER BY es_principal DESC, fecha_apertura ASC;

-- Mensaje de confirmación
SELECT 'Tabla branches creada exitosamente con 5 sucursales' AS resultado;

