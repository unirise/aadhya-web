import { Sunrise, Sun, Sunset, Moon } from 'lucide-react'
import type { Theme } from '@/contexts/ThemeContext'
import type { DotData } from '@/types/dot'

const THEME_META: Record<Theme, { icon: typeof Sun; title: string; tinyText: string }> = {
  morning: { icon: Sunrise, title: 'Morning', tinyText: 'Morn' },
  afternoon: { icon: Sun, title: 'Afternoon', tinyText: 'Day' },
  evening: { icon: Sunset, title: 'Evening', tinyText: 'Eve' },
  night: { icon: Moon, title: 'Night', tinyText: 'Night' },
}

export function themeDot(theme: Theme, toggleTheme: () => void): Omit<DotData, 'isFocused'> {
  const meta = THEME_META[theme]
  return {
    id: 'theme',
    icon: meta.icon,
    label: 'Theme',
    title: meta.title,
    subtitle: `Currently using ${theme} theme`,
    tinyText: meta.tinyText,
    smallText: 'Cycle through morning, afternoon, evening, and night themes.',
    largeText: `Switch between four themes to match your mood. Currently on ${theme}.`,
    buttonText: 'Next Theme',
    onClick: toggleTheme,
  }
}
