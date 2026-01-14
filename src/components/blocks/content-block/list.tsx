import React from 'react'

interface ListProps {
  label: string
  description?: string
}

export const List: React.FC<ListProps> = ({ label, description }) => {
  return (
    <div className='flex flex-col h-full cursor-pointer'>
      <h3 className='text-lg font-semibold'>{label}</h3>
      {description && (
        <p className='text-sm mt-2 font-medium '>{description}</p>
      )}
    </div>
  )
}
