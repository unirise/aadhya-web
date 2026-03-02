import { Home } from 'lucide-react'
import type { DotData } from '@/types/dot'
import type { Activity } from '@/types/activities'
import { getIntelligenceIcon } from '@/lib/intelligence-icons'

export type { Activity as ApiActivity }

export function mapActivityToDotData(
  activity: Activity,
  _index: number
): DotData {
  const { metadata } = activity
  const IconComponent =
    getIntelligenceIcon(activity.domain, activity.attribute) || Home
  return {
    id: activity.id,
    key: metadata?.key || activity.id,
    label: metadata?.label,
    title: metadata?.title,
    subtitle: metadata?.subtitle,
    tinyText: metadata?.tinyText,
    smallText: metadata?.smallText,
    mediumText: metadata?.mediumText,
    largeText: metadata?.largeText,
    media: metadata?.media,
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
