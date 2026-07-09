export default function SellerTermsModal({ onAgree, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Before you sell</h2>
          <p className="text-xs text-gray-400 mt-0.5">Seller rules on Merkato</p>
        </div>

        <div className="px-6 py-4 text-sm text-gray-600 space-y-3">
          <p className="font-medium text-gray-900">These items are not allowed:</p>
          <ul className="space-y-2">
            <li className="flex gap-2">🚫 <span>Guns, ammunition, or any weapons</span></li>
            <li className="flex gap-2">🚫 <span>Alcohol, tobacco, drugs, or vape products</span></li>
            <li className="flex gap-2">🚫 <span>Anything dangerous or that can cause harm</span></li>
            <li className="flex gap-2">🚫 <span>Stolen, counterfeit, or illegal items</span></li>
            <li className="flex gap-2">🚫 <span>Recalled or unsafe products</span></li>
          </ul>
          <p className="text-xs text-gray-400 pt-2">
            Listings that break these rules will be removed and may lead to
            account suspension.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onAgree}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
          >
            I agree — continue
          </button>
        </div>

      </div>
    </div>
  )
}