import { z } from 'zod'

// Contact form schema
export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(5, 'Email must be at least 5 characters'),
    subject: z
        .string()
        .min(5, 'Subject must be at least 5 characters')
        .max(100, 'Subject must not exceed 100 characters'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must not exceed 500 characters'),
})

// User registration schema
export const userRegistrationSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(30, 'First name must not exceed 30 characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(30, 'Last name must not exceed 30 characters'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z
        .string()
        .min(8, 'Please confirm your password'),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), 'Please enter a valid phone number'),
    age: z
        .number()
        .min(18, 'You must be at least 18 years old')
        .max(120, 'Please enter a valid age')
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

// Login form schema
export const loginFormSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
})

// Search form schema
export const searchFormSchema = z.object({
    query: z
        .string()
        .min(1, 'Search query is required')
        .max(100, 'Search query must not exceed 100 characters'),
    category: z
        .enum(['all', 'users', 'posts', 'comments'], {
            errorMap: () => ({ message: 'Please select a valid category' }),
        })
        .optional(),
    sortBy: z
        .enum(['relevance', 'date', 'popularity'], {
            errorMap: () => ({ message: 'Please select a valid sort option' }),
        })
        .optional(),
})

// Helper functions to get inferred types (for JSDoc comments)
// Usage: /** @type {ContactFormData} */
export const getContactFormType = () => contactFormSchema._output
export const getUserRegistrationFormType = () => userRegistrationSchema._output
export const getLoginFormType = () => loginFormSchema._output
export const getSearchFormType = () => searchFormSchema._output
