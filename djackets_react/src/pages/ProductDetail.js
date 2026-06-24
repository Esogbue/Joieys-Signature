import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProductDetail = () => {
  const { categorySlug, productSlug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/products/${categorySlug}/${productSlug}/`)
      .then(res => {
        setProduct(res.data)
        document.title = `${res.data.name} — Joiey's Signature`
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        navigate('/shop')
      })
  }, [categorySlug, productSlug, navigate])

  const addToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const chosenSize = selectedSize?.size || product.size

    const existing = cart.find(item => item.id === product.id && item.size === chosenSize)

    if (existing) {
      const maxStock = selectedSize ? selectedSize.stock : product.stock
      existing.quantity = Math.min(existing.quantity + quantity, maxStock)
    } else {
      cart.push({
        ...product,
        quantity,
        size: chosenSize
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    setAdded(true)
    setSizeError(false)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="text-center py-32" style={{ color: '#9B59B6' }}>Loading...</div>
  )

  if (!product) return null

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img src={product.get_image} alt={product.name}
            className="w-full h-full object-cover" />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: '#9B59B6' }}>
            Joiey's Collection
          </p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
            {product.name}
          </h1>
          <p className="text-2xl font-bold mb-4" style={{ color: '#C8A96E' }}>
            ₦{Number(product.price).toLocaleString()}
          </p>

          {product.description && (
            <p className="text-gray-500 mb-6">{product.description}</p>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 ? (
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Select Size {sizeError && (
                  <span className="text-red-400 text-xs ml-2">— Please select a size</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sizeOption => (
                  <button
                    key={sizeOption.id}
                    onClick={() => {
                      if (sizeOption.is_available) {
                        setSelectedSize(sizeOption)
                        setSizeError(false)
                        setQuantity(1)
                      }
                    }}
                    disabled={!sizeOption.is_available}
                    className="w-12 h-12 rounded-xl text-sm font-semibold border-2 transition"
                    style={{
                      borderColor: selectedSize?.id === sizeOption.id ? '#D63384' : '#E8D5F5',
                      backgroundColor: selectedSize?.id === sizeOption.id ? '#FCE4F0' : 'white',
                      color: !sizeOption.is_available ? '#ccc' : selectedSize?.id === sizeOption.id ? '#D63384' : '#1a1a1a',
                      cursor: !sizeOption.is_available ? 'not-allowed' : 'pointer',
                      textDecoration: !sizeOption.is_available ? 'line-through' : 'none',
                    }}>
                    {sizeOption.size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-xs text-gray-400 mt-2">
                  {selectedSize.stock} items available in size {selectedSize.size}
                </p>
              )}
            </div>
          ) : (
            <div className="flex gap-3 mb-6 text-sm">
              <span className="px-3 py-1 rounded-full border"
                style={{ borderColor: '#E8D5F5', color: '#9B59B6' }}>
                Size: {product.size}
              </span>
              {product.color && (
                <span className="px-3 py-1 rounded-full border"
                  style={{ borderColor: '#E8D5F5', color: '#9B59B6' }}>
                  Color: {product.color}
                </span>
              )}
            </div>
          )}

          {/* Stock */}
          {product.is_in_stock ? (
            <p className="text-green-500 text-sm mb-4">✓ In Stock</p>
          ) : (
            <p className="text-red-400 text-sm mb-4">✗ Out of Stock</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-500">Quantity:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-lg"
                style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>−</button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button onClick={() => {
                const maxStock = selectedSize ? selectedSize.stock : product.stock
                setQuantity(q => Math.min(q + 1, maxStock))
              }}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-lg"
                style={{ borderColor: '#C8A96E', color: '#C8A96E' }}>+</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button onClick={addToCart} disabled={!product.is_in_stock}
            className="w-full py-4 rounded-full text-white font-semibold text-lg transition"
            style={{
              background: product.is_in_stock
                ? 'linear-gradient(135deg, #D63384, #9B59B6)'
                : '#ccc',
              cursor: product.is_in_stock ? 'pointer' : 'not-allowed'
            }}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
