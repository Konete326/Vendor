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
  ChevronLeftIcon,
  ChevronRightIcon,
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

export default function Sidebar({ isCollapsed, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className={`fixed left-0 top-0 h-full bg-app-panel border-r border-app-border flex flex-col transition-all duration-300 z-10 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo / Header */}
      <div className={`flex items-center justify-between p-4 border-b border-app-border ${isCollapsed ? 'flex-col gap-2 p-2' : ''}`}>
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-teal-500 dark:text-teal-400 truncate">
            MA Vendor Admin
          </h1>
        )}
        {isCollapsed && (
          <span className="text-lg font-bold text-teal-500 dark:text-teal-400">
            MA
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg bg-app-muted text-app-text-secondary hover:text-app-text hover:bg-app-border transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 space-y-1 overflow-y-auto ${isCollapsed ? 'px-1' : 'px-4'}`}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-all duration-200 ${
                isCollapsed
                  ? `justify-center w-10 h-10 mx-auto ${
                      isActive
                        ? 'bg-app-muted text-teal-500 dark:text-teal-400'
                        : 'text-app-text-secondary hover:text-app-text hover:bg-app-muted/50'
                    }`
                  : `gap-3 px-4 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-app-muted text-teal-500 dark:text-teal-400'
                        : 'text-app-text-secondary hover:text-app-text hover:bg-app-muted/50'
                    }`
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info / Logout */}
      <div className={`p-4 border-t border-app-border ${isCollapsed ? 'p-2 flex flex-col items-center gap-4' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col gap-0' : 'mb-3'}`}>
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name
              ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
              : 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-app-text truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-app-text-secondary truncate">{user?.role || 'Admin'}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`flex items-center rounded-lg transition-colors ${
            isCollapsed
              ? 'justify-center w-10 h-10 text-app-text-secondary hover:text-app-text hover:bg-app-muted/50'
              : 'gap-2 w-full px-4 py-2 text-sm font-medium text-app-text-secondary hover:text-app-text hover:bg-app-muted/50'
          }`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
