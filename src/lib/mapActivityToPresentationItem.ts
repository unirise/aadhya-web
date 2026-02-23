import { Home } from 'lucide-react'
import type { DotData } from '@/types/dot'
import type { Activity } from '@/types/activities'
import { getIntelligenceIcon } from '@/lib/intelligence-icons'

export type { Activity as ApiActivity }

export function mapActivityToDotData(
  activity: Activity,
  index: number
): DotData {
  const { metadata } = activity
  const displayName = metadata?.domainDisplayName || activity.domain
  const IconComponent = getIntelligenceIcon(displayName) || Home
  const text = metadata?.text || metadata?.description || ''
  return {
    id: activity.id,
    key: metadata?.key || activity.id,
    label: activity.attribute,
    title: text,
    subtitle: metadata?.subtitle,
    tinyText: `Activity ${index + 1}`,
    smallText: text.slice(0, 120) + (text.length > 120 ? '\u2026' : ''),
    icon: IconComponent,
  }
}

export function mapActivitiesToDotData(activities: Activity[]): DotData[] {
  return activities.map((a, i) => mapActivityToDotData(a, i))
}

/** @deprecated Use mapActivityToDotData instead */
export const mapActivityToPresentationItem = mapActivityToDotData
/** @deprecated Use mapActivitiesToDotData instead */
export const mapActivitiesToPresentationItems = mapActivitiesToDotData
