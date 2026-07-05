import { useState, useRef } from 'react'

export default function TermsModal({ onAgree, onClose }) {
  const [reachedBottom, setReachedBottom] = useState(false)
  const scrollRef = useRef(null)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    // small buffer so it triggers reliably on all screens
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
    if (atBottom) setReachedBottom(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Terms of Service & Privacy Policy
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Scroll to the bottom to continue
          </p>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-600 space-y-4 leading-relaxed"
        >
          <h3 className="font-semibold text-gray-900">1. Acceptance of Terms</h3>
          <p>
            By creating an account on Merkato, you agree to these Terms of
            Service and the Privacy Policy below. If you do not agree, please
            do not use the platform.
          </p>

          <h3 className="font-semibold text-gray-900">2. Your Account</h3>
          <p>
            You are responsible for the accuracy of the information you
            provide and for keeping your password secure. You must be at
            least 18 years old to use Merkato.
          </p>

          <h3 className="font-semibold text-gray-900">3. Listings and Transactions</h3>
          <p>
            Sellers are responsible for the accuracy of their listings.
            Buyers and sellers transact at their own discretion. Items that
            are illegal, counterfeit, or unsafe may not be listed and will be
            removed.
          </p>

          <h3 className="font-semibold text-gray-900">4. Prohibited Conduct</h3>
          <p>
            You may not use Merkato to harass others, post fraudulent
            listings, attempt to scam users, or violate any applicable law.
            Violations may result in account suspension or removal.
          </p>

          <h3 className="font-semibold text-gray-900">5. Limitation of Liability</h3>
          <p>
            Merkato provides the platform "as is" and is not a party to
            transactions between buyers and sellers. We are not liable for
            disputes, losses, or damages arising from user transactions.
          </p>

          <h3 className="font-semibold text-gray-900">6. Privacy — What We Collect</h3>
          <p>
            When you register we collect your name, email address, zip code,
            and optionally your phone number. We also store listings you post
            and messages you send.
          </p>

          <h3 className="font-semibold text-gray-900">7. Privacy — How We Use It</h3>
          <p>
            Your information is used to operate your account, show listings
            near you, and connect buyers with sellers. We do not sell your
            personal information to third parties.
          </p>

          <h3 className="font-semibold text-gray-900">8. Privacy — What Others See</h3>
          <p>
            Your first name and general area are visible on your listings.
            Your email, exact address, and phone number are never shown
            publicly.
          </p>

          <h3 className="font-semibold text-gray-900">9. Changes</h3>
          <p>
            We may update these terms from time to time. Continued use of
            Merkato after changes means you accept the updated terms.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onAgree}
            disabled={!reachedBottom}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {reachedBottom ? 'I Agree' : 'Scroll to the bottom'}
          </button>
        </div>

      </div>
    </div>
  )
}