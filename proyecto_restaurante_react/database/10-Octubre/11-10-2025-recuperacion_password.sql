-- ============================================
-- SISTEMA DE RECUPERACIÓN DE CONTRASEÑA
-- Fecha: 11 de Octubre de 2025
-- Descripción: Implementar sistema de recuperación de contraseña por correo
-- ============================================

USE proyecto_restaurante_react;

-- ============================================
-- 1. CREAR TABLA PARA CÓDIGOS DE RECUPERACIÓN
-- ============================================

CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_codigo (codigo),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. AGREGAR COMENTARIOS DESCRIPTIVOS
-- ============================================

ALTER TABLE password_reset_codes COMMENT = 'Códigos de recuperación de contraseña con expiración de 60 segundos';

-- ============================================
-- 3. CREAR PROCEDIMIENTO PARA LIMPIAR CÓDIGOS EXPIRADOS
-- ============================================

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS LimpiarCodigosExpirados()
BEGIN
    -- Eliminar códigos expirados o usados
    DELETE FROM password_reset_codes 
    WHERE expires_at < NOW() OR used = TRUE;
END //

DELIMITER ;

-- ============================================
-- 4. CREAR EVENTO PARA LIMPIEZA AUTOMÁTICA
-- ============================================

-- Crear evento que se ejecute cada minuto para limpiar códigos expirados
CREATE EVENT IF NOT EXISTS limpiar_codigos_expirados
ON SCHEDULE EVERY 1 MINUTE
DO
  CALL LimpiarCodigosExpirados();

-- ============================================
-- 5. VERIFICAR ESTRUCTURA CREADA
-- ============================================

-- Mostrar estructura de la tabla
DESCRIBE password_reset_codes;

-- Mostrar eventos creados
SHOW EVENTS LIKE 'limpiar_codigos_expirados';

-- ============================================
-- 6. COMENTARIOS FINALES
-- ============================================

-- La tabla password_reset_codes almacena:
-- - correo: Email del usuario que solicita recuperación
-- - codigo: Código de 6 dígitos generado aleatoriamente
-- - expires_at: Timestamp de expiración (60 segundos después de creación)
-- - used: Indica si el código ya fue utilizado
-- - created_at: Timestamp de creación del código

-- El evento automático limpia códigos expirados cada minuto
-- Los índices optimizan las consultas por correo, código y expiración
