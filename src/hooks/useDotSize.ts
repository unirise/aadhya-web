import { useState, useEffect, type RefObject } from 'react'
import type { DotSizeTier } from '@/types/dot'

function getTier(width: number, height: number): DotSizeTier {
  const constraining = Math.min(width, height)
  if (constraining < 80) return 'xs'
  if (constraining < 150) return 'sm'
  if (constraining < 250) return 'md'
  if (constraining < 400) return 'lg'
  return 'xl'
}

export function useDotSize(ref: RefObject<HTMLElement | null>): DotSizeTier {
  const [tier, setTier] = useState<DotSizeTier>('sm')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setTier(getTier(width, height))
    })

    observer.observe(el)
    // Set initial size
    const { width, height } = el.getBoundingClientRect()
    setTier(getTier(width, height))

    return () => observer.disconnect()
  }, [ref])

  return tier
}
