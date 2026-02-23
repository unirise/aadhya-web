import { Dot } from '../dots/Dot'
import type { DotData } from '@/types/dot'

interface ContentSectionProps {
  title: string
  description?: string
  items: DotData[]
}

export function ContentSection({
  title,
  description,
  items,
}: ContentSectionProps) {
  return (
    <div className='flex flex-col items-center h-full w-full min-h-0 overflow-hidden'>
      <div className='py-4 text-center flex-shrink-0'>
        <h1 className='text-4xl font-bold text-foreground mb-2'>{title}</h1>
        {description && (
          <p className='text-lg text-muted-foreground'>{description}</p>
        )}
      </div>
      <div className='flex justify-center flex-wrap gap-4 w-full flex-1 min-h-0 [&>*]:basis-[calc(50%-0.5rem)] lg:[&>*]:basis-[calc(25%-0.75rem)]'>
        {items.map(item => (
          <Dot key={item.key ?? item.id} data={item} className='max-h-75' />
        ))}
      </div>
    </div>
  )
}
