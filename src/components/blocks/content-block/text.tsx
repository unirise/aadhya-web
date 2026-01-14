import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TextProps {
  icon?: LucideIcon
  text?: string
  subtext?: string
  iconSize?: number
  iconColor?: string
}

export const Text: React.FC<TextProps> = ({
  icon: IconComponent,
  text,
  subtext,
  iconSize = 48,
  iconColor,
}) => {
  return (
    <div className='h-full w-full flex flex-col gap-3 justify-center items-center'>
      {IconComponent && (
        <div className='flex justify-center mb-4'>
          <div className='p-4 rounded-2xl flex items-center justify-center'>
            <IconComponent size={iconSize} color={iconColor} />
          </div>
        </div>
      )}
      {text && (
        <h2 className='text-3xl font-bold leading-tight text-center'>{text}</h2>
      )}
      {subtext && <p className='text-lg  text-center mt-2'>{subtext}</p>}
    </div>
  )
}
