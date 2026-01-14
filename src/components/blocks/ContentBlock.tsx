import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Block, BlockProps } from './Block'
import { List, Text } from './content-block'

interface ContentBlockProps extends Omit<BlockProps, 'children'> {
  label: string
  description?: string
  type?: string
  component?: React.ComponentType<any>
  componentProps?: Record<string, any>
  icon?: LucideIcon
  text?: string
  subtext?: string
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  label,
  description,
  type,
  component: Component,
  componentProps,
  icon,
  text,
  subtext,
  className,
  ...props
}) => {
  // Determine which component to render based on type
  const getContentComponent = () => {
    if (Component) {
      return (
        <Component
          label={label}
          description={description}
          {...componentProps}
        />
      )
    }

    if (type === 'list') {
      return <List label={label} description={description} />
    }

    if (type === 'text') {
      return <Text icon={icon} text={text} subtext={subtext} />
    }

    // Default content rendering
    return (
      <div className='flex flex-col h-full'>
        <h3 className='text-lg font-semibold'>{label}</h3>
        {description && (
          <p className='text-sm text-white mt-2'>{description}</p>
        )}
      </div>
    )
  }

  return (
    <Block
      className={cn(
        'py-4 px-8',
        'bg-gray-100 border-6 border-gray-100 text-black',
        className
      )}
      {...props}
    >
      {getContentComponent()}
    </Block>
  )
}
