import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Home, Zap, ZapIcon, HomeIcon } from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import { activitiesApi } from '@/services/activitiesApi'
import { Header } from '@/components/sections/Header'
import { Panel } from '@/components/sections/Panel'
import { Footer } from '@/components/sections/Footer'
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
import {
  ACTIVITY_FLUID_SIZES,
  ACTIVITY_FLUID_MIN_SIZES,
  ACTIVITY_CONTENT_SIZES,
  ACTIVITY_CONTENT_MIN_SIZES,
  ACTIVITY_LAYOUT_PADDING,
  ACTIVITY_MOBILE_GAP,
  ACTIVITY_CONTENT_RADIUS,
  ACTIVITY_MEDIA_STORAGE_ID,
} from '@/config/activityLayout'

export default function Activities() {
  const { assessmentId, activityId } = useParams<{ assessmentId: string; activityId: string }>()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [rawActivities, setRawActivities] = useState<ApiActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [reloadKey, setReloadKey] = useState(0)
  const activityStartTimesRef = useRef<Record<string, number>>({})
  const setFocusRef = useRef<((pos: FocusPosition) => void) | undefined>(
    undefined
  )

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
  }, [assessmentId, reloadKey])

  const dotDataItems = useMemo(
    () => mapActivitiesToDotData(rawActivities),
    [rawActivities]
  )

  const { currentSlideIndex, goToSlide, nextSlide, isVisited, resetState } =
    useSlideState(dotDataItems.length, `aadhya-activity-state-${assessmentId}`)

  // If a specific activityId was requested in the URL, jump to it once activities load
  const initialActivityIdRef = useRef(activityId ?? null)
  useEffect(() => {
    if (!initialActivityIdRef.current || rawActivities.length === 0) return
    const idx = rawActivities.findIndex(a => a.id === initialActivityIdRef.current)
    if (idx !== -1) {
      goToSlide(idx)
      initialActivityIdRef.current = null
    }
  }, [rawActivities, goToSlide])

  // Record when each activity slide first becomes visible
  useEffect(() => {
    const activity = rawActivities[currentSlideIndex]
    if (activity) {
      activityStartTimesRef.current[activity.id] = Date.now()
    }
  }, [currentSlideIndex, rawActivities])

  const activeItem = dotDataItems[currentSlideIndex]

  const onHome = useCallback(() => navigate('/'), [navigate])

  const reloadActivities = useCallback(() => {
    resetState()
    setReloadKey(k => k + 1)
    setAnswers({})
  }, [resetState])

  const handleAnswerSelect = useCallback(
    async (activityId: string, value: number) => {
      const startTime = activityStartTimesRef.current[activityId]
      const timeSpentSeconds = startTime
        ? Math.round((Date.now() - startTime) / 1000)
        : undefined
      setAnswers(prev => ({ ...prev, [activityId]: value }))
      setFocusRef.current?.({ section: 'content', zone: 'main', index: 0 })
      try {
        await activitiesApi.submitAnswer(activityId, value, timeSpentSeconds)
      } catch (err) {
        console.error('Error submitting answer:', err)
      }
    },
    []
  )

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

  const windowSize = isMobile ? 5 : 7
  const windowStartRef = useRef(0)
  // Sticky window: only re-centers when currentSlideIndex exits the visible window.
  // Clicking a visible dot keeps the window stable; sequential nav advances it.
  const footerWindowStart = useMemo(() => {
    const prev = windowStartRef.current
    const prevEnd = prev + windowSize - 1
    const maxStart = Math.max(0, dotDataItems.length - windowSize)
    let newStart: number
    if (dotDataItems.length === 0) {
      newStart = 0
    } else if (
      currentSlideIndex < prev ||
      currentSlideIndex > Math.min(prevEnd, dotDataItems.length - 1)
    ) {
      // currentSlide exited the window — re-center
      newStart = Math.max(
        0,
        Math.min(currentSlideIndex - Math.floor((windowSize - 1) / 2), maxStart)
      )
    } else {
      // currentSlide still inside window — keep start
      newStart = prev
    }
    windowStartRef.current = newStart
    return newStart
  }, [currentSlideIndex, windowSize, dotDataItems.length])

  const footerWindowEnd = Math.min(
    footerWindowStart + windowSize - 1,
    dotDataItems.length - 1
  )

  const panelCount =
    rawActivities[currentSlideIndex]?.metadata?.options?.length ?? 0

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, zone, index } = position
      if (section === 'header') {
        ;[onHome, reloadActivities, toggleTheme][index]?.()
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
      reloadActivities,
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

  setFocusRef.current = setFocus

  // Auto-focus: middle option for MCQ activities, content dot otherwise
  useEffect(() => {
    if (panelCount > 0) {
      setFocus({
        section: 'content',
        zone: 'panel',
        index: Math.floor(panelCount / 2),
      })
    } else {
      setFocus({ section: 'content', zone: 'main', index: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, panelCount])

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
      onClick: onHome,
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
      onClick: reloadActivities,
      isFocused: isFocused('header', 1),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 2) },
  ]

  const footerDots: DotData[] = useMemo(
    () =>
      dotDataItems.map((item, i) => ({
        ...item,
        tinyText: `ACTIVITY ${i + 1}`,
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
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        <div
          role='status'
          aria-live='polite'
          className='flex items-center justify-center h-full'
        >
          <p className='text-muted-foreground'>Loading activities...</p>
        </div>
      </FluidLayout>
    )
  }

  if (error && rawActivities.length === 0) {
    return (
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        <div
          role='alert'
          className='flex flex-col items-center justify-center h-full gap-4'
        >
          <p className='text-destructive font-medium'>Error: {error}</p>
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
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={headerActions} />}
        footer={<Footer items={[]} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        <div
          role='status'
          aria-live='polite'
          className='flex items-center justify-center h-full'
        >
          <p className='text-muted-foreground'>No activities available.</p>
        </div>
      </FluidLayout>
    )
  }

  // --- Build content dot for xl tier ---
  const activity = rawActivities[currentSlideIndex]

  const contentDot: DotData = {
    id: activeItem?.id ?? 'content',
    mediaStorageId: ACTIVITY_MEDIA_STORAGE_ID,
    icon: activeItem?.icon ?? Home,
    label: activeItem?.label ?? '',
    title: activeItem?.title ?? '',
    subtitle: activeItem?.subtitle,
    largeText: activeItem?.largeText,
    media: activeItem ? (
      <Media
        item={{
          key: activeItem.key ?? activeItem.id,
          label: activeItem.label ?? '',
          title: activeItem.title ?? '',
          icon: activeItem.icon,
          diagram:
            typeof activeItem.media === 'string' ? activeItem.media : undefined,
        }}
        onClick={handleNext}
        className='bg-transparent border-0 shadow-none rounded-none'
      />
    ) : undefined,
    onClick: handleNext,
    isFocused: isFocused('content', 0, 'main'),
    canAdvance: canAdvance(currentSlideIndex),
    buttonText: 'Save & Next',
  }

  // --- Compose sections ---

  return (
    <NavigationProvider value={navContextValue}>
      <FluidLayout
        layoutId={`activities-${assessmentId}`}
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={headerActions} />}
        footer={<Footer items={footerDots} currentIndex={currentSlideIndex} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        <main
          aria-label='Activity content'
          className='w-full h-full overflow-hidden min-h-0'
        >
          <FluidContentPanel
            layoutId={`activities-${assessmentId}`}
            content={
              activeItem ? (
                <div
                  className={`w-full h-full ${ACTIVITY_CONTENT_RADIUS} divide-y lg:divide-y-0 lg:divide-x overflow-hidden`}
                >
                  <Dot
                    data={contentDot}
                    className={ACTIVITY_CONTENT_RADIUS}
                  />
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
            defaultSizes={ACTIVITY_CONTENT_SIZES}
            minSizes={ACTIVITY_CONTENT_MIN_SIZES}
          />
        </main>
      </FluidLayout>
    </NavigationProvider>
  )
}
