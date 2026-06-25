import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.new_password || !form.confirm_password) {
      setError('Please fill in all fields')
      return
    }
    if (form.new_password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }
    if (form.new_password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      await axios.post('https://joieyssignature.pythonanywhere.com/api/v1/reset-password/', {
        uid,
        token,
        new_password: form.new_password,
      })
      alert('Password reset successful! Please login with your new password.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Reset link is invalid or expired.')
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

        <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#1a1a1a' }}>
          Reset Your Password
        </h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter your new password below
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={form.new_password}
            onChange={e => setForm({ ...form, new_password: e.target.value })}
            className="px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8D5F5' }}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={form.confirm_password}
            onChange={e => setForm({ ...form, confirm_password: e.target.value })}
            className="px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8D5F5' }}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-full text-white font-semibold text-lg mt-6 transition hover:opacity-90"
          style={{
            background: loading ? '#ccc' : 'linear-gradient(135deg, #D63384, #9B59B6)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword
