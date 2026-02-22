import { type ReactNode } from 'react'
import { Dot } from '../dots/Dot'
import { InputDot } from '../dots/InputDot'
import { Container } from './Container'
import type { DotData, InputDotData } from '@/types/dot'

interface PanelProps {
  items?: DotData[]
  inputItems?: InputDotData[]
  groupValue?: string
  onValueChange?: (val: string) => void
  children?: ReactNode
}

export function Panel({
  items,
  inputItems,
  groupValue,
  onValueChange,
  children,
}: PanelProps) {
  if (children) {
    return (
      <aside
        className='h-full flex flex-col overflow-hidden'
        aria-label='Panel'
      >
        {children}
      </aside>
    )
  }

  if (inputItems) {
    return (
      <aside
        className='h-full flex flex-col overflow-hidden'
        aria-label='Answer options'
        role='radiogroup'
      >
        <Container title='Answer Options' rounded='rounded-2xl'>
          {inputItems.length > 0 ? (
            <div className='flex flex-col gap-4 flex-1 justify-around'>
              {inputItems.map(item => (
                <InputDot key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground text-center py-8'>
              No answer options for this activity.
            </p>
          )}
        </Container>
      </aside>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label='Explore other activities'
      className='h-full flex flex-col overflow-hidden'
    >
      <Container title='Explore' rounded='rounded-2xl'>
        <div className='flex flex-col gap-4 flex-1'>
          {items.map(item => (
            <Dot key={item.key ?? item.id} data={item} />
          ))}
        </div>
      </Container>
    </nav>
  )
}
