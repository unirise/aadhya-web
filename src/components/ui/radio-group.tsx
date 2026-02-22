import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
        <Circle className='h-2.5 w-2.5 fill-current text-current' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

interface RadioGroupOptionProps {
  value: string
  emoji: string
  label: string
  isSelected: boolean
  className?: string
}

const RadioGroupOption = React.forwardRef<
  HTMLLabelElement,
  RadioGroupOptionProps
>(({ value, emoji, label, isSelected, className }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'flex-1 min-w-[140px] p-5 px-4',
        'text-lg font-bold rounded-xl border-3 transition-all',
        'flex flex-row items-center justify-between gap-2 text-center',
        'select-none cursor-pointer',
        isSelected
          ? 'bg-sky-600 text-white border-sky-600'
          : 'bg-sky-100 text-gray-800 border-sky-100 hover:bg-sky-200 hover:border-sky-200',
        className
      )}
    >
      <RadioGroupItem
        value={value}
        className={cn(
          'mt-2',
          isSelected
            ? 'border-white text-white'
            : 'border-gray-400 text-gray-400'
        )}
      />
      <span className='select-none pointer-events-none bg-transparent'>
        {label}
      </span>
      <span className='text-4xl select-none pointer-events-none bg-transparent'>
        {emoji}
      </span>
    </label>
  )
})
RadioGroupOption.displayName = 'RadioGroupOption'

const RadioButton = RadioGroupItem

interface InputDotRadioProps {
  isSelected?: boolean
  className?: string
}

function InputDotRadio({ isSelected, className }: InputDotRadioProps) {
  return (
    <div
      className={cn(
        'h-5 w-5 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0',
        isSelected ? 'opacity-100' : 'opacity-50',
        className
      )}
    >
      {isSelected && (
        <Circle className='h-3 w-3 fill-current text-current' />
      )}
    </div>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupOption, RadioButton, InputDotRadio }
