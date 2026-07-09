import SellerTermsModal from '../components/SellerTermsModal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock data — replaced by the real API later
const MOCK_LISTINGS = [
  { id: '1', title: 'iPhone 13 Pro - 256GB, unlocked', price: 550, category: 'electronics', condition: 'used', seller_name: 'Sara A.', zip: '17601' },
  { id: '2', title: 'IKEA desk, like new', price: 45, category: 'furniture', condition: 'like new', seller_name: 'Dawit T.', zip: '17603' },
  { id: '3', title: 'Adjustable dumbbells 5-50lb', price: 120, category: 'sports', condition: 'used', seller_name: 'Mike R.', zip: '17602' },
  { id: '4', title: 'PS5 with 2 controllers', price: 380, category: 'electronics', condition: 'used', seller_name: 'Amina H.', zip: '17601' },
  { id: '5', title: 'Dining table + 4 chairs', price: 200, category: 'furniture', condition: 'used', seller_name: 'Yonas B.', zip: '17603' },
  { id: '6', title: 'Trek mountain bike', price: 275, category: 'sports', condition: 'good', seller_name: 'Liya M.', zip: '17545' },
  { id: '7', title: 'Habesha kemis, handwoven', price: 150, category: 'clothing', condition: 'new', seller_name: 'Selam G.', zip: '17601' },
  { id: '8', title: 'MacBook Air M2, barely used', price: 780, category: 'electronics', condition: 'like new', seller_name: 'Kofi O.', zip: '17603' },
]

const CATEGORIES = ['all', 'electronics', 'furniture', 'clothing', 'sports', 'vehicles', 'home', 'other']

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSellIntro, setShowSellIntro] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(stored))
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function handleSellClick() {
 // const seen = localStorage.getItem('merkato_seen_sell_intro')
  //if (!seen) {
  setShowSellIntro(true)
  //} else {
   // navigate('/sell')
 // }
}

function handleIntroContinue() {
  localStorage.setItem('merkato_seen_sell_intro', 'true')
  setShowSellIntro(false)
  navigate('/sell')
}

  const filtered = MOCK_LISTINGS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || item.category === category
    return matchesSearch && matchesCategory
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <img src="/logo.png" alt="Merkato" className="h-10" />

        {/* Search — center, grows on desktop */}
        <div className="flex-1 max-w-xl mx-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Merkato..."
            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-gray-300 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleSellClick} className="hidden sm:block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
            + Sell
          </button>

          {/* Avatar menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center hover:ring-2 hover:ring-orange-300 transition"
            >
              {user.first_name?.[0]}{user.last_name?.[0]}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 text-sm">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user.full_name}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                  My listings
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">

        {/* Greeting */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Hi {user.first_name} 👋
          </h2>
          <p className="text-sm text-gray-500">Today's picks near {user.zip_code}</p>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:border-orange-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-5xl">
                  📦
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-900">${item.price}</p>
                  <p className="text-sm text-gray-700 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.seller_name} · {item.zip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Mobile: floating Sell button */}
      <button className="sm:hidden fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full h-14 w-14 shadow-lg text-2xl z-20">
        +
      </button>

     {showSellIntro && (
        <SellerTermsModal
          onAgree={handleIntroContinue}
          onClose={() => setShowSellIntro(false)}
        />
      )}

    </div>
  )
}