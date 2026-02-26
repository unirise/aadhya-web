import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useDotSize } from '@/hooks/useDotSize'
import { InputDotRadio } from '@/components/ui/radio-group'
import type { InputDotData, DotSizeTier } from '@/types/dot'

const DOT_DEBUG = true

interface InputDotProps {
  data: InputDotData
  className?: string
}

function radioProps(data: InputDotData) {
  return {
    isSelected: data.isSelected,
    name: data.groupName,
    value: data.value,
    disabled: data.isDisabled,
    onChange: () => data.onSelect(data.value),
    ariaLabel: data.ariaLabel ?? data.label,
  }
}

function InputDotXs({ data }: { data: InputDotData }) {
  return (
    <div className='flex items-center gap-2 w-full h-full px-2 py-1'>
      <InputDotRadio {...radioProps(data)} />
      <span className='text-xs font-bold flex-1 line-clamp-2'>
        {data.label}
      </span>
      {data.emoji && (
        <span
          className='text-base select-none flex-shrink-0'
          aria-hidden='true'
        >
          {data.emoji}
        </span>
      )}
    </div>
  )
}

function InputDotSm({ data }: { data: InputDotData }) {
  return (
    <div className='flex items-center gap-3 w-full h-full px-3 py-2'>
      <InputDotRadio {...radioProps(data)} />
      <span className='text-sm font-bold flex-1 line-clamp-2'>
        {data.label}
      </span>
      {data.emoji && (
        <span className='text-xl select-none flex-shrink-0' aria-hidden='true'>
          {data.emoji}
        </span>
      )}
    </div>
  )
}

function InputDotMd({ data }: { data: InputDotData }) {
  return (
    <div className='flex items-center gap-4 w-full h-full px-4 py-3'>
      <InputDotRadio {...radioProps(data)} />
      <span className='text-base font-bold flex-1 line-clamp-2'>
        {data.label}
      </span>
      {data.emoji && (
        <span className='text-3xl select-none flex-shrink-0' aria-hidden='true'>
          {data.emoji}
        </span>
      )}
    </div>
  )
}

function InputDotLg({ data }: { data: InputDotData }) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 w-full h-full p-4'>
      {data.emoji && (
        <span className='text-4xl select-none' aria-hidden='true'>
          {data.emoji}
        </span>
      )}
      <span className='text-lg font-bold text-center'>{data.label}</span>
      <InputDotRadio {...radioProps(data)} />
    </div>
  )
}

function InputDotXl({ data }: { data: InputDotData }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 w-full h-full p-6'>
      {data.emoji && (
        <span className='text-5xl select-none' aria-hidden='true'>
          {data.emoji}
        </span>
      )}
      <span className='text-xl font-bold text-center'>{data.label}</span>
      <InputDotRadio {...radioProps(data)} />
    </div>
  )
}

const tierRenderers: Record<DotSizeTier, React.FC<{ data: InputDotData }>> = {
  xs: InputDotXs,
  sm: InputDotSm,
  md: InputDotMd,
  lg: InputDotLg,
  xl: InputDotXl,
}

export function InputDot({ data, className }: InputDotProps) {
  const ref = useRef<HTMLLabelElement>(null)
  const tier = useDotSize(ref)

  useEffect(() => {
    if (data.isFocused && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      if (document.activeElement !== ref.current) {
        ref.current.focus({ preventScroll: true })
      }
    } else if (
      !data.isFocused &&
      ref.current &&
      document.activeElement === ref.current
    ) {
      ref.current.blur()
    }
  }, [data.isFocused])

  const focusClasses = data.isFocused
    ? 'border-none outline outline-[3px] outline-focus outline-offset-[-4px]'
    : 'border border-border hover:border-primary/20'

  const stateClasses = data.isSelected
    ? 'bg-primary text-primary-foreground'
    : 'bg-card text-foreground hover:bg-accent hover:text-accent-foreground'

  const TierComponent = tierRenderers[tier]

  return (
    <label
      ref={ref}
      id={data.id}
      tabIndex={data.isFocused ? 0 : -1}
      className={cn(
        'h-full relative rounded-xl transition-all duration-300 overflow-hidden w-full min-h-[80px] cursor-pointer select-none block',
        data.isDisabled && 'opacity-50 cursor-not-allowed',
        focusClasses,
        stateClasses,
        className
      )}
    >
      <TierComponent data={data} />
      {DOT_DEBUG && (
        <span
          aria-hidden='true'
          className='absolute bottom-0.5 right-1 text-[8px] leading-none text-muted-foreground/50 pointer-events-none select-none'
        >
          {tier}
        </span>
      )}
    </label>
  )
}
