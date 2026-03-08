import { useMemo, useState, useCallback } from 'react'
import { PresentationLayout } from '@/components/layouts/PresentationLayout'
import { visionSlides } from '@/constants/vision-slides'
import type { VisionSlide } from '@/constants/vision-slides'
import type { DotData } from '@/types/dot'

function slidesToDotData(
  slideList: VisionSlide[],
  userName: string,
  onNameChange: (name: string) => void
): DotData[] {
  return slideList.map(s => {
    const dot: DotData = {
      id: `vision-${s.id}`,
      key: `vision-${s.id}`,
      label: s.label,
      title: s.title,
      subtitle: s.subtitle,
      smallText: s.paragraphs?.[0]?.slice(0, 120),
      largeText: s.paragraphs,
      media: s.media,
      mediaStorageId: 'vision',
      icon: s.icon,
    }

    if (s.textInput) {
      dot.textInput = {
        ...s.textInput,
        onValue: onNameChange,
      }
      dot.media = undefined
    }

    // Personalize slide titles with name
    if (userName) {
      if (s.id === 0) {
        dot.title = `Hey ${userName}, ${s.title.charAt(0).toLowerCase()}${s.title.slice(1)}`
      }
    }
    return dot
  })
}

export default function Vision() {
  const [userName, setUserName] = useState(
    () => localStorage.getItem('aadhya-user-name') ?? ''
  )

  const handleNameChange = useCallback((name: string) => {
    setUserName(name)
  }, [])

  const activities = useMemo(
    () => slidesToDotData(visionSlides, userName, handleNameChange),
    [userName, handleNameChange]
  )
  const panelDotsPerSlide = useMemo(
    () => visionSlides.map(s => s.sidebarDots ?? []),
    []
  )

  return (
    <PresentationLayout
      activities={activities}
      storageKey='aadhya-vision-showcase'
      panelDotsPerSlide={panelDotsPerSlide}
    />
  )
}
