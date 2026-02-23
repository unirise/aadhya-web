import { useMemo } from 'react'
import { PresentationLayout } from '@/components/layouts/PresentationLayout'
import { slides } from '@/constants/slides'
import type { DotData } from '@/types/dot'

function slidesToDotData(slideList: typeof slides): DotData[] {
  return slideList.map(s => ({
    id: `slide-${s.id}`,
    key: `slide-${s.id}`,
    label: s.label,
    title: s.title,
    subtitle: s.subtitle,
    smallText: s.paragraphs?.[0]?.slice(0, 120),
    largeText: s.paragraphs,
    media: s.diagram,
    icon: s.icon,
  }))
}

export default function Presentation() {
  const activities = useMemo(() => slidesToDotData(slides), [])

  return (
    <PresentationLayout
      activities={activities}
      storageKey='aadhya-presentation-demo'
    />
  )
}
