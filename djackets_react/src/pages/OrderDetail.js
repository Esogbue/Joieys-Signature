import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const OrderDetail = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    axios.get('https://joieyssignature.pythonanywhere.com/api/v1/orders/', {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        const found = res.data.find(o => o.id === parseInt(orderId))
        if (!found) navigate('/my-orders')
        setOrder(found)
        document.title = `Order #${found.id} — Joiey's Signature`
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        navigate('/my-orders')
      })
  }, [orderId, navigate])

  const statusColor = (status) => {
    switch (status) {
      case 'delivered': return '#22c55e'
      case 'shipped': return '#3b82f6'
      case 'processing': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      default: return '#9B59B6'
    }
  }

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

  if (loading) return (
    <div className="text-center py-32" style={{ color: '#9B59B6' }}>
      Loading order details...
    </div>
  )

  if (!order) return null

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Back Button */}
      <Link to="/my-orders"
        className="flex items-center gap-2 text-sm mb-8 w-fit"
        style={{ color: '#9B59B6' }}>
        ← Back to My Orders
      </Link>

      {/* Order Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>
            Order #{order.id}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{order.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-NG', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <span className="text-sm font-semibold px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: statusColor(order.status) }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Date Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ backgroundColor: '#E8D5F5' }} />
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: '#E8D5F5', color: '#9B59B6' }}>
          {new Date(order.created_at).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#E8D5F5' }} />
      </div>

      {/* Order Progress Bar */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>Order Progress</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 z-0"
              style={{ backgroundColor: '#E8D5F5' }}>
              <div className="h-full transition-all duration-500"
                style={{
                  backgroundColor: '#9B59B6',
                  width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%`
                }} />
            </div>

            {statusSteps.map((step, index) => {
              const isCompleted = statusSteps.indexOf(order.status) >= index
              return (
                <div key={step} className="flex flex-col items-center z-10 gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: isCompleted ? '#9B59B6' : '#E8D5F5' }}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className="text-xs capitalize text-center"
                    style={{ color: isCompleted ? '#9B59B6' : '#aaa' }}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E8D5F5' }}>
          <h2 className="font-semibold" style={{ color: '#1a1a1a' }}>Items Ordered</h2>
        </div>
        <div className="px-6 py-4 flex flex-col gap-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
                  {item.quantity}x
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.product_name || `Product #${item.product}`}
                  </p>
                  {item.size && (
                    <p className="text-sm" style={{ color: '#9B59B6' }}>Size: {item.size}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    ₦{Number(item.price).toLocaleString()} each
                  </p>
                </div>
              </div>
              <p className="font-bold" style={{ color: '#C8A96E' }}>
                ₦{Number(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Delivery Information
          </h2>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p><span className="text-gray-400">Name: </span>
              {order.first_name} {order.last_name}</p>
            <p><span className="text-gray-400">Phone: </span>{order.phone}</p>
            <p><span className="text-gray-400">Address: </span>{order.address}</p>
            <p><span className="text-gray-400">City: </span>{order.place}</p>
            <p><span className="text-gray-400">Zip Code: </span>{order.zipcode}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>Payment Summary</h2>
          <div className="flex flex-col gap-3 text-sm">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-gray-600">
                <span>{item.product_name} x{item.quantity}</span>
                <span>₦{Number(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-base"
              style={{ borderColor: '#E8D5F5' }}>
              <span>Total Paid</span>
              <span style={{ color: '#C8A96E' }}>
                ₦{Number(order.paid_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center">
        <Link to="/shop"
          className="px-8 py-3 rounded-full text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
          Continue Shopping
        </Link>
      </div>

    </div>
  )
}

export default OrderDetail
