import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui'
import { Block, BlockProps } from './Block'

interface SettingBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  onClick?: () => void
  icon?: LucideIcon
}

export const SettingBlock: React.FC<SettingBlockProps> = ({
  label,
  onClick,
  icon: Icon,
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
        <span className='flex items-center justify-center gap-2'>
          {Icon && <Icon className='w-5 h-5' />}
          <span>{label}</span>
        </span>
      </Button>
    </Block>
  )
}
