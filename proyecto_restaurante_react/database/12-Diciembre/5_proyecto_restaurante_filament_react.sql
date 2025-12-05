-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2025 a las 19:06:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_restaurante_filament_react`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador de la sucursal',
  `name` varchar(100) NOT NULL COMMENT 'nombre de la sucursal',
  `address` varchar(255) NOT NULL COMMENT 'dirección de la sucursal',
  `city` varchar(100) NOT NULL COMMENT 'ciudad',
  `state` varchar(100) NOT NULL COMMENT 'estado/provincia',
  `postal_code` varchar(20) DEFAULT NULL COMMENT 'código postal',
  `phone` varchar(20) NOT NULL COMMENT 'teléfono de contacto',
  `email` varchar(100) DEFAULT NULL COMMENT 'correo electrónico',
  `opening_time` time NOT NULL DEFAULT '09:00:00' COMMENT 'hora de apertura',
  `closing_time` time NOT NULL DEFAULT '22:00:00' COMMENT 'hora de cierre',
  `operation_days` varchar(100) NOT NULL DEFAULT 'Monday to Sunday' COMMENT 'días de operación',
  `latitude` decimal(10,8) DEFAULT NULL COMMENT 'latitud GPS',
  `longitude` decimal(11,8) DEFAULT NULL COMMENT 'longitud GPS',
  `is_main` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'es sucursal principal',
  `has_delivery` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'tiene servicio de entrega',
  `has_parking` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'tiene estacionamiento',
  `capacity_people` int(11) DEFAULT NULL COMMENT 'capacidad de personas',
  `image` varchar(255) DEFAULT NULL COMMENT 'imagen de la sucursal',
  `description` text DEFAULT NULL COMMENT 'descripción de la sucursal',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'sucursal activa',
  `opening_date` date DEFAULT NULL COMMENT 'fecha de apertura',
  `manager` varchar(100) DEFAULT NULL COMMENT 'gerente de la sucursal',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de creación',
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'fecha de actualización',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `city`, `state`, `postal_code`, `phone`, `email`, `opening_time`, `closing_time`, `operation_days`, `latitude`, `longitude`, `is_main`, `has_delivery`, `has_parking`, `capacity_people`, `image`, `description`, `active`, `opening_date`, `manager`, `creation_date`, `update_date`, `created_at`, `updated_at`) VALUES
(1, 'Sabor & Tradición - Centro', 'Av. Principal, Edificio Centro Plaza, Local 5', 'Caracas', 'Distrito Capital', '1010', '0212-555-1234', 'centro@sabortradicion.com', '09:00:00', '23:00:00', 'Lunes a Domingo', 10.50634800, -66.91462300, 1, 1, 1, 120, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Nuestra sucursal principal ubicada en el corazón de Caracas. Cuenta con amplios espacios, estacionamiento y servicio de delivery. Perfecta para reuniones familiares y eventos especiales.', 1, '2020-01-15', 'María Rodríguez', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(2, 'Sabor & Tradición - Las Mercedes', 'Calle París con Av. Principal de Las Mercedes, C.C. Plaza Las Mercedes', 'Caracas', 'Distrito Capital', '1060', '0212-555-2345', 'lasmercedes@sabortradicion.com', '11:00:00', '23:30:00', 'Lunes a Domingo', 10.49504000, -66.85743000, 0, 1, 1, 80, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', 'Ubicada en la exclusiva zona de Las Mercedes, esta sucursal ofrece un ambiente elegante y sofisticado. Ideal para cenas románticas y encuentros de negocios.', 1, '2021-03-20', 'Carlos Méndez', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(3, 'Sabor & Tradición - Altamira', 'Av. San Juan Bosco con 2da Transversal de Altamira', 'Caracas', 'Distrito Capital', '1062', '0212-555-3456', 'altamira@sabortradicion.com', '10:00:00', '22:00:00', 'Lunes a Sábado', 10.49677000, -66.85371000, 0, 1, 0, 60, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Nuestra sucursal boutique en Altamira combina tradición con modernidad. Ambiente acogedor perfecto para almuerzos de trabajo y reuniones casuales.', 1, '2021-07-10', 'Ana Fernández', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(4, 'Sabor & Tradición - Valencia', 'Av. Bolívar Norte, Centro Comercial Metrópolis, Nivel 2', 'Valencia', 'Carabobo', '2001', '0241-555-4567', 'valencia@sabortradicion.com', '10:00:00', '22:00:00', 'Lunes a Domingo', 10.16277000, -68.00779000, 0, 1, 1, 100, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'Primera sucursal fuera de Caracas. Ubicada en el moderno Centro Comercial Metrópolis de Valencia, ofrece toda la tradición de nuestros sabores con amplias instalaciones.', 1, '2022-05-15', 'José Ramírez', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(5, 'Sabor & Tradición - Maracaibo', 'Av. 5 de Julio con Calle 72, Sector La Lago', 'Maracaibo', 'Zulia', '4001', '0261-555-5678', 'maracaibo@sabortradicion.com', '11:00:00', '23:00:00', 'Martes a Domingo', 10.66667000, -71.61667000, 0, 1, 1, 90, 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', 'Nuestra más reciente apertura en la ciudad del sol amado. Diseño moderno con toques tradicionales, ofreciendo las mejores vistas del Lago de Maracaibo.', 1, '2023-02-28', 'Luis Pérez', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador de la categoría',
  `name` varchar(100) NOT NULL COMMENT 'nombre de la categoría',
  `description` text DEFAULT NULL COMMENT 'descripción de la categoría',
  `image` varchar(255) DEFAULT NULL COMMENT 'ruta de la imagen de la categoría',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active' COMMENT 'estado de la categoría',
  `order_show` int(11) NOT NULL DEFAULT 0 COMMENT 'orden de visualización de la categoría',
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de última actualización del registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image`, `status`, `order_show`, `created_at`, `updated_at`) VALUES
(1, 'Entradas', 'Deliciosos aperitivos para comenzar', 'entradas.jpg', 'active', 1, '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(2, 'Platos Principales', 'Nuestros platos más sustanciosos', 'principales.jpg', 'active', 2, '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(3, 'Postres', 'Dulces tentaciones para terminar', 'postres.jpg', 'active', 3, '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(4, 'Bebidas', 'Refrescos, jugos y bebidas calientes', 'bebidas.jpg', 'active', 4, '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(5, 'Especialidades', 'Los platos únicos de la casa', 'especialidades.jpg', 'active', 5, '2025-12-05 22:05:26', '2025-12-05 22:05:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluations`
--

CREATE TABLE `evaluations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `evaluation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
(5, '2025_11_14_230943_create_categories_table', 1),
(6, '2025_11_14_230944_create_products_table', 1),
(7, '2025_11_20_162850_create_orders_table', 1),
(8, '2025_11_20_184716_create_evaluations_table', 1),
(9, '2025_11_20_194041_create_order_details_table', 1),
(10, '2025_11_20_194939_create_payment_methods_table', 1),
(11, '2025_11_21_193119_create_venezuela_banks_table', 1),
(12, '2025_11_22_022450_create_physical_payment_orders_table', 1),
(13, '2025_11_25_155608_create_branches_table', 1),
(14, '2025_11_25_163839_create_product_branches_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador de la orden',
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','preparing','ready','delivered','canceled') NOT NULL DEFAULT 'pending' COMMENT 'estado de la orden',
  `service_type` enum('delivery','pickup') NOT NULL COMMENT 'tipo de servicio',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'subtotal de la orden',
  `taxes` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'impuestos de la orden',
  `total` decimal(10,2) NOT NULL COMMENT 'total de la orden',
  `delivery_address` text DEFAULT NULL COMMENT 'dirección de entrega',
  `contact_phone` varchar(20) DEFAULT NULL COMMENT 'teléfono de contacto',
  `special_notes` text DEFAULT NULL COMMENT 'notas especiales',
  `payment_method` varchar(50) DEFAULT NULL COMMENT 'método de pago',
  `currency` enum('nacional','internacional') NOT NULL DEFAULT 'internacional' COMMENT 'moneda de la orden',
  `national_payment_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'datos de pago nacional' CHECK (json_valid(`national_payment_data`)),
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de la orden',
  `estimated_delivery_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de entrega estimada',
  `assigned_employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pending_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de creación de la orden',
  `preparing_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de inicio de la preparación',
  `ready_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de finalización de la preparación',
  `on_the_way_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de salida para entrega',
  `delivered_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de entrega',
  `canceled_date` timestamp NULL DEFAULT NULL COMMENT 'fecha de cancelación',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `service_type`, `subtotal`, `taxes`, `total`, `delivery_address`, `contact_phone`, `special_notes`, `payment_method`, `currency`, `national_payment_data`, `order_date`, `estimated_delivery_date`, `assigned_employee_id`, `pending_date`, `preparing_date`, `ready_date`, `on_the_way_date`, `delivered_date`, `canceled_date`, `created_at`, `updated_at`) VALUES
(1, 2, 'delivered', 'delivery', 45.50, 7.28, 52.78, 'Avenida 2 #456', '+1 555-0102', NULL, 'efectivo', 'internacional', NULL, '2024-09-05 16:30:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-05 17:15:00', NULL, '2024-09-05 16:30:00', '2024-09-05 17:15:00'),
(2, 3, 'delivered', 'pickup', 32.00, 5.12, 37.12, NULL, '+1 555-0103', NULL, 'tarjeta', 'internacional', NULL, '2024-09-08 18:15:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-08 19:00:00', NULL, '2024-09-08 18:15:00', '2024-09-08 19:00:00'),
(3, 4, 'delivered', 'delivery', 67.80, 10.85, 78.65, 'Calle 4 #321', '+1 555-0104', NULL, 'efectivo', 'internacional', NULL, '2024-09-12 22:45:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-12 23:45:00', NULL, '2024-09-12 22:45:00', '2024-09-12 23:45:00'),
(4, 5, 'delivered', 'pickup', 28.50, 4.56, 33.06, NULL, '+1 555-0105', NULL, 'tarjeta', 'internacional', NULL, '2024-09-15 15:20:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-15 15:50:00', NULL, '2024-09-15 15:20:00', '2024-09-15 15:50:00'),
(5, 6, 'delivered', 'delivery', 54.20, 8.67, 62.87, 'Boulevard 6 #987', '+1 555-0106', NULL, 'efectivo', 'internacional', NULL, '2024-09-18 23:30:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-19 00:30:00', NULL, '2024-09-18 23:30:00', '2024-09-19 00:30:00'),
(6, 2, 'delivered', 'delivery', 41.00, 6.56, 47.56, 'Avenida 2 #456', '+1 555-0102', NULL, 'tarjeta', 'internacional', NULL, '2024-10-02 17:00:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-02 18:00:00', NULL, '2024-10-02 17:00:00', '2024-10-02 18:00:00'),
(7, 4, 'delivered', 'pickup', 38.90, 6.22, 45.12, NULL, '+1 555-0104', NULL, 'efectivo', 'internacional', NULL, '2024-10-03 21:15:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-03 22:00:00', NULL, '2024-10-03 21:15:00', '2024-10-03 22:00:00'),
(8, 5, 'delivered', 'delivery', 72.50, 11.60, 84.10, 'Avenida 5 #654', '+1 555-0105', NULL, 'tarjeta', 'internacional', NULL, '2024-10-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-05 01:15:00', NULL, '2024-10-05 00:00:00', '2024-10-05 01:15:00'),
(9, 6, 'delivered', 'pickup', 29.80, 4.77, 34.57, NULL, '+1 555-0106', NULL, 'efectivo', 'internacional', NULL, '2024-10-05 16:45:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-05 17:15:00', NULL, '2024-10-05 16:45:00', '2024-10-05 17:15:00'),
(10, 7, 'delivered', 'delivery', 55.60, 8.90, 64.50, 'Calle 7 #159', '+1 555-0107', NULL, 'tarjeta', 'internacional', NULL, '2024-10-06 19:30:00', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-06 20:45:00', NULL, '2024-10-06 19:30:00', '2024-10-06 20:45:00'),
(11, 2, 'delivered', 'delivery', 48.90, 7.82, 56.72, 'Avenida 2 #456', '+1 555-0102', NULL, 'efectivo', 'internacional', NULL, '2025-12-05 14:00:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-05 15:15:00', NULL, '2025-12-05 14:00:00', '2025-12-05 15:15:00'),
(12, 8, 'ready', 'pickup', 35.00, 5.60, 40.60, NULL, '+1 555-0108', NULL, 'tarjeta', 'internacional', NULL, '2025-12-05 15:30:00', NULL, NULL, NULL, NULL, '2025-12-05 16:15:00', NULL, NULL, NULL, '2025-12-05 15:30:00', '2025-12-05 16:15:00'),
(13, 9, 'preparing', 'delivery', 62.30, 9.97, 72.27, 'Boulevard 9 #951', '+1 555-0109', NULL, 'efectivo', 'internacional', NULL, '2025-12-05 16:00:00', NULL, NULL, NULL, '2025-12-05 16:10:00', NULL, NULL, NULL, NULL, '2025-12-05 16:00:00', '2025-12-05 16:10:00'),
(14, 10, 'pending', 'pickup', 27.50, 4.40, 31.90, NULL, '+1 555-0110', NULL, 'tarjeta', 'internacional', NULL, '2025-12-05 17:00:00', NULL, NULL, '2025-12-05 17:00:00', NULL, NULL, NULL, NULL, NULL, '2025-12-05 17:00:00', '2025-12-05 17:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_details`
--

CREATE TABLE `order_details` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador del detalle de la orden',
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL COMMENT 'cantidad del producto',
  `unit_price` decimal(10,2) NOT NULL COMMENT 'precio unitario del producto',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'subtotal del detalle',
  `product_notes` text DEFAULT NULL COMMENT 'notas del producto',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `product_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 12.99, 25.98, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(2, 1, 5, 1, 22.99, 22.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(3, 2, 4, 1, 16.99, 16.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(4, 2, 10, 1, 2.99, 2.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(5, 3, 6, 2, 18.99, 37.98, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(6, 3, 8, 1, 8.99, 8.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(7, 4, 7, 1, 15.99, 15.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(8, 4, 11, 1, 4.99, 4.99, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(9, 5, 2, 3, 10.99, 32.97, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(10, 5, 12, 2, 3.99, 7.98, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL COMMENT 'email del usuario',
  `token` varchar(255) NOT NULL COMMENT 'token de restablecimiento de contraseña',
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `currency_type` enum('nacional','internacional') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`configuration`)),
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `code`, `name`, `currency_type`, `active`, `configuration`, `creation_date`, `update_date`, `created_at`, `updated_at`) VALUES
(1, 'tarjeta', 'Tarjeta de Crédito/Débito', 'internacional', 1, '{\"tipos\":[\"visa\",\"mastercard\"],\"requiere_cvv\":true}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(2, 'paypal', 'PayPal', 'internacional', 1, '{\"redireccion\":true,\"requiere_password\":true}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(3, 'zinli', 'Zinli', 'internacional', 1, '{\"requiere_pin\":true,\"longitud_pin\":4}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(4, 'zelle', 'Zelle', 'internacional', 1, '{\"requiere_nombre_completo\":true}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(5, 'pago_movil', 'Pago Móvil', 'nacional', 1, '{\"requiere_cedula\":true,\"requiere_referencia\":true,\"bancos_disponibles\":[\"provincial\",\"mercantil\",\"banesco\",\"bnc\",\"bdv\",\"venezolano\"]}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(6, 'transferencia', 'Transferencia Bancaria', 'nacional', 1, '{\"requiere_cedula\":true,\"requiere_referencia\":true,\"bancos_disponibles\":[\"provincial\",\"mercantil\",\"banesco\",\"bnc\",\"bdv\",\"venezolano\"]}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(7, 'fisico', 'Pago Físico', 'nacional', 1, '{\"solo_recoger\":true,\"limite_horas\":3,\"requiere_confirmacion_admin\":true}', '2025-12-05 18:05:27', '2025-12-05 18:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `physical_payment_orders`
--

CREATE TABLE `physical_payment_orders` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador de la orden de pago físico',
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `limit_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'fecha límite para el pago',
  `status` enum('pending','confirmed','canceled') NOT NULL DEFAULT 'pending' COMMENT 'estado de la orden de pago',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de creación',
  `update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'fecha de actualización',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador del producto',
  `name` varchar(100) NOT NULL COMMENT 'nombre del producto',
  `description` text DEFAULT NULL COMMENT 'descripción del producto',
  `price` decimal(10,2) NOT NULL COMMENT 'precio del producto',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL COMMENT 'ruta de la imagen del producto',
  `status` enum('active','inactive','out of stock') NOT NULL DEFAULT 'active' COMMENT 'estado del producto',
  `preparation_time` int(11) NOT NULL DEFAULT 15 COMMENT 'tiempo de preparación en minutos',
  `ingredients` text DEFAULT NULL COMMENT 'ingredientes del producto',
  `is_special` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'indica si el producto es especial',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de creación del producto',
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de última actualización del registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `image`, `status`, `preparation_time`, `ingredients`, `is_special`, `creation_date`, `created_at`, `updated_at`) VALUES
(1, 'Alitas Buffalo', 'Alitas de pollo con salsa picante buffalo', 12.99, 1, NULL, 'active', 15, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(2, 'Nachos Supremos', 'Nachos con queso, guacamole, crema y jalapeños', 10.99, 1, NULL, 'active', 10, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(3, 'Calamares Fritos', 'Anillos de calamar empanizados con salsa marinara', 14.99, 1, NULL, 'active', 12, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(4, 'Hamburguesa Clásica', 'Carne de res, lechuga, tomate, cebolla y papas fritas', 16.99, 2, NULL, 'active', 20, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(5, 'Filete de Salmón', 'Salmón a la plancha con vegetales y arroz', 22.99, 2, NULL, 'active', 25, NULL, 1, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(6, 'Pasta Alfredo', 'Fettuccine con salsa alfredo y pollo', 18.99, 2, NULL, 'active', 18, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(7, 'Pizza Margherita', 'Pizza tradicional con tomate, mozzarella y albahaca', 15.99, 2, NULL, 'active', 20, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(8, 'Cheesecake', 'Pastel de queso con frutos rojos', 8.99, 3, NULL, 'active', 5, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(9, 'Brownie con Helado', 'Brownie de chocolate caliente con helado de vainilla', 7.99, 3, NULL, 'active', 8, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(10, 'Tiramisú', 'Postre italiano con café y mascarpone', 9.99, 3, NULL, 'active', 5, NULL, 1, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(11, 'Coca Cola', 'Refresco de cola 355ml', 2.99, 4, NULL, 'active', 2, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(12, 'Jugo de Naranja Natural', 'Jugo fresco de naranja 300ml', 4.99, 4, NULL, 'active', 3, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(13, 'Café Americano', 'Café negro recién preparado', 3.99, 4, NULL, 'active', 5, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(14, 'Smoothie de Fresa', 'Batido de fresa con yogurt', 6.99, 4, NULL, 'active', 5, NULL, 0, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(15, 'Paella Marinera', 'Arroz con mariscos frescos (para 2 personas)', 35.99, 5, NULL, 'active', 45, NULL, 1, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26'),
(16, 'Ceviche Peruano', 'Pescado fresco marinado en limón', 19.99, 5, NULL, 'active', 15, NULL, 1, '2025-12-05 18:05:26', '2025-12-05 22:05:26', '2025-12-05 22:05:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_branches`
--

CREATE TABLE `product_branches` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador de la asignación producto-sucursal',
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'producto disponible en la sucursal',
  `special_price` decimal(10,2) DEFAULT NULL COMMENT 'precio especial para esta sucursal (opcional)',
  `assignment_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de asignación',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `product_branches`
--

INSERT INTO `product_branches` (`id`, `product_id`, `branch_id`, `available`, `special_price`, `assignment_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(2, 2, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(3, 3, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(4, 4, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(5, 5, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(6, 6, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(7, 7, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(8, 8, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(9, 9, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(10, 10, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(11, 11, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(12, 12, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(13, 13, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(14, 14, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(15, 15, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(16, 16, 1, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(17, 13, 2, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(18, 9, 2, 1, 8.47, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(19, 4, 2, 1, 19.71, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(20, 15, 2, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(21, 11, 2, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(22, 6, 2, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(23, 1, 2, 1, 14.68, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(24, 2, 2, 0, 11.98, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(25, 14, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(26, 13, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(27, 1, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(28, 8, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(29, 3, 3, 1, 17.69, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(30, 2, 3, 0, 13.08, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(31, 9, 3, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(32, 16, 3, 0, 17.19, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(33, 4, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(34, 12, 3, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(35, 11, 3, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(36, 10, 3, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(37, 6, 3, 0, 19.18, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(38, 5, 3, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(39, 14, 4, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(40, 10, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(41, 12, 4, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(42, 7, 4, 0, 19.03, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(43, 2, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(44, 3, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(45, 13, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(46, 9, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(47, 8, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(48, 15, 4, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(49, 4, 4, 1, 19.71, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(50, 16, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(51, 6, 4, 1, 17.09, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(52, 1, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(53, 5, 4, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(54, 11, 4, 0, 2.66, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(55, 13, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(56, 9, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(57, 15, 5, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(58, 11, 5, 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(59, 6, 5, 0, 17.47, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(60, 1, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(61, 10, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(62, 8, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(63, 3, 5, 0, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(64, 7, 5, 1, 18.23, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL COMMENT 'identificador de la sesión',
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'dirección IP de la sesión',
  `user_agent` text DEFAULT NULL COMMENT 'agente de usuario de la sesión',
  `payload` longtext NOT NULL COMMENT 'payload de la sesión',
  `last_activity` int(11) NOT NULL COMMENT 'fecha de última actividad de la sesión'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador del usuario',
  `name` varchar(100) NOT NULL COMMENT 'nombre del usuario',
  `last_name` varchar(100) NOT NULL COMMENT 'apellido del usuario',
  `email` varchar(100) NOT NULL COMMENT 'email del usuario',
  `email_verified_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de verificación del email',
  `password` varchar(255) NOT NULL COMMENT 'contraseña del usuario',
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL COMMENT 'número de teléfono del usuario',
  `address` text DEFAULT NULL COMMENT 'dirección del usuario',
  `profile_picture` longtext DEFAULT NULL COMMENT 'imagen de perfil del usuario en formato base64',
  `role` enum('admin','employee','client') NOT NULL DEFAULT 'client' COMMENT 'rol del usuario',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active' COMMENT 'estado del usuario',
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de registro del usuario',
  `last_connection` timestamp NULL DEFAULT NULL COMMENT 'fecha de última conexión del usuario',
  `remember_token` varchar(100) DEFAULT NULL COMMENT 'token de recuerdo del usuario',
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'fecha de última actualización del registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `last_name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `phone_number`, `address`, `profile_picture`, `role`, `status`, `registration_date`, `last_connection`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Principal', 'admin@restaurante.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 'active', '2025-11-04 19:17:00', NULL, NULL, '2025-11-04 19:17:00', '2025-11-04 19:17:00'),
(2, 'Juan', 'Pérez', 'juan@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0101', 'Calle 1 #123', NULL, 'client', 'active', '2024-01-15 18:30:00', NULL, NULL, '2024-01-15 18:30:00', '2024-01-15 18:30:00'),
(3, 'María', 'González', 'maria@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0102', 'Avenida 2 #456', NULL, 'client', 'active', '2024-02-20 22:15:00', NULL, NULL, '2024-02-20 22:15:00', '2024-02-20 22:15:00'),
(4, 'Carlos', 'Rodríguez', 'carlos@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0103', 'Boulevard 3 #789', NULL, 'client', 'inactive', '2024-03-10 17:45:00', NULL, NULL, '2024-03-10 17:45:00', '2024-03-10 17:45:00'),
(5, 'Ana', 'Martínez', 'ana@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0104', 'Calle 4 #321', NULL, 'client', 'active', '2024-04-06 00:20:00', NULL, NULL, '2024-04-06 00:20:00', '2024-04-06 00:20:00'),
(6, 'Luis', 'López', 'luis@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0105', 'Avenida 5 #654', NULL, 'client', 'active', '2024-05-12 19:00:00', NULL, NULL, '2024-05-12 19:00:00', '2024-05-12 19:00:00'),
(7, 'Sofia', 'Hernández', 'sofia@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0106', 'Boulevard 6 #987', NULL, 'client', 'active', '2024-06-18 21:30:00', NULL, NULL, '2024-06-18 21:30:00', '2024-06-18 21:30:00'),
(8, 'Diego', 'García', 'diego@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0107', 'Calle 7 #159', NULL, 'client', 'active', '2024-07-22 23:45:00', NULL, NULL, '2024-07-22 23:45:00', '2024-07-22 23:45:00'),
(9, 'Elena', 'Díaz', 'elena@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0108', 'Avenida 8 #753', NULL, 'client', 'active', '2024-08-30 18:15:00', NULL, NULL, '2024-08-30 18:15:00', '2024-08-30 18:15:00'),
(10, 'Miguel', 'Ramírez', 'miguel@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0109', 'Boulevard 9 #951', NULL, 'client', 'active', '2024-09-14 20:00:00', NULL, NULL, '2024-09-14 20:00:00', '2024-09-14 20:00:00'),
(11, 'Laura', 'Torres', 'laura@example.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+1 555-0110', 'Calle 10 #852', NULL, 'client', 'active', '2024-10-01 22:30:00', NULL, NULL, '2024-10-01 22:30:00', '2024-10-01 22:30:00'),
(12, 'Ikabaru Alejandro', 'Garcia Torres', 'ikabarugarcia12@gmail.com', NULL, '$2y$12$jZkMhhHtNl6wE0JPB92RC.Xgp1ZMyCFgZP6Hnys/9/2Ua5c5yLmzC', NULL, NULL, NULL, '+58 414 2591853', NULL, NULL, 'client', 'active', '2025-11-11 19:30:17', NULL, NULL, '2025-11-11 23:30:17', '2025-11-11 23:30:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venezuela_banks`
--

CREATE TABLE `venezuela_banks` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'identificador del banco',
  `code` varchar(10) NOT NULL COMMENT 'código del banco',
  `name` varchar(100) NOT NULL COMMENT 'nombre del banco',
  `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'estado del banco',
  `system_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'datos del sistema en formato JSON' CHECK (json_valid(`system_data`)),
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'fecha de creación',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `venezuela_banks`
--

INSERT INTO `venezuela_banks` (`id`, `code`, `name`, `active`, `system_data`, `creation_date`, `created_at`, `updated_at`) VALUES
(1, '0108', 'BBVA Banco Provincial', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(2, '0105', 'Banco Mercantil', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(3, '0134', 'Banesco', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(4, '0191', 'Banco Nacional de Crédito', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(5, '0102', 'Banco de Venezuela', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27'),
(6, '0104', 'Venezolano de Crédito', 1, NULL, '2025-12-05 22:05:27', '2025-12-05 22:05:27', '2025-12-05 22:05:27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_active` (`active`),
  ADD KEY `idx_is_main` (`is_main`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluations_user_id_foreign` (`user_id`),
  ADD KEY `evaluations_order_id_foreign` (`order_id`),
  ADD KEY `evaluations_product_id_foreign` (`product_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_assigned_employee_id_foreign` (`assigned_employee_id`);

--
-- Indices de la tabla `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_details_order_id_foreign` (`order_id`),
  ADD KEY `order_details_product_id_foreign` (`product_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_methods_code_unique` (`code`);

--
-- Indices de la tabla `physical_payment_orders`
--
ALTER TABLE `physical_payment_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `physical_payment_orders_order_id_foreign` (`order_id`),
  ADD KEY `idx_limit_date` (`limit_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indices de la tabla `product_branches`
--
ALTER TABLE `product_branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_branch` (`product_id`,`branch_id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_branch_id` (`branch_id`),
  ADD KEY `idx_available` (`available`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `venezuela_banks`
--
ALTER TABLE `venezuela_banks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venezuela_banks_code_unique` (`code`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador de la sucursal', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador de la categoría', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador de la orden', AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador del detalle de la orden', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `physical_payment_orders`
--
ALTER TABLE `physical_payment_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador de la orden de pago físico';

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador del producto', AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `product_branches`
--
ALTER TABLE `product_branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador de la asignación producto-sucursal', AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador del usuario', AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `venezuela_banks`
--
ALTER TABLE `venezuela_banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identificador del banco', AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_assigned_employee_id_foreign` FOREIGN KEY (`assigned_employee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `physical_payment_orders`
--
ALTER TABLE `physical_payment_orders`
  ADD CONSTRAINT `physical_payment_orders_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `product_branches`
--
ALTER TABLE `product_branches`
  ADD CONSTRAINT `product_branches_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_branches_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
