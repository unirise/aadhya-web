import React from 'react'
import { cn } from '../../lib/utils'
import { Block, BlockProps } from './Block'

interface InputBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  description?: string
}

export const InputBlock: React.FC<InputBlockProps> = ({
  label,
  description,
  className,
  ...props
}) => {
  return (
    <Block
      className={cn('bg-[#219EBC] border-6 border-[#219EBC]', className)}
      {...props}
    >
      <div className='flex flex-col h-full'>
        <div className='text-sm font-medium text-white/70 mb-1'>Inputs</div>
        <h3 className='text-lg font-semibold text-white'>{label}</h3>
        {description && (
          <p className='text-sm text-white/80 mt-2'>{description}</p>
        )}
      </div>
    </Block>
  )
}
