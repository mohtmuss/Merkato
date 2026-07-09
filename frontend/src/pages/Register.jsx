import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TermsModal from '../components/TermsModal'

function passwordStrength(password) {
  if (!password) return { score: 0, label: '', color: '', width: '0%' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: '33%' }
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-600', width: '66%' }
  return { score, label: 'Strong', color: 'bg-green-500', text: 'text-green-600', width: '100%' }
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    zip_code: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const strength = passwordStrength(form.password)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }
    if (!/^\d{5}$/.test(form.zip_code)) {
      setError('Zip code must be 5 digits')
      return
    }

    setLoading(true)
    try {
      const { confirm_password, ...payload } = form
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      navigate('/verify', { state: { email: form.email } })

    } catch (err) {
      setError('Cannot reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        <div className="mb-8 text-center">
          <Link to="/">
            <img src="/logo.png" alt="Merkato" className="h-20 mx-auto" />
          </Link>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Mohamed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Mussa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className={inputClass}
              placeholder="At least 8 characters"
            />

            {/* Strength meter */}
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className={`text-xs mt-1 font-medium ${strength.text}`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Repeat your password"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip code
              </label>
              <input
                type="text"
                name="zip_code"
                value={form.zip_code}
                onChange={handleChange}
                required
                inputMode="numeric"
                maxLength={5}
                className={inputClass}
                placeholder="17603"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="(717) 555-1234"
              />
            </div>
          </div>

          {/* Terms agreement */}
          <div
            onClick={() => !agreed && setShowTerms(true)}
            className="flex items-start gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={agreed}
              readOnly
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 pointer-events-none"
            />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <span className="text-orange-500 hover:underline">
                Terms of Service and Privacy Policy
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>

        {showTerms && (
          <TermsModal
            onAgree={() => {
              setAgreed(true)
              setShowTerms(false)
            }}
            onClose={() => setShowTerms(false)}
          />
        )}

      </div>
    </div>
  )
}