import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(
    JSON.parse(localStorage.getItem('cart') || '[]').reduce((sum, item) => sum + item.quantity, 0)
  )
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')
  const rawUsername = localStorage.getItem('username') || ''
  const letters = rawUsername.replace(/[^a-zA-Z]/g, '')
  const trimmed = letters.charAt(0).toUpperCase() + letters.slice(1, 7)
  const username = letters.length > 7 ? trimmed + '...' : trimmed
  const dropdownRef = useRef(null)

  useEffect(() => {
    const updateCartCount = () => {
      const count = JSON.parse(localStorage.getItem('cart') || '[]').reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
    }

    window.addEventListener('cartUpdated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    navigate('/')
    window.location.reload()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${search}`)
      setSearch('')
      setMenuOpen(false)
    }
  }

  return (
    <nav style={{ backgroundColor: '#1a1a1a' }} className="px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" style={{ display: 'inline-block', fontFamily: 'Great Vibes, cursive', position: 'relative', padding: '5px 15px 5px 8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #D63384, #9B59B6, #C8A96E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2rem',
            lineHeight: '1.2',
            padding: '8px 10px',
          }}>Joiey's</div>
          <div style={{
            color: '#C8A96E',
            fontSize: '1rem',
            position: 'absolute',
            bottom: '5px',
            right: '4px',
          }}>signature</div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #333',
                  width: '180px'
                }}
              />
              <button type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                🔍
              </button>
            </div>
          </form>

          <Link to="/" className="text-white hover:text-yellow-400 transition">Home</Link>
          <Link to="/shop" className="text-white hover:text-yellow-400 transition">Shop</Link>

          {/* Cart with count */}
          <Link to="/cart" className="text-white hover:text-yellow-400 transition relative">
            Cart 🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: '#D63384' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition"
                style={{ backgroundColor: '#2a2a2a', color: '#C8A96E', border: '1px solid #C8A96E' }}>
                👤 {username} ▾
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden z-50"
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #333' }}>
                  <Link to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-gray-700 transition">
                    📦 My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="px-4 py-2 rounded-full text-sm font-medium border transition hover:opacity-90"
                style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>
                Login
              </Link>
              <Link to="/signup"
                className="px-4 py-2 rounded-full text-sm font-medium transition hover:opacity-90"
                style={{ backgroundColor: '#C8A96E', color: '#1a1a1a' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 px-4 pb-4">

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 rounded-full text-sm outline-none w-full"
                style={{
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #333',
                }}
              />
              <button type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </button>
            </div>
          </form>

          <Link to="/" className="text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="text-white" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/cart" className="text-white" onClick={() => setMenuOpen(false)}>
            Cart 🛒 {cartCount > 0 && `(${cartCount})`}
          </Link>

          {isLoggedIn ? (
            <>
              <p className="text-sm" style={{ color: '#C8A96E' }}>👤 {username}</p>
              <Link to="/my-orders" className="text-white" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
              <button onClick={handleLogout} className="text-left text-red-400">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="text-white" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
