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
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-secondary text-secondary-foreground border-secondary hover:bg-accent hover:border-accent',
        className
      )}
    >
      <RadioGroupItem
        value={value}
        className={cn(
          'mt-2',
          isSelected
            ? 'border-primary-foreground text-primary-foreground'
            : 'border-muted-foreground text-muted-foreground'
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
  name?: string
  value?: string
  disabled?: boolean
  onChange?: () => void
  ariaLabel?: string
}

function InputDotRadio({ isSelected, className, name, value, disabled, onChange, ariaLabel }: InputDotRadioProps) {
  return (
    <>
      <input
        type='radio'
        name={name}
        value={value}
        checked={isSelected ?? false}
        disabled={disabled}
        onChange={onChange ?? (() => {})}
        aria-label={ariaLabel}
        tabIndex={-1}
        className='sr-only'
      />
      <div
        aria-hidden='true'
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
    </>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupOption, RadioButton, InputDotRadio }
