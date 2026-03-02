import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  Clock,
  FileText,
  Lightbulb,
  Target,
  ArrowRight,
  Home,
  HomeIcon,
  ZapIcon,
} from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAssessment,
  useMyResponses,
  ASSESSMENTS_KEYS,
} from '@/hooks/useAssessments'
import {
  Header,
  Footer,
  FluidLayout,
  FluidContentPanel,
  Panel,
} from '@/components/sections'
import { Dot } from '@/components/dots/Dot'
import { Media } from '@/components/blocks/content/Media'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'
import {
  ACTIVITY_FLUID_SIZES,
  ACTIVITY_FLUID_MIN_SIZES,
  ACTIVITY_CONTENT_SIZES,
  ACTIVITY_CONTENT_MIN_SIZES,
  ACTIVITY_LAYOUT_PADDING,
  ACTIVITY_CONTENT_RADIUS,
} from '@/config/activityLayout'

function AssessmentStart() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { theme, toggleTheme } = useTheme()
  const {
    data: assessment,
    isLoading,
    error: assessmentError,
    refetch,
  } = useAssessment(assessmentId)

  const activities = assessment?.activities || []

  const { data: myResponses } = useMyResponses()

  // Determine progress: which activities in this assessment already have a response
  const respondedActivityIds = new Set(
    (myResponses ?? [])
      .filter(r => activities.some(a => a.id === r.activityId))
      .map(r => r.activityId)
  )
  const hasStarted = respondedActivityIds.size > 0
  const firstUnansweredActivity = activities.find(
    a => !respondedActivityIds.has(a.id)
  )
  const continueTarget = firstUnansweredActivity ?? activities[0]

  const handleStart = () => {
    if (activities.length > 0 && assessmentId) {
      navigate(`/assessment/${assessmentId}/activity/${continueTarget.id}`)
    }
  }

  const handleStartFromBeginning = () => {
    if (activities.length > 0 && assessmentId) {
      navigate(`/assessment/${assessmentId}/activity/${activities[0].id}`)
    }
  }

  const error = assessmentError?.message

  // Metrics
  const activityCount = activities.length
  const uniqueAttributes = new Set(
    activities.map(a => a.attribute).filter(Boolean)
  ).size
  const totalSeconds = activityCount * 10
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const timeEstimate = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  const footerCount = activities.length > 0 ? 1 : 0

  const handleReset = useCallback(() => {
    if (assessmentId) {
      queryClient.invalidateQueries({
        queryKey: ASSESSMENTS_KEYS.detail(assessmentId),
      })
    }
    refetch()
  }, [queryClient, assessmentId, refetch])

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) handleReset()
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        if (position.zone === 'main' && index === 0) handleStart()
      } else if (section === 'footer') {
        if (index === 0) handleStartFromBeginning()
      }
    },
    [navigate, toggleTheme, activities, assessmentId, handleReset, hasStarted]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: 3,
    footerCount,
    onActivate: handleActivate,
  })

  const navigationItems: DotData[] = [
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
      onClick: () => navigate('/'),
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
      onClick: handleReset,
      isFocused: isFocused('header', 1),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 2) },
  ]

  const footerItems: DotData[] =
    activities.length > 0
      ? [
          {
            id: 'begin',
            icon: ArrowRight,
            label: hasStarted ? 'Start from Beginning' : 'Begin',
            tinyText: hasStarted ? 'Restart' : 'Begin',
            onClick: handleStartFromBeginning,
            isFocused: isFocused('footer', 0),
          },
        ]
      : []

  const panelItems: DotData[] = [
    {
      id: 'activity-count',
      icon: FileText,
      title: hasStarted ? `${activityCount}` : activityCount.toString(),
      label: activityCount === 1 ? 'Activity' : 'Activities',
      tinyText: hasStarted ? `${activityCount}` : String(activityCount),
      ariaLabel: hasStarted
        ? `${respondedActivityIds.size} of ${activityCount} activities completed`
        : `${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`,
      role: 'region',
      isFocused: isFocused('content', 0, 'panel'),
      onClick: () => {},
    },
    {
      id: 'activity-completed-count',
      icon: FileText,
      title: hasStarted
        ? `${respondedActivityIds.size}`
        : activityCount.toString(),
      label: 'Completed',
      tinyText: hasStarted
        ? `${respondedActivityIds.size}`
        : String(activityCount),
      ariaLabel: hasStarted
        ? `${respondedActivityIds.size} of ${activityCount} activities completed`
        : `${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`,
      role: 'region',
      isFocused: isFocused('content', 0, 'panel'),
      onClick: () => {},
    },
    {
      id: 'attribute-count',
      icon: Target,
      label: uniqueAttributes === 1 ? 'Attribute' : 'Attributes',
      title: uniqueAttributes.toString(),
      tinyText: String(uniqueAttributes),
      ariaLabel: `${uniqueAttributes} ${uniqueAttributes === 1 ? 'attribute' : 'attributes'}`,
      role: 'region',
      isFocused: isFocused('content', 1, 'panel'),
      onClick: () => {},
    },
    {
      id: 'time-estimate',
      icon: Clock,
      label: 'Est. Completion',
      title: timeEstimate.toString(),
      tinyText: timeEstimate,
      ariaLabel: `Estimated completion: ${timeEstimate}`,
      role: 'region',
      isFocused: isFocused('content', 2, 'panel'),
      onClick: () => {},
    },
  ]

  const contentDot: DotData = {
    id: assessmentId ?? 'assessment',
    icon: Lightbulb,
    label: 'Assessment',
    title: assessment?.name ?? '',
    subtitle: assessment?.description,
    largeText: assessment?.introduction ? [assessment.introduction] : [],
    media: assessment ? (
      <Media
        item={{
          key: assessmentId ?? 'assessment',
          label: 'Assessment',
          title: assessment.name ?? '',
          icon: Lightbulb,
        }}
        onClick={handleStart}
        className='bg-transparent border-0 shadow-none rounded-none'
      />
    ) : undefined,
    onClick: handleStart,
    isFocused: isFocused('content', 0),
    canAdvance: activities.length > 0,
    buttonText: hasStarted
      ? `Continue ${assessment?.name ?? 'Assessment'}`
      : `Start ${assessment?.name ?? 'Assessment'}`,
  }

  const loadingContent = (
    <main aria-label='Assessment' className='h-full w-full overflow-hidden'>
      <div
        role='status'
        aria-live='polite'
        className='flex items-center justify-center h-full'
      >
        <p className='text-muted-foreground'>Loading assessment...</p>
      </div>
    </main>
  )

  const errorContent = (
    <main aria-label='Assessment' className='h-full w-full overflow-hidden'>
      <div role='alert' className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <p className='text-destructive font-medium mb-4'>
            {error || 'Assessment not found'}
          </p>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  )

  if (isLoading) {
    return (
      <FluidLayout
        layoutId='assessment-start'
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={navigationItems} />}
        footer={<Footer items={footerItems} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        {loadingContent}
      </FluidLayout>
    )
  }

  if (error || !assessment) {
    return (
      <FluidLayout
        layoutId='assessment-start'
        defaultSizes={ACTIVITY_FLUID_SIZES}
        minSizes={ACTIVITY_FLUID_MIN_SIZES}
        header={<Header items={navigationItems} />}
        footer={<Footer items={footerItems} />}
        className={ACTIVITY_LAYOUT_PADDING}
      >
        {errorContent}
      </FluidLayout>
    )
  }

  return (
    <FluidLayout
      layoutId='assessment-start'
      defaultSizes={ACTIVITY_FLUID_SIZES}
      minSizes={ACTIVITY_FLUID_MIN_SIZES}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main
        aria-label={assessment?.name ?? 'Assessment'}
        className='h-full w-full overflow-hidden'
      >
        <FluidContentPanel
          layoutId='assessment-start-content'
          defaultSizes={ACTIVITY_CONTENT_SIZES}
          minSizes={ACTIVITY_CONTENT_MIN_SIZES}
          content={
            <>
              <div
                className={`w-full h-full ${ACTIVITY_CONTENT_RADIUS} divide-y lg:divide-y-0 lg:divide-x overflow-hidden`}
              >
                <Dot data={contentDot} className={ACTIVITY_CONTENT_RADIUS} />
              </div>

              {activities.length === 0 && (
                <div className='mx-auto mt-8'>
                  <div
                    role='alert'
                    className='bg-yellow-50 border border-yellow-200 rounded-lg p-5'
                  >
                    <div className='flex items-center justify-center gap-2'>
                      <AlertCircle
                        className='text-yellow-600'
                        size={20}
                        aria-hidden='true'
                      />
                      <p className='text-yellow-800 text-sm font-medium'>
                        This assessment has no activities yet. Please check back
                        later.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          }
          panel={<Panel items={panelItems} />}
        />
      </main>
    </FluidLayout>
  )
}

export default AssessmentStart
