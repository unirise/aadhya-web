import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Block, BlockProps } from '../Block'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface ActionBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  onClick?: () => void
  icon?: LucideIcon
}

export const ActionBlock: React.FC<ActionBlockProps> = ({
  label,
  onClick,
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <Block
      className={cn(
        'bg-amber-500 border-6 border-amber-500 text-white',
        className
      )}
      {...props}
    >
      <Button variant='ghost' className='h-full w-full' onClick={onClick}>
        <span className='flex items-center justify-center gap-2'>
          {Icon && <Icon className='w-5 h-5' />}
          <span>{label}</span>
        </span>
      </Button>
    </Block>
  )
}
export default ActionBlock
