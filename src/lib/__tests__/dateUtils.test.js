import { describe, it, expect } from 'vitest'
import {
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeTime,
    formatTimeAgo,
    formatUTC,
    addDays,
    subtractDays,
    addHours,
    subtractHours,
    isToday,
    isYesterday,
    isTomorrow,
    isSame,
    isBefore,
    isAfter,
    diffInDays,
    diffInHours,
    isValidDate,
    parseDate,
    now,
    today,
    tomorrow,
    yesterday,
    DATE_FORMATS,
    dayjs
} from '../dateUtils'

describe('Date Utils', () => {
    const testDate = '2025-07-06T14:30:00Z'
    const testDate2 = '2025-07-07T14:30:00Z'

    describe('Formatting Functions', () => {
        it('should format date correctly', () => {
            expect(formatDate(testDate)).toBe('Jul 6, 2025')
            expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2025-07-06')
            expect(formatDate(testDate, DATE_FORMATS.SHORT)).toBe('07/06/2025')
        })

        it('should format datetime correctly', () => {
            const result = formatDateTime(testDate, 'YYYY-MM-DD HH:mm')
            expect(result).toMatch(/2025-07-06 \d{2}:\d{2}/)
        })

        it('should format time correctly', () => {
            const result = formatTime(testDate, 'HH:mm')
            expect(result).toMatch(/\d{2}:\d{2}/)
        })

        it('should handle empty/null dates', () => {
            expect(formatDate(null)).toBe('')
            expect(formatDate(undefined)).toBe('')
            expect(formatDate('')).toBe('')
        })

        it('should format UTC correctly', () => {
            const result = formatUTC(testDate)
            expect(result).toContain('UTC')
            expect(result).toContain('2025-07-06')
        })
    })

    describe('Relative Time Functions', () => {
        it('should format relative time', () => {
            const now = new Date()
            const pastDate = addDays(now, -2)
            const futureDate = addDays(now, 2)

            expect(formatRelativeTime(pastDate)).toContain('ago')
            expect(formatRelativeTime(futureDate)).toContain('in')
        })

        it('should format time ago with smart formatting', () => {
            const todayDate = new Date()
            const result = formatTimeAgo(todayDate)
            expect(result).toContain('Today at')
        })
    })

    describe('Date Manipulation Functions', () => {
        it('should add days correctly', () => {
            const result = addDays(testDate, 5)
            expect(formatDate(result, 'YYYY-MM-DD')).toBe('2025-07-11')
        })

        it('should subtract days correctly', () => {
            const result = subtractDays(testDate, 5)
            expect(formatDate(result, 'YYYY-MM-DD')).toBe('2025-07-01')
        })

        it('should add hours correctly', () => {
            const result = addHours(testDate, 5)
            expect(result).toBeDefined()
            expect(dayjs(result).isAfter(dayjs(testDate))).toBe(true)
        })

        it('should subtract hours correctly', () => {
            const result = subtractHours(testDate, 5)
            expect(result).toBeDefined()
            expect(dayjs(result).isBefore(dayjs(testDate))).toBe(true)
        })

        it('should handle null dates in manipulation functions', () => {
            expect(addDays(null, 5)).toBeNull()
            expect(subtractDays(null, 5)).toBeNull()
            expect(addHours(null, 5)).toBeNull()
            expect(subtractHours(null, 5)).toBeNull()
        })
    })

    describe('Comparison Functions', () => {
        it('should check if date is today', () => {
            const todayDate = new Date()
            expect(isToday(todayDate)).toBe(true)
            expect(isToday(testDate)).toBe(false)
        })

        it('should check if date is yesterday', () => {
            const yesterdayDate = subtractDays(new Date(), 1)
            expect(isYesterday(yesterdayDate)).toBe(true)
            expect(isYesterday(new Date())).toBe(false)
        })

        it('should check if date is tomorrow', () => {
            const tomorrowDate = addDays(new Date(), 1)
            expect(isTomorrow(tomorrowDate)).toBe(true)
            expect(isTomorrow(new Date())).toBe(false)
        })

        it('should compare dates correctly', () => {
            expect(isSame(testDate, testDate)).toBe(true)
            expect(isBefore(testDate, testDate2)).toBe(true)
            expect(isAfter(testDate2, testDate)).toBe(true)
        })

        it('should handle null dates in comparisons', () => {
            expect(isToday(null)).toBe(false)
            expect(isYesterday(null)).toBe(false)
            expect(isTomorrow(null)).toBe(false)
            expect(isSame(null, testDate)).toBe(false)
            expect(isBefore(null, testDate)).toBe(false)
            expect(isAfter(null, testDate)).toBe(false)
        })
    })

    describe('Difference Functions', () => {
        it('should calculate difference in days', () => {
            const diff = diffInDays(testDate2, testDate)
            expect(diff).toBe(1)
        })

        it('should calculate difference in hours', () => {
            const diff = diffInHours(testDate2, testDate)
            expect(diff).toBe(24)
        })

        it('should handle null dates in difference functions', () => {
            expect(diffInDays(null, testDate)).toBe(0)
            expect(diffInHours(testDate, null)).toBe(0)
        })
    })

    describe('Validation Functions', () => {
        it('should validate dates correctly', () => {
            expect(isValidDate(testDate)).toBe(true)
            expect(isValidDate('2025-07-06')).toBe(true)
            expect(isValidDate('invalid-date')).toBe(false)
            expect(isValidDate(null)).toBe(false)
        })

        it('should parse dates correctly', () => {
            const parsed = parseDate('2025-07-06')
            expect(parsed).toBeDefined()
            expect(parsed.isValid()).toBe(true)

            const invalidParsed = parseDate('invalid-date')
            expect(invalidParsed).toBeNull()

            const emptyParsed = parseDate('')
            expect(emptyParsed).toBeNull()
        })
    })

    describe('Current Date Functions', () => {
        it('should return current date functions', () => {
            expect(now()).toBeDefined()
            expect(today()).toBeDefined()
            expect(tomorrow()).toBeDefined()
            expect(yesterday()).toBeDefined()

            // Check that today is actually start of day
            const todayResult = today()
            expect(formatTime(todayResult)).toBe('00:00')
        })
    })

    describe('Date Format Constants', () => {
        it('should have all required format constants', () => {
            expect(DATE_FORMATS.SHORT).toBe('MM/DD/YYYY')
            expect(DATE_FORMATS.MEDIUM).toBe('MMM D, YYYY')
            expect(DATE_FORMATS.LONG).toBe('MMMM D, YYYY')
            expect(DATE_FORMATS.ISO).toBe('YYYY-MM-DD')
            expect(DATE_FORMATS.TIME_12).toBe('h:mm A')
            expect(DATE_FORMATS.TIME_24).toBe('HH:mm')
        })
    })

    describe('Day.js Instance Export', () => {
        it('should export dayjs instance', () => {
            expect(dayjs).toBeDefined()
            expect(typeof dayjs).toBe('function')

            // Test that plugins are loaded
            const testDayjs = dayjs()
            expect(typeof testDayjs.fromNow).toBe('function') // relativeTime plugin
            expect(typeof testDayjs.utc).toBe('function') // utc plugin
            expect(typeof testDayjs.isToday).toBe('function') // isToday plugin
        })
    })
})
