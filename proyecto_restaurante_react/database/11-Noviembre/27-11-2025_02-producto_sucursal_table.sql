-- ============================================
-- TABLA PRODUCTO_SUCURSAL PARA NUEVA BASE DE DATOS
-- ============================================
-- Fecha: 27 de Noviembre de 2025
-- Descripción: Tabla intermedia para asignar productos a sucursales
--               Adaptada para la nueva estructura de base de datos
-- ============================================

-- Crear tabla intermedia producto_sucursal
-- Esta tabla establece una relación muchos-a-muchos entre products y branches
CREATE TABLE IF NOT EXISTS `producto_sucursal` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) UNSIGNED NOT NULL COMMENT 'ID del producto (products.id)',
  `sucursal_id` bigint(20) UNSIGNED NOT NULL COMMENT 'ID de la sucursal (branches.id)',
  `disponible` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Indica si el producto está disponible en esta sucursal',
  `precio_especial` decimal(10,2) DEFAULT NULL COMMENT 'Precio especial para esta sucursal (opcional)',
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de asignación del producto a la sucursal',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_producto_sucursal` (`producto_id`, `sucursal_id`),
  KEY `idx_producto_id` (`producto_id`),
  KEY `idx_sucursal_id` (`sucursal_id`),
  KEY `idx_disponible` (`disponible`),
  CONSTRAINT `fk_producto_sucursal_producto` FOREIGN KEY (`producto_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_producto_sucursal_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ASIGNAR TODOS LOS PRODUCTOS ACTUALES A LA SUCURSAL PRINCIPAL
-- ============================================

-- Obtener el ID de la sucursal principal
SET @sucursal_principal_id = (SELECT id FROM branches WHERE is_main = TRUE LIMIT 1);

-- Insertar todos los productos existentes en la sucursal principal
INSERT INTO `producto_sucursal` (`producto_id`, `sucursal_id`, `disponible`, `created_at`)
SELECT 
  p.id,
  @sucursal_principal_id,
  TRUE,
  NOW()
FROM products p
WHERE p.status = 'active'
  AND @sucursal_principal_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM producto_sucursal ps 
    WHERE ps.producto_id = p.id 
      AND ps.sucursal_id = @sucursal_principal_id
  );

-- ============================================
-- VERIFICACIÓN DE DATOS
-- ============================================

-- Mostrar cuántos productos tiene cada sucursal
SELECT 
  b.name AS sucursal,
  b.city AS ciudad,
  COUNT(ps.producto_id) AS total_productos,
  SUM(CASE WHEN ps.disponible = TRUE THEN 1 ELSE 0 END) AS productos_disponibles
FROM branches b
LEFT JOIN producto_sucursal ps ON b.id = ps.sucursal_id
WHERE b.active = TRUE
GROUP BY b.id, b.name, b.city
ORDER BY b.is_main DESC, b.name;

