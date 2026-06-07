// import { BarChart3, FileText, History, Home, Mic } from 'lucide-react'
// import { NavLink } from 'react-router-dom'

// export default function Navbar() {
//   const navItems = [
//     { name: 'Home', path: '/home', icon: Home },
//     { name: 'Voice', path: '/log', icon: Mic },
//     { name: 'History', path: '/history', icon: History },
//     { name: 'Budget', path: '/budget', icon: BarChart3 },
//     { name: 'OCR', path: '/extract', icon: FileText },
//   ]

//   return (
//     <nav
//       className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 pb-safe"
//       aria-label="Main navigation"
//     >
//       <ul className="flex justify-between items-center px-2 py-3 max-w-lg mx-auto">
//         {navItems.map((item) => {
//           const Icon = item.icon
//           return (
//             <li key={item.name} className="flex-1">
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-teal-300 ${
//                     isActive
//                       ? 'text-teal-400 font-bold bg-gray-800'
//                       : 'text-gray-400 font-medium hover:text-gray-200'
//                   }`
//                 }
//                 aria-label={`Navigate to ${item.name}`}
//               >
//                 <Icon className="h-6 w-6" aria-hidden="true" />
//                 <span className="text-xs tracking-wide">{item.name}</span>
//               </NavLink>
//             </li>
//           )
//         })}
//       </ul>
//     </nav>
//   )
// }
