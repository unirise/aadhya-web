import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dot } from '@/components/dots/Dot'
import type { DotData } from '@/types/dot'

interface TextInputModalProps {
  open: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
  placeholder?: string
}

export function TextInputModal({
  open,
  value,
  onChange,
  onClose,
  placeholder = 'Type here...',
}: TextInputModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const closeDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && textareaRef.current) {
      requestAnimationFrame(() => textareaRef.current?.focus())
    }
  }, [open])

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value, open])

  const focusCloseDot = useCallback(() => {
    const btn = closeDotRef.current?.querySelector('[role="button"]') as HTMLElement
    btn?.focus()
  }, [])

  const handleTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' || e.key === 'ArrowDown') {
        e.preventDefault()
        focusCloseDot()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose, focusCloseDot]
  )

  // Trap focus: stop all keyboard events from bubbling to window
  // so useKeyboardNavigation doesn't intercept them
  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation()

      // If focus is on the close dot area (not the textarea)
      if (e.target !== textareaRef.current) {
        if (e.key === 'Tab' && e.shiftKey) {
          e.preventDefault()
          textareaRef.current?.focus()
        } else if (e.key === 'Tab' && !e.shiftKey) {
          e.preventDefault()
          textareaRef.current?.focus()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          textareaRef.current?.focus()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClose()
        }
      }
    },
    [onClose]
  )

  if (!open) return null

  const textClasses =
    'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug'

  const closeDot: DotData = {
    id: 'text-input-close',
    icon: X,
    label: 'Close',
    tinyText: 'Close',
    onClick: onClose,
    role: 'button',
    ariaLabel: 'Close text input',
  }

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col items-center bg-background/90 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-label='Text input'
      onKeyDown={handleModalKeyDown}
    >
      {/* Text area — centered when small, fills container as it grows */}
      <div className='flex-1 flex items-center justify-center w-[90%] max-w-4xl min-h-0 overflow-hidden'>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full max-h-full resize-none bg-transparent border-none outline-none text-center',
            textClasses,
            'text-foreground placeholder:text-muted-foreground/40',
            'caret-primary overflow-y-auto'
          )}
          style={{ height: 'auto' }}
          aria-label='Text input field'
        />
      </div>

      {/* Close dot at bottom */}
      <div ref={closeDotRef} className='pb-6 pt-2'>
        <div className='w-12 h-12'>
          <Dot data={closeDot} />
        </div>
      </div>
    </div>
  )
}
