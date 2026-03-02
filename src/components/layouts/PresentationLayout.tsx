import {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Zap, Moon, Sun, Sunrise, Sunset } from 'lucide-react'
import { Dot } from '@/components/dots/Dot'
import { Media } from '@/components/blocks/content/Media'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { Panel } from '@/components/sections/Panel'
import { FluidLayout } from '@/components/sections/FluidLayout'
import { FluidContentPanel } from '@/components/sections/FluidContentPanel'
import { useSlideState } from '@/hooks/useSlideState'
import { useTheme } from '@/contexts/ThemeContext'
import {
  useKeyboardNavigation,
  type FocusPosition,
} from '@/hooks/useKeyboardNavigation'
import { NavigationProvider } from '@/contexts/NavigationContext'
import type { DotData } from '@/types/dot'

interface PresentationLayoutProps {
  activities: DotData[]
  storageKey?: string
  assessmentName?: string
  renderPanel?: (currentIndex: number) => ReactNode
  getCanAdvance?: (currentIndex: number) => boolean
  onComplete?: () => void
}

export function PresentationLayout({
  activities,
  storageKey = 'aadhya-activity-state',
  assessmentName,
  renderPanel: customRenderPanel,
  getCanAdvance,
  onComplete,
}: PresentationLayoutProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const {
    currentSlideIndex,
    goToSlide,
    nextSlide,
    isVisited,
    getPanelSlides,
    resetState,
  } = useSlideState(activities.length, storageKey)

  const onHome = useCallback(() => navigate('/'), [navigate])

  const activeItem = activities[currentSlideIndex]

  const panelItems: DotData[] = useMemo(() => {
    if (customRenderPanel) return []
    const indices = getPanelSlides()
    return indices.map(index => ({
      ...activities[index],
      isVisited: isVisited(index),
    }))
  }, [getPanelSlides, activities, customRenderPanel, isVisited])

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, zone, index } = position
      if (section === 'header') {
        ;[onHome, resetState, toggleTheme][index]?.()
      } else if (section === 'content' && zone === 'main') {
        if (getCanAdvance?.(currentSlideIndex) === false) return
        if (currentSlideIndex >= activities.length - 1) {
          onComplete?.()
        } else {
          nextSlide()
        }
      } else if (section === 'content' && zone === 'panel') {
        const panelIndices = getPanelSlides()
        const targetIndex = panelIndices[index]
        if (targetIndex !== undefined) goToSlide(targetIndex)
      } else if (section === 'footer') {
        goToSlide(index)
      }
    },
    [
      onHome,
      resetState,
      toggleTheme,
      nextSlide,
      getPanelSlides,
      goToSlide,
      getCanAdvance,
      onComplete,
      currentSlideIndex,
      activities.length,
    ]
  )

  const maxVisible = isMobile ? 5 : 7
  const footerWindowStart = useMemo(() => {
    const total = activities.length
    if (total <= maxVisible) return 0
    const center = Math.floor((maxVisible - 1) / 2)
    return Math.max(0, Math.min(currentSlideIndex - center, total - maxVisible))
  }, [currentSlideIndex, activities.length, maxVisible])

  const footerWindowEnd = Math.min(
    footerWindowStart + maxVisible - 1,
    activities.length - 1
  )

  const { focus, setFocus, isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: panelItems.length,
    footerCount: activities.length,
    footerWindowStart,
    footerWindowEnd,
    isMobile,
    onActivate: handleActivate,
  })

  const navContextValue = useMemo(
    () => ({ focus, setFocus, isFocused }),
    [focus, setFocus, isFocused]
  )

  const hasInitialFocus = useRef(false)
  useEffect(() => {
    if (hasInitialFocus.current) return
    hasInitialFocus.current = true
    const el = document.getElementById('presentation-focus-start')
    if (el && typeof el.focus === 'function') {
      requestAnimationFrame(() => {
        el.focus({ preventScroll: true })
      })
    }
  }, [])

  const handleNext = useCallback(() => {
    setFocus({ section: 'content', zone: 'main', index: 0 })
    if (getCanAdvance?.(currentSlideIndex) === false) return
    if (currentSlideIndex >= activities.length - 1) onComplete?.()
    else nextSlide()
  }, [
    setFocus,
    getCanAdvance,
    currentSlideIndex,
    activities.length,
    onComplete,
    nextSlide,
  ])

  // --- Build DotData arrays ---

  const headerItems: DotData[] = useMemo(
    () => [
      {
        id: 'presentation-focus-start',
        label: 'Home',
        icon: <Home className='w-5 h-5' />,
        ariaLabel: 'Home \u2014 return to home page',
        isFocused: isFocused('header', 0),
        onClick: () => {
          setFocus({ section: 'header', zone: 'main', index: 0 })
          onHome()
        },
      },
      {
        id: 'logo',
        label: 'Logo',
        icon: <Zap className='w-5 h-5' />,
        ariaLabel: 'Reset to the beginning',
        isFocused: isFocused('header', 1),
        onClick: () => {
          setFocus({ section: 'header', zone: 'main', index: 1 })
          resetState()
        },
      },
      {
        id: 'theme',
        label: 'Theme',
        icon: { morning: <Sunrise className='w-5 h-5' />, afternoon: <Sun className='w-5 h-5' />, evening: <Sunset className='w-5 h-5' />, night: <Moon className='w-5 h-5' /> }[theme],
        ariaLabel: `Current theme: ${theme}. Click to switch.`,
        isFocused: isFocused('header', 2),
        onClick: () => {
          setFocus({ section: 'header', zone: 'main', index: 2 })
          toggleTheme()
        },
      },
    ],
    [theme, isFocused, setFocus, onHome, resetState, toggleTheme]
  )

  const footerDots: DotData[] = useMemo(
    () =>
      activities.map((item, i) => ({
        ...item,
        isActive: i === currentSlideIndex,
        isVisited: isVisited(i),
        isFocused: isFocused('footer', i),
        onClick: () => {
          setFocus({ section: 'footer', zone: 'main', index: i })
          goToSlide(i)
        },
      })),
    [activities, currentSlideIndex, isVisited, isFocused, setFocus, goToSlide]
  )

  const panelDotsWithFocus: DotData[] = useMemo(() => {
    const panelIndices = getPanelSlides()
    return panelItems.map((item, i) => ({
      ...item,
      isFocused: isFocused('content', i, 'panel'),
      onClick: () => {
        setFocus({ section: 'content', zone: 'panel', index: i })
        goToSlide(panelIndices[i])
      },
    }))
  }, [panelItems, isFocused, setFocus, goToSlide, getPanelSlides])

  if (activities.length === 0) {
    return (
      <FluidLayout
        layoutId='presentation'
        defaultSizes={[10, 80, 10]}
        header={<Header items={headerItems} />}
        footer={
          <footer className='w-full h-full bg-background/80 backdrop-blur-sm z-50' />
        }
        className='p-2 sm:p-4'
      >
        <main
          aria-label='Activity content'
          className='flex flex-col items-center justify-center h-full p-4'
        >
          <p className='text-muted-foreground'>No activities to show.</p>
        </main>
      </FluidLayout>
    )
  }

  // --- Content dot for xl tier ---
  const contentDot: DotData = {
    id: activeItem?.id ?? 'content',
    icon: activeItem?.icon ?? Home,
    label: activeItem?.label ?? '',
    title: activeItem?.title ?? '',
    subtitle: activeItem?.subtitle,
    largeText: activeItem?.largeText ?? [],
    media: activeItem ? (
      <Media
        item={{
          key: activeItem.key ?? activeItem.id,
          label: activeItem.label,
          title: activeItem.title ?? '',
          subtitle: activeItem.subtitle,
          icon: activeItem.icon,
          diagram: typeof activeItem.media === 'string' ? activeItem.media : undefined,
        }}
        onClick={handleNext}
        className='bg-transparent border-0 shadow-none rounded-none'
      />
    ) : undefined,
    onClick: handleNext,
    isFocused: isFocused('content', 0, 'main'),
    canAdvance: getCanAdvance?.(currentSlideIndex) ?? true,
    buttonText: 'Next',
  }

  const contentJsx = (
    <div className='w-full h-full rounded-2xl bg-card border divide-y lg:divide-y-0 lg:divide-x overflow-hidden'>
      <Dot data={contentDot} className='rounded-2xl' />
    </div>
  )

  const panelJsx = (
    <div className='h-full overflow-hidden min-h-0'>
      {customRenderPanel ? (
        <aside
          className='h-full flex flex-col overflow-hidden'
          aria-label='Panel'
        >
          {customRenderPanel(currentSlideIndex)}
        </aside>
      ) : (
        <Panel items={panelDotsWithFocus} />
      )}
    </div>
  )

  return (
    <NavigationProvider value={navContextValue}>
      <FluidLayout
        layoutId='presentation'
        defaultSizes={[15, 70, 15]}
        header={
          <Header
            items={headerItems}
            trailing={
              assessmentName ? (
                <div className='text-sm text-muted-foreground ml-auto'>
                  Activity {currentSlideIndex + 1} of {activities.length}
                </div>
              ) : undefined
            }
          />
        }
        footer={
          <Footer
            items={footerDots}
            currentIndex={currentSlideIndex}
          />
        }
        className='p-2 sm:p-4'
      >
        <main
          aria-label='Activity content'
          className='w-full h-full overflow-hidden min-h-0'
        >
          {isMobile ? (
            <div className='flex flex-col w-full h-full overflow-hidden gap-2 sm:gap-4 min-h-0'>
              {contentJsx}
              {panelJsx}
            </div>
          ) : (
            <FluidContentPanel
              layoutId='presentation'
              content={contentJsx}
              panel={panelJsx}
              defaultSizes={[80, 20]}
            />
          )}
        </main>
      </FluidLayout>
    </NavigationProvider>
  )
}
