import React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui'
import { Block, BlockProps } from './Block'

interface ActionBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  onClick?: () => void
}

export const ActionBlock: React.FC<ActionBlockProps> = ({
  label,
  onClick,
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
        {label}
      </Button>
    </Block>
  )
}
export default ActionBlock
