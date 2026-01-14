import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import { cn } from '../../lib/utils'
import { Block, BlockProps } from './Block'

interface NavigationBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  to: string
}

export const NavigationBlock: React.FC<NavigationBlockProps> = ({
  label,
  to,
  className,
  ...props
}) => {
  return (
    <Block
      className={cn('bg-brown-400 border-6 border-brown-400', className)}
      {...props}
    >
      <Button variant='ghost' className='h-full w-full text-white' asChild>
        <Link to={to}>{label}</Link>
      </Button>
    </Block>
  )
}
