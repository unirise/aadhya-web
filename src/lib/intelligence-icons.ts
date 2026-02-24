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

const iconMap: Record<string, Record<string, LucideIcon>> = {
  intelligence: {
    INTRAPERSONAL: Brain,
    BODILY_KINESTHETIC: Activity,
    LOGICAL_MATHEMATICAL: Calculator,
    LINGUISTIC: BookOpen,
    MUSICAL: Music,
    SPATIAL: Eye,
    NATURALISTIC: Leaf,
    INTERPERSONAL: Users,
  },
}

// Legacy mapping for callers that pass display names
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

export function getIntelligenceIcon(
  domain: string,
  attribute?: string
): LucideIcon | null {
  console.log('🚀 ~ getIntelligenceIcon ~ attribute:', attribute, domain)
  if (attribute) {
    return iconMap[domain.toLowerCase()]?.[attribute.toUpperCase()] ?? null
  }
  return intelligenceIcons[domain] || null
}

/**
 * Get all intelligence icons as an object
 * @returns Object mapping domain codes to icon components
 */
export function getAllIntelligenceIcons(): Record<string, LucideIcon> {
  return intelligenceIcons
}
