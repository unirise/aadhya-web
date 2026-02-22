import React from 'react'
import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { Button } from '../ui'
import { cn } from '../../lib/utils'
import { Block, BlockProps } from './Block'

interface NavigationBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  to: string
  icon?: LucideIcon
}

export const NavigationBlock: React.FC<NavigationBlockProps> = ({
  label,
  to,
  icon: Icon,
  className,
  ...props
}) => {
  return (
    <Block
      className={cn('bg-brown-400 border-6 border-brown-400', className)}
      {...props}
    >
      <Button variant='ghost' className='h-full w-full text-white' asChild>
        <Link to={to} className='flex items-center justify-center gap-2'>
          {Icon && <Icon className='w-5 h-5' />}
          <span>{label}</span>
        </Link>
      </Button>
    </Block>
  )
}
