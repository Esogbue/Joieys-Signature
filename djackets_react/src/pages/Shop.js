import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const Shop = () => {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchAllProducts = (page = 1) => {
    setLoading(true)
    axios.get(`https://joieyssignature.pythonanywhere.com/api/v1/all-products/?page=${page}`)
      .then(res => {
        setProducts(res.data.results)
        setTotalCount(res.data.count)
        setTotalPages(Math.ceil(res.data.count / 12))
        setCurrentPage(page)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const fetchCategoryProducts = (categorySlug, page = 1) => {
    setLoading(true)
    axios.get(`https://joieyssignature.pythonanywhere.com/api/v1/products/${categorySlug}/?page=${page}`)
      .then(res => {
        setProducts(res.data.results)
        setTotalCount(res.data.count)
        setTotalPages(Math.ceil(res.data.count / 12))
        setCurrentPage(page)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    document.title = "Shop — Joiey's Signature"
    const params = new URLSearchParams(location.search)
    const urlSearch = params.get('search')
    if (urlSearch) setSearch(urlSearch)

    axios.get('https://joieyssignature.pythonanywhere.com/api/v1/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err))

    fetchAllProducts(1)
  }, [location.search])

  const handleCategoryClick = (categorySlug) => {
    if (activeCategory === categorySlug) return
    setCurrentPage(1)
    if (!categorySlug) {
      setActiveCategory(null)
      fetchAllProducts(1)
    } else {
      setActiveCategory(categorySlug)
      fetchCategoryProducts(categorySlug, 1)
    }
  }

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (activeCategory) {
      fetchCategoryProducts(activeCategory, page)
    } else {
      fetchAllProducts(page)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Our Collection</h1>
        <p style={{ color: '#9B59B6' }}>Find your perfect style</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-full border-2 outline-none"
          style={{ borderColor: '#C8A96E' }}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => handleCategoryClick(null)}
          className="px-5 py-2 rounded-full text-sm font-medium transition"
          style={{
            backgroundColor: activeCategory === null ? '#C8A96E' : 'transparent',
            color: activeCategory === null ? 'white' : '#C8A96E',
            border: '2px solid #C8A96E'
          }}>
          All
        </button>
        {categories.map(cat => {
          const slug = cat.get_absolute_url.replace(/\//g, '')
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(slug)}
              className="px-5 py-2 rounded-full text-sm font-medium transition"
              style={{
                backgroundColor: activeCategory === slug ? '#9B59B6' : 'transparent',
                color: activeCategory === slug ? 'white' : '#9B59B6',
                border: '2px solid #9B59B6'
              }}>
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Products Count */}
      {!loading && (
        <p className="text-center text-sm text-gray-400 mb-6">
          Showing {filtered.length} of {totalCount} products
          {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
        </p>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#9B59B6' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link
              to={product.get_absolute_url}
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="overflow-hidden relative">
                <img
                  src={product.get_thumbnail}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />
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
                  <p className="text-sm" style={{ color: '#9B59B6' }}>
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
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 mt-12">

          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full text-sm font-medium transition"
            style={{
              backgroundColor: currentPage === 1 ? '#f0f0f0' : 'transparent',
              color: currentPage === 1 ? '#ccc' : '#9B59B6',
              border: '2px solid',
              borderColor: currentPage === 1 ? '#f0f0f0' : '#9B59B6',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}>
            ← Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className="w-9 h-9 rounded-full text-sm font-medium transition"
              style={{
                backgroundColor: currentPage === page ? '#C8A96E' : 'transparent',
                color: currentPage === page ? 'white' : '#1a1a1a',
                border: '2px solid',
                borderColor: currentPage === page ? '#C8A96E' : '#E8D5F5',
              }}>
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full text-sm font-medium transition"
            style={{
              backgroundColor: currentPage === totalPages ? '#f0f0f0' : 'transparent',
              color: currentPage === totalPages ? '#ccc' : '#9B59B6',
              border: '2px solid',
              borderColor: currentPage === totalPages ? '#f0f0f0' : '#9B59B6',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Shop
