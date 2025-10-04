import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { API_ENDPOINTS } from '../config.ts'
import type { 
  Usuario, 
  AuthContextType, 
  AuthResponse, 
  RegisterData,
  RolUsuario 
} from '../types.ts'

/**
 * Context para gestión de autenticación
 * Fuente: https://react.dev/learn/passing-data-deeply-with-context
 */
const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Hook personalizado para usar el contexto de autenticación
 * Fuente: https://react.dev/reference/react/useContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Provider de autenticación
 * Gestiona el estado del usuario y provee funciones de auth
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Al cargar, verificar si hay sesión activa
  useEffect(() => {
    verificarSesion()
  }, [])

  /**
   * Verificar si hay una sesión activa
   */
  const verificarSesion = async (): Promise<void> => {
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
        const data: AuthResponse = await response.json()
        if (data.success && data.usuario) {
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
  const login = async (correo: string, password: string): Promise<AuthResponse> => {
    try {
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password })
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.token && data.usuario) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token)
        
        // Actualizar estado del usuario
        setUsuario(data.usuario)
        
        return { success: true, usuario: data.usuario }
      } else {
        const errorMsg = data.message || 'Error al iniciar sesión'
        setError(errorMsg)
        return { success: false, message: errorMsg }
      }
    } catch (error) {
      console.error('Error en login:', error)
      const errorMsg = 'Error de conexión'
      setError(errorMsg)
      return { success: false, message: errorMsg }
    }
  }

  /**
   * Registrar nuevo usuario
   */
  const register = async (datos: RegisterData): Promise<AuthResponse> => {
    try {
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      })

      const data: AuthResponse = await response.json()

      if (data.success) {
        // Auto-login después de registro exitoso
        return await login(datos.correo, datos.password)
      } else {
        const errorMsg = data.message || 'Error al registrarse'
        setError(errorMsg)
        return { success: false, message: errorMsg }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      const errorMsg = 'Error de conexión'
      setError(errorMsg)
      return { success: false, message: errorMsg }
    }
  }

  /**
   * Cerrar sesión
   */
  const logout = async (): Promise<void> => {
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
  const tieneRol = (rol: RolUsuario): boolean => {
    return usuario?.rol === rol
  }

  /**
   * Verificar si el usuario está autenticado
   */
  const estaAutenticado = (): boolean => {
    return usuario !== null
  }

  /**
   * Actualizar información del usuario actual
   */
  const actualizarUsuario = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return
      }

      const response = await fetch(API_ENDPOINTS.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        if (data.success && data.usuario) {
          setUsuario(data.usuario)
        }
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error)
    }
  }

  // Valor del contexto
  const value: AuthContextType = {
    usuario,
    loading,
    error,
    login,
    register,
    logout,
    tieneRol,
    estaAutenticado,
    actualizarUsuario,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

