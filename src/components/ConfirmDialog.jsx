// Props:
//   transaction — { amount, category, date, note } — parsed transaction to confirm
//   onConfirm   — () => void — called when user confirms; should save to store
//   onCancel    — () => void — called when user cancels; should discard and go back
//
// TODO: Modal-style card overlaid on the screen. Display all transaction fields
// clearly. Two prominent action buttons (Confirm / Cancel). Trap focus inside
// the dialog while open. aria-modal="true", role="dialog".
export default function ConfirmDialog({ transaction, onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm transaction"
      className="fixed inset-0 flex items-center justify-center bg-black/60"
    >
      <div className="bg-surface rounded-2xl p-8 w-80 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Confirm Transaction</h2>
        <p><span className="text-gray-400">Amount:</span> RM {transaction?.amount}</p>
        <p><span className="text-gray-400">Category:</span> {transaction?.category}</p>
        <p><span className="text-gray-400">Date:</span> {transaction?.date}</p>
        {transaction?.note && <p><span className="text-gray-400">Note:</span> {transaction.note}</p>}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-accent rounded-xl py-3 font-semibold hover:opacity-90"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-brand border border-surface rounded-xl py-3 font-semibold hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
