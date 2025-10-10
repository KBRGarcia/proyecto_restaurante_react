-- =====================================================
-- AGREGAR TIMESTAMPS PARA SEGUIMIENTO DE ESTADOS
-- Fecha: 10-10-2025
-- Descripción: Agregar campos de timestamps para rastrear
--              el progreso de las órdenes en tiempo real
-- =====================================================

-- =====================================================
-- NUEVOS CAMPOS A AGREGAR:
-- =====================================================
-- fecha_pendiente     - Cuando se crea la orden
-- fecha_preparando    - Cuando se inicia la preparación
-- fecha_listo         - Cuando está listo para entrega/recoger
-- fecha_en_camino     - Cuando sale para entrega (solo domicilio)
-- fecha_entregado     - Cuando se completa la entrega
-- fecha_cancelado     - Cuando se cancela la orden

-- =====================================================
-- AGREGAR CAMPOS DE TIMESTAMPS:
-- =====================================================

ALTER TABLE ordenes 
ADD COLUMN fecha_pendiente TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha cuando se crea la orden',
ADD COLUMN fecha_preparando TIMESTAMP NULL COMMENT 'Fecha cuando se inicia la preparación',
ADD COLUMN fecha_listo TIMESTAMP NULL COMMENT 'Fecha cuando está listo para entrega/recoger',
ADD COLUMN fecha_en_camino TIMESTAMP NULL COMMENT 'Fecha cuando sale para entrega (solo domicilio)',
ADD COLUMN fecha_entregado TIMESTAMP NULL COMMENT 'Fecha cuando se completa la entrega',
ADD COLUMN fecha_cancelado TIMESTAMP NULL COMMENT 'Fecha cuando se cancela la orden';

-- =====================================================
-- ACTUALIZAR ÓRDENES EXISTENTES:
-- =====================================================
-- Para órdenes existentes, establecer fecha_pendiente = fecha_orden
UPDATE ordenes 
SET fecha_pendiente = fecha_orden 
WHERE fecha_pendiente IS NULL;

-- =====================================================
-- FLUJO DE ESTADOS ACTUALIZADO:
-- =====================================================

-- PARA LLEVAR (tipo_servicio = 'recoger'):
-- pendiente → preparando → listo → entregado
-- 
-- A DOMICILIO (tipo_servicio = 'domicilio'):
-- pendiente → preparando → listo → en_camino → entregado
--
-- CUALQUIERA:
-- pendiente → cancelado (en cualquier momento antes de listo)

-- =====================================================
-- TRIGGER PARA ACTUALIZAR TIMESTAMPS:
-- =====================================================
-- Se implementará en el código PHP para actualizar automáticamente
-- los timestamps cuando cambie el estado de la orden

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN:
-- =====================================================
CREATE INDEX idx_ordenes_fecha_pendiente ON ordenes(fecha_pendiente);
CREATE INDEX idx_ordenes_fecha_preparando ON ordenes(fecha_preparando);
CREATE INDEX idx_ordenes_fecha_listo ON ordenes(fecha_listo);
CREATE INDEX idx_ordenes_fecha_en_camino ON ordenes(fecha_en_camino);
CREATE INDEX idx_ordenes_fecha_entregado ON ordenes(fecha_entregado);
CREATE INDEX idx_ordenes_fecha_cancelado ON ordenes(fecha_cancelado);

-- =====================================================
-- VERIFICACIÓN:
-- =====================================================
-- Verificar que los campos se agregaron correctamente
DESCRIBE ordenes;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ Campos de timestamps agregados a la tabla ordenes
-- ✅ Índices creados para optimización de consultas
-- ✅ Órdenes existentes actualizadas con fecha_pendiente
-- ✅ Flujo de estados diferenciado por tipo de servicio
-- ✅ Seguimiento completo del proceso de órdenes

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
