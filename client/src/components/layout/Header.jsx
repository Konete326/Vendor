import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function Header({ title }) {
  const { darkMode, toggleTheme } = useTheme()
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <header className="bg-app-panel border-b border-app-border px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-app-text">{title}</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-app-muted text-app-text-secondary hover:text-app-text hover:bg-app-border transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
