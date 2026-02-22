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
  Moon,
  Sun,
  HomeIcon,
  ZapIcon,
} from 'lucide-react'
import { useAssessment } from '@/hooks/useAssessments'
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

function AssessmentStart() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const {
    data: assessment,
    isLoading,
    error: assessmentError,
  } = useAssessment(assessmentId)

  const activities = assessment?.activities || []

  const handleStart = () => {
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

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index <= 1) navigate('/')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        if (position.zone === 'main' && index === 0) handleStart()
      } else if (section === 'footer') {
        if (index === 0) handleStart()
      }
    },
    [navigate, toggleTheme, activities, assessmentId]
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

  const footerItems: DotData[] =
    activities.length > 0
      ? [
          {
            id: 'begin',
            icon: ArrowRight,
            label: 'Begin',
            onClick: handleStart,
            isFocused: isFocused('footer', 0),
          },
        ]
      : []

  const panelItems: DotData[] = [
    {
      id: 'activity-count',
      icon: FileText,
      title: activityCount.toString(),
      label: activityCount === 1 ? 'Activity' : 'Activities',
      tinyText: String(activityCount),
      ariaLabel: `${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`,
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
    buttonText: `Start ${assessment?.name ?? 'Assessment'}`,
  }

  const loadingContent = (
    <div className='flex items-center justify-center h-full'>
      <p className='text-muted-foreground'>Loading assessment...</p>
    </div>
  )

  const errorContent = (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <p className='text-red-600 mb-4'>{error || 'Assessment not found'}</p>
        <button
          onClick={() => navigate('/')}
          className='px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
        >
          Back to Home
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <FluidLayout
        layoutId='assessment-start'
        defaultSizes={[8, 84, 8]}
        header={<Header items={navigationItems} />}
        footer={<Footer items={footerItems} />}
        className='p-2 sm:p-4'
      >
        {loadingContent}
      </FluidLayout>
    )
  }

  if (error || !assessment) {
    return (
      <FluidLayout
        layoutId='assessment-start'
        defaultSizes={[8, 84, 8]}
        header={<Header items={navigationItems} />}
        footer={<Footer items={footerItems} />}
        className='p-2 sm:p-4'
      >
        {errorContent}
      </FluidLayout>
    )
  }

  return (
    <FluidLayout
      layoutId='assessment-start'
      defaultSizes={[8, 84, 8]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId='assessment-start-content'
        content={
          <>
            <div className='w-full h-full rounded-2xl divide-y lg:divide-y-0 lg:divide-x overflow-hidden'>
              <Dot data={contentDot} className='rounded-2xl' />
            </div>

            {activities.length === 0 && (
              <div className='mx-auto mt-8'>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-5'>
                  <div className='flex items-center justify-center gap-2'>
                    <AlertCircle className='text-yellow-600' size={20} />
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
        defaultSizes={[80, 20]}
      />
    </FluidLayout>
  )
}

export default AssessmentStart
