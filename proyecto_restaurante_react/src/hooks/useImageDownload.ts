import { useState } from 'react'
import html2canvas from 'html2canvas'
import { useNotification } from '../contexts/NotificationContext'

/**
 * Hook personalizado para generar y descargar imágenes de recibos
 * Utiliza html2canvas para capturar elementos HTML como imágenes
 * 
 * Fuente: https://html2canvas.hertzen.com/
 */

interface UseImageDownloadOptions {
  filename?: string
  quality?: number
  backgroundColor?: string
  scale?: number
}

export function useImageDownload() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { success, error: showError } = useNotification()

  /**
   * Generar y descargar imagen desde un elemento HTML
   */
  const downloadImage = async (
    elementId: string, 
    options: UseImageDownloadOptions = {}
  ) => {
    const {
      filename = 'recibo',
      quality = 0.95,
      backgroundColor = '#ffffff',
      scale = 2
    } = options

    setIsGenerating(true)

    try {
      const element = document.getElementById(elementId)
      
      if (!element) {
        throw new Error('No se encontró el elemento para capturar')
      }

      // Configuración de html2canvas para mejor calidad
      const canvas = await html2canvas(element, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight
      })

      // Convertir canvas a blob
      const dataUrl = canvas.toDataURL('image/png', quality)
      
      // Crear enlace de descarga
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`
      
      // Trigger descarga
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Mostrar notificación de éxito
      success(
        'Imagen Descargada',
        `El recibo se ha descargado exitosamente como ${filename}.png`,
        4000
      )

    } catch (error) {
      console.error('Error al generar imagen:', error)
      showError(
        'Error al Generar Imagen',
        'No se pudo generar la imagen del recibo. Por favor, intenta nuevamente.',
        5000
      )
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Generar imagen y obtenerla como data URL (sin descargar)
   */
  const generateImageDataUrl = async (
    elementId: string,
    options: UseImageDownloadOptions = {}
  ): Promise<string | null> => {
    const {
      backgroundColor = '#ffffff',
      scale = 2,
      quality = 0.95
    } = options

    try {
      const element = document.getElementById(elementId)
      
      if (!element) {
        throw new Error('No se encontró el elemento para capturar')
      }

      const canvas = await html2canvas(element, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight
      })

      return canvas.toDataURL('image/png', quality)

    } catch (error) {
      console.error('Error al generar imagen:', error)
      return null
    }
  }

  /**
   * Generar imagen y copiarla al portapapeles
   */
  const copyImageToClipboard = async (
    elementId: string,
    options: UseImageDownloadOptions = {}
  ) => {
    const {
      backgroundColor = '#ffffff',
      scale = 2
    } = options

    setIsGenerating(true)

    try {
      const element = document.getElementById(elementId)
      
      if (!element) {
        throw new Error('No se encontró el elemento para capturar')
      }

      const canvas = await html2canvas(element, {
        backgroundColor,
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight
      })

      // Convertir canvas a blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ])
            
            success(
              'Imagen Copiada',
              'El recibo se ha copiado al portapapeles',
              3000
            )
          } catch (clipboardError) {
            console.error('Error al copiar al portapapeles:', clipboardError)
            showError(
              'Error al Copiar',
              'No se pudo copiar la imagen al portapapeles',
              4000
            )
          }
        }
      }, 'image/png')

    } catch (error) {
      console.error('Error al generar imagen:', error)
      showError(
        'Error al Generar Imagen',
        'No se pudo generar la imagen del recibo',
        5000
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    downloadImage,
    generateImageDataUrl,
    copyImageToClipboard,
    isGenerating
  }
}

