// Props:
//   category — string — category label to display
//   spent    — number — amount spent so far in RM
//   limit    — number — monthly limit in RM for this category
//
// TODO: Labelled progress bar showing spent / limit. Bar turns accent colour
// when over 80% used. Accessible: use role="progressbar" with aria-valuenow,
// aria-valuemin, aria-valuemax, aria-label.
export default function BudgetBar({ category, spent, limit }) {
  const pct = Math.min((spent / limit) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>{category}</span>
        <span>RM {spent} / RM {limit}</span>
      </div>
      <div className="w-full bg-brand rounded-full h-3" aria-hidden="true">
        <div
          role="progressbar"
          aria-label={`${category} budget`}
          aria-valuenow={spent}
          aria-valuemin={0}
          aria-valuemax={limit}
          className={`h-3 rounded-full transition-all ${pct >= 80 ? 'bg-accent' : 'bg-green-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
