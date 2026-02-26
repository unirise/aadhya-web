import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HomeIcon, ArrowLeft } from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import { useAssessment } from '@/hooks/useAssessments'
import { Header, Footer, FluidLayout, ContentSection } from '@/components/sections'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'
import { ACTIVITY_LAYOUT_PADDING } from '@/config/activityLayout'

function AssessmentThankYou() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { data: assessment, isLoading, error } = useAssessment(assessmentId)

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) toggleTheme()
      } else if (section === 'content') {
        if (index === 0) navigate(`/assessment/${assessmentId}/start`)
        else if (index === 1) navigate('/')
      }
    },
    [navigate, toggleTheme, assessmentId]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 2,
    contentCount: 2,
    panelCount: 0,
    footerCount: 0,
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
      buttonText: 'Go Home',
      onClick: () => navigate('/'),
      isFocused: isFocused('header', 0),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 1) },
  ]

  const actionDots: DotData[] = [
    {
      id: 'back-to-overview',
      icon: ArrowLeft,
      label: 'Overview',
      title: 'Back to Overview',
      subtitle: assessment?.name,
      tinyText: 'Back',
      smallText: 'Return to the assessment overview page.',
      buttonText: 'Back to Overview',
      onClick: () => navigate(`/assessment/${assessmentId}/start`),
      isFocused: isFocused('content', 0),
    },
    {
      id: 'go-home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Go Home',
      subtitle: 'Your personal dashboard',
      tinyText: 'Home',
      smallText: 'Return to your main dashboard.',
      buttonText: 'Go Home',
      onClick: () => navigate('/'),
      isFocused: isFocused('content', 1),
    },
  ]

  const loadingContent = (
    <main className='h-full w-full overflow-hidden flex items-center justify-center'>
      <p className='text-muted-foreground'>Loading...</p>
    </main>
  )

  const errorContent = (
    <main className='h-full w-full overflow-hidden flex items-center justify-center'>
      <div className='text-center'>
        <p className='text-destructive font-medium mb-4'>
          {error?.message || 'Assessment not found'}
        </p>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
        >
          Back to Home
        </button>
      </div>
    </main>
  )

  const thankYouContent = assessment && (
    <main
      aria-label={`Thank you for completing ${assessment.name}`}
      className='h-full w-full overflow-hidden'
    >
      <ContentSection
        title='Thank You!'
        description={`You have completed ${assessment.name}`}
        items={actionDots}
      />
    </main>
  )

  const content = isLoading
    ? loadingContent
    : error || !assessment
      ? errorContent
      : thankYouContent

  return (
    <FluidLayout
      layoutId='assessment-thank-you'
      defaultSizes={[10, 87, 3]}
      minSizes={[5, 50, 3]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={[]} />}
      className={ACTIVITY_LAYOUT_PADDING}
    >
      {content}
    </FluidLayout>
  )
}

export default AssessmentThankYou
