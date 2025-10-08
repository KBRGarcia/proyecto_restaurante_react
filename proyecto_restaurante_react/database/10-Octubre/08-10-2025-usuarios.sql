-- Modificación de la tabla usuarios
-- Fecha: 08-10-2025
-- Descripción: Agregar campo foto_perfil para almacenar imágenes de perfil en base64

USE proyecto_restaurante_react;

-- Agregar columna foto_perfil a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN foto_perfil LONGTEXT NULL 
COMMENT 'Imagen de perfil del usuario en formato base64' 
AFTER direccion;

