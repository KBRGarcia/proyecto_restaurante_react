-- ============================================
-- SCRIPT DE CORRECCIÓN PARA CONSTRAINTS FALLIDOS
-- Fecha: 11 de Octubre de 2025
-- Descripción: Limpiar constraints problemáticos y datos inconsistentes
-- ============================================

USE proyecto_restaurante_react;

-- ============================================
-- 1. ELIMINAR CONSTRAINTS EXISTENTES (SI EXISTEN)
-- ============================================

-- Eliminar constraints de validación si existen
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_nombre_formato;
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_apellido_formato;
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_codigo_area;
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_numero_telefono;

-- ============================================
-- 2. LIMPIAR DATOS PROBLEMÁTICOS
-- ============================================

-- Limpiar nombres existentes (remover caracteres especiales y ajustar longitud)
UPDATE usuarios 
SET nombre = TRIM(REGEXP_REPLACE(nombre, '[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]', ''))
WHERE nombre IS NOT NULL;

-- Ajustar longitudes de nombres
UPDATE usuarios 
SET nombre = SUBSTRING(TRIM(nombre), 1, 16) 
WHERE LENGTH(TRIM(nombre)) > 16;

-- Limpiar apellidos existentes (remover caracteres especiales y ajustar longitud)
UPDATE usuarios 
SET apellido = TRIM(REGEXP_REPLACE(apellido, '[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]', ''))
WHERE apellido IS NOT NULL;

-- Ajustar longitudes de apellidos
UPDATE usuarios 
SET apellido = SUBSTRING(TRIM(apellido), 1, 16) 
WHERE LENGTH(TRIM(apellido)) > 16;

-- Asegurar que nombres y apellidos tengan al menos 2 caracteres
UPDATE usuarios 
SET nombre = CASE 
    WHEN LENGTH(TRIM(nombre)) < 2 THEN 'Usuario'
    ELSE TRIM(nombre)
END
WHERE LENGTH(TRIM(nombre)) < 2;

UPDATE usuarios 
SET apellido = CASE 
    WHEN LENGTH(TRIM(apellido)) < 2 THEN 'Apellido'
    ELSE TRIM(apellido)
END
WHERE LENGTH(TRIM(apellido)) < 2;

-- Verificar que no hay valores NULL en campos obligatorios
UPDATE usuarios 
SET nombre = 'Usuario' WHERE nombre IS NULL OR TRIM(nombre) = '';
UPDATE usuarios 
SET apellido = 'Apellido' WHERE apellido IS NULL OR TRIM(apellido) = '';

-- Limpiar códigos de área inválidos
UPDATE usuarios 
SET codigo_area = '0414' 
WHERE codigo_area IS NOT NULL 
AND codigo_area NOT IN ('0414', '0424', '0412', '0416', '0426');

-- Limpiar números telefónicos inválidos
UPDATE usuarios 
SET numero_telefono = '1234567' 
WHERE numero_telefono IS NOT NULL 
AND (LENGTH(numero_telefono) != 7 OR numero_telefono NOT REGEXP '^[0-9]{7}$');

-- ============================================
-- 3. VERIFICAR DATOS ANTES DE AGREGAR CONSTRAINTS
-- ============================================

-- Mostrar datos problemáticos (si los hay)
SELECT 'Nombres problemáticos:' as tipo, COUNT(*) as cantidad
FROM usuarios 
WHERE nombre NOT REGEXP '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]{2,16}$'
UNION ALL
SELECT 'Apellidos problemáticos:', COUNT(*)
FROM usuarios 
WHERE apellido NOT REGEXP '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]{2,16}$'
UNION ALL
SELECT 'Códigos área problemáticos:', COUNT(*)
FROM usuarios 
WHERE codigo_area IS NOT NULL 
AND codigo_area NOT IN ('0414', '0424', '0412', '0416', '0426')
UNION ALL
SELECT 'Números teléfono problemáticos:', COUNT(*)
FROM usuarios 
WHERE numero_telefono IS NOT NULL 
AND (LENGTH(numero_telefono) != 7 OR numero_telefono NOT REGEXP '^[0-9]{7}$');

-- ============================================
-- 4. AGREGAR CONSTRAINTS DE VALIDACIÓN
-- ============================================

-- Constraint para validar formato de nombre (solo letras, acentos y ñ)
ALTER TABLE usuarios 
ADD CONSTRAINT chk_nombre_formato 
CHECK (nombre REGEXP '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]{2,16}$');

-- Constraint para validar formato de apellido (solo letras, acentos y ñ)
ALTER TABLE usuarios 
ADD CONSTRAINT chk_apellido_formato 
CHECK (apellido REGEXP '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]{2,16}$');

-- Constraint para validar código de área
ALTER TABLE usuarios 
ADD CONSTRAINT chk_codigo_area 
CHECK (codigo_area IN ('0414', '0424', '0412', '0416', '0426'));

-- Constraint para validar número telefónico (7 dígitos)
ALTER TABLE usuarios 
ADD CONSTRAINT chk_numero_telefono 
CHECK (numero_telefono REGEXP '^[0-9]{7}$');

-- ============================================
-- 5. VERIFICACIÓN FINAL
-- ============================================

-- Verificar que todos los cambios se aplicaron correctamente
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'proyecto_restaurante_react' 
AND TABLE_NAME = 'usuarios'
AND COLUMN_NAME IN ('nombre', 'apellido', 'codigo_area', 'numero_telefono', 'password')
ORDER BY ORDINAL_POSITION;

-- Mostrar algunos datos de ejemplo
SELECT 
    id,
    nombre,
    apellido,
    codigo_area,
    numero_telefono,
    CONCAT(codigo_area, '-', numero_telefono) as telefono_completo
FROM usuarios 
LIMIT 5;
