import { createContext, useContext, useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config'

/**
 * Context para gestión de autenticación
 * Fuente: https://react.dev/learn/passing-data-deeply-with-context
 */
const AuthContext = createContext(null)

/**
 * Hook personalizado para usar el contexto de autenticación
 * Fuente: https://react.dev/reference/react/useContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

/**
 * Provider de autenticación
 * Gestiona el estado del usuario y provee funciones de auth
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Al cargar, verificar si hay sesión activa
  useEffect(() => {
    verificarSesion()
  }, [])

  /**
   * Verificar si hay una sesión activa
   */
  const verificarSesion = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setLoading(false)
        return
      }

      // Verificar token con el backend
      const response = await fetch(API_ENDPOINTS.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsuario(data.usuario)
        } else {
          localStorage.removeItem('token')
        }
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error verificando sesión:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Iniciar sesión
   */
  const login = async (correo, password) => {
    try {
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password })
      })

      const data = await response.json()

      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token)
        
        // Actualizar estado del usuario
        setUsuario(data.usuario)
        
        return { success: true, usuario: data.usuario }
      } else {
        setError(data.message || 'Error al iniciar sesión')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError('Error de conexión')
      return { success: false, message: 'Error de conexión' }
    }
  }

  /**
   * Registrar nuevo usuario
   */
  const register = async (datos) => {
    try {
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      })

      const data = await response.json()

      if (data.success) {
        // Auto-login después de registro exitoso
        return await login(datos.correo, datos.password)
      } else {
        setError(data.message || 'Error al registrarse')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      setError('Error de conexión')
      return { success: false, message: 'Error de conexión' }
    }
  }

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        // Notificar al backend
        await fetch(API_ENDPOINTS.logout, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar estado local
      localStorage.removeItem('token')
      setUsuario(null)
      setError(null)
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const tieneRol = (rol) => {
    return usuario?.rol === rol
  }

  /**
   * Verificar si el usuario está autenticado
   */
  const estaAutenticado = () => {
    return usuario !== null
  }

  // Valor del contexto
  const value = {
    usuario,
    loading,
    error,
    login,
    register,
    logout,
    tieneRol,
    estaAutenticado,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

