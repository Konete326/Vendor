import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const getInitialDarkMode = () => {
  const saved = localStorage.getItem('theme')
  return saved ? saved === 'dark' : true
}

const applyThemeClass = (isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = getInitialDarkMode()
    applyThemeClass(isDark)
    return isDark
  })

  useEffect(() => {
    applyThemeClass(darkMode)
  }, [darkMode])

  const toggleTheme = () => setDarkMode((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
