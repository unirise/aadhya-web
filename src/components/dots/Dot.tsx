import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDotSize } from '@/hooks/useDotSize'
import type { DotData, DotSizeTier } from '@/types/dot'

const DOT_DEBUG = true

interface DotProps {
  data: DotData
  className?: string
}

function renderIcon(icon: DotData['icon'], sizeClass: string): React.ReactNode {
  if (icon === null || icon === undefined) return null
  if (React.isValidElement(icon))
    return <span className={sizeClass}>{icon}</span>
  return React.createElement(
    icon as React.ComponentType<{ className?: string }>,
    { className: sizeClass }
  )
}

function DotXs({ data }: { data: DotData }) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      {renderIcon(data.icon, 'w-4 h-4')}
    </div>
  )
}

function DotSm({ data }: { data: DotData }) {
  const labelColor = data.isActive
    ? 'text-primary-foreground'
    : 'text-muted-foreground'

  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-1.5'>
      <div className='[&_svg]:w-5 [&_svg]:h-5 mb-1'>
        {renderIcon(data.icon, 'w-5 h-5')}
      </div>
      <span
        aria-hidden='true'
        className={cn(
          'text-sm font-bold text-center line-clamp-1 w-full leading-tight',
          labelColor
        )}
      >
        {data.tinyText}
      </span>
    </div>
  )
}

function DotMd({ data }: { data: DotData }) {
  const labelColor = data.isActive
    ? 'text-primary-foreground'
    : 'text-muted-foreground'

  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-3'>
      <div className='[&_svg]:w-6 [&_svg]:h-6 mb-2'>
        {renderIcon(data.icon, 'w-6 h-6')}
      </div>
      {data.tinyText && (
        <span className='text-md font-bold text-center line-clamp-1 w-full'>
          {data.label}
        </span>
      )}
      <span
        aria-hidden='true'
        className={cn(
          'text-xs font-medium text-center line-clamp-1 w-full mt-1',
          labelColor
        )}
      >
        {data.tinyText}
      </span>
    </div>
  )
}

function DotLg({ data }: { data: DotData }) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-6 overflow-hidden'>
      <div className='flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3 [&_svg]:w-6 [&_svg]:h-6'>
        {renderIcon(data.icon, 'w-6 h-6')}
      </div>
      {data.title && (
        <span className='text-xl font-bold text-center w-full'>
          {data.title}
        </span>
      )}
      {data.largeText && (
        <p className='text-sm text-muted-foreground text-center w-full mt-2 line-clamp-3'>
          {data.largeText}
        </p>
      )}
    </div>
  )
}

function DotXl({ data }: { data: DotData }) {
  const paragraphs = Array.isArray(data.largeText)
    ? data.largeText
    : data.largeText
      ? [data.largeText]
      : []

  const canAdvance = data.canAdvance ?? true
  const buttonText = data.buttonText ?? 'Next'
  const hasMedia = data.media !== undefined

  const textContent = (
    <div className='h-full w-full flex flex-col items-center justify-center cursor-pointer'>
      <div className='flex flex-col p-4 lg:p-12 space-y-3 lg:space-y-6 overflow-y-auto h-full w-full'>
        <div className='flex-1 flex flex-col justify-center space-y-3 lg:space-y-6'>
          <div className='space-y-1.5 lg:space-y-4'>
            {data.label && (
              <span className='inline-flex items-center gap-2 px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full bg-primary/10 text-primary text-xs lg:text-sm font-semibold uppercase tracking-wider w-fit'>
                {data.label}
              </span>
            )}
            {data.title && (
              <h1 className='text-xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight'>
                {data.title}
              </h1>
            )}
            {data.subtitle && (
              <p className='text-sm lg:text-lg text-primary/80 font-medium italic'>
                {data.subtitle}
              </p>
            )}
          </div>
          {paragraphs.length > 0 && (
            <div className='space-y-4'>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className='text-base leading-relaxed text-foreground/90'
                >
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>

        {data.onClick && (
          <button
            type='button'
            aria-label={`${buttonText} — advance from ${data.title}`}
            aria-disabled={!canAdvance}
            disabled={!canAdvance}
            onClick={e => {
              e.stopPropagation()
              if (!canAdvance) return
              data.onClick?.()
            }}
            className={cn(
              'font-semibold py-2 px-4 lg:py-4 lg:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 group shadow-lg flex-shrink-0',
              canAdvance
                ? 'bg-primary text-primary-foreground hover:shadow-xl hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70',
              data.isFocused &&
                'outline outline-2 outline-blue-500 outline-offset-2 brightness-110'
            )}
          >
            <span className='text-sm lg:text-lg'>{buttonText}</span>
            <ArrowRight
              className='w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform'
              aria-hidden='true'
            />
          </button>
        )}
      </div>
    </div>
  )

  if (hasMedia) {
    return (
      <div className='flex flex-col lg:grid lg:grid-cols-2 w-full h-full overflow-hidden min-h-0'>
        <div className='flex-[3] lg:flex-none lg:h-full overflow-hidden min-h-0 order-2 lg:order-1'>
          {textContent}
        </div>
        <div className='flex-[3] lg:flex-none lg:h-full overflow-hidden min-h-0 order-1 lg:order-2 flex items-center justify-center'>
          {typeof data.media === 'string' ? (
            <div className='p-4 lg:p-8'>{data.media}</div>
          ) : (
            data.media
          )}
        </div>
      </div>
    )
  }

  return textContent
}

const tierRenderers: Record<DotSizeTier, React.FC<{ data: DotData }>> = {
  xs: DotXs,
  sm: DotSm,
  md: DotMd,
  lg: DotLg,
  xl: DotXl,
}

export function Dot({ data, className }: DotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const tier = useDotSize(ref)

  useEffect(() => {
    if (data.isFocused && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      if (document.activeElement !== ref.current) {
        ref.current.focus({ preventScroll: true })
      }
    } else if (
      !data.isFocused &&
      ref.current &&
      document.activeElement === ref.current
    ) {
      ref.current.blur()
    }
  }, [data.isFocused])

  const focusClasses = data.isFocused
    ? 'border-none outline outline-[3px] outline-blue-500 outline-offset-[-4px]'
    : 'border border-border hover:border-primary/20'

  const stateClasses = data.isActive
    ? 'bg-primary text-primary-foreground'
    : data.isVisited
      ? 'bg-primary/10 text-foreground hover:bg-accent hover:text-accent-foreground'
      : 'bg-card hover:bg-accent hover:text-accent-foreground'

  const TierComponent = tierRenderers[tier]

  const content = (
    <div
      ref={ref}
      id={data.id}
      role={data.role ?? (data.onClick ? 'button' : undefined)}
      aria-label={data.ariaLabel ?? data.label}
      aria-pressed={data.ariaPressed}
      aria-current={data.ariaCurrent}
      aria-disabled={data.ariaDisabled}
      tabIndex={data.isFocused ? 0 : -1}
      onClick={data.onClick}
      className={cn(
        'relative rounded-xl transition-all duration-300 overflow-hidden w-full h-full',
        data.onClick && 'cursor-pointer',
        focusClasses,
        stateClasses,
        className
      )}
    >
      <TierComponent data={data} />
      {DOT_DEBUG && (
        <span className='absolute bottom-0.5 right-1 text-[8px] leading-none text-muted-foreground/50 pointer-events-none select-none'>
          {tier}
        </span>
      )}
    </div>
  )

  if (data.to) {
    return <Link to={data.to}>{content}</Link>
  }

  return content
}
