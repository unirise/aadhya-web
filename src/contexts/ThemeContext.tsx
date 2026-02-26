import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import mermaid from 'mermaid'
import { getMermaidVars } from '@/lib/mermaidTheme'

export type Theme = 'morning' | 'afternoon' | 'evening' | 'night'

const THEMES: Theme[] = ['morning', 'afternoon', 'evening', 'night']

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function migrateTheme(stored: string | null): Theme {
  if (stored === 'light') return 'afternoon'
  if (stored === 'dark') return 'night'
  if (stored && THEMES.includes(stored as Theme)) return stored as Theme
  return 'afternoon'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    migrateTheme(localStorage.getItem('theme'))
  )

  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach(t => root.classList.remove(t))
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      look: 'classic',
      themeVariables: getMermaidVars(theme),
    })
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const idx = THEMES.indexOf(prev)
      return THEMES[(idx + 1) % THEMES.length]
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
