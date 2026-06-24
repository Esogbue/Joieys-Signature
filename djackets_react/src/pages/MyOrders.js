import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "My Orders — Joiey's Signature"
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    axios.get('http://127.0.0.1:8000/api/v1/orders/', {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [navigate])

  const statusColor = (status) => {
    switch (status) {
      case 'delivered': return '#22c55e'
      case 'shipped': return '#3b82f6'
      case 'processing': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      default: return '#9B59B6'
    }
  }

  const groupOrdersByDate = (orders) => {
    const groups = {}
    orders.forEach(order => {
      const date = new Date(order.created_at)
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      let label
      if (date.toDateString() === today.toDateString()) {
        label = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday'
      } else {
        label = date.toLocaleDateString('en-NG', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      }

      if (!groups[label]) groups[label] = []
      groups[label].push(order)
    })
    return groups
  }

  if (loading) return (
    <div className="text-center py-32" style={{ color: '#9B59B6' }}>
      Loading your orders...
    </div>
  )

  if (orders.length === 0) return (
    <div className="text-center py-32">
      <p className="text-2xl mb-4" style={{ color: '#9B59B6' }}>You have no orders yet 📦</p>
      <Link to="/shop"
        className="px-8 py-3 rounded-full text-white font-medium"
        style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
        Start Shopping
      </Link>
    </div>
  )

  const grouped = groupOrdersByDate(orders)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a1a1a' }}>My Orders</h1>

      {Object.entries(grouped).map(([dateLabel, dateOrders]) => (
        <div key={dateLabel} className="mb-8">

          {/* Date Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8D5F5' }} />
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#E8D5F5', color: '#9B59B6' }}>
              {dateLabel}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8D5F5' }} />
          </div>

          {/* Orders for that date */}
          <div className="flex flex-col gap-4">
            {dateOrders.map(order => (
              <Link to={`/my-orders/${order.id}`} key={order.id}
                className="block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

                {/* Order Header */}
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ backgroundColor: '#FDFAFF', borderBottom: '1px solid #E8D5F5' }}>
                  <div>
                    <p className="text-sm text-gray-400">Order #{order.id}</p>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>
                      {order.first_name} {order.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: statusColor(order.status) }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-sm mt-1 text-gray-400">{order.email}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 flex flex-col gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product_name || `Product #${item.product}`}
                          </p>
                          {item.size && (
                            <p className="text-xs" style={{ color: '#9B59B6' }}>Size: {item.size}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold" style={{ color: '#C8A96E' }}>
                        ₦{Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ borderTop: '1px solid #E8D5F5' }}>
                  <div>
                    <p className="text-sm text-gray-400">Delivery to</p>
                    <p className="text-sm font-medium text-gray-700">
                      {order.address}, {order.place}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Total Paid</p>
                    <p className="text-lg font-bold" style={{ color: '#C8A96E' }}>
                      ₦{Number(order.paid_amount).toLocaleString()}
                    </p>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyOrders
