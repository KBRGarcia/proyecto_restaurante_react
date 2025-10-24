# 📸 Generación de Imágenes de Recibos

## Descripción

Se ha implementado un sistema completo para generar y descargar imágenes de recibos y detalles de órdenes en el proyecto React con Vite. La solución utiliza `html2canvas` para capturar elementos HTML como imágenes de alta calidad.

## 🚀 Características Implementadas

### ✅ Funcionalidades Principales
- **Generación de imágenes PNG** de alta calidad
- **Vista previa del recibo** antes de descargar
- **Descarga directa** de la imagen
- **Copia al portapapeles** de la imagen
- **Diseño profesional** del recibo con estilos optimizados
- **Notificaciones** de éxito y error
- **Estados de carga** durante la generación

### 🎨 Componentes Creados

#### 1. `ReceiptImage.tsx`
Componente especializado para mostrar el recibo con:
- Diseño profesional con gradientes y sombras
- Información completa de la orden
- Detalles de productos ordenados
- Resumen de pagos con impuestos
- Información de entrega
- Notas especiales
- Footer con fecha de generación

#### 2. `useImageDownload.ts` (Hook personalizado)
Hook que proporciona:
- `downloadImage()` - Descarga la imagen como archivo PNG
- `copyImageToClipboard()` - Copia la imagen al portapapeles
- `generateImageDataUrl()` - Genera la imagen como data URL
- `isGenerating` - Estado de carga

#### 3. `receipt.css`
Estilos específicos para:
- Mejorar la calidad de captura
- Animaciones sutiles
- Optimización para html2canvas
- Diseño responsive

## 📦 Dependencias Instaladas

```bash
npm install html2canvas
```

## 🔧 Configuración de html2canvas

El hook utiliza configuración optimizada para mejor calidad:

```typescript
const canvas = await html2canvas(element, {
  backgroundColor: '#ffffff',
  scale: 2,                    // Doble resolución
  useCORS: true,               // Soporte para imágenes externas
  allowTaint: true,            // Permitir contenido externo
  logging: false,              // Sin logs en consola
  width: element.offsetWidth,
  height: element.offsetHeight,
  scrollX: 0,
  scrollY: 0
})
```

## 🎯 Uso en OrderDetailsModal

### Botones Implementados

1. **Vista Previa** - Muestra el recibo en un modal
2. **Descargar Recibo** - Genera y descarga la imagen PNG
3. **Copiar Imagen** - Copia la imagen al portapapeles

### Estados de la Interfaz

- Botones deshabilitados cuando no hay productos
- Indicador de carga durante la generación
- Notificaciones de éxito/error
- Vista previa opcional del recibo

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

### Limitaciones
- La función de copiar al portapapeles requiere HTTPS en producción
- Algunos estilos CSS avanzados pueden no renderizarse correctamente
- Imágenes externas requieren CORS habilitado

## 🎨 Personalización del Recibo

### Modificar el Diseño
Edita `src/components/ReceiptImage.tsx` para:
- Cambiar colores y fuentes
- Agregar logo del restaurante
- Modificar información de contacto
- Personalizar el layout

### Ajustar Calidad de Imagen
En `src/hooks/useImageDownload.ts`:
```typescript
const options = {
  quality: 0.95,        // Calidad PNG (0-1)
  scale: 2,              // Resolución (1=normal, 2=doble)
  backgroundColor: '#ffffff'
}
```

## 🔍 Ejemplo de Uso

```typescript
import { useImageDownload } from '../hooks/useImageDownload'

function MiComponente() {
  const { downloadImage, copyImageToClipboard, isGenerating } = useImageDownload()

  const handleDownload = () => {
    downloadImage('receipt-content', {
      filename: 'mi_recibo',
      quality: 0.95,
      scale: 2
    })
  }

  return (
    <div>
      <button onClick={handleDownload} disabled={isGenerating}>
        {isGenerating ? 'Generando...' : 'Descargar Recibo'}
      </button>
    </div>
  )
}
```

## 🚨 Solución de Problemas

### Error: "No se encontró el elemento"
- Asegúrate de que el elemento tenga el ID correcto
- Verifica que el elemento esté visible en el DOM

### Imagen de baja calidad
- Aumenta el valor de `scale` (2 o 3)
- Verifica que las fuentes estén cargadas
- Usa `quality: 1` para máxima calidad

### Error de CORS
- Las imágenes externas requieren CORS habilitado
- Usa imágenes locales o con CORS configurado

## 📈 Rendimiento

### Optimizaciones Implementadas
- Configuración optimizada de html2canvas
- Estados de carga para mejor UX
- Manejo de errores robusto
- Estilos optimizados para captura

### Recomendaciones
- Usar `scale: 2` para balance calidad/rendimiento
- Evitar elementos muy grandes (>2000px)
- Pre-cargar fuentes personalizadas

## 🔮 Futuras Mejoras

- [ ] Soporte para PDF con jsPDF
- [ ] Plantillas de recibo personalizables
- [ ] Compresión de imágenes
- [ ] Generación en servidor
- [ ] Soporte para múltiples formatos (JPEG, WebP)

---

**Nota**: Esta implementación está optimizada para el proyecto de restaurante y puede adaptarse fácilmente a otros casos de uso similares.

