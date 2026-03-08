import React, { useCallback, useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import type { PresentationItem } from '@/types/presentation'
import type { MediaItem } from '@/types/dot'
import { useTheme } from '@/contexts/ThemeContext'

function renderIcon(icon: PresentationItem['icon']) {
  if (icon === null || icon === undefined) return null
  if (React.isValidElement(icon)) return icon
  return React.createElement(
    icon as React.ComponentType<{ className?: string; strokeWidth?: number }>,
    {
      className: 'w-48 h-48 text-primary/30',
      strokeWidth: 1,
    }
  )
}

function MermaidDiagram({
  diagram,
  id,
  title,
}: {
  diagram: string
  id: string
  title?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const uniqueId = `mermaid-${id}-${Date.now()}`
    mermaid.render(uniqueId, diagram).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    })
  }, [diagram, id, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label={title ? `${title} — visual diagram` : 'Visual diagram'}
      className='w-full h-full flex items-center justify-center p-8'
    />
  )
}

export interface MediaProps {
  item: PresentationItem
  onClick?: () => void
  className?: string
}

export function Media({ item, onClick, className }: MediaProps) {
  const handleKeyDown = onClick
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }
    : undefined

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? item.title : undefined}
      className={`flex items-center justify-center bg-card border shadow-sm rounded-2xl p-4 lg:p-8 h-full w-full overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {item.diagram ? (
        <MermaidDiagram
          diagram={item.diagram}
          id={item.key}
          title={item.title}
        />
      ) : (
        <div className='flex items-center justify-center w-full h-full'>
          {renderIcon(item.icon)}
        </div>
      )}
    </div>
  )
}

function MediaItemRenderer({ item }: { item: MediaItem }) {
  switch (item.type) {
    case 'icon':
      return (
        <div className='flex items-center justify-center w-full h-full'>
          {renderIcon(item.icon)}
        </div>
      )
    case 'image':
      return (
        <img
          src={item.src}
          alt={item.alt ?? ''}
          className='w-full h-full object-cover rounded-xl p-2'
        />
      )
    case 'video':
      return (
        <video
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          className='w-full h-full object-cover rounded-xl p-2'
        />
      )
    case 'diagram':
      return <MermaidDiagram diagram={item.diagram} id={item.id} />
  }
}

export interface MediaCarouselProps {
  items: MediaItem[]
  className?: string
}

const MEDIA_PREF_KEY = 'aadhya-preferred-media'

function mediaPairKey(item: MediaItem): string | null {
  return item.category ? `${item.type}:${item.category}` : null
}

function findPreferredIndex(items: MediaItem[]): number {
  const preferred = localStorage.getItem(MEDIA_PREF_KEY)
  if (preferred) {
    const match = items.findIndex(item => mediaPairKey(item) === preferred)
    if (match !== -1) return match
  }
  return 0
}

export function MediaCarousel({ items, className }: MediaCarouselProps) {
  const itemsKey = items.map(i => mediaPairKey(i) ?? i.type).join(',')
  const [index, setIndex] = useState(() => findPreferredIndex(items))
  const { theme } = useTheme()
  const clickEnabled = theme === 'evening'

  useEffect(() => {
    setIndex(findPreferredIndex(items))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- itemsKey is a content-derived key from items
  }, [itemsKey])

  const pairs = new Set(items.map(mediaPairKey).filter(Boolean))
  const hasMultiplePairs = pairs.size > 1

  const cycle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (items.length <= 1) return
      setIndex(i => {
        const next = (i + 1) % items.length
        const key = mediaPairKey(items[next])
        if (key && hasMultiplePairs) localStorage.setItem(MEDIA_PREF_KEY, key)
        return next
      })
    },
    [items, hasMultiplePairs]
  )

  if (items.length === 0) return null

  const safeIndex = index < items.length ? index : 0
  const current = items[safeIndex]
  const canCycle = items.length > 1 && clickEnabled

  return (
    <div
      aria-label={
        canCycle
          ? `Media ${safeIndex + 1} of ${items.length} — click to see next`
          : undefined
      }
      className={`flex items-center justify-center h-full w-full overflow-hidden relative ${canCycle ? 'cursor-pointer' : ''} ${className ?? ''}`}
      onClick={canCycle ? cycle : undefined}
    >
      <MediaItemRenderer item={current} />
      {canCycle && (
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === safeIndex ? 'bg-primary' : 'bg-primary/25'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
