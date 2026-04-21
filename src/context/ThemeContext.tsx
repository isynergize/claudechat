import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { THEMES, DEFAULT_THEME, type ThemeId, type Theme } from '../lib/themes'

const STORAGE_KEY = 'claude-chat-theme'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value)
  }
}

interface ThemeContextValue {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    return stored && THEMES.find(t => t.id === stored) ? stored : DEFAULT_THEME
  })

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId])

  // Apply on first render
  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId)!
    applyTheme(theme)
  }, [])

  function setThemeId(id: ThemeId) {
    setThemeIdState(id)
  }

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
