import { Home, Mic, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Props: activePage — 'hub' | 'voice' | 'history'
export default function Navbar({ activePage }) {
  const navigate = useNavigate()

  const items = [
    { id: 'hub',     label: 'Hub',     Icon: Home,    path: '/'        },
    { id: 'voice',   label: 'Voice',   Icon: Mic,     path: '/log'     },
    { id: 'history', label: 'History', Icon: History, path: '/history' },
  ]

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto
                 bg-bg-surface border-t border-white/10 h-20
                 flex items-center justify-around z-50"
    >
      {items.map(({ id, label, Icon, path }) => {
        const active = activePage === id
        return (
          <button
            key={id}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className="flex flex-col items-center flex-1"
          >
            <Icon size={40} className={active ? 'text-cyan' : 'text-text-muted'} />
            <span className={`text-[15px] ${active ? 'text-cyan' : 'text-text-muted'}`}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
