import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HERO_IMAGES = ['/hero1.png', '/hero2.png']

export default function Home() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <div className="relative flex-1 min-h-screen overflow-hidden">

        {/* Rotating background images — desktop/tablet only */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className={`hidden md:block absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}

        {/* Mobile-only gradient background */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-700" />

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <h1 className="text-2xl font-bold text-orange-400">Merkato</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-white/90 hover:text-white text-sm font-medium px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              Get started
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-24 md:pt-36 pb-32">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Buy and sell anything,
            <span className="text-orange-300"> right in your community</span>
          </h2>
          <p className="text-white/90 text-lg mt-6 max-w-xl mx-auto drop-shadow">
            Merkato is your local marketplace. List an item in seconds, find
            deals near you, and connect directly with buyers and sellers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition"
            >
              Start selling
            </Link>
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition backdrop-blur"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* About section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Merkato works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📸</div>
              <h4 className="font-bold text-gray-900 mb-2">List it</h4>
              <p className="text-gray-500 text-sm">
                Snap a photo, set your price, and post your item in under a
                minute.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="font-bold text-gray-900 mb-2">Connect</h4>
              <p className="text-gray-500 text-sm">
                Chat with buyers and sellers directly to ask questions and
                make offers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="font-bold text-gray-900 mb-2">Deal done</h4>
              <p className="text-gray-500 text-sm">
                Meet up locally or ship it — sell safely and get paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} Merkato. Buy and sell anything.
      </footer>

    </div>
  )
}