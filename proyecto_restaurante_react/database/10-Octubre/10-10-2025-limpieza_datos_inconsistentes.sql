-- =====================================================
-- LIMPIEZA DE DATOS INCONSISTENTES
-- Fecha: 10-10-2025
-- Descripción: Eliminar todos los datos ficticios e inconsistentes
-- =====================================================

-- =====================================================
-- PROBLEMAS IDENTIFICADOS:
-- =====================================================
-- 1. Órdenes con fechas anteriores al registro del usuario
-- 2. Órdenes sin detalles de productos (12 órdenes)
-- 3. Órdenes con totales incorrectos (16 órdenes)
-- 4. Datos ficticios que no corresponden a la realidad

-- =====================================================
-- ESTRATEGIA DE LIMPIEZA:
-- =====================================================
-- 1. Eliminar órdenes con fechas inconsistentes
-- 2. Eliminar órdenes sin detalles de productos
-- 3. Mantener solo órdenes con datos reales y consistentes
-- 4. Actualizar estadísticas para que sean 100% reales

-- =====================================================
-- PASO 1: ELIMINAR ÓRDENES CON FECHAS INCONSISTENTES
-- =====================================================

-- Eliminar órdenes donde la fecha de orden es anterior al registro del usuario
DELETE o FROM ordenes o
JOIN usuarios u ON o.usuario_id = u.id
WHERE o.fecha_orden < u.fecha_registro;

-- =====================================================
-- PASO 2: ELIMINAR ÓRDENES SIN DETALLES DE PRODUCTOS
-- =====================================================

-- Eliminar órdenes que no tienen detalles de productos
DELETE o FROM ordenes o
LEFT JOIN orden_detalles od ON o.id = od.orden_id
WHERE od.orden_id IS NULL;

-- =====================================================
-- PASO 3: ELIMINAR ÓRDENES CON TOTALES INCORRECTOS
-- =====================================================

-- Eliminar órdenes donde los totales no coinciden con los detalles
DELETE o FROM ordenes o
WHERE o.id IN (
    SELECT orden_id FROM (
        SELECT o.id as orden_id
        FROM ordenes o
        LEFT JOIN orden_detalles od ON o.id = od.orden_id
        GROUP BY o.id, o.subtotal, o.impuestos, o.total
        HAVING ABS(o.subtotal - COALESCE(SUM(od.subtotal), 0)) > 0.01
           OR ABS(o.total - (COALESCE(SUM(od.subtotal), 0) * 1.16)) > 0.01
    ) as subquery
);

-- =====================================================
-- PASO 4: ELIMINAR USUARIOS SIN ÓRDENES VÁLIDAS
-- =====================================================

-- Eliminar usuarios que no tienen órdenes válidas (opcional)
-- Solo si quieres mantener solo usuarios con actividad real
-- DELETE u FROM usuarios u
-- LEFT JOIN ordenes o ON u.id = o.usuario_id
-- WHERE o.usuario_id IS NULL AND u.rol = 'cliente';

-- =====================================================
-- PASO 5: VERIFICAR DATOS RESTANTES
-- =====================================================

-- Verificar que no queden inconsistencias
SELECT 
    'Órdenes restantes' as tipo,
    COUNT(*) as cantidad
FROM ordenes
UNION ALL
SELECT 
    'Usuarios con órdenes' as tipo,
    COUNT(DISTINCT usuario_id) as cantidad
FROM ordenes
UNION ALL
SELECT 
    'Detalles de órdenes' as tipo,
    COUNT(*) as cantidad
FROM orden_detalles
UNION ALL
SELECT 
    'Órdenes con fechas inconsistentes' as tipo,
    COUNT(*) as cantidad
FROM ordenes o
JOIN usuarios u ON o.usuario_id = u.id
WHERE o.fecha_orden < u.fecha_registro
UNION ALL
SELECT 
    'Órdenes sin detalles' as tipo,
    COUNT(*) as cantidad
FROM ordenes o
LEFT JOIN orden_detalles od ON o.id = od.orden_id
WHERE od.orden_id IS NULL;

-- =====================================================
-- PASO 6: ACTUALIZAR ESTADÍSTICAS
-- =====================================================

-- Las estadísticas del dashboard ahora serán 100% reales
-- porque solo mostrarán datos consistentes y válidos

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ Solo órdenes con fechas posteriores al registro del usuario
-- ✅ Solo órdenes con detalles de productos reales
-- ✅ Solo órdenes con totales correctos
-- ✅ Dashboard y Mis Órdenes mostrarán datos 100% reales
-- ✅ No más datos ficticios o inconsistentes

-- =====================================================
-- NOTA IMPORTANTE:
-- =====================================================
-- Esta limpieza eliminará todos los datos ficticios.
-- Solo se mantendrán los datos reales y consistentes.
-- Si necesitas datos de prueba, se pueden crear después
-- con fechas y relaciones correctas.

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
