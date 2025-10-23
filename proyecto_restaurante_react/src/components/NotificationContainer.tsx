import { useNotification } from '../contexts/NotificationContext'
import type { Notification } from '../contexts/NotificationContext'

/**
 * Contenedor de Notificaciones
 * Muestra las notificaciones tipo toast en la esquina superior de la pantalla
 * 
 * Fuente oficial: https://react.dev/learn/rendering-lists
 */

interface NotificationItemProps {
  notification: Notification
  onClose: (id: string) => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  /**
   * Obtener configuración visual según el tipo
   */
  const getTypeConfig = (type: Notification['type']) => {
    const configs = {
      success: {
        bgClass: 'alert-success',
        icon: 'fa-check-circle',
        iconColor: 'text-success'
      },
      error: {
        bgClass: 'alert-danger',
        icon: 'fa-times-circle',
        iconColor: 'text-danger'
      },
      warning: {
        bgClass: 'alert-warning',
        icon: 'fa-exclamation-triangle',
        iconColor: 'text-warning'
      },
      info: {
        bgClass: 'alert-info',
        icon: 'fa-info-circle',
        iconColor: 'text-info'
      }
    }
    return configs[type]
  }

  const config = getTypeConfig(notification.type)

  return (
    <div 
      className={`alert ${config.bgClass} alert-dismissible fade show shadow-lg mb-3`}
      role="alert"
      style={{
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '350px',
        maxWidth: '500px'
      }}
    >
      <div className="d-flex align-items-start">
        <div className="me-3">
          <i className={`fas ${config.icon} fa-2x ${config.iconColor}`}></i>
        </div>
        <div className="flex-grow-1">
          <h6 className="alert-heading mb-1">
            <strong>{notification.title}</strong>
          </h6>
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            {notification.message}
          </p>
        </div>
        <button 
          type="button" 
          className="btn-close" 
          onClick={() => onClose(notification.id)}
          aria-label="Close"
        ></button>
      </div>
      {notification.duration && notification.duration > 0 && (
        <div className="progress mt-2" style={{ height: '3px' }}>
          <div 
            className={`progress-bar bg-${notification.type === 'success' ? 'success' : notification.type === 'error' ? 'danger' : notification.type}`}
            style={{ 
              animation: `progressBar ${notification.duration}ms linear forwards`,
              width: '100%'
            }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 9999 }}
    >
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

