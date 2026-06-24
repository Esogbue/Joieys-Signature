import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Checkout = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    zipcode: '',
    place: '',
  })

  useEffect(() => {
    document.title = "Checkout — Joiey's Signature"
  }, [navigate])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) navigate('/cart')
    setCartItems(cart)
  }, [navigate])

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePayment = () => {
    // ← ADD THIS FIRST
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login or create an account to complete your purchase.')
      navigate('/login')
      return
    }

  // Check all required fields filled
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'place']
    for (const key of requiredFields) {
      if (!form[key]) {
        alert('Please fill in all required fields')
        setLoading(false)
        return
      }
    }

    setLoading(true)

    const PaystackPop = window.PaystackPop

    const handler = PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: total * 100, // Paystack uses kobo
      currency: 'NGN',
      callback: function(response) {
        // Payment successful — verify with backend
        const token = localStorage.getItem('token')
        axios.post('http://127.0.0.1:8000/api/v1/checkout/', {
          ...form,
          paystack_token: response.reference,
          items: cartItems.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
          }))
        }, {
          headers: { Authorization: `Token ${token}` }
        })
        .then(() => {
          localStorage.removeItem('cart')
          window.dispatchEvent(new Event('cartUpdated'))
          navigate('/order-success')
        })
        .catch(err => {
          console.log(err)
          alert('Order could not be saved. Please contact support.')
        })
        .finally(() => setLoading(false))
      },
      onClose: function() {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a1a1a' }}>Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-6" style={{ color: '#1a1a1a' }}>
            Delivery Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'first_name', placeholder: 'First Name' },
              { name: 'last_name', placeholder: 'Last Name' },
            ].map(field => (
              <input key={field.name} name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border outline-none w-full"
                style={{ borderColor: '#E8D5F5' }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {[
              { name: 'email', placeholder: 'Email Address', type: 'email' },
              { name: 'phone', placeholder: 'Phone Number', type: 'tel' },
              { name: 'address', placeholder: 'Delivery Address' },
              { name: 'place', placeholder: 'City / State' },
              { name: 'zipcode', placeholder: 'Zip Code (optional)' },
            ].map(field => (
              <input key={field.name} name={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border outline-none w-full"
                style={{ borderColor: '#E8D5F5' }}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h2 className="font-semibold text-lg mb-4" style={{ color: '#1a1a1a' }}>
              Order Summary
            </h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <img src={item.get_thumbnail} alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs" style={{ color: '#9B59B6' }}>
                      x{item.quantity} · Size {item.size}
                    </p>
                  </div>
                </div>
                <p className="font-semibold" style={{ color: '#C8A96E' }}>
                  ₦{Number(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 mt-4" style={{ borderColor: '#E8D5F5' }}>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span style={{ color: '#C8A96E' }}>₦{Number(total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button onClick={handlePayment} disabled={loading}
            className="w-full py-4 rounded-full text-white font-semibold text-lg transition hover:opacity-90"
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #D63384, #9B59B6)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Processing...' : `Pay ₦${Number(total).toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
