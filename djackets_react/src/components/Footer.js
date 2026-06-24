import { Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a' }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'Great Vibes, cursive', display: 'inline-block', position: 'relative', padding: '5px 60px 5px 10px' }}>
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
              bottom: '6px',
              right: '49px',
            }}>signature</div>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Elevate your style with our exclusive fashion collections. Quality pieces for the modern man & woman.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition">Home</Link>
            <Link to="/shop" className="text-gray-400 text-sm hover:text-white transition">Shop</Link>
            <Link to="/cart" className="text-gray-400 text-sm hover:text-white transition">Cart</Link>
            <Link to="/login" className="text-gray-400 text-sm hover:text-white transition">Login / Sign Up</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition">Terms & Privacy</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <div className="flex flex-col gap-2 text-gray-400 text-sm">
            <p>📍 Abuja, Nigeria</p>
            <p>📞 +234 902 298 0319</p>
            <p>✉️ Shopwithjoieysng@gmail.com</p>
            <div className="flex gap-4 mt-3">
              <a href="https://instagram.com/joieys_signature" target="_blank" rel="noreferrer"
                className="transition hover:opacity-70"
                style={{ color: '#E1306C' }}>
                <FaInstagram size={24} />
              </a>
              <a href="https://wa.me/2349022980319" target="_blank" rel="noreferrer"
                className="transition hover:opacity-70"
                style={{ color: '#25D366' }}>
                <FaWhatsapp size={24} />
              </a>
              <a href="https://tiktok.com/@joieys_signature" target="_blank" rel="noreferrer"
                className="transition hover:opacity-70"
                style={{ color: '#ffffff' }}>
                <FaTiktok size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Joiey's Signature. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
