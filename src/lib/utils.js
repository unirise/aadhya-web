import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDate as formatDateDayjs, formatDateTime, formatRelativeTime } from './dateUtils'

/**
 * Combines class names using clsx and merges Tailwind CSS classes
 * @param {...(string|object|array)} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Formats a date to a readable string using Day.js
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'MMM D, YYYY')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'MMM D, YYYY') {
    return formatDateDayjs(date, format)
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, length, suffix = '...') {
    if (str.length <= length) return str
    return str.slice(0, length) + suffix
}

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
}