import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Cart — Joiey's Signature"
    setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const updateQuantity = (id, size, delta) => {
    const updated = cartItems.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id, size) => {
    const updated = cartItems.filter(item => !(item.id === id && item.size === size))
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) return (
    <div className="text-center py-32">
      <p className="text-2xl mb-4" style={{ color: '#9B59B6' }}>Your cart is empty 🛒</p>
      <Link to="/shop"
        className="px-8 py-3 rounded-full text-white font-medium"
        style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
        Continue Shopping
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Your Cart</h1>

      <div className="flex flex-col gap-4 mb-10">
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${item.size}-${index}`}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">

            {/* Image */}
            <img src={item.get_thumbnail} alt={item.name}
              className="w-20 h-20 object-cover rounded-xl" />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm" style={{ color: '#9B59B6' }}>Size: {item.size}</p>
              <p className="font-bold mt-1" style={{ color: '#C8A96E' }}>
                ₦{Number(item.price).toLocaleString()}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.size, -1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>−</button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.size, 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>+</button>
            </div>

            {/* Subtotal */}
            <p className="w-24 text-right font-bold" style={{ color: '#1a1a1a' }}>
              ₦{Number(item.price * item.quantity).toLocaleString()}
            </p>

            {/* Remove */}
            <button onClick={() => removeItem(item.id, item.size)}
              className="text-red-400 hover:text-red-600 text-lg ml-2">✕</button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-bold" style={{ color: '#1a1a1a' }}>
            ₦{Number(total).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-6 text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-xl" style={{ color: '#C8A96E' }}>
            ₦{Number(total).toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => {
            const token = localStorage.getItem('token')
            if (!token) {
              alert('Please login or create an account to proceed to checkout.')
              navigate('/login')
              return
            }
            navigate('/checkout')
          }}
          className="w-full py-4 rounded-full text-white font-semibold text-lg transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
          Proceed to Checkout
        </button>

        <Link to="/shop"
          className="block text-center mt-4 text-sm"
          style={{ color: '#9B59B6' }}>
          ← Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Cart
