-- =====================================================
-- FLUJO DE ESTADOS COMPLETO CON TIMESTAMPS
-- Fecha: 10-10-2025
-- Descripción: Implementación completa del flujo de estados
--              diferenciado por tipo de servicio con timestamps
-- =====================================================

-- =====================================================
-- FLUJO DE ESTADOS IMPLEMENTADO:
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
-- CAMPOS DE TIMESTAMPS AGREGADOS:
-- =====================================================
-- fecha_pendiente     - Cuando se crea la orden (DEFAULT CURRENT_TIMESTAMP)
-- fecha_preparando    - Cuando se inicia la preparación
-- fecha_listo         - Cuando está listo para entrega/recoger
-- fecha_en_camino     - Cuando sale para entrega (solo domicilio)
-- fecha_entregado     - Cuando se completa la entrega
-- fecha_cancelado     - Cuando se cancela la orden

-- =====================================================
-- FUNCIONALIDADES IMPLEMENTADAS:
-- =====================================================

-- 1. ✅ DashboardPage.tsx
--    - Flujo diferenciado por tipo de servicio
--    - Modal con información completa de la orden
--    - Validación de transiciones de estado
--    - Visualización del flujo de estados
--    - Botón de acción para cambiar estados

-- 2. ✅ OrderCard.tsx
--    - Nuevo estado "en_camino" con ícono de motocicleta
--    - Colores diferenciados para cada estado
--    - Descripciones actualizadas

-- 3. ✅ OrderDetailsModal.tsx
--    - Timeline completo con timestamps reales
--    - Estados diferenciados por tipo de servicio
--    - Información detallada de cada paso
--    - Fechas y horas precisas

-- 4. ✅ MisOrdenesPage.tsx
--    - Muestra órdenes con nuevos estados
--    - Filtros actualizados
--    - Estadísticas correctas

-- 5. ✅ API ordenes.php
--    - Actualización automática de timestamps
--    - Consultas con campos de timestamps
--    - Validación de permisos

-- 6. ✅ API admin/dashboard.php
--    - Órdenes recientes con timestamps
--    - Información completa para administradores

-- 7. ✅ types.ts
--    - Nuevo tipo EstadoOrden con 'en_camino'
--    - Interfaz Orden con campos de timestamps
--    - Tipos actualizados

-- =====================================================
-- EXPERIENCIA DE USUARIO:
-- =====================================================

-- ADMINISTRADOR:
-- 1. Ve tabla de órdenes recientes en Dashboard
-- 2. Hace clic en botón de acción (ícono de edición)
-- 3. Se abre modal con información completa
-- 4. Ve flujo de estados según tipo de servicio
-- 5. Selecciona nuevo estado del dropdown
-- 6. Confirma el cambio
-- 7. La tabla se actualiza automáticamente
-- 8. Los timestamps se registran automáticamente

-- CLIENTE:
-- 1. Ve sus órdenes en "Mis Órdenes"
-- 2. Hace clic en "Ver Detalles"
-- 3. Ve timeline completo con fechas y horas
-- 4. Sigue el progreso en tiempo real
-- 5. Ve estados diferenciados por tipo de servicio

-- =====================================================
-- VALIDACIONES IMPLEMENTADAS:
-- =====================================================
-- ✅ Solo admin/empleado pueden cambiar estados
-- ✅ Estados finales (entregado/cancelado) no se pueden cambiar
-- ✅ Transiciones válidas según tipo de servicio
-- ✅ Timestamps se actualizan automáticamente
-- ✅ Validación de token de autenticación

-- =====================================================
-- ESTADOS CON COLORES:
-- =====================================================
-- Pendiente: Badge amarillo (warning)
-- Preparando: Badge azul (info)
-- Listo: Badge azul primario (primary)
-- En Camino: Badge gris (secondary) - Solo domicilio
-- Entregado: Badge verde (success)
-- Cancelado: Badge rojo (danger)

-- =====================================================
-- TIMELINE EN MIS ÓRDENES:
-- =====================================================
-- 1. Orden Recibida - fecha_orden
-- 2. En Preparación - fecha_preparando
-- 3. Listo para Entrega/Recoger - fecha_listo
-- 4. En Camino - fecha_en_camino (solo domicilio)
-- 5. Entregado - fecha_entregado
-- 6. Cancelado - fecha_cancelado (si aplica)

-- =====================================================
-- CASOS DE USO CUBIERTOS:
-- =====================================================
-- ✅ Orden para llevar: pendiente → preparando → listo → entregado
-- ✅ Orden a domicilio: pendiente → preparando → listo → en_camino → entregado
-- ✅ Cancelación en cualquier momento antes de "listo"
-- ✅ Seguimiento completo con timestamps
-- ✅ Diferenciación visual por tipo de servicio
-- ✅ Validaciones de seguridad

-- =====================================================
-- ARCHIVOS MODIFICADOS:
-- =====================================================
-- src/pages/DashboardPage.tsx - Gestión de estados
-- src/components/OrderCard.tsx - Nuevo estado en_camino
-- src/components/OrderDetailsModal.tsx - Timeline con timestamps
-- src/types.ts - Tipos actualizados
-- server/api/ordenes.php - Timestamps automáticos
-- server/api/admin/dashboard.php - Consultas actualizadas
-- database/ - Migración de timestamps

-- =====================================================
-- RESULTADO FINAL:
-- =====================================================
-- ✅ Flujo de estados completo y diferenciado
-- ✅ Timestamps automáticos para seguimiento
-- ✅ Interfaz intuitiva para administradores
-- ✅ Timeline detallado para clientes
-- ✅ Validaciones de seguridad implementadas
-- ✅ Experiencia de usuario mejorada
-- ✅ Control total sobre el proceso de órdenes

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
