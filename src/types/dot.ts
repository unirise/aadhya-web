import type React from 'react'
import type { LucideIcon } from 'lucide-react'

export type MediaItem =
  | { type: 'icon'; icon: LucideIcon | React.ReactNode; category?: string }
  | { type: 'image'; src: string; alt?: string; category?: string }
  | { type: 'diagram'; diagram: string; id: string; category?: string }
  | { type: 'video'; src: string; alt?: string; category?: string }

export interface DotData {
  id: string
  icon: LucideIcon | React.ReactNode
  label?: string
  title?: string
  subtitle?: string
  key?: string
  tinyText?: string
  smallText?: string
  mediumText?: string
  largeText?: string | string[]
  media?: string | React.ReactNode | MediaItem[]
  onClick?: () => void
  to?: string
  isFocused?: boolean
  isActive?: boolean
  isVisited?: boolean
  ariaLabel?: string
  ariaPressed?: boolean
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  ariaDisabled?: boolean
  role?: string
  buttonText?: string
  canAdvance?: boolean
  mediaDefaultSizes?: [number, number]
  mediaStorageId?: string
  textInput?: {
    storageKey: string
    placeholder?: string
    onValue?: (value: string) => void
  }
  isInputFocused?: boolean
}

export interface InputDotData {
  id: string
  value: string
  groupName: string
  label: string
  emoji?: string
  isSelected: boolean
  isFocused?: boolean
  isDisabled?: boolean
  onSelect: (value: string) => void
  ariaLabel?: string
}

export type DotSizeTier = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
