import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    setError('')

    try {
      await axios.post('http://127.0.0.1:8000/api/v1/forgot-password/', { email })
      setSent(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #FCE4F0, #E8D5F5, #FDFAFF)' }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center w-full flex justify-center mb-6">
          <div style={{ fontFamily: 'Great Vibes, cursive', display: 'inline-block', position: 'relative', padding: '15px 80px 15px 30px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #D63384, #9B59B6, #C8A96E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '3.5rem',
              lineHeight: '1.2',
              padding: '5px 8px',
            }}>Joiey's</div>
            <div style={{
              color: '#C8A96E',
              fontSize: '1.5rem',
              position: 'absolute',
              bottom: '10px',
              right: '62px',
            }}>signature</div>
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Check your email!</h2>
            <p className="text-sm text-gray-500 mb-6">
              We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <Link to="/login"
              className="text-sm"
              style={{ color: '#9B59B6' }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1a1a1a' }}>
              Forgot Password?
            </h2>
            <p className="text-sm text-center text-gray-400 mb-6">
              Enter your email and we'll send you a reset link
            </p>

            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none mb-4"
              style={{ borderColor: '#E8D5F5' }}
            />

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-full text-white font-semibold text-lg transition hover:opacity-90"
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #D63384, #9B59B6)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm" style={{ color: '#9B59B6' }}>
                ← Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
