import { useState, useEffect, useCallback, useRef } from 'react'

export type Section = 'header' | 'content' | 'footer'
export type Zone = 'main' | 'panel'

export interface FocusPosition {
  section: Section
  zone: Zone
  index: number
}

interface UseKeyboardNavigationConfig {
  headerCount: number
  contentCount?: number
  panelCount: number
  footerCount: number
  footerWindowStart?: number
  footerWindowEnd?: number
  isMobile?: boolean
  onActivate?: (position: FocusPosition) => void
  onFooterBoundary?: (direction: 'left' | 'right') => void
}

export function useKeyboardNavigation({
  headerCount,
  contentCount = 1,
  panelCount,
  footerCount,
  footerWindowStart = 0,
  footerWindowEnd,
  isMobile = false,
  onActivate,
  onFooterBoundary,
}: UseKeyboardNavigationConfig) {
  const visibleEnd = footerWindowEnd ?? footerCount - 1
  const [focus, setFocus] = useState<FocusPosition>({
    section: 'header',
    zone: 'main',
    index: 0,
  })

  const onActivateRef = useRef(onActivate)
  onActivateRef.current = onActivate
  const onFooterBoundaryRef = useRef(onFooterBoundary)
  onFooterBoundaryRef.current = onFooterBoundary

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const { section, zone, index } = focus

      switch (e.key) {
        case 'Tab': {
          e.preventDefault()
          const positions: FocusPosition[] = [
            ...Array.from({ length: headerCount }, (_, i) => ({
              section: 'header' as Section,
              zone: 'main' as Zone,
              index: i,
            })),
            ...Array.from({ length: contentCount }, (_, i) => ({
              section: 'content' as Section,
              zone: 'main' as Zone,
              index: i,
            })),
            ...Array.from({ length: panelCount }, (_, i) => ({
              section: 'content' as Section,
              zone: 'panel' as Zone,
              index: i,
            })),
            ...Array.from({ length: footerCount }, (_, i) => ({
              section: 'footer' as Section,
              zone: 'main' as Zone,
              index: i,
            })),
          ]
          const currentIdx = positions.findIndex(
            p => p.section === section && p.zone === zone && p.index === index
          )
          const total = positions.length
          const base = currentIdx < 0 ? 0 : currentIdx
          const nextIdx = e.shiftKey
            ? (base - 1 + total) % total
            : (base + 1) % total
          setFocus(positions[nextIdx])
          break
        }

        case 'ArrowUp': {
          e.preventDefault()
          if (section === 'header') break
          if (section === 'content') {
            if (zone === 'panel') {
              if (isMobile) {
                setFocus({ section: 'content', zone: 'main', index: 0 })
              } else {
                if (index > 0) {
                  setFocus({
                    section: 'content',
                    zone: 'panel',
                    index: index - 1,
                  })
                } else {
                  setFocus({
                    section: 'header',
                    zone: 'main',
                    index: headerCount - 1,
                  })
                }
              }
            } else {
              setFocus({ section: 'header', zone: 'main', index: 0 })
            }
          }
          if (section === 'footer') {
            if (isMobile && panelCount > 0) {
              setFocus({ section: 'content', zone: 'panel', index: 0 })
            } else {
              setFocus({ section: 'content', zone: 'main', index: 0 })
            }
          }
          break
        }

        case 'ArrowDown': {
          e.preventDefault()
          if (section === 'header') {
            setFocus({ section: 'content', zone: 'main', index: 0 })
          }
          if (section === 'content') {
            if (zone === 'panel') {
              if (isMobile) {
                if (footerCount > 0) {
                  setFocus({
                    section: 'footer',
                    zone: 'main',
                    index: footerWindowStart,
                  })
                }
              } else {
                if (index < panelCount - 1) {
                  setFocus({
                    section: 'content',
                    zone: 'panel',
                    index: index + 1,
                  })
                } else if (footerCount > 0) {
                  setFocus({
                    section: 'footer',
                    zone: 'main',
                    index: visibleEnd,
                  })
                }
              }
            } else {
              if (isMobile) {
                if (panelCount > 0) {
                  setFocus({ section: 'content', zone: 'panel', index: 0 })
                } else if (footerCount > 0) {
                  setFocus({
                    section: 'footer',
                    zone: 'main',
                    index: footerWindowStart,
                  })
                }
              } else {
                if (footerCount > 0) {
                  setFocus({
                    section: 'footer',
                    zone: 'main',
                    index: footerWindowStart,
                  })
                }
              }
            }
          }
          if (section === 'footer') break
          break
        }

        case 'ArrowLeft': {
          e.preventDefault()
          if (section === 'header') {
            if (index > 0)
              setFocus({ section: 'header', zone: 'main', index: index - 1 })
          }
          if (section === 'content') {
            if (zone === 'panel') {
              if (isMobile) {
                if (index > 0) {
                  setFocus({
                    section: 'content',
                    zone: 'panel',
                    index: index - 1,
                  })
                } else {
                  setFocus({ section: 'content', zone: 'main', index: 0 })
                }
              } else {
                setFocus({
                  section: 'content',
                  zone: 'main',
                  index: contentCount - 1,
                })
              }
            } else if (index > 0) {
              setFocus({ section: 'content', zone: 'main', index: index - 1 })
            }
          }
          if (section === 'footer') {
            if (index > 0) {
              setFocus({ section: 'footer', zone: 'main', index: index - 1 })
            } else {
              onFooterBoundaryRef.current?.('left')
            }
          }
          break
        }

        case 'ArrowRight': {
          e.preventDefault()
          if (section === 'header') {
            if (index < headerCount - 1) {
              setFocus({ section: 'header', zone: 'main', index: index + 1 })
            }
          }
          if (section === 'content') {
            if (zone === 'main') {
              if (index < contentCount - 1) {
                setFocus({ section: 'content', zone: 'main', index: index + 1 })
              } else if (!isMobile && panelCount > 0) {
                setFocus({ section: 'content', zone: 'panel', index: 0 })
              }
            } else if (zone === 'panel' && isMobile) {
              if (index < panelCount - 1) {
                setFocus({
                  section: 'content',
                  zone: 'panel',
                  index: index + 1,
                })
              }
            }
          }
          if (section === 'footer') {
            if (index < footerCount - 1) {
              setFocus({ section: 'footer', zone: 'main', index: index + 1 })
            } else {
              onFooterBoundaryRef.current?.('right')
            }
          }
          break
        }

        case 'Enter':
        case ' ': {
          e.preventDefault()
          onActivateRef.current?.(focus)
          break
        }
      }
    },
    [
      focus,
      headerCount,
      contentCount,
      panelCount,
      footerCount,
      footerWindowStart,
      visibleEnd,
      isMobile,
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const isFocused = useCallback(
    (section: Section, index: number, zone: Zone = 'main') => {
      return (
        focus.section === section &&
        focus.zone === zone &&
        focus.index === index
      )
    },
    [focus]
  )

  return { focus, setFocus, isFocused }
}
