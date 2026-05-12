import { CATEGORIES } from '@/data/categories'

// Props:
//   category — string — category id (matched against CATEGORIES list)
//
// TODO: Coloured pill displaying the category name. Uses the color defined in
// the CATEGORIES data. Suitable for inline use in summary and transaction views.
export default function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.id === category)
  const color = cat?.color ?? '#888'
  const label = cat?.label ?? category

  return (
    <span
      aria-label={`Category: ${label}`}
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}
