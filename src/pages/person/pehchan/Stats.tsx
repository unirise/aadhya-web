import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Home as HomeIcon,
  BarChart3,
  Brain,
  Dumbbell,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import {
  Header,
  Footer,
  FluidLayout,
  FluidContentPanel,
  Panel,
} from '@/components/sections'
import { Dot } from '@/components/dots/Dot'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'
import {
  useIntelligenceScores,
  usePhysicalScores,
  toDisplayScores,
  topN,
} from '@/hooks/useProfileScores'

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading stats…</p>
    </div>
  )
}

function ErrorContent({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <AlertCircle className='w-8 h-8 text-destructive' />
      <p className='text-sm text-destructive'>{message}</p>
      <button
        type='button'
        onClick={onRetry}
        className='text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80'
      >
        Retry
      </button>
    </div>
  )
}

function StatsMedia({
  intScores,
  physScores,
}: {
  intScores: Record<string, number>
  physScores: Record<string, number>
}) {
  const intEntries = Object.entries(intScores).sort(([, a], [, b]) => b - a)
  const physEntries = Object.entries(physScores).sort(([, a], [, b]) => b - a)

  return (
    <div className='h-full w-full overflow-auto p-4 flex flex-col justify-center space-y-6'>
      <div>
        <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
          Intelligence Scores
        </h3>
        <div className='space-y-2'>
          {intEntries.map(([name, score]) => (
            <div key={name} className='flex items-center gap-2'>
              <span className='text-xs w-28 truncate'>{name}</span>
              <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-500 rounded-full transition-all'
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className='text-xs text-muted-foreground w-8 text-right'>
                {score}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
          Physical Scores
        </h3>
        <div className='space-y-2'>
          {physEntries.map(([name, score]) => (
            <div key={name} className='flex items-center gap-2'>
              <span className='text-xs w-28 truncate'>{name}</span>
              <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-emerald-500 rounded-full transition-all'
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className='text-xs text-muted-foreground w-8 text-right'>
                {score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stats() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const intQuery = useIntelligenceScores()
  const physQuery = usePhysicalScores()

  const intScores = useMemo(
    () =>
      intQuery.data?.intelligences
        ? toDisplayScores(intQuery.data.intelligences, 'intelligence')
        : null,
    [intQuery.data]
  )

  const physScores = useMemo(
    () =>
      physQuery.data?.physical
        ? toDisplayScores(physQuery.data.physical, 'physical')
        : null,
    [physQuery.data]
  )

  const topIntelligence = useMemo(
    () => (intScores ? topN(intScores, 1) : []),
    [intScores]
  )
  const topPhysical = useMemo(
    () => (physScores ? topN(physScores, 1) : []),
    [physScores]
  )

  const totalActivities = useMemo(() => {
    const intCount = intScores ? Object.keys(intScores).length : 0
    const physCount = physScores ? Object.keys(physScores).length : 0
    return intCount + physCount
  }, [intScores, physScores])

  const isLoading = intQuery.isLoading || physQuery.isLoading
  const hasError = intQuery.isError || physQuery.isError
  const errorMessage =
    intQuery.error?.message ||
    physQuery.error?.message ||
    'Failed to load stats'

  const handleRetry = useCallback(() => {
    if (intQuery.isError) intQuery.refetch()
    if (physQuery.isError) physQuery.refetch()
  }, [intQuery, physQuery])

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'footer') {
        if (index === 0) navigate('/')
      }
    },
    [navigate, toggleTheme]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: 3,
    footerCount: 1,
    onActivate: handleActivate,
  })

  const navigationItems: DotData[] = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Home',
      subtitle: 'Return to main dashboard',
      tinyText: 'Home',
      buttonText: 'Go Home',
      onClick: () => navigate('/'),
      isFocused: isFocused('header', 0),
    },
    {
      id: 'back',
      icon: ArrowLeft,
      label: 'Back',
      title: 'Back to Dashboard',
      subtitle: 'Return to Pehchan dashboard',
      tinyText: 'Back',
      buttonText: 'Go Back',
      onClick: () => navigate('/pehachan/dashboard'),
      isFocused: isFocused('header', 1),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 2) },
  ]

  const buildLargeText = (): string[] => {
    const parts: string[] = []
    parts.push(
      `You have completed assessments across ${totalActivities} domains.`
    )
    if (topIntelligence.length > 0) {
      parts.push(
        `Your strongest intelligence area is ${topIntelligence[0]}. This is where you demonstrate the most natural ability and potential for growth.`
      )
    }
    if (topPhysical.length > 0) {
      parts.push(
        `Your strongest physical area is ${topPhysical[0]}. This represents your most developed physical capability.`
      )
    }
    parts.push(
      'The bar charts show your detailed scores across all intelligence and physical domains.'
    )
    return parts
  }

  const statsContent: DotData = {
    id: 'stats-overview',
    icon: BarChart3,
    label: 'Statistics',
    title: 'Your Statistics',
    subtitle:
      'A detailed breakdown of your performance across all assessments',
    largeText: isLoading || hasError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : hasError ? (
      <ErrorContent message={errorMessage} onRetry={handleRetry} />
    ) : intScores && physScores ? (
      <StatsMedia intScores={intScores} physScores={physScores} />
    ) : (
      <LoadingContent />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
  }

  const panelItems: DotData[] = [
    {
      id: 'activities-completed',
      icon: CheckCircle,
      label: 'Activities',
      title: 'Activities Completed',
      tinyText: isLoading ? '…' : `${totalActivities}`,
      smallText: `${totalActivities} domains assessed so far.`,
      isFocused: isFocused('content', 0, 'panel'),
    },
    {
      id: 'best-intelligence',
      icon: Brain,
      label: 'Intelligence',
      title: 'Best Intelligence',
      tinyText: isLoading ? '…' : topIntelligence[0] || '—',
      smallText: topIntelligence[0]
        ? `${topIntelligence[0]} is your strongest intelligence.`
        : 'Complete assessments to see your top intelligence.',
      isFocused: isFocused('content', 1, 'panel'),
    },
    {
      id: 'best-physical',
      icon: Dumbbell,
      label: 'Physical',
      title: 'Best Physical',
      tinyText: isLoading ? '…' : topPhysical[0] || '—',
      smallText: topPhysical[0]
        ? `${topPhysical[0]} is your strongest physical area.`
        : 'Complete assessments to see your top physical area.',
      isFocused: isFocused('content', 2, 'panel'),
    },
  ]

  const footerItems: DotData[] = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Home',
      subtitle: 'Return home',
      tinyText: 'Home',
      buttonText: 'Go Home',
      onClick: () => navigate('/'),
      isFocused: isFocused('footer', 0),
    },
  ]

  return (
    <FluidLayout
      layoutId='pehchan-stats'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId='pehchan-stats'
        content={
          <main aria-label='Statistics' className='h-full w-full overflow-hidden'>
            <Dot data={statsContent} />
          </main>
        }
        panel={<Panel items={panelItems} />}
      />
    </FluidLayout>
  )
}

export default Stats
