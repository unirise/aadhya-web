import React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui'
import { Block, BlockProps } from './Block'

interface SettingBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  onClick?: () => void
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  label,
  onClick,
  className,
  ...props
}) => {
  return (
    <Block
      className={cn(
        'bg-teal-600 border-6 border-teal-600 text-white',
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
