"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Puppy {
  id: number
  name: string
  age: string
  gender: string
  color: string
  price: number
  priceDisplay: string
  status: string
  image: string
  description?: string
  weight?: string
  parents?: string
  vaccinations?: string[]
}

export interface CartItem {
  puppy: Puppy
  addMicrochip: boolean
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (puppy: Puppy) => void
  removeFromCart: (puppyId: number) => void
  toggleMicrochip: (puppyId: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("frenchBulldogCart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("frenchBulldogCart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (puppy: Puppy) => {
    setCart((prev) => {
      // Check if puppy already in cart
      const exists = prev.find((item) => item.puppy.id === puppy.id)
      if (exists) {
        return prev
      }
      return [...prev, { puppy, addMicrochip: false }]
    })
  }

  const removeFromCart = (puppyId: number) => {
    setCart((prev) => prev.filter((item) => item.puppy.id !== puppyId))
  }

  const toggleMicrochip = (puppyId: number) => {
    setCart((prev) =>
      prev.map((item) => (item.puppy.id === puppyId ? { ...item, addMicrochip: !item.addMicrochip } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const puppyPrice = item.puppy.price
      const microchipPrice = item.addMicrochip ? 50 : 0
      return total + puppyPrice + microchipPrice
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        toggleMicrochip,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
