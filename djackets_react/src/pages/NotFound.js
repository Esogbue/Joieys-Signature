import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found — Joiey's Signature"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #FCE4F0, #E8D5F5, #FDFAFF)' }}>
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #D63384, #9B59B6, #C8A96E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Great Vibes, cursive'
          }}>
          404
        </h1>
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
          Oops! Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/"
            className="px-6 py-3 rounded-full text-white font-medium transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
            Go Home
          </Link>
          <Link to="/shop"
            className="px-6 py-3 rounded-full font-medium border-2 transition hover:opacity-90"
            style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
