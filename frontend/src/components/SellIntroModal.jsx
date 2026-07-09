import SellIntroVideo from './SellIntroVideo'

export default function SellIntroModal({ onContinue, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Welcome to selling on Merkato 🎉
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            A quick look at how it works
          </p>
        </div>

        {/* Animated intro video */}
        <div className="aspect-video">
          <SellIntroVideo />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
          >
            Not now
          </button>
          <button
            onClick={onContinue}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Got it — start selling
          </button>
        </div>

      </div>
    </div>
  )
}