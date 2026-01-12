import {
  Brain,
  Activity,
  Calculator,
  BookOpen,
  Music,
  Eye,
  Leaf,
  Users,
} from 'lucide-react'

/**
 * Icon mapping for Multiple Intelligences types
 * Maps each intelligence domain to a semantically appropriate icon from lucide-react
 */
export const intelligenceIcons = {
  INTRAPERSONAL: Brain,
  BODILY_KINESTHETIC: Activity,
  LOGICAL_MATHEMATICAL: Calculator,
  LINGUISTIC: BookOpen,
  MUSICAL: Music,
  SPATIAL: Eye,
  NATURALISTIC: Leaf,
  INTERPERSONAL: Users,
}

/**
 * Get the icon component for a given intelligence domain
 * @param {string} domain - The intelligence domain code (e.g., 'INTRAPERSONAL')
 * @returns {React.Component} The icon component from lucide-react
 */
export function getIntelligenceIcon(domain) {
  return intelligenceIcons[domain] || null
}

/**
 * Get all intelligence icons as an object
 * @returns {Object} Object mapping domain codes to icon components
 */
export function getAllIntelligenceIcons() {
  return intelligenceIcons
}

