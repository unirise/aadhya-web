import { describe, it, expect } from 'vitest'
import { cn, formatDate, capitalize, truncate } from '../utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe(
        'class1 class2'
      )
    })

    it('handles undefined and null values', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
    })

    it('handles empty input', () => {
      expect(cn()).toBe('')
    })

    it('handles arrays', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2')
    })

    it('handles objects', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe(
        'class1 class3'
      )
    })
  })

  describe('formatDate function', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/January 15, 2025/)
    })

    it('handles string input', () => {
      const formatted = formatDate('2025-01-15')
      expect(formatted).toMatch(/January 15, 2025/)
    })
  })

  describe('capitalize function', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('handles already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A')
    })
  })

  describe('truncate function', () => {
    it('truncates long string', () => {
      expect(truncate('This is a very long string', 10)).toBe('This is a ...')
    })

    it('does not truncate short string', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })

    it('uses custom suffix', () => {
      expect(truncate('This is a very long string', 10, '---')).toBe(
        'This is a ---'
      )
    })
  })
})
