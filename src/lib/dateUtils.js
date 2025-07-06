import dayjs from './dayjs'

/**
 * Date utility functions using Day.js
 * Provides consistent date/time formatting and manipulation across the app
 */

// Basic formatting functions
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatTime = (date, format = 'HH:mm') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// Localized formatting
export const formatDateLocalized = (date, format = 'LL') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTimeLocalized = (date, format = 'LLL') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

// Relative time functions
export const formatRelativeTime = date => {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export const formatRelativeTimeStrict = date => {
  if (!date) return ''
  return dayjs(date).fromNow(true) // without suffix (ago/in)
}

export const formatTimeAgo = date => {
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
export const formatUTC = (date, format = 'YYYY-MM-DD HH:mm:ss [UTC]') => {
  if (!date) return ''
  return dayjs(date).utc().format(format)
}

export const formatTimezone = (
  date,
  timezone,
  format = 'YYYY-MM-DD HH:mm:ss z'
) => {
  if (!date) return ''
  return dayjs(date).tz(timezone).format(format)
}

export const toUTC = date => {
  if (!date) return null
  return dayjs(date).utc().toISOString()
}

export const fromUTC = date => {
  if (!date) return null
  return dayjs.utc(date).local()
}

// Date manipulation functions
export const addDays = (date, days) => {
  if (!date) return null
  return dayjs(date).add(days, 'day')
}

export const subtractDays = (date, days) => {
  if (!date) return null
  return dayjs(date).subtract(days, 'day')
}

export const addHours = (date, hours) => {
  if (!date) return null
  return dayjs(date).add(hours, 'hour')
}

export const subtractHours = (date, hours) => {
  if (!date) return null
  return dayjs(date).subtract(hours, 'hour')
}

export const startOfDay = date => {
  if (!date) return null
  return dayjs(date).startOf('day')
}

export const endOfDay = date => {
  if (!date) return null
  return dayjs(date).endOf('day')
}

export const startOfWeek = date => {
  if (!date) return null
  return dayjs(date).startOf('week')
}

export const endOfWeek = date => {
  if (!date) return null
  return dayjs(date).endOf('week')
}

export const startOfMonth = date => {
  if (!date) return null
  return dayjs(date).startOf('month')
}

export const endOfMonth = date => {
  if (!date) return null
  return dayjs(date).endOf('month')
}

// Comparison functions
export const isToday = date => {
  if (!date) return false
  return dayjs(date).isToday()
}

export const isYesterday = date => {
  if (!date) return false
  return dayjs(date).isYesterday()
}

export const isTomorrow = date => {
  if (!date) return false
  return dayjs(date).isTomorrow()
}

export const isSame = (date1, date2, unit = 'day') => {
  if (!date1 || !date2) return false
  return dayjs(date1).isSame(dayjs(date2), unit)
}

export const isBefore = (date1, date2, unit = 'day') => {
  if (!date1 || !date2) return false
  return dayjs(date1).isBefore(dayjs(date2), unit)
}

export const isAfter = (date1, date2, unit = 'day') => {
  if (!date1 || !date2) return false
  return dayjs(date1).isAfter(dayjs(date2), unit)
}

// Difference functions
export const diffInDays = (date1, date2) => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'day')
}

export const diffInHours = (date1, date2) => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'hour')
}

export const diffInMinutes = (date1, date2) => {
  if (!date1 || !date2) return 0
  return dayjs(date1).diff(dayjs(date2), 'minute')
}

// Validation functions
export const isValidDate = date => {
  return dayjs(date).isValid()
}

export const parseDate = (dateString, format) => {
  if (!dateString) return null
  const parsed = format ? dayjs(dateString, format) : dayjs(dateString)
  return parsed.isValid() ? parsed : null
}

// Current date/time functions
export const now = () => dayjs()
export const today = () => dayjs().startOf('day')
export const tomorrow = () => dayjs().add(1, 'day').startOf('day')
export const yesterday = () => dayjs().subtract(1, 'day').startOf('day')

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
}

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
