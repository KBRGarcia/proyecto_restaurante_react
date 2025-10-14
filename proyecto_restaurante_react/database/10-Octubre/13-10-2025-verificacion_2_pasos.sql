-- ========================================
-- TABLA PARA REGISTROS PENDIENTES DE VERIFICACIÓN
-- ========================================
-- Esta tabla almacena los registros de usuarios que están esperando
-- verificación por correo electrónico antes de completar su registro

CREATE TABLE IF NOT EXISTS pending_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(16) NOT NULL,
    apellido VARCHAR(16) NOT NULL,
    codigo_area VARCHAR(4) NULL,
    numero_telefono VARCHAR(7) NULL,
    code VARCHAR(6) NOT NULL,
    code_expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_email (email),
    INDEX idx_code_expires (code_expires_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA PARA CÓDIGOS DE RECUPERACIÓN DE CONTRASEÑA
-- ========================================
-- Esta tabla almacena los códigos de recuperación de contraseña
-- usando el mismo sistema de verificación de 2 pasos

CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(64) NULL,
    token_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_reset_token (reset_token),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PROCEDIMIENTO PARA LIMPIAR CÓDIGOS EXPIRADOS
-- ========================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CleanExpiredCodes()
BEGIN
    -- Limpiar códigos expirados de pending_registrations
    DELETE FROM pending_registrations 
    WHERE code_expires_at < NOW();
    
    -- Limpiar códigos expirados de verification_codes
    DELETE FROM verification_codes 
    WHERE expires_at < NOW();
    
    -- Mostrar registros limpiados
    SELECT ROW_COUNT() as registros_limpiados;
END //
DELIMITER ;

-- ========================================
-- EVENTO AUTOMÁTICO PARA LIMPIEZA (OPCIONAL)
-- ========================================
-- Este evento se ejecuta cada hora para limpiar códigos expirados
-- Descomenta si quieres activar la limpieza automática

-- SET GLOBAL event_scheduler = ON;
-- 
-- CREATE EVENT IF NOT EXISTS cleanup_expired_codes
-- ON SCHEDULE EVERY 1 HOUR
-- DO
--   CALL CleanExpiredCodes();

-- ========================================
-- VERIFICACIÓN DE TABLAS CREADAS
-- ========================================
SELECT 
    'pending_registrations' as tabla,
    COUNT(*) as registros_existentes
FROM pending_registrations
UNION ALL
SELECT 
    'verification_codes' as tabla,
    COUNT(*) as registros_existentes
FROM verification_codes;

-- ========================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ========================================
/*
ESTRUCTURA DE pending_registrations:
- id: Identificador único
- email: Correo del usuario (único)
- password_hash: Contraseña hasheada
- nombre, apellido: Datos del usuario
- codigo_area, numero_telefono: Datos de contacto
- code: Código de verificación de 6 dígitos
- code_expires_at: Fecha de expiración del código
- attempts: Número de intentos de verificación
- created_at, updated_at: Timestamps

FLUJO DE VERIFICACIÓN:
1. Usuario completa formulario de registro
2. Sistema genera código y lo guarda en pending_registrations
3. Código se envía por correo electrónico
4. Usuario ingresa código en formulario de verificación
5. Sistema valida código y crea usuario en tabla usuarios
6. Registro pendiente se elimina

CONFIGURACIÓN RECOMENDADA:
- Código expira en 10 minutos (600 segundos)
- Máximo 5 intentos de verificación
- Cooldown de 60 segundos entre reenvíos
- Código de 6 dígitos
*/
