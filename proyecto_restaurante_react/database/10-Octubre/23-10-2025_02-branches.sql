-- =====================================================
-- RELACIÓN PRODUCTOS - SUCURSALES
-- Fecha: 23-10-2025
-- Descripción: Tabla intermedia para asignar productos a sucursales
--              Permite que cada sucursal tenga su propio menú
-- =====================================================

-- Eliminar la tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS `producto_sucursal`;

-- Crear tabla intermedia producto_sucursal
-- Esta tabla establece una relación muchos-a-muchos entre productos y sucursales
CREATE TABLE `producto_sucursal` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `producto_id` INT(11) NOT NULL,
  `sucursal_id` INT(11) NOT NULL,
  `disponible` BOOLEAN DEFAULT TRUE,
  `precio_especial` DECIMAL(10, 2) DEFAULT NULL COMMENT 'Precio especial para esta sucursal (opcional)',
  `fecha_asignacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_producto_sucursal` (`producto_id`, `sucursal_id`),
  KEY `idx_producto_id` (`producto_id`),
  KEY `idx_sucursal_id` (`sucursal_id`),
  KEY `idx_disponible` (`disponible`),
  CONSTRAINT `fk_producto_sucursal_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_producto_sucursal_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ASIGNAR TODOS LOS PRODUCTOS ACTUALES A LA SUCURSAL PRINCIPAL
-- =====================================================

-- Obtener el ID de la sucursal principal
SET @sucursal_principal_id = (SELECT id FROM branches WHERE es_principal = TRUE LIMIT 1);

-- Insertar todos los productos existentes en la sucursal principal
INSERT INTO `producto_sucursal` (`producto_id`, `sucursal_id`, `disponible`)
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
-- VISTA PARA FACILITAR CONSULTAS
-- =====================================================

-- Crear vista que combina productos con sus sucursales
CREATE OR REPLACE VIEW `vista_productos_sucursales` AS
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
-- PROCEDIMIENTO ALMACENADO PARA ASIGNAR PRODUCTO A SUCURSAL
-- =====================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `asignar_producto_a_sucursal` $$

CREATE PROCEDURE `asignar_producto_a_sucursal`(
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

-- =====================================================
-- PROCEDIMIENTO ALMACENADO PARA ELIMINAR PRODUCTO DE SUCURSAL
-- =====================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `eliminar_producto_de_sucursal` $$

CREATE PROCEDURE `eliminar_producto_de_sucursal`(
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
-- VERIFICACIÓN DE DATOS
-- =====================================================

-- Mostrar cuántos productos tiene cada sucursal
SELECT 
  b.nombre AS sucursal,
  b.ciudad,
  COUNT(ps.producto_id) AS total_productos,
  SUM(CASE WHEN ps.disponible = TRUE THEN 1 ELSE 0 END) AS productos_disponibles
FROM branches b
LEFT JOIN producto_sucursal ps ON b.id = ps.sucursal_id
WHERE b.activo = TRUE
GROUP BY b.id, b.nombre, b.ciudad
ORDER BY b.es_principal DESC, b.nombre;

-- Mostrar algunos productos con sus sucursales asignadas
SELECT 
  p.id,
  p.nombre AS producto,
  GROUP_CONCAT(b.nombre SEPARATOR ', ') AS sucursales
FROM productos p
LEFT JOIN producto_sucursal ps ON p.id = ps.producto_id
LEFT JOIN branches b ON ps.sucursal_id = b.id
WHERE p.estado = 'activo'
GROUP BY p.id, p.nombre
LIMIT 10;

-- Mensaje de confirmación
SELECT 'Sistema de menús por sucursal implementado exitosamente' AS resultado;

