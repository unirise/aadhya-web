import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import type { PresentationItem } from '@/types/presentation'
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
  title: string
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
      aria-label={`${title} — visual diagram`}
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
