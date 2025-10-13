# 📧 Configuración de Envío de Correos en XAMPP

## 🎯 Objetivo
Configurar el envío de correos desde XAMPP hacia Gmail, Hotmail y otros proveedores para el sistema de recuperación de contraseña.

## 🔧 Configuración en XAMPP

### 1. Configurar PHP.ini

Edita el archivo `php.ini` en tu instalación de XAMPP:

**Ubicación típica:**
- Windows: `C:\xampp\php\php.ini`
- Mac: `/Applications/XAMPP/xamppfiles/etc/php.ini`
- Linux: `/opt/lampp/etc/php.ini`

**Configuraciones a modificar:**

```ini
[mail function]
; Para Windows
SMTP = smtp.gmail.com
smtp_port = 587
sendmail_from = tu-email@gmail.com
sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"

; Para Linux/Mac
; sendmail_path = /usr/sbin/sendmail -t -i
```

### 2. Configurar Sendmail (Windows)

Si usas Windows, descarga y configura Sendmail:

1. **Descargar Sendmail:**
   - Ve a: https://www.glob.com.au/sendmail/
   - Descarga la versión para Windows

2. **Instalar Sendmail:**
   - Extrae en `C:\xampp\sendmail\`
   - Edita `C:\xampp\sendmail\sendmail.ini`

3. **Configurar sendmail.ini:**

```ini
[sendmail]
smtp_server=smtp.gmail.com
smtp_port=587
error_logfile=error.log
debug_logfile=debug.log
auth_username=tu-email@gmail.com
auth_password=tu-contraseña-de-aplicacion
force_sender=tu-email@gmail.com
```

### 3. Configuración para Gmail

**Para usar Gmail como servidor SMTP:**

1. **Habilitar contraseña de aplicación:**
   - Ve a tu cuenta de Google
   - Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
   - Genera una contraseña para "Mail"

2. **Configurar en sendmail.ini:**
```ini
smtp_server=smtp.gmail.com
smtp_port=587
auth_username=tu-email@gmail.com
auth_password=tu-contraseña-de-aplicacion-16-digitos
```

### 4. Configuración para Hotmail/Outlook

**Para usar Hotmail como servidor SMTP:**

```ini
smtp_server=smtp-mail.outlook.com
smtp_port=587
auth_username=tu-email@hotmail.com
auth_password=tu-contraseña
```

## 🧪 Probar la Configuración

### 1. Usar el Script de Prueba

Accede a: `http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/test-mail.php`

### 2. Verificar Logs

Revisa los logs de PHP en:
- Windows: `C:\xampp\apache\logs\error.log`
- Mac/Linux: `/Applications/XAMPP/xamppfiles/logs/php_error_log`

### 3. Comandos de Prueba

Puedes probar desde la línea de comandos:

```bash
# En Windows
C:\xampp\php\php.exe -r "mail('tu-email@gmail.com', 'Prueba', 'Mensaje de prueba');"

# En Mac/Linux
/Applications/XAMPP/xamppfiles/bin/php -r "mail('tu-email@gmail.com', 'Prueba', 'Mensaje de prueba');"
```

## 🔍 Solución de Problemas

### Problema: Correos no llegan

**Soluciones:**
1. Verificar que el correo no esté en spam
2. Revisar logs de error de PHP
3. Verificar configuración de firewall
4. Probar con diferentes proveedores (Gmail, Hotmail, Yahoo)

### Problema: Error de autenticación

**Soluciones:**
1. Usar contraseña de aplicación en Gmail
2. Verificar credenciales en sendmail.ini
3. Habilitar "Acceso de aplicaciones menos seguras" (no recomendado)

### Problema: Timeout de conexión

**Soluciones:**
1. Verificar conexión a internet
2. Probar con puerto 465 (SSL) en lugar de 587 (TLS)
3. Verificar configuración de proxy/firewall

## 📋 Configuración Alternativa: PHPMailer

Si la configuración nativa no funciona, puedes usar PHPMailer:

### 1. Instalar PHPMailer

```bash
composer require phpmailer/phpmailer
```

### 2. Configurar PHPMailer

```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'tu-email@gmail.com';
$mail->Password = 'tu-contraseña-de-aplicacion';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
?>
```

## ✅ Verificación Final

Una vez configurado correctamente:

1. ✅ El script de prueba envía correos exitosamente
2. ✅ Los correos llegan a la bandeja de entrada (no spam)
3. ✅ El sistema de recuperación de contraseña funciona
4. ✅ Los logs no muestran errores de envío

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de error de PHP
2. Verifica la configuración de sendmail.ini
3. Prueba con diferentes proveedores de correo
4. Consulta la documentación oficial de XAMPP

---

**Nota:** Esta configuración es para desarrollo. En producción, considera usar servicios como SendGrid, Mailgun o Amazon SES.
