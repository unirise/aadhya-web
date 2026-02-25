import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'
import { CSSProperties } from 'react'

/**
 * Custom hook for creating forms with Zod validation
 * @param schema - Zod schema for validation
 * @param defaultValues - Default form values
 * @param onSubmit - Submit handler function
 * @returns Form methods and state
 */
export const useZodForm = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues: DefaultValues<T> = {} as DefaultValues<T>,
  onSubmit: ((data: T) => Promise<void> | void) | null = null
) => {
  const form = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onChange', // Validate on change for better UX
  })

  const handleSubmit = form.handleSubmit(async (data: T) => {
    if (onSubmit) {
      try {
        await onSubmit(data)
      } catch (error) {
        console.error('Form submission error:', error)
        // You can add global error handling here
      }
    }
  })

  return {
    ...form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
  }
}

/**
 * Helper function to get error message for a field
 * @param errors - Form errors object
 * @param fieldName - Field name
 * @returns Error message or null
 */
export const getFieldError = (
  errors: UseFormReturn['formState']['errors'],
  fieldName: string
): string | null => {
  const error = errors[fieldName]
  return error?.message as string | null
}

interface FieldProps {
  style: CSSProperties
  'aria-invalid': boolean
  'aria-describedby'?: string
}

/**
 * Helper function to get field props for consistent styling
 * @param errors - Form errors object
 * @param fieldName - Field name
 * @returns Field props with styling
 */
export const getFieldProps = (
  errors: UseFormReturn['formState']['errors'],
  fieldName: string
): FieldProps => {
  const hasError = !!errors[fieldName]

  return {
    style: {
      width: '100%',
      padding: '8px 12px',
      border: hasError ? '1px solid #ef4444' : '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${fieldName}-error` : undefined,
  }
}

/**
 * Common form field styles
 */
export const formStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: {
    border: '1px solid #ef4444',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '80px',
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#1d4ed8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  buttonSecondary: {
    backgroundColor: '#6b7280',
    color: 'white',
  },
} as const
