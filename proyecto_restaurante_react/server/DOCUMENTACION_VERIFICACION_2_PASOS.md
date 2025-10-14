# 📧 Sistema de Verificación de 2 Pasos - Guía Completa

## 🎯 **Descripción del Sistema**

El sistema de verificación de 2 pasos implementa un flujo robusto para el registro de usuarios:

1. **Paso 1**: Usuario completa formulario de registro
2. **Paso 2**: Sistema envía código de verificación por correo
3. **Paso 3**: Usuario ingresa código para completar registro
4. **Paso 4**: Cuenta se activa automáticamente

## 🗄️ **Base de Datos**

### **Tabla: `pending_registrations`**
```sql
CREATE TABLE pending_registrations (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Ejecutar Script SQL**
```bash
# Ejecutar en MySQL/MariaDB
mysql -u root -p proyecto_restaurante_react < database/10-Octubre/11-10-2025-verificacion_2_pasos.sql
```

## 📧 **Configuración de Correo**

### **Opción 1: PHPMailer (Recomendado)**

#### **Instalación Automática**
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/install-phpmailer.php
```

#### **Instalación Manual con Composer**
```bash
cd server
composer require phpmailer/phpmailer
```

#### **Configuración SMTP**
Editar `server/config/verification-mail.php`:

```php
'smtp' => [
    'host' => 'smtp.gmail.com',           // Servidor SMTP
    'username' => 'tu-email@gmail.com',   // Tu email
    'password' => 'tu-contraseña-app',     // Contraseña de aplicación
    'port' => 587,
    'secure' => 'tls',                    // 'tls' o 'ssl'
    'from_email' => 'noreply@sabortradicion.com',
    'from_name' => 'Sabor & Tradición',
],
```

### **Opción 2: Función mail() Nativa**
El sistema incluye fallback automático a `mail()` si PHPMailer no está disponible.

## 🔧 **Configuración por Proveedor**

### **Gmail**
```php
'smtp' => [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'secure' => 'tls',
    'username' => 'tu-email@gmail.com',
    'password' => 'contraseña-de-aplicacion', // NO tu contraseña normal
],
```

**Pasos para Gmail:**
1. Habilitar verificación en 2 pasos
2. Generar contraseña de aplicación
3. Usar la contraseña de aplicación (16 caracteres)

### **Hotmail/Outlook**
```php
'smtp' => [
    'host' => 'smtp-mail.outlook.com',
    'port' => 587,
    'secure' => 'tls',
    'username' => 'tu-email@hotmail.com',
    'password' => 'tu-contraseña',
],
```

### **Yahoo**
```php
'smtp' => [
    'host' => 'smtp.mail.yahoo.com',
    'port' => 587,
    'secure' => 'tls',
    'username' => 'tu-email@yahoo.com',
    'password' => 'contraseña-de-aplicacion',
],
```

## 🚀 **APIs del Sistema**

### **1. Enviar Código de Verificación**
```
POST /api/auth/send-verification-code.php
```

**Body:**
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "codigo_area": "0414",
    "numero_telefono": "1234567"
}
```

**Respuesta:**
```json
{
    "success": true,
    "message": "Código de verificación enviado a tu correo electrónico",
    "expires_in": 600,
    "cooldown": 60
}
```

### **2. Verificar Código**
```
POST /api/auth/verify-code.php
```

**Body:**
```json
{
    "email": "usuario@ejemplo.com",
    "code": "123456"
}
```

**Respuesta:**
```json
{
    "success": true,
    "message": "Registro completado exitosamente",
    "token": "abc123...",
    "usuario": {
        "id": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "usuario@ejemplo.com",
        "rol": "cliente",
        "estado": "activo"
    }
}
```

### **3. Reenviar Código**
```
POST /api/auth/resend-verification-code.php
```

**Body:**
```json
{
    "email": "usuario@ejemplo.com"
}
```

## 🎨 **Frontend**

### **Componentes Principales**

#### **Register.tsx**
- Formulario de registro inicial
- Validaciones en tiempo real
- Transición a verificación

#### **VerificationCode.tsx**
- Input para código de 6 dígitos
- Timer de expiración
- Botón de reenvío
- Contador de intentos

### **Flujo de Usuario**

1. **Registro**: Usuario completa formulario
2. **Envío**: Sistema envía código por correo
3. **Verificación**: Usuario ingresa código
4. **Éxito**: Cuenta activada automáticamente

## ⚙️ **Configuración Avanzada**

### **Parámetros de Verificación**
```php
'verification' => [
    'code_length' => 6,                    // Longitud del código
    'code_ttl_seconds' => 600,             // Tiempo de vida (10 min)
    'max_attempts' => 5,                   // Intentos máximos
    'resend_cooldown_seconds' => 60,      // Cooldown entre reenvíos
],
```

### **CORS**
```php
'cors' => [
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost',
    ],
],
```

## 🧪 **Pruebas**

### **Script de Prueba Directa**
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/test-recuperacion-directo.php
```

