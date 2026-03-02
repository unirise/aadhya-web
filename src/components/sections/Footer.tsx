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
  const center = Math.floor((size - 1) / 2)
  const start = Math.max(0, Math.min(currentIndex - center, totalItems - size))
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
  const maxVisible = isMobile ? 5 : 7

  const windowStart = useMemo(() => {
    if (!activityMode || items.length <= maxVisible) return 0
    const center = Math.floor((maxVisible - 1) / 2)
    return Math.max(0, Math.min(currentIndex - center, items.length - maxVisible))
  }, [items.length, currentIndex, maxVisible, activityMode])

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
            <nav
              aria-label='Activity navigation'
              className='overflow-hidden w-full h-full'
            >
              <div
                className='flex items-center h-full transition-transform duration-300'
                style={{
                  width: items.length <= maxVisible
                    ? '100%'
                    : `${(items.length / maxVisible) * 100}%`,
                  transform: items.length <= maxVisible
                    ? undefined
                    : `translateX(-${(windowStart / items.length) * 100}%)`,
                }}
              >
                {items.map(item => (
                  <div
                    key={item.key ?? item.id}
                    className='flex items-center justify-center h-full'
                    style={{ width: `${100 / Math.max(items.length, maxVisible)}%` }}
                  >
                    <Dot
                      data={{
                        ...item,
                        ariaCurrent: item.isActive ? 'step' : undefined,
                      }}
                      className='aspect-square w-auto'
                    />
                  </div>
                ))}
              </div>
            </nav>
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
