// Props:
//   transaction — { amount, category, date, note }
//   onConfirm   — () => void
//   onCancel    — () => void
export default function ConfirmDialog({ transaction, onConfirm, onCancel }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm transaction"
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <div className="bg-bg-surface rounded-card p-8 w-80 flex flex-col gap-4">
        <h2 className="text-h2 font-bold">Confirm Transaction</h2>
        <p><span className="text-text-muted">Amount: </span>RM {transaction?.amount}</p>
        <p><span className="text-text-muted">Category: </span>{transaction?.category}</p>
        <p><span className="text-text-muted">Date: </span>{transaction?.date}</p>
        {transaction?.note && <p><span className="text-text-muted">Note: </span>{transaction.note}</p>}
        <div className="flex gap-3 mt-2">
          <button onClick={onConfirm} className="flex-1 bg-save-green rounded-btn py-3 font-semibold">
            Confirm
          </button>
          <button onClick={onCancel} className="flex-1 bg-cancel-red rounded-btn py-3 font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
