import { CATEGORIES } from '@/data/categories'

// Props: category (string) — category id matched against CATEGORIES list
export default function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.id === category)
  const color = cat?.color ?? '#888888'
  const label = cat?.label ?? category

  return (
    <span
      aria-label={`Category: ${label}`}
      className="inline-block px-3 py-1 rounded-pill text-caption font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}
