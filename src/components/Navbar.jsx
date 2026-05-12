import { Link } from 'react-router-dom'

// No props.
// TODO: Horizontal navigation bar with the VocaFin app name and links to all
// main routes. Should be fully keyboard and screen-reader accessible.
export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="w-full bg-surface flex items-center justify-between px-6 py-4"
    >
      <span className="text-accent font-bold text-xl">VocaFin</span>
      <ul className="flex gap-4 text-sm" role="list">
        <li><Link to="/"        className="hover:text-accent focus:text-accent">Home</Link></li>
        <li><Link to="/budget"  className="hover:text-accent focus:text-accent">Budget</Link></li>
        <li><Link to="/history" className="hover:text-accent focus:text-accent">History</Link></li>
        <li><Link to="/summary" className="hover:text-accent focus:text-accent">Summary</Link></li>
      </ul>
    </nav>
  )
}
