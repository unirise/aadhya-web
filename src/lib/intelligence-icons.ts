import { LucideIcon } from 'lucide-react'
import { ATTRIBUTES_BY_DOMAIN } from '@/constants/activity-constants'

// Legacy exports derived from ATTRIBUTES_BY_DOMAIN
export const intelligenceIcons: Record<string, LucideIcon> = Object.fromEntries(
  (ATTRIBUTES_BY_DOMAIN.intelligence ?? [])
    .filter(a => a.icon)
    .map(a => [a.label, a.icon as LucideIcon])
)

export const physicalIcons: Record<string, LucideIcon> = Object.fromEntries(
  (ATTRIBUTES_BY_DOMAIN.physical ?? [])
    .filter(a => a.icon)
    .map(a => [a.label, a.icon as LucideIcon])
)

export function getIntelligenceIcon(
  domain: string,
  attribute?: string
): LucideIcon | null {
  if (attribute) {
    const normalizedAttr = attribute.toLowerCase().replace(/_/g, '-')
    const found = (ATTRIBUTES_BY_DOMAIN[domain.toLowerCase()] ?? []).find(
      a => a.value === normalizedAttr
    )
    return found?.icon ?? null
  }

  // Search all domains: match by label (e.g. 'Intrapersonal Intelligence')
  // or by normalized value (e.g. 'INTERPERSONAL' -> 'interpersonal')
  const normalizedDomain = domain.toLowerCase().replace(/_/g, '-')
  for (const attrs of Object.values(ATTRIBUTES_BY_DOMAIN)) {
    const found =
      attrs.find(a => a.label === domain) ??
      attrs.find(a => a.value === normalizedDomain)
    if (found?.icon) return found.icon
  }

  return null
}

export function getAllIntelligenceIcons(): Record<string, LucideIcon> {
  return intelligenceIcons
}
