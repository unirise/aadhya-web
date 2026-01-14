import React from 'react'
import { Block, BlockProps } from './Block'
import { cn } from '../../lib/utils'

interface ControlBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  description?: string
}

export const ControlBlock: React.FC<ControlBlockProps> = ({
  label,
  description,
  className,
  ...props
}) => {
  return (
    <Block className={cn('bg-[#8ECAE6] border-[#8ECAE6]', className)} {...props}>
      <div className="flex flex-col h-full">
        <div className="text-sm font-medium text-gray-700 mb-1">Controls</div>
        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
      </div>
    </Block>
  )
}

