import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

/**
 * Sistema de Notificaciones Global
 * Proporciona un contexto para mostrar notificaciones tipo toast en toda la aplicación
 * 
 * Fuente oficial: https://react.dev/reference/react/useContext
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  icon?: string
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ) => void
  removeNotification: (id: string) => void
  success: (title: string, message: string, duration?: number) => void
  error: (title: string, message: string, duration?: number) => void
  warning: (title: string, message: string, duration?: number) => void
  info: (title: string, message: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  /**
   * Generar ID único para la notificación
   */
  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Remover notificación por ID
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  /**
   * Mostrar notificación
   */
  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      duration: number = 5000
    ) => {
      const id = generateId()
      
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration
      }

      setNotifications(prev => [...prev, notification])

      // Auto-remover después de la duración especificada
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }
    },
    [removeNotification]
  )

  /**
   * Atajos para diferentes tipos de notificaciones
   */
  const success = useCallback(
    (title: string, message: string, duration?: number) => {
      showNotification('success', title, message, duration)
    },
    [showNotification]
  )

  const error = useCallback(
    (title: string, message: string, duration?: number) => {
      showNotification('error', title, message, duration)
    },
    [showNotification]
  )

  const warning = useCallback(
    (title: string, message: string, duration?: number) => {
      showNotification('warning', title, message, duration)
    },
    [showNotification]
  )

  const info = useCallback(
    (title: string, message: string, duration?: number) => {
      showNotification('info', title, message, duration)
    },
    [showNotification]
  )

  const value: NotificationContextType = {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

