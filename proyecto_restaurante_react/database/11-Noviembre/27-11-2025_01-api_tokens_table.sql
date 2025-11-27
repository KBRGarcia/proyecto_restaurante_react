-- ============================================
-- TABLA DE TOKENS DE API PARA PROYECTO REACT
-- ============================================
-- Fecha: 27 de Noviembre de 2025
-- Descripción: Tabla para gestionar tokens de autenticación API
--               Compatible con el sistema de tokens del proyecto React
-- ============================================

-- Crear tabla para tokens de API (diferente de sessions de Laravel)
CREATE TABLE IF NOT EXISTS `api_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  CONSTRAINT `api_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

