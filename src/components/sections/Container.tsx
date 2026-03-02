import { type ReactNode, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  title?: string
  rounded?: string
  fullHeight?: boolean
  fullWidth?: boolean
  /** When true, omit background and border (e.g. for header/footer) */
  transparent?: boolean
  onClick?: () => void
}

export function Container({
  children,
  className,
  title,
  rounded = 'rounded-3xl',
  fullHeight = true,
  fullWidth = true,
  transparent = false,
  onClick,
}: ContainerProps) {
  const handleKeyDown = onClick
    ? (e: KeyboardEvent) => {
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
      className={cn(
        'relative w-full flex flex-col items-center',
        rounded,
        !transparent,
        fullHeight && 'h-full',
        fullWidth && 'w-full',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {title && (
        <div className='absolute top-1 left-1 z-10'>
          {/* Optional: uncomment for visible title <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3> */}
        </div>
      )}
      <div className='w-full h-full flex flex-col overflow-hidden'>
        {children}
      </div>
    </div>
  )
}
