import { useState, useMemo } from 'react'
import { icons, type LucideIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
  placeholder?: string
  className?: string
}

const iconEntries = Object.entries(icons) as [string, LucideIcon][]

export function IconPicker({
  value,
  onChange,
  placeholder = 'Pick icon...',
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return iconEntries.slice(0, 60)
    const q = search.toLowerCase()
    return iconEntries
      .filter(([name]) => name.toLowerCase().includes(q))
      .slice(0, 60)
  }, [search])

  const SelectedIcon = value
    ? (icons[value as keyof typeof icons] ?? null)
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-start gap-2 font-normal', className)}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className='size-4 shrink-0' />
              <span className='truncate'>{value}</span>
            </>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72 p-2' align='start'>
        <Input
          placeholder='Search icons...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='mb-2'
          autoFocus
        />
        <div className='grid grid-cols-6 gap-1 max-h-48 overflow-y-auto'>
          {filtered.map(([name, Icon]) => (
            <button
              key={name}
              type='button'
              title={name}
              onClick={() => {
                onChange(name)
                setOpen(false)
                setSearch('')
              }}
              className={cn(
                'flex items-center justify-center size-9 rounded-md hover:bg-accent transition-colors',
                value === name && 'bg-accent ring-1 ring-ring'
              )}
            >
              <Icon className='size-4' />
            </button>
          ))}
          {filtered.length === 0 && (
            <p className='col-span-6 text-center text-sm text-muted-foreground py-4'>
              No icons found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
