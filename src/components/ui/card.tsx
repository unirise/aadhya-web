import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-lg border shadow-sm', className)}
        {...rest}
      />
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...rest}
    />
  )
})
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...rest }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  )
})
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => {
  return (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...rest} />
  )
})
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...rest} />
})
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...rest}
    />
  )
})
CardFooter.displayName = 'CardFooter'
