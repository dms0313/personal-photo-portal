import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme-preference'

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setIsDarkMode(stored === 'dark')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem(STORAGE_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode((previous) => !previous)

  return { isDarkMode, toggleDarkMode }
}
