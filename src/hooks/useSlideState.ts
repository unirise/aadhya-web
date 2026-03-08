import { useState, useEffect, useCallback } from 'react'

const DEFAULT_STORAGE_KEY = 'aadhya-activity-state'

interface SlideState {
  currentSlide: number
  currentSlideIndex: number
  visitedSlides: Set<number>
  next: () => void
  nextSlide: () => void
  prev: () => void
  goToSlide: (index: number) => void
  getPanelSlides: () => number[]
  isVisited: (index: number) => boolean
  resetState: () => void
}

export function useSlideState(
  totalSlides: number,
  storageKey: string = DEFAULT_STORAGE_KEY
): SlideState {
  const currentKey = `presentation-current-slide-${storageKey}`
  const visitedKey = `presentation-visited-slides-${storageKey}`

  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    const stored = localStorage.getItem(currentKey)
    return stored ? parseInt(stored, 10) : 0
  })

  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(() => {
    const stored = localStorage.getItem(visitedKey)
    return stored ? new Set(JSON.parse(stored)) : new Set([0])
  })

  useEffect(() => {
    localStorage.setItem(currentKey, currentSlide.toString())
  }, [currentSlide, currentKey])

  useEffect(() => {
    localStorage.setItem(visitedKey, JSON.stringify(Array.from(visitedSlides)))
  }, [visitedSlides, visitedKey])

  const next = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      const nextIndex = currentSlide + 1
      setCurrentSlide(nextIndex)
      setVisitedSlides(prev => new Set([...prev, nextIndex]))
    }
  }, [currentSlide, totalSlides])

  const nextSlide = next

  const prev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }, [currentSlide])

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index)
        setVisitedSlides(prev => new Set([...prev, index]))
      }
    },
    [totalSlides]
  )

  const getPanelSlides = useCallback((): number[] => {
    const others = Array.from({ length: totalSlides }, (_, i) => i).filter(
      i => i !== currentSlide
    )
    const unvisited = others.filter(i => !visitedSlides.has(i))
    const pool = unvisited.length > 0 ? unvisited : others
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [totalSlides, visitedSlides, currentSlide])

  const isVisited = useCallback(
    (index: number) => visitedSlides.has(index),
    [visitedSlides]
  )

  const resetState = useCallback(() => {
    setCurrentSlide(0)
    setVisitedSlides(new Set([0]))
  }, [])

  return {
    currentSlide,
    currentSlideIndex: currentSlide,
    visitedSlides,
    next,
    nextSlide,
    prev,
    goToSlide,
    getPanelSlides,
    isVisited,
    resetState,
  }
}
