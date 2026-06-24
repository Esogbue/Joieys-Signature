import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const OrderSuccess = () => {
  useEffect(() => {
    document.title = "Order Successful — Joiey's Signature"
  }, [])

  return (
    <div className="text-center py-32 px-6">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
        Order Placed Successfully!
      </h1>
      <p className="mb-2" style={{ color: '#9B59B6' }}>
        Thank you for shopping with Joiey's Signature.
      </p>
      <p className="text-gray-400 mb-8">
        You will receive a confirmation shortly.
      </p>
      <Link to="/shop"
        className="px-8 py-3 rounded-full text-white font-medium"
        style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
        Continue Shopping
      </Link>
    </div>
  )
}

export default OrderSuccess
