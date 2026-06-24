import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const Login = ({ signup }) => {
  const [isLogin, setIsLogin] = useState(!signup)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    re_password: '',
  })

  useEffect(() => {
    document.title = isLogin ? "Login — Joiey's Signature" : "Sign Up — Joiey's Signature"
  }, [isLogin])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/login/', {
          email: form.email,
          password: form.password,
        })
        localStorage.setItem('token', res.data.auth_token)
        localStorage.setItem('email', form.email)
        localStorage.setItem('username', form.email.split('@')[0])
        navigate('/')
      } else {
        if (form.password !== form.re_password) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        await axios.post('http://127.0.0.1:8000/api/v1/register/', {
          username: form.email.split('@')[0],
          email: form.email,
          password: form.password,
          re_password: form.re_password,
        })
        setIsLogin(true)
        setError('')
        alert('Account created! Please log in.')
      }
    } catch (err) {
      setError('Invalid credentials or account already exists.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #FCE4F0, #E8D5F5, #FDFAFF)' }}>

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center w-full flex justify-center">
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
        <p className="text-center text-sm mb-8" style={{ color: '#9B59B6' }}>
          {isLogin ? 'Welcome back! Please login.' : 'Create your account to get started.'}
        </p>

        {/* Toggle */}
        <div className="flex rounded-full overflow-hidden border mb-6"
          style={{ borderColor: '#E8D5F5' }}>
          <button
            onClick={() => setIsLogin(true)}
            className="flex-1 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: isLogin ? '#C8A96E' : 'transparent',
              color: isLogin ? 'white' : '#9B59B6'
            }}>
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="flex-1 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: !isLogin ? '#C8A96E' : 'transparent',
              color: !isLogin ? 'white' : '#9B59B6'
            }}>
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <input name="email" type="email" placeholder="Email Address"
            value={form.email} onChange={handleChange}
            className="px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8D5F5' }}
          />
          <input name="password" type="password" placeholder="Password"
            value={form.password} onChange={handleChange}
            className="px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8D5F5' }}
          />

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs" style={{ color: '#9B59B6' }}>
                Forgot Password?
              </Link>
            </div>
          )}

          {!isLogin && (
            <input name="re_password" type="password" placeholder="Confirm Password"
              value={form.re_password} onChange={handleChange}
              className="px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: '#E8D5F5' }}
            />
          )}
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-full text-white font-semibold text-lg mt-6 transition hover:opacity-90"
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #D63384, #9B59B6)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}

export default Login
