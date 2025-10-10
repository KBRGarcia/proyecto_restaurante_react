-- =====================================================
-- GESTIÓN DE ESTADOS DE ÓRDENES DESDE DASHBOARD
-- Fecha: 10-10-2025
-- Descripción: Implementación de funcionalidad para cambiar
--              estados de órdenes desde el panel administrativo
-- =====================================================

-- =====================================================
-- FUNCIONALIDAD IMPLEMENTADA:
-- =====================================================
-- 1. ✅ Botón de "Acción" en tabla de Órdenes Recientes
-- 2. ✅ Modal para cambiar estado de orden
-- 3. ✅ Validación de estados disponibles
-- 4. ✅ Integración con API PUT /api/ordenes.php?id={id}
-- 5. ✅ Actualización en tiempo real de la tabla

-- =====================================================
-- ESTADOS DE ÓRDENES DISPONIBLES:
-- =====================================================
-- pendiente   → preparando, cancelado
-- preparando  → listo, cancelado  
-- listo       → entregado
-- entregado   → (final, no se puede cambiar)
-- cancelado   → (final, no se puede cambiar)

-- =====================================================
-- FLUJO DE ESTADOS:
-- =====================================================
-- 1. Cliente hace pedido → pendiente
-- 2. Admin/Empleado inicia preparación → preparando
-- 3. Admin/Empleado termina preparación → listo
-- 4. Admin/Empleado entrega → entregado
-- 
-- En cualquier momento antes de "listo" se puede cancelar

-- =====================================================
-- PERMISOS REQUERIDOS:
-- =====================================================
-- Solo usuarios con rol 'admin' o 'empleado' pueden:
-- - Ver el botón de acción en la tabla
-- - Cambiar estados de órdenes
-- - Acceder al modal de gestión

-- =====================================================
-- API UTILIZADA:
-- =====================================================
-- PUT /api/ordenes.php?id={orden_id}
-- Headers: Authorization: Bearer {token}
-- Body: { "estado": "nuevo_estado" }

-- =====================================================
-- VALIDACIONES IMPLEMENTADAS:
-- =====================================================
-- 1. ✅ Solo admin/empleado pueden cambiar estados
-- 2. ✅ Estados finales (entregado/cancelado) no se pueden cambiar
-- 3. ✅ Solo se permiten transiciones válidas de estado
-- 4. ✅ Validación de token de autenticación
-- 5. ✅ Manejo de errores de conexión

-- =====================================================
-- INTERFAZ DE USUARIO:
-- =====================================================
-- 1. Botón con ícono de edición (fas fa-edit)
-- 2. Modal con información completa de la orden
-- 3. Select con estados disponibles
-- 4. Confirmación visual del cambio
-- 5. Feedback de éxito/error

-- =====================================================
-- ARCHIVOS MODIFICADOS:
-- =====================================================
-- src/pages/DashboardPage.tsx
-- - Agregados estados para gestión de órdenes
-- - Implementadas funciones de cambio de estado
-- - Agregado modal de cambio de estado
-- - Actualizado botón de acciones en tabla

-- =====================================================
-- FUNCIONES AGREGADAS:
-- =====================================================
-- abrirModalOrden(orden) - Abre modal para cambiar estado
-- cerrarModalOrden() - Cierra modal
-- actualizarEstadoOrden() - Actualiza estado via API
-- obtenerEstadosDisponibles(estado) - Valida transiciones

-- =====================================================
-- ESTADOS DE REACT AGREGADOS:
-- =====================================================
-- ordenSeleccionada - Orden actualmente seleccionada
-- mostrarModalOrden - Control de visibilidad del modal
-- nuevoEstado - Estado seleccionado para cambiar
-- actualizandoOrden - Estado de carga durante actualización

-- =====================================================
-- EXPERIENCIA DE USUARIO:
-- =====================================================
-- 1. Admin ve tabla de órdenes recientes
-- 2. Hace clic en botón de acción (ícono de edición)
-- 3. Se abre modal con información de la orden
-- 4. Selecciona nuevo estado del dropdown
-- 5. Confirma el cambio
-- 6. La tabla se actualiza automáticamente
-- 7. Recibe confirmación de éxito

-- =====================================================
-- CASOS DE USO:
-- =====================================================
-- ✅ Cambiar orden de "pendiente" a "preparando"
-- ✅ Cambiar orden de "preparando" a "listo"  
-- ✅ Cambiar orden de "listo" a "entregado"
-- ✅ Cancelar orden en cualquier estado antes de "listo"
-- ❌ No se puede cambiar orden "entregado" o "cancelado"

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ Administradores pueden gestionar estados de órdenes
-- ✅ Flujo de trabajo del restaurante implementado
-- ✅ Control total sobre el proceso de órdenes
-- ✅ Interfaz intuitiva y fácil de usar
-- ✅ Validaciones de seguridad implementadas

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================
