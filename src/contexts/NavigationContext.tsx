import { createContext, useContext, type ReactNode } from 'react'
import type {
  FocusPosition,
  Section,
  Zone,
} from '@/hooks/useKeyboardNavigation'

interface NavigationContextType {
  focus: FocusPosition
  setFocus: (position: FocusPosition) => void
  isFocused: (section: Section, index: number, zone?: Zone) => boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export function NavigationProvider({
  children,
  value,
}: {
  children: ReactNode
  value: NavigationContextType
}) {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  return context
}
