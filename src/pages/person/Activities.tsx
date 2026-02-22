import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Home, Zap, Moon, Sun, ZapIcon, HomeIcon } from 'lucide-react'
import { activitiesApi } from '@/services/activitiesApi'
import { Header } from '@/components/sections/Header'
import { Panel } from '@/components/sections/Panel'
import { Footer, getFooterWindow } from '@/components/sections/Footer'
import { FluidLayout } from '@/components/sections/FluidLayout'
import { FluidContentPanel } from '@/components/sections/FluidContentPanel'
import { Dot } from '@/components/dots/Dot'
import { Media } from '@/components/blocks/content/Media'
import { mapActivitiesToDotData } from '@/lib/mapActivityToPresentationItem'
import type { ApiActivity } from '@/lib/mapActivityToPresentationItem'
import { useSlideState } from '@/hooks/useSlideState'
import { useTheme } from '@/contexts/ThemeContext'
import {
  useKeyboardNavigation,
  type FocusPosition,
} from '@/hooks/useKeyboardNavigation'
import { NavigationProvider } from '@/contexts/NavigationContext'
import type { DotData, InputDotData } from '@/types/dot'

export default function Activities() {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [rawActivities, setRawActivities] = useState<ApiActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!assessmentId) {
        setError('Assessment ID is required')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        const [activitiesRes, responsesRes] = await Promise.all([
          activitiesApi.fetchActivities(100, 1, assessmentId),
          activitiesApi.fetchMyResponses(),
        ])
        const data =
          (
            activitiesRes as {
              data?: { questions?: ApiActivity[] }
              questions?: ApiActivity[]
            }
          ).data ?? (activitiesRes as { questions?: ApiActivity[] })
        const questions =
          data?.questions ?? (Array.isArray(activitiesRes) ? activitiesRes : [])
        setRawActivities(questions)

        const responsesData =
          (responsesRes as { data?: unknown[] }).data ?? responsesRes
        if (Array.isArray(responsesData) && responsesData.length > 0) {
          const saved: Record<string, number> = {}
          responsesData.forEach(
            (r: {
              activityId?: string
              responseData?: { optionValue?: number }
            }) => {
              if (
                r.activityId !== null &&
                r.activityId !== undefined &&
                r.responseData?.optionValue !== null &&
                r.responseData?.optionValue !== undefined
              ) {
                saved[r.activityId] = r.responseData.optionValue
              }
            }
          )
          setAnswers(saved)
        }
      } catch (err) {
        console.error('Error loading activities:', err)
        setError((err as Error).message ?? 'Failed to load activities.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [assessmentId])

  const dotDataItems = useMemo(
    () => mapActivitiesToDotData(rawActivities),
    [rawActivities]
  )

  const { currentSlideIndex, goToSlide, nextSlide, isVisited, resetState } =
    useSlideState(dotDataItems.length, `aadhya-activity-state-${assessmentId}`)

  const activeItem = dotDataItems[currentSlideIndex]

  const onHome = useCallback(() => navigate('/'), [navigate])

  const handleAnswerSelect = async (activityId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [activityId]: value }))
    try {
      await activitiesApi.submitAnswer(activityId, value)
    } catch (err) {
      console.error('Error submitting answer:', err)
    }
  }

  const handleComplete = useCallback(() => {
    if (assessmentId) navigate(`/assessment/${assessmentId}/thank-you`)
  }, [assessmentId, navigate])

  const canAdvance = useCallback(
    (index: number) => {
      const activity = rawActivities[index]
      return (
        activity !== null &&
        activity !== undefined &&
        answers[activity.id] !== null &&
        answers[activity.id] !== undefined
      )
    },
    [rawActivities, answers]
  )

  const { start: footerWindowStart, size: footerWindowSize } = useMemo(
    () => getFooterWindow(dotDataItems.length, currentSlideIndex, isMobile),
    [dotDataItems.length, currentSlideIndex, isMobile]
  )
  const footerWindowEnd = Math.min(
    footerWindowStart + footerWindowSize - 1,
    dotDataItems.length - 1
  )

  const panelCount =
    rawActivities[currentSlideIndex]?.metadata?.options?.length ?? 0

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, zone, index } = position
      if (section === 'header') {
        ;[onHome, resetState, toggleTheme][index]?.()
      } else if (section === 'content' && zone === 'main') {
        if (!canAdvance(currentSlideIndex)) return
        if (currentSlideIndex >= dotDataItems.length - 1) {
          handleComplete()
        } else {
          nextSlide()
        }
      } else if (section === 'content' && zone === 'panel') {
        const activity = rawActivities[currentSlideIndex]
        if (activity?.metadata?.options?.[index]) {
          handleAnswerSelect(
            activity.id,
            activity.metadata.options[index].value
          )
        }
      } else if (section === 'footer') {
        goToSlide(index)
      }
    },
    [
      onHome,
      resetState,
      toggleTheme,
      canAdvance,
      currentSlideIndex,
      dotDataItems.length,
      handleComplete,
      nextSlide,
      goToSlide,
      rawActivities,
      handleAnswerSelect,
    ]
  )

  const { focus, setFocus, isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount,
    footerCount: dotDataItems.length,
    footerWindowStart,
    footerWindowEnd,
    isMobile,
    onActivate: handleActivate,
  })

  const inputDotItems: InputDotData[] = useMemo(() => {
    const activity = rawActivities[currentSlideIndex]
    const options = activity?.metadata?.options
    if (!options?.length) return []
    return options.map((option, i) => ({
      id: `option-${activity.id}-${option.value}`,
      value: option.value.toString(),
      groupName: activity.id,
      label: option.label,
      emoji: option.emoji,
      isSelected: answers[activity.id] === option.value,
      isFocused: isFocused('content', i, 'panel'),
      onSelect: (v: string) => handleAnswerSelect(activity.id, Number(v)),
    }))
  }, [rawActivities, currentSlideIndex, answers, isFocused, handleAnswerSelect])

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
      requestAnimationFrame(() => el.focus({ preventScroll: true }))
    }
  }, [])

  const handleNext = useCallback(() => {
    setFocus({ section: 'content', zone: 'main', index: 0 })
    if (!canAdvance(currentSlideIndex)) return
    if (currentSlideIndex >= dotDataItems.length - 1) handleComplete()
    else nextSlide()
  }, [
    setFocus,
    canAdvance,
    currentSlideIndex,
    dotDataItems.length,
    handleComplete,
    nextSlide,
  ])

  // --- Build section data ---

  const headerActions: DotData[] = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Welcome Home',
      subtitle: 'Your personal dashboard',
      tinyText: 'Home',
      smallText:
        'Navigate back to your main dashboard and see recent activity.',
      largeText: [
        'This is the home screen where you can access all your assessments, track your progress, and manage your learning journey.',
        'Use the navigation below to explore different sections of the application.',
      ],
      buttonText: 'Go Home',
      onClick: () => {},
      isFocused: isFocused('header', 0),
    },
    {
      id: 'logo',
      icon: ZapIcon,
      label: 'Reset',
      title: 'Reset Dots',
      subtitle: 'This button will Reset the content you have in front of you',
      tinyText: 'Reset',
      buttonText: 'Reset',
      onClick: () => {},
      isFocused: isFocused('header', 1),
    },
    {
      id: 'theme',
      icon: theme === 'light' ? Moon : Sun,
      label: 'Theme',
      title: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      subtitle: `Currently using ${theme} theme`,
      tinyText: theme === 'light' ? 'Dark' : 'Light',
      smallText: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode for a different visual experience.`,
      largeText: `Toggle between light and dark themes to match your preference. The current theme is ${theme}.`,
      buttonText: 'Toggle Theme',
      onClick: toggleTheme,
      isFocused: isFocused('header', 2),
    },
  ]

  const footerDots: DotData[] = useMemo(
    () =>
      dotDataItems.map((item, i) => ({
        ...item,
        // tinyText: `ACTIVITY ${i}`,
        isActive: i === currentSlideIndex,
        isVisited: isVisited(i),
        isFocused: isFocused('footer', i),
        onClick: () => {
          setFocus({ section: 'footer', zone: 'main', index: i })
          goToSlide(i)
        },
      })),
    [dotDataItems, currentSlideIndex, isVisited, isFocused, setFocus, goToSlide]
  )

  // --- Loading / error / empty states ---

  if (isLoading && rawActivities.length === 0) {
    return (
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={[10, 75, 15]}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className='p-2 sm:p-4'
      >
        <div className='flex items-center justify-center h-full'>
          <p className='text-muted-foreground'>Loading activities...</p>
        </div>
      </FluidLayout>
    )
  }

  if (error && rawActivities.length === 0) {
    return (
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={[10, 75, 15]}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className='p-2 sm:p-4'
      >
        <div className='flex flex-col items-center justify-center h-full gap-4'>
          <p className='text-red-600'>Error: {error}</p>
          <button
            type='button'
            onClick={() => window.location.reload()}
            className='px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90'
          >
            Retry
          </button>
        </div>
      </FluidLayout>
    )
  }

  if (rawActivities.length === 0) {
    return (
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={[10, 75, 15]}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className='p-2 sm:p-4'
      >
        <div className='flex items-center justify-center h-full'>
          <p className='text-muted-foreground'>No activities available.</p>
        </div>
      </FluidLayout>
    )
  }

  // --- Build content dot for xl tier ---
  const activity = rawActivities[currentSlideIndex]

  const contentDot: DotData = {
    id: activeItem?.id ?? 'content',
    icon: activeItem?.icon ?? Home,
    label: activeItem?.label ?? '',
    title: activeItem?.title ?? '',
    subtitle: activeItem?.subtitle,
    largeText: [],
    media: activeItem ? (
      <Media
        item={{
          key: activeItem.key ?? activeItem.id,
          label: activeItem.label,
          title: activeItem.title ?? '',
          icon: activeItem.icon,
        }}
        onClick={handleNext}
        className='bg-transparent border-0 shadow-none rounded-none'
      />
    ) : undefined,
    onClick: handleNext,
    isFocused: isFocused('content', 0, 'main'),
    canAdvance: canAdvance(currentSlideIndex),
    buttonText: 'Next',
  }

  // --- Compose sections ---

  return (
    <NavigationProvider value={navContextValue}>
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={[10, 75, 15]}
        header={<Header items={headerActions} />}
        footer={<Footer items={footerDots} currentIndex={currentSlideIndex} />}
        className='p-2 sm:p-4'
      >
        <main
          aria-label='Activity content'
          className='w-full h-full overflow-hidden min-h-0'
        >
          {isMobile ? (
            <div className='flex flex-col w-full h-full overflow-hidden gap-2 sm:gap-4 min-h-0'>
              {activeItem && (
                <div className='w-full h-full rounded-2xl bg-card border divide-y lg:divide-y-0 lg:divide-x overflow-hidden'>
                  <Dot data={contentDot} className='rounded-2xl' />
                </div>
              )}
              <div className='overflow-hidden min-h-0'>
                <Panel
                  inputItems={inputDotItems}
                  groupValue={answers[activity?.id]?.toString()}
                  onValueChange={v =>
                    handleAnswerSelect(activity.id, Number(v))
                  }
                />
              </div>
            </div>
          ) : (
            <FluidContentPanel
              layoutId={`activities-${assessmentId}`}
              content={
                activeItem ? (
                  <div className='w-full h-full rounded-2xl bg-card border divide-y lg:divide-y-0 lg:divide-x overflow-hidden'>
                    <Dot data={contentDot} className='rounded-2xl' />
                  </div>
                ) : null
              }
              panel={
                <Panel
                  inputItems={inputDotItems}
                  groupValue={answers[activity?.id]?.toString()}
                  onValueChange={v =>
                    handleAnswerSelect(activity.id, Number(v))
                  }
                />
              }
              defaultSizes={[80, 20]}
            />
          )}
        </main>
      </FluidLayout>
    </NavigationProvider>
  )
}
