import React, { createContext, useContext, useState } from 'react'
import type { CartItem, Product } from '../types'

interface CartContextType {
  items:          CartItem[]
  addToCart:      (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart:      () => void
  totalItems:     number
  totalPrice:     number
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [items, setItems] = useState<CartItem[]>([])
  const addToCart = (product: Product) => {
    setItems(currentItems => {
      const alreadyInCart = currentItems.find(item => item.product.id === product.id)

      if (alreadyInCart) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentItems, { product, quantity: 1 }]
    })
  }
  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
  }
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}