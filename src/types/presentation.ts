import type React from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * One item in the presentation/activity run.
 * Used by Action and Content; can be built from static data or from API activity.
 */
export interface PresentationItem {
  key: string
  label: string
  title: string
  subtitle?: string
  description?: string
  paragraphs?: string[]
  diagram?: string
  /** LucideIcon component or ReactNode for display in Action/Content */
  icon: LucideIcon | React.ReactNode
}
