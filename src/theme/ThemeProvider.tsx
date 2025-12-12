import React, { createContext, useContext } from 'react'
import { useTheme } from './useTheme'

interface ThemeContextProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// The hook lives alongside the provider so consumers can import both from a single module.
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
