import { useMemo, useState, useEffect } from 'react'
import { Dot } from '../dots/Dot'
import { Container } from './Container'
import type { DotData } from '@/types/dot'

interface FooterProps {
  items: DotData[]
  currentIndex?: number
}

/** Pure helper: compute the visible window for activity footer dots. */
export function getFooterWindow(
  totalItems: number,
  currentIndex: number,
  isMobile: boolean
): { start: number; size: number } {
  const size = isMobile ? 5 : 7
  if (totalItems <= size) return { start: 0, size }
  const start = Math.max(0, Math.min(currentIndex - 3, totalItems - size))
  return { start, size }
}

function isActivityMode(items: DotData[]): boolean {
  return items.some(
    item => item.isActive !== undefined || item.isVisited !== undefined
  )
}

export function Footer({ items, currentIndex = 0 }: FooterProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const activityMode = isActivityMode(items)

  const windowedItems = useMemo(() => {
    if (!activityMode) return items
    const { start, size } = getFooterWindow(
      items.length,
      currentIndex,
      isMobile
    )
    return items.slice(start, start + size)
  }, [items, currentIndex, isMobile, activityMode])

  return (
    <footer
      aria-label={activityMode ? 'Activity index' : 'Footer navigation'}
      className='w-full h-full z-50 overflow-hidden'
    >
      <Container
        transparent
        rounded='rounded-none'
        className='bg-transparent mx-auto w-full'
      >
        <div className='h-full w-full flex justify-between items-center lg:px-50'>
          {activityMode ? (
            <div
              role='tablist'
              aria-label='Activity navigation'
              className='flex gap-2 sm:gap-4 items-center justify-center flex-1 w-full h-full'
            >
              {windowedItems.map(item => (
                <Dot
                  key={item.key ?? item.id}
                  data={item}
                  className='aspect-square w-auto'
                />
              ))}
            </div>
          ) : (
            <div className='flex justify-around items-center gap-2 sm:gap-4 w-full h-full'>
              {items.map(item => (
                <Dot
                  key={item.key ?? item.id}
                  data={item}
                  className='aspect-square w-auto'
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </footer>
  )
}
