// Props: category (string), spent (number), limit (number)
export default function BudgetBar({ category, spent, limit }) {
  const pct = Math.min((spent / limit) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-caption mb-1">
        <span className="text-text-primary">{category}</span>
        <span className="text-text-muted">RM {spent} / RM {limit}</span>
      </div>
      <div className="w-full bg-bg-card rounded-pill h-2">
        <div
          role="progressbar"
          aria-label={`${category} budget`}
          aria-valuenow={spent}
          aria-valuemin={0}
          aria-valuemax={limit}
          className={`h-2 rounded-pill transition-all ${pct >= 80 ? 'bg-cancel-red' : 'bg-cyan'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
