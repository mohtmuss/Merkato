import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

export default function Verify() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const inputsRef = useRef([])

  // No email in state means they landed here directly — send them back
  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  function handleChange(i, value) {
    if (!/^\d?$/.test(value)) return // digits only, one per box
    const next = [...digits]
    next[i] = value
    setDigits(next)
    // Auto-advance to the next box
    if (value && i < 5) inputsRef.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    // Backspace on an empty box jumps back
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(next)
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')

    } catch {
      setError('Cannot reach the server')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setResent(false)
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResent(true)
      setDigits(['', '', '', '', '', ''])
      inputsRef.current[0]?.focus()
    } catch {
      setError('Cannot reach the server')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        <div className="mb-8 text-center">
          <Link to="/">
            <img src="/logo.png" alt="Merkato" className="h-20 mx-auto" />
          </Link>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Check your email</h2>
          <p className="text-gray-500 mt-1 text-sm">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {resent && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
            A new code has been sent
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 text-sm transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn't get a code?{' '}
          <button onClick={handleResend} className="text-orange-500 font-medium hover:underline">
            Resend
          </button>
        </p>

      </div>
    </div>
  )
}