import React from 'react'
import { cn } from '@/lib/utils'

interface ListProps {
  label: string
  description?: string
}

export const List: React.FC<ListProps> = ({ label, description }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-start gap-2 p-4',
        'w-full flex-1 rounded-xl transition-all duration-300',
        'cursor-pointer',
        'hover:border-primary hover:shadow-md'
      )}
    >
      <h3 className='text-2xl font-semibold text-center'>{label}</h3>
      {description && (
        <p className='text-l text-muted-foreground line-clamp-2'>
          {description}
        </p>
      )}
    </div>
  )
}
