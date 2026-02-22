import { type ReactNode } from 'react'
import { Dot } from '../dots/Dot'
import { Container } from './Container'
import type { DotData } from '@/types/dot'

interface HeaderProps {
  items: DotData[]
  trailing?: ReactNode
}

export function Header({ items, trailing }: HeaderProps) {
  return (
    <header
      aria-label='Presentation navigation'
      className='w-full h-full bg-background/80 backdrop-blur-sm z-50 overflow-hidden'
    >
      <Container
        transparent
        rounded='rounded-none'
        className='bg-transparent mx-auto'
      >
        <div className='flex justify-around items-center gap-2 sm:gap-4 w-full h-full'>
          {items.map(item => (
            <Dot
              key={item.key ?? item.id}
              data={item}
              className='aspect-square w-auto'
            />
          ))}
          {trailing}
        </div>
      </Container>
    </header>
  )
}
