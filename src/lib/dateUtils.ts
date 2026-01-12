import dayjs, { Dayjs, ConfigType, OpUnitType, ManipulateType } from 'dayjs'
import './dayjs' // Import to ensure plugins are loaded

/**
 * Date utility functions using Day.js
 * Provides consistent date/time formatting and manipulation across the app
 */

// Basic formatting functions
export const formatDate = (date: ConfigType, format = 'YYYY-MM-DD'): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTime = (date: ConfigType, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatTime = (date: ConfigType, format = 'HH:mm'): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// Localized formatting
export const formatDateLocalized = (date: ConfigType, format = 'LL'): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTimeLocalized = (date: ConfigType, format = 'LLL'): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// Relative time functions
export const formatRelativeTime = (date: ConfigType): string => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export const formatRelativeTimeStrict = (date: ConfigType): string => {
  if (!date) return ''
  return dayjs(date).fromNow(true) // without suffix (ago/in)
}

export const formatTimeAgo = (date: ConfigType): string => {
  if (!date) return ''
  const now = dayjs()
  const target = dayjs(date)

  if (target.isToday()) {
    return `Today at ${target.format('HH:mm')}`
  } else if (target.isYesterday()) {
    return `Yesterday at ${target.format('HH:mm')}`
  } else if (target.isTomorrow()) {
    return `Tomorrow at ${target.format('HH:mm')}`
  } else if (now.diff(target, 'day') < 7) {
    return target.format('dddd [at] HH:mm')
  } else {
    return target.format('MMM D, YYYY [at] HH:mm')
  }
}

// UTC and timezone functions
export const formatUTC = (date: ConfigType, format = 'YYYY-MM-DD HH:mm:ss [UTC]'): string => {
  if (!date) return ''
  return dayjs(date).utc().format(format)
}

export const formatTimezone = (
  date: ConfigType,
  timezone: string,
  format = 'YYYY-MM-DD HH:mm:ss z'
): string => {
  if (!date) return ''
  return dayjs(date).tz(timezone).format(format)
}

export const toUTC = (date: ConfigType): string | null => {
  if (!date) return null
  return dayjs(date).utc().toISOString()
}

export const fromUTC = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs.utc(date).local()
}

// Date manipulation functions
export const addDays = (date: ConfigType, days: number): Dayjs | null => {
  if (!date) return null
  return dayjs(date).add(days, 'day')
}

export const subtractDays = (date: ConfigType, days: number): Dayjs | null => {
  if (!date) return null
  return dayjs(date).subtract(days, 'day')
}

export const addHours = (date: ConfigType, hours: number): Dayjs | null => {
  if (!date) return null
  return dayjs(date).add(hours, 'hour')
}

export const subtractHours = (date: ConfigType, hours: number): Dayjs | null => {
  if (!date) return null
  return dayjs(date).subtract(hours, 'hour')
}

export const startOfDay = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).startOf('day')
}

export const endOfDay = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).endOf('day')
}

export const startOfWeek = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).startOf('week')
}

export const endOfWeek = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).endOf('week')
}

export const startOfMonth = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).startOf('month')
}

export const endOfMonth = (date: ConfigType): Dayjs | null => {
  if (!date) return null
  return dayjs(date).endOf('month')
}

// Comparison functions
export const isToday = (date: ConfigType): boolean => {
  if (!date) return false
  return dayjs(date).isToday()
}

export const isYesterday = (date: ConfigType): boolean => {
  if (!date) return false
  return dayjs(date).isYesterday()
}

export const isTomorrow = (date: ConfigType): boolean => {
  if (!date) return false
  return dayjs(date).isTomorrow()
}

export const isSame = (date1: ConfigType, date2: ConfigType, unit: OpUnitType = 'day'): boolean => {
  if (!date1 || !date2) return false
  return dayjs(date1).isSame(dayjs(date2), unit)
}

export const isBefore = (date1: ConfigType, date2: ConfigType, unit: OpUnitType = 'day'): boolean => {
  if (!date1 || !date2) return false
  return dayjs(date1).isBefore(dayjs(date2), unit)
}

export const isAfter = (date1: ConfigType, date2: ConfigType, unit: OpUnitType = 'day'): boolean => {
  if (!date1 || !date2) return false
  return dayjs(date1).isAfter(dayjs(date2), unit)
}

// Difference functions
export const diffInDays = (date1: ConfigType, date2: ConfigType): number => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'day')
}

export const diffInHours = (date1: ConfigType, date2: ConfigType): number => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'hour')
}

export const diffInMinutes = (date1: ConfigType, date2: ConfigType): number => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'minute')
}

// Validation functions
export const isValidDate = (date: ConfigType): boolean => {
  return dayjs(date).isValid()
}

export const parseDate = (dateString: string, format?: string): Dayjs | null => {
  if (!dateString) return null
  const parsed = format ? dayjs(dateString, format) : dayjs(dateString)
  return parsed.isValid() ? parsed : null
}

// Current date/time functions
export const now = (): Dayjs => dayjs()
export const today = (): Dayjs => dayjs().startOf('day')
export const tomorrow = (): Dayjs => dayjs().add(1, 'day').startOf('day')
export const yesterday = (): Dayjs => dayjs().subtract(1, 'day').startOf('day')

// Common date formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  MEDIUM: 'MMM D, YYYY',
  LONG: 'MMMM D, YYYY',
  ISO: 'YYYY-MM-DD',
  TIME_12: 'h:mm A',
  TIME_24: 'HH:mm',
  DATETIME_SHORT: 'MM/DD/YYYY h:mm A',
  DATETIME_MEDIUM: 'MMM D, YYYY h:mm A',
  DATETIME_LONG: 'MMMM D, YYYY h:mm A',
  DATETIME_ISO: 'YYYY-MM-DD HH:mm:ss',
} as const

// Export dayjs instance for direct use if needed
export { dayjs }

// Export default object with all functions
export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatDateLocalized,
  formatDateTimeLocalized,
  formatRelativeTime,
  formatRelativeTimeStrict,
  formatTimeAgo,
  formatUTC,
  formatTimezone,
  toUTC,
  fromUTC,
  addDays,
  subtractDays,
  addHours,
  subtractHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isYesterday,
  isTomorrow,
  isSame,
  isBefore,
  isAfter,
  diffInDays,
  diffInHours,
  diffInMinutes,
  isValidDate,
  parseDate,
  now,
  today,
  tomorrow,
  yesterday,
  DATE_FORMATS,
  dayjs,
}

