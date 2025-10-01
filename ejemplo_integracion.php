<?php
// Ejemplo: Página PHP que integra React
include("includes/db.php");
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menú React - Sabor & Tradición</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include("includes/header.php"); ?>

  <!-- OPCIÓN A: En Desarrollo - Usar servidor de Vite -->
  <?php if ($_SERVER['SERVER_NAME'] === 'localhost'): ?>
    <script type="module" src="http://localhost:3000/@vite/client"></script>
    <script type="module" src="http://localhost:3000/src/main.jsx"></script>
  <?php else: ?>
    <!-- OPCIÓN B: En Producción - Usar archivos compilados -->
    <script type="module" src="/dist/assets/main.js"></script>
    <link rel="stylesheet" href="/dist/assets/main.css">
  <?php endif; ?>

  <!-- Contenedor donde React se montará -->
  <div id="react-root"></div>

  <!-- Scripts de Bootstrap -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

