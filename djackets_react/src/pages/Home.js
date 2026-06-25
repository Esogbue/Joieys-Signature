import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ProductCarousel = ({ products, offset = 0 }) => {
  const [current, setCurrent] = useState(offset)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % products.length)
  }, [products.length])

  const prev = () => {
    setCurrent(prev => (prev - 1 + products.length) % products.length)
  }

  useEffect(() => {
    if (products.length === 0) return
    const interval = setInterval(next, 3500)
    return () => clearInterval(interval)
  }, [products.length, next])

  if (products.length === 0) return null

  const product = products[current]

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Product Image */}
      <Link to={product.get_absolute_url} className="relative block w-full h-full">
        <img
          src={product.get_image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ borderRadius: '16px' }}
        />

        {/* Fade overlay to blend with background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, #FCE4F0 0%, transparent 30%, transparent 70%, #E8D5F5 100%)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }} />

        {/* Top and bottom fade */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, #FCE4F0 0%, transparent 20%, transparent 80%, #E8D5F5 100%)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }} />
      </Link>

      {/* Manual Arrows */}
      <button
        onClick={prev}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition hover:opacity-90 z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: '#D63384' }}>
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition hover:opacity-90 z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: '#D63384' }}>
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? '16px' : '6px',
              height: '6px',
              backgroundColor: i === current ? '#D63384' : 'rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const Home = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    document.title = "Joiey's Signature — Home"
    axios.get('https://joieyssignature.pythonanywhere.com/api/v1/latest-products/')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
  }, [])

  // Split products for left and right carousels
  const leftProducts = products.filter((_, i) => i % 2 === 0)
  const rightProducts = products.filter((_, i) => i % 2 !== 0)

  return (
    <div>
      {/* Hero Section */}
      <div className="relative flex items-center justify-center text-center px-6"
        style={{
          background: 'linear-gradient(135deg, #FCE4F0, #E8D5F5, #FDFAFF)',
          minHeight: '500px',
        }}>

        {/* Three column layout */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-4 items-center py-16">

          {/* Left Carousel */}
          <div style={{ height: '380px' }} className="hidden md:block">
            {leftProducts.length > 0 && (
              <ProductCarousel products={leftProducts} offset={0} />
            )}
          </div>

          {/* Center Hero Content */}
          <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center">
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: '#9B59B6' }}>
              Welcome to
            </p>
            <div style={{ fontFamily: 'Great Vibes, cursive', display: 'inline-block', position: 'relative', padding: '5px 10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #D63384, #9B59B6, #C8A96E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '5rem',
                lineHeight: '1.2',
                padding: '5px 8px',
              }}>Joiey's</div>
              <div style={{
                color: '#C8A96E',
                fontSize: '2rem',
                position: 'absolute',
                bottom: '0px',
                right: '-14px',
              }}>signature</div>
            </div>
            <p className="text-lg mb-8 mt-4" style={{ color: '#555' }}>
              Elevate your style with our exclusive fashion collections
            </p>
            <Link to="/shop"
              className="px-8 py-3 rounded-full text-white font-medium text-lg transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #D63384, #9B59B6)' }}>
              Shop Now
            </Link>
          </div>

          {/* Right Carousel */}
          <div style={{ height: '380px' }} className="hidden md:block">
            {rightProducts.length > 0 && (
              <ProductCarousel products={rightProducts} offset={1} />
            )}
          </div>

        </div>
      </div>

      {/* Latest Products Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#1a1a1a' }}>
          New Arrivals
        </h2>
        <p className="text-center mb-10" style={{ color: '#9B59B6' }}>
          Fresh styles just dropped
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={product.get_absolute_url} key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="overflow-hidden relative">
                <img src={product.get_thumbnail} alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
                {!product.is_in_stock && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <span className="text-white font-semibold px-4 py-2 rounded-full text-sm"
                      style={{ backgroundColor: '#ef4444' }}>
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                {product.color && (
                  <p className="text-sm mt-1" style={{ color: '#9B59B6' }}>
                    Color: {product.color}
                  </p>
                )}
                <p className="font-bold mt-2" style={{ color: '#C8A96E' }}>
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop"
            className="px-8 py-3 rounded-full font-medium border-2 transition hover:text-white"
            style={{ borderColor: '#C8A96E', color: '#C8A96E' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#C8A96E'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
            View All Products
          </Link>
        </div>
      </div>

      {/* Brand Values Section */}
      <div style={{ backgroundColor: '#1a1a1a' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold text-white mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-400">Every piece is carefully selected for quality and style</p>
          </div>
          <div>
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-semibold text-white mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-400">Quick and reliable delivery across Nigeria</p>
          </div>
          <div>
            <div className="text-3xl mb-3">💝</div>
            <h3 className="font-semibold text-white mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-400">Hassle-free returns within 7 days of purchase</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
