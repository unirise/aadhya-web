import React from 'react'
import { Card } from '../ui/card'
import { cn } from '../../lib/utils'

export interface BlockProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Block: React.FC<BlockProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Card className={cn('h-full w-full', className)} onClick={onClick}>
      {children}
    </Card>
  )
}
