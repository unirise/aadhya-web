import { useState, useMemo } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  className?: string
}

const EMOJI_LIST: { emoji: string; label: string }[] = [
  { emoji: '😊', label: 'smiling' },
  { emoji: '🙂', label: 'slightly smiling' },
  { emoji: '😐', label: 'neutral' },
  { emoji: '😕', label: 'confused' },
  { emoji: '😢', label: 'crying' },
  { emoji: '😄', label: 'grinning' },
  { emoji: '😃', label: 'happy' },
  { emoji: '😁', label: 'beaming' },
  { emoji: '😆', label: 'laughing' },
  { emoji: '😅', label: 'sweat smile' },
  { emoji: '🤣', label: 'rofl' },
  { emoji: '😂', label: 'joy' },
  { emoji: '🙃', label: 'upside down' },
  { emoji: '😉', label: 'wink' },
  { emoji: '😇', label: 'halo' },
  { emoji: '🥰', label: 'love' },
  { emoji: '😍', label: 'heart eyes' },
  { emoji: '🤩', label: 'star struck' },
  { emoji: '😘', label: 'kiss' },
  { emoji: '😋', label: 'yummy' },
  { emoji: '🤔', label: 'thinking' },
  { emoji: '🤨', label: 'raised eyebrow' },
  { emoji: '😮', label: 'surprised' },
  { emoji: '😲', label: 'astonished' },
  { emoji: '😳', label: 'flushed' },
  { emoji: '🥺', label: 'pleading' },
  { emoji: '😞', label: 'disappointed' },
  { emoji: '😔', label: 'pensive' },
  { emoji: '😟', label: 'worried' },
  { emoji: '😣', label: 'persevering' },
  { emoji: '😖', label: 'confounded' },
  { emoji: '😫', label: 'tired' },
  { emoji: '😩', label: 'weary' },
  { emoji: '😤', label: 'huffing' },
  { emoji: '😠', label: 'angry' },
  { emoji: '😡', label: 'pouting' },
  { emoji: '👍', label: 'thumbs up' },
  { emoji: '👎', label: 'thumbs down' },
  { emoji: '👏', label: 'clapping' },
  { emoji: '🙌', label: 'raising hands' },
  { emoji: '🤝', label: 'handshake' },
  { emoji: '✋', label: 'raised hand' },
  { emoji: '👋', label: 'waving' },
  { emoji: '💪', label: 'flexed' },
  { emoji: '🧠', label: 'brain' },
  { emoji: '💡', label: 'lightbulb' },
  { emoji: '⭐', label: 'star' },
  { emoji: '🌟', label: 'glowing star' },
  { emoji: '🔥', label: 'fire' },
  { emoji: '💯', label: 'hundred' },
  { emoji: '✅', label: 'check' },
  { emoji: '❌', label: 'cross' },
  { emoji: '❓', label: 'question' },
  { emoji: '❗', label: 'exclamation' },
  { emoji: '🎯', label: 'target' },
  { emoji: '🏆', label: 'trophy' },
  { emoji: '🎉', label: 'party' },
  { emoji: '📚', label: 'books' },
  { emoji: '✏️', label: 'pencil' },
  { emoji: '🎵', label: 'music' },
  { emoji: '🎨', label: 'art' },
  { emoji: '🌿', label: 'nature' },
  { emoji: '🤸', label: 'acrobatics' },
  { emoji: '🗣️', label: 'speaking' },
  { emoji: '🧘', label: 'meditation' },
]

export function EmojiPicker({ value, onChange, className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return EMOJI_LIST
    const q = search.toLowerCase()
    return EMOJI_LIST.filter(e => e.label.toLowerCase().includes(q))
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('justify-center text-lg px-0', className)}
        >
          {value || '?'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-2' align='start'>
        <Input
          placeholder='Search emoji...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='mb-2'
          autoFocus
        />
        <div className='grid grid-cols-7 gap-1 max-h-40 overflow-y-auto'>
          {filtered.map(e => (
            <button
              key={e.emoji}
              type='button'
              title={e.label}
              onClick={() => {
                onChange(e.emoji)
                setOpen(false)
                setSearch('')
              }}
              className={cn(
                'flex items-center justify-center size-8 rounded-md hover:bg-accent text-lg transition-colors',
                value === e.emoji && 'bg-accent ring-1 ring-ring'
              )}
            >
              {e.emoji}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className='col-span-7 text-center text-sm text-muted-foreground py-4'>
              No emoji found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
