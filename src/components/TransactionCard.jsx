import { Utensils, Car, Cross, Coffee, HelpCircle } from 'lucide-react'

const CATEGORY_CONFIG = {
  Food:      { Icon: Utensils,   bg: 'bg-cat-food'      },
  Transport: { Icon: Car,        bg: 'bg-cat-transport'  },
  Health:    { Icon: Cross,      bg: 'bg-cat-health'     },
  Coffee:    { Icon: Coffee,     bg: 'bg-cat-coffee'     },
  Others:    { Icon: HelpCircle, bg: 'bg-cat-others'     },
}

// Props: { id, name, category, amount, time, date }
export default function TransactionCard({ name, category, amount, time }) {
  const { Icon, bg } = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.Others

  return (
    <div className="bg-bg-surface rounded-card px-4 py-3 mb-2 flex items-center gap-3">
      <span className={`${bg} w-10 h-10 rounded-icon flex items-center justify-center shrink-0`}>
        <Icon size={18} className="text-white" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-text-primary truncate">{name}</p>
        <p className="text-caption text-text-muted">{category} • {time}</p>
      </div>

      <span className="text-cancel-red font-bold text-amount-sm shrink-0">
        -RM {amount.toFixed(2)}
      </span>
    </div>
  )
}