### **Prueba de Correo**
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/test-mail.php
```

### **Diagnóstico de Conexión**
```
http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/diagnostico-conexion.html
```

## 🔍 **Solución de Problemas**

### **Error: "No se pudo enviar el correo"**
1. Verificar configuración SMTP
2. Comprobar credenciales
3. Revisar logs de PHP
4. Probar con diferentes proveedores

### **Error: "Código expirado"**
1. Verificar configuración de tiempo
2. Comprobar zona horaria del servidor
3. Revisar tabla `pending_registrations`

### **Error: "Demasiados intentos"**
1. Limpiar registros pendientes
2. Verificar configuración de intentos
3. Revisar logs de verificación

### **Códigos no llegan al correo**
1. Revisar carpeta de spam
2. Verificar configuración SMTP
3. Probar con correo diferente
4. Comprobar logs del servidor

## 📊 **Monitoreo**

### **Logs Importantes**
- `C:\xampp\apache\logs\error.log` (Windows)
- `/var/log/apache2/error.log` (Linux)
- `C:\xampp\sendmail\error.log` (Sendmail)

### **Consultas Útiles**
```sql
-- Ver registros pendientes
SELECT * FROM pending_registrations ORDER BY created_at DESC;

-- Limpiar códigos expirados
DELETE FROM pending_registrations WHERE code_expires_at < NOW();

-- Verificar usuarios recientes
SELECT * FROM usuarios WHERE fecha_registro > DATE_SUB(NOW(), INTERVAL 1 DAY);
```

## 🔒 **Seguridad**

### **Características de Seguridad**
- ✅ Códigos de 6 dígitos aleatorios
- ✅ Expiración automática (10 minutos)
- ✅ Límite de intentos (5 máximo)
- ✅ Cooldown entre reenvíos (60 segundos)
- ✅ Comparación segura de códigos
- ✅ Limpieza automática de datos expirados

### **Recomendaciones**
1. Usar HTTPS en producción
2. Configurar firewall para SMTP
3. Monitorear intentos de verificación
4. Rotar credenciales SMTP regularmente
5. Implementar rate limiting adicional

## 📈 **Métricas y Estadísticas**

### **KPIs Importantes**
- Tasa de verificación exitosa
- Tiempo promedio de verificación
- Intentos promedio por usuario
- Tasa de reenvío de códigos

### **Consultas de Métricas**
```sql
-- Tasa de verificación por día
SELECT 
    DATE(created_at) as fecha,
    COUNT(*) as total_registros,
    SUM(CASE WHEN attempts = 0 THEN 1 ELSE 0 END) as verificaciones_exitosas,
    ROUND(SUM(CASE WHEN attempts = 0 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as tasa_exito
FROM pending_registrations 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

---

## 🎉 **¡Sistema Listo!**

Con esta implementación tienes un sistema robusto de verificación de 2 pasos que:

- ✅ Funciona con Gmail, Hotmail, Yahoo y otros proveedores
- ✅ Incluye manejo de errores completo
- ✅ Tiene interfaz de usuario intuitiva
- ✅ Es seguro y escalable
- ✅ Incluye herramientas de diagnóstico

**¡El sistema está listo para usar!** 🚀
