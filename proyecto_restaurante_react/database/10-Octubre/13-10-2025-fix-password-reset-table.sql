-- Script para corregir la estructura de la tabla password_reset_codes
-- Fecha: 13-10-2025
-- Descripción: Corrige la estructura de la tabla para que coincida con el código PHP

USE proyecto_restaurante_react;

-- Verificar si la tabla existe con la estructura incorrecta
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proyecto_restaurante_react' 
AND TABLE_NAME = 'password_reset_codes'
ORDER BY ORDINAL_POSITION;

-- Eliminar la tabla existente si tiene la estructura incorrecta
DROP TABLE IF EXISTS password_reset_codes;

-- Crear la tabla con la estructura correcta
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

-- Verificar que la tabla se creó correctamente
DESCRIBE password_reset_codes;

-- Mostrar mensaje de confirmación
SELECT 'Tabla password_reset_codes creada correctamente' AS status;
