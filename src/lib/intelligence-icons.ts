import {
  Brain,
  Activity,
  Calculator,
  BookOpen,
  Music,
  Eye,
  Leaf,
  Users,
  LucideIcon,
} from 'lucide-react'

/**
 * Icon mapping for Multiple Intelligences types
 * Maps each intelligence domain to a semantically appropriate icon from lucide-react
 */
export const intelligenceIcons: Record<string, LucideIcon> = {
  'Intrapersonal Intelligence': Brain,
  'Bodily-Kinesthetic Intelligence': Activity,
  'Logical-Mathematical Intelligence': Calculator,
  'Linguistic Intelligence': BookOpen,
  'Musical Intelligence': Music,
  'Spatial Intelligence': Eye,
  'Naturalistic Intelligence': Leaf,
  'Interpersonal Intelligence': Users,
}

/**
 * Get the icon component for a given intelligence domain
 * @param domain - The intelligence domain code (e.g., 'INTRAPERSONAL')
 * @returns The icon component from lucide-react
 */
export function getIntelligenceIcon(domain: string): LucideIcon | null {
  return intelligenceIcons[domain] || null
}

/**
 * Get all intelligence icons as an object
 * @returns Object mapping domain codes to icon components
 */
export function getAllIntelligenceIcons(): Record<string, LucideIcon> {
  return intelligenceIcons
}
