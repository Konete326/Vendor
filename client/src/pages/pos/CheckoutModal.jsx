import { UserIcon } from '@heroicons/react/24/outline'

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  customerName,
  setCustomerName,
  paymentMethod,
  setPaymentMethod,
  receivedAmount,
  setReceivedAmount,
  cartTotal,
  dueAmount,
  submitting,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-app-panel border border-app-border rounded-xl max-w-sm w-full p-6 space-y-4">
        <h2 className="text-lg font-bold text-app-text flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-teal-500" /> Checkout Details
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-app-text-secondary">Customer Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Ali Ahmed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-app-text-secondary">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Partial">Partial / Udhaar</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-app-text-secondary">Amount Received</label>
            <input
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(Number(e.target.value))}
              className="w-full bg-app-bg border border-app-input-border text-app-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0"
            />
          </div>
          <div className="border-t border-app-border pt-3 space-y-1 text-sm font-semibold">
            <div className="flex justify-between text-app-text-secondary">
              <span>Total Amount:</span>
              <span>Rs. {cartTotal}</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>Due Amount:</span>
              <span>Rs. {dueAmount}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-muted rounded-lg text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold cursor-pointer"
            >
              {submitting ? 'Placing Order...' : 'Submit Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
