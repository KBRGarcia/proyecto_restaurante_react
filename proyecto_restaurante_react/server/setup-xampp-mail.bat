@echo off
echo ========================================
echo    CONFIGURACION DE CORREO PARA XAMPP
echo ========================================
echo.

echo [1/4] Verificando instalacion de XAMPP...
if not exist "C:\xampp\php\php.ini" (
    echo ERROR: XAMPP no encontrado en C:\xampp\
    echo Por favor, instala XAMPP o ajusta la ruta en este script
    pause
    exit /b 1
)

echo [2/4] Configurando PHP.ini...
set PHP_INI=C:\xampp\php\php.ini

REM Hacer backup del php.ini original
if not exist "%PHP_INI%.backup" (
    copy "%PHP_INI%" "%PHP_INI%.backup" >nul
    echo Backup creado: %PHP_INI%.backup
)

REM Configurar SMTP en php.ini
powershell -Command "(Get-Content '%PHP_INI%') -replace ';SMTP = localhost', 'SMTP = smtp.gmail.com' | Set-Content '%PHP_INI%'"
powershell -Command "(Get-Content '%PHP_INI%') -replace ';smtp_port = 25', 'smtp_port = 587' | Set-Content '%PHP_INI%'"
powershell -Command "(Get-Content '%PHP_INI%') -replace ';sendmail_from = me@example.com', 'sendmail_from = noreply@sabortradicion.com' | Set-Content '%PHP_INI%'"

echo [3/4] Descargando Sendmail para Windows...
if not exist "C:\xampp\sendmail" (
    mkdir "C:\xampp\sendmail"
)

REM Crear sendmail.ini
echo [sendmail] > "C:\xampp\sendmail\sendmail.ini"
echo smtp_server=smtp.gmail.com >> "C:\xampp\sendmail\sendmail.ini"
echo smtp_port=587 >> "C:\xampp\sendmail\sendmail.ini"
echo error_logfile=error.log >> "C:\xampp\sendmail\sendmail.ini"
echo debug_logfile=debug.log >> "C:\xampp\sendmail\sendmail.ini"
echo auth_username= >> "C:\xampp\sendmail\sendmail.ini"
echo auth_password= >> "C:\xampp\sendmail\sendmail.ini"
echo force_sender=noreply@sabortradicion.com >> "C:\xampp\sendmail\sendmail.ini"

echo [4/4] Configuracion completada!
echo.
echo ========================================
echo    INSTRUCCIONES IMPORTANTES
echo ========================================
echo.
echo 1. REINICIA Apache en XAMPP Control Panel
echo 2. Para usar Gmail, necesitas:
echo    - Habilitar "Contrasenas de aplicaciones" en tu cuenta Google
echo    - Editar C:\xampp\sendmail\sendmail.ini
echo    - Agregar tu email y contrasena de aplicacion
echo.
echo 3. Para probar el sistema:
echo    http://localhost/codigos-ika-XAMPP/proyecto_restaurante_react/proyecto_restaurante_react/server/test-mail.php
echo.
echo 4. Los logs de correo estan en:
echo    C:\xampp\sendmail\error.log
echo    C:\xampp\sendmail\debug.log
echo.
echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================
echo.
pause
