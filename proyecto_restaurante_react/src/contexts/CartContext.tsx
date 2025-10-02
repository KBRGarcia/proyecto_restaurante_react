import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ItemCarrito, CartContextType, Producto } from '../types.ts'

/**
 * Context para gestión del carrito de compras
 * Fuente oficial: https://react.dev/learn/passing-data-deeply-with-context
 * 
 * Implementa el patrón de Context API de React para compartir el estado
 * del carrito entre componentes sin prop drilling.
 */
const CartContext = createContext<CartContextType | null>(null)

/**
 * Hook personalizado para usar el contexto del carrito
 * Fuente: https://react.dev/reference/react/useContext
 * 
 * @throws {Error} Si se usa fuera del CartProvider
 * @returns {CartContextType} El contexto del carrito
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

// Constantes para cálculos
const STORAGE_KEY = 'restaurante_cart'
const TASA_IMPUESTO = 0.16 // 16% de IVA

/**
 * Provider del carrito de compras
 * Gestiona el estado del carrito y provee funciones para manipularlo
 * Persiste los datos en localStorage para mantener el carrito entre sesiones
 */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<ItemCarrito[]>([])

  /**
   * Cargar carrito desde localStorage al montar el componente
   * Fuente: https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error)
    }
  }, [])

  /**
   * Guardar carrito en localStorage cada vez que cambie
   * Fuente: https://react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error al guardar el carrito:', error)
    }
  }, [items])

  /**
   * Agregar un producto al carrito o incrementar su cantidad si ya existe
   * 
   * @param producto - El producto a agregar
   * @param cantidad - Cantidad a agregar (por defecto 1)
   */
  const agregarItem = (producto: Producto, cantidad: number = 1): void => {
    setItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === producto.id)
      
      if (itemExistente) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      } else {
        // Si no existe, agregarlo
        const nuevoItem: ItemCarrito = {
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          cantidad: cantidad,
          imagen: producto.imagen,
          descripcion: producto.descripcion,
          tiempo_preparacion: producto.tiempo_preparacion
        }
        return [...prevItems, nuevoItem]
      }
    })
  }

  /**
   * Eliminar un producto del carrito completamente
   * 
   * @param productoId - ID del producto a eliminar
   */
  const eliminarItem = (productoId: number): void => {
    setItems(prevItems => prevItems.filter(item => item.id !== productoId))
  }

  /**
   * Actualizar la cantidad de un producto en el carrito
   * Si la cantidad es 0 o menor, elimina el producto
   * 
   * @param productoId - ID del producto
   * @param cantidad - Nueva cantidad
   */
  const actualizarCantidad = (productoId: number, cantidad: number): void => {
    if (cantidad <= 0) {
      eliminarItem(productoId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productoId
          ? { ...item, cantidad }
          : item
      )
    )
  }

  /**
   * Vaciar el carrito completamente
   */
  const vaciarCarrito = (): void => {
    setItems([])
  }

  /**
   * Verificar si un producto está en el carrito
   * 
   * @param productoId - ID del producto
   * @returns true si el producto está en el carrito
   */
  const estaEnCarrito = (productoId: number): boolean => {
    return items.some(item => item.id === productoId)
  }

  /**
   * Obtener la cantidad de un producto en el carrito
   * 
   * @param productoId - ID del producto
   * @returns La cantidad del producto o 0 si no está en el carrito
   */
  const obtenerCantidad = (productoId: number): number => {
    const item = items.find(item => item.id === productoId)
    return item ? item.cantidad : 0
  }

  /**
   * Calcular la cantidad total de items en el carrito
   */
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0)

  /**
   * Calcular el subtotal (sin impuestos)
   */
  const subtotal = items.reduce((total, item) => total + (item.precio * item.cantidad), 0)

  /**
   * Calcular impuestos (IVA)
   */
  const impuestos = subtotal * TASA_IMPUESTO

  /**
   * Calcular el total (subtotal + impuestos)
   */
  const total = subtotal + impuestos

  // Valor del contexto
  const value: CartContextType = {
    items,
    cantidadTotal,
    subtotal,
    impuestos,
    total,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    vaciarCarrito,
    estaEnCarrito,
    obtenerCantidad,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext

