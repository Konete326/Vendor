import { NavLink, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  BoltIcon,
  FolderOpenIcon,
  ArchiveBoxIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/bikes/category', label: 'Bikes Category', icon: WrenchScrewdriverIcon },
  { to: '/bikes/raw-material', label: 'Materials Config', icon: FolderOpenIcon },
  { to: '/bikes/raw-material-inventory', label: 'Stock Control', icon: CubeIcon },
  { to: '/bikes/assemble', label: 'New Assembly', icon: BoltIcon },
  { to: '/bikes/assemble-history', label: 'Ready to Sale', icon: ArchiveBoxIcon },
  { to: '/pos', label: 'POS (Quick Sale)', icon: ShoppingCartIcon },
  { to: '/sales-history', label: 'Sales Records', icon: ClipboardDocumentListIcon },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-app-panel border-r border-app-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-teal-500 dark:text-teal-400">MA Vendor Admin</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-app-muted text-teal-500 dark:text-teal-400'
                  : 'text-app-text-secondary hover:text-app-text hover:bg-app-muted/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-app-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name
              ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
              : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-app-text truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-app-text-secondary truncate">{user?.role || 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-app-text-secondary hover:text-app-text hover:bg-app-muted/50 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
