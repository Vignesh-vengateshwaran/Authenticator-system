import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import type { Product, CartItem } from '../types'

const DashboardPage: React.FC = () => {
  const { user, logout }   = useAuth()
  const navigate           = useNavigate()
  const isAdmin            = user?.role === 'ADMIN'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">ShopNow</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {user?.name}</span>
          {isAdmin ? (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full border border-yellow-300">
              👑 Admin
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300">
              👤 User
            </span>
          )}

          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-medium"
          >
            Logout
          </button>
        </div>
      </nav>
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}

    </div>
  )
}

const UserDashboard: React.FC = () => {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const [showCart, setShowCart]     = useState(false)
  const [orderDone, setOrderDone]   = useState(false)
  const [justAdded, setJustAdded]   = useState<number | null>(null)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setJustAdded(product.id)
    setTimeout(() => setJustAdded(null), 1500)
  }

  const handlePlaceOrder = () => {
    clearCart()
    setShowCart(false)
    setOrderDone(true)
    setTimeout(() => setOrderDone(false), 3000)
  }

  return (
    <div className="p-6">

      <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome to ShopNow!</h2>
        <p className="mt-1 text-blue-100">Browse our products and add them to your cart.</p>
        <p className="mt-1 text-blue-100">Free shipping on orders over $50.</p>
      </div>

      {orderDone && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 font-medium">
          ✅ Order placed successfully! We will deliver it soon.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Our Products</h3>
        <button
          onClick={() => setShowCart(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium relative"
        >
          🛒 View Cart
          {totalItems > 0 && (
            <span className="ml-2 bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
              <p className="text-gray-500 text-sm mt-1">{product.description}</p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">
                  {product.stock} in stock
                </span>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full mt-3 py-2 rounded font-semibold transition-colors
                  ${justAdded === product.id
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {justAdded === product.id ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>

          </div>
        ))}
      </div>

      {showCart && (
        <CartPanel
          items={items}
          totalPrice={totalPrice}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

    </div>
  )
}

interface CartPanelProps {
  items:            CartItem[]
  totalPrice:       number
  onClose:          () => void
  onUpdateQuantity: (id: number, qty: number) => void
  onRemove:         (id: number) => void
  onPlaceOrder:     () => void
}

const CartPanel: React.FC<CartPanelProps> = ({
  items, totalPrice, onClose, onUpdateQuantity, onRemove, onPlaceOrder
}) => {

  const shipping   = totalPrice >= 50 ? 0 : 4.99
  const grandTotal = totalPrice + shipping

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-xl">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-3">🛒</p>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some products first</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 border border-gray-200 rounded-lg p-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{item.product.name}</p>
                  <p className="text-gray-500 text-sm">${item.product.price.toFixed(2)} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-300 rounded text-gray-700 font-bold hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 border border-gray-300 rounded text-gray-700 font-bold hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="text-red-500 text-xs hover:underline ml-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>

              </div>
            ))
          )}

        </div>
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-5 space-y-3">

            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500 text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={onPlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold"
            >
              Place Order
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

const AdminDashboard: React.FC = () => {
  const [prices, setPrices] = useState<Record<number, number>>(
    Object.fromEntries(products.map(p => [p.id, p.price]))
  )
  const [stocks, setStocks] = useState<Record<number, number>>(
    Object.fromEntries(products.map(p => [p.id, p.stock]))
  )
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [savedId, setSavedId]       = useState<number | null>(null)

  const handleSave = (id: number) => {
    setEditingId(null)
    setSavedId(id)
    setTimeout(() => setSavedId(null), 2000)
  }

  const totalProducts = products.length
  const lowStockCount = products.filter(p => stocks[p.id] < 20).length
  const totalRevenue  = products.reduce((sum, p) => sum + prices[p.id] * stocks[p.id], 0)

  return (
    <div className="p-6">
      <div className="bg-yellow-500 text-white rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-1 text-yellow-100">Manage your products, prices, and inventory below.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-lg shadow p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          <p className="text-gray-500 mt-1">Total Products</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 text-center">
          <p className="text-3xl font-bold text-red-500">{lowStockCount}</p>
          <p className="text-gray-500 mt-1">Low Stock Items</p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 text-center">
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(0)}</p>
          <p className="text-gray-500 mt-1">Total Inventory Value</p>
        </div>

      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Product Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
              {savedId === product.id && (
                <p className="text-green-600 text-sm font-medium mt-1">
                  ✓ Changes saved!
                </p>
              )}
              {editingId === product.id ? (
                <div className="mt-3 space-y-3">

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={prices[product.id]}
                      onChange={e => setPrices(prev => ({
                        ...prev,
                        [product.id]: parseFloat(e.target.value)
                      }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={stocks[product.id]}
                      onChange={e => setStocks(prev => ({
                        ...prev,
                        [product.id]: parseInt(e.target.value)
                      }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(product.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>

                </div>

              ) : (
                <div className="mt-3">

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${prices[product.id]?.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded
                      ${stocks[product.id] < 20
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      {stocks[product.id]} in stock
                    </span>
                  </div>
                  {stocks[product.id] < 20 && (
                    <p className="text-red-500 text-xs mt-1">
                      ⚠ Low stock — consider restocking
                    </p>
                  )}

                  <button
                    onClick={() => setEditingId(product.id)}
                    className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold"
                  >
                    ✏ Edit Product
                  </button>

                </div>

              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default DashboardPage