import SellerTermsModal from '../components/SellerTermsModal'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const CATEGORIES = ['electronics', 'furniture', 'clothing', 'sports', 'vehicles', 'home', 'other']
const CONDITIONS = ['new', 'like new', 'good', 'used', 'for parts']
const MAX_PHOTOS = 5

export default function Sell() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    price: '',
    zip_code: JSON.parse(localStorage.getItem('user') || '{}').zip_code || '',
    condition: 'used',
    fulfillment: 'pickup',
    category: '',
    description: '',
  })
  const [photos, setPhotos] = useState([]) // [{ file, preview }]
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files)
    const room = MAX_PHOTOS - photos.length
    const accepted = files.slice(0, room).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos([...photos, ...accepted])
    e.target.value = '' // allow re-picking the same file
  }

  function removePhoto(i) {
    URL.revokeObjectURL(photos[i].preview)
    setPhotos(photos.filter((_, idx) => idx !== i))
  }

  function movePhoto(i, dir) {
    const j = i + dir
    if (j < 0 || j >= photos.length) return
    const next = [...photos]
    ;[next[i], next[j]] = [next[j], next[i]]
    setPhotos(next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.category) return setError('Pick a category')
    if (photos.length === 0) return setError('Add at least one photo')
    if (!/^\d{5}$/.test(form.zip_code)) return setError('Zip code must be 5 digits')
    if (Number(form.price) <= 0) return setError('Enter a valid price')

    // TODO: send to backend API (next step)
    console.log('LISTING TO SUBMIT:', form, photos)
    alert('Listing ready! (Backend wiring is our next step)')
    navigate('/dashboard')
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-800 text-xl">←</Link>
        <img src="/logo.png" alt="Merkato" className="h-8" />
        <span className="font-semibold text-gray-800">Create listing</span>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos <span className="text-gray-400">({photos.length}/{MAX_PHOTOS} — first photo is your cover)</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={p.preview} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />

                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      COVER
                    </span>
                  )}

                  {/* Controls */}
                  <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                    <button type="button" onClick={() => movePhoto(i, -1)}
                      className="bg-black/50 text-white text-xs h-6 w-6 rounded disabled:opacity-30"
                      disabled={i === 0}>‹</button>
                    <button type="button" onClick={() => removePhoto(i)}
                      className="bg-black/50 text-white text-xs h-6 w-6 rounded">✕</button>
                    <button type="button" onClick={() => movePhoto(i, 1)}
                      className="bg-black/50 text-white text-xs h-6 w-6 rounded disabled:opacity-30"
                      disabled={i === photos.length - 1}>›</button>
                  </div>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-orange-500 transition">
                  <span className="text-2xl">+</span>
                  <span className="text-xs">Add photo</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What are you selling?</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              required maxLength={80} className={inputClass} placeholder="e.g. iPhone 13 Pro 256GB" />
          </div>

          {/* Price + Zip */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                required min="0" step="0.01" className={inputClass} placeholder="120" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (zip)</label>
              <input type="text" name="zip_code" value={form.zip_code} onChange={handleChange}
                required inputMode="numeric" maxLength={5} className={inputClass} placeholder="17603" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                    form.category === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:border-orange-400'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange} className={inputClass}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Fulfillment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How will the buyer get it?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'pickup', label: '🤝 Pickup' },
                { value: 'delivery', label: '📦 Delivery' },
                { value: 'both', label: '✨ Both' },
              ].map((opt) => (
                <button key={opt.value} type="button"
                  onClick={() => setForm({ ...form, fulfillment: opt.value })}
                  className={`py-2.5 rounded-lg text-sm font-medium transition border ${
                    form.fulfillment === opt.value
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-orange-400'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} maxLength={500} className={inputClass}
              placeholder="Details buyers should know — size, age, flaws, reason for selling..." />
          </div>

          <button type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-3 text-sm transition">
            Post listing
          </button>
        </form>
      </main>
    </div>
  )
}