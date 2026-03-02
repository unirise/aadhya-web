import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import mermaid from 'mermaid'
import {
  ArrowLeft,
  Home as HomeIcon,
  Brain,
  Dumbbell,
  BarChart3,
  Target,
  BookOpen,
  LayoutDashboard,
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

function buildRadarDiagram(
  intScores: Record<string, number>,
  physScores: Record<string, number>
) {
  const allKeys = [...Object.keys(intScores), ...Object.keys(physScores)]
  const axes = allKeys.map((k, i) => `a${i}["${k}"]`).join(', ')

  const intValues = [
    ...Object.values(intScores),
    ...Object.keys(physScores).map(() => 0),
  ].join(', ')

  const physValues = [
    ...Object.keys(intScores).map(() => 0),
    ...Object.values(physScores),
  ].join(', ')

  return `radar-beta
  title Learning Profile
  axis ${axes}
  curve Intelligence{${intValues}}
  curve Physical{${physValues}}`
}

function MermaidRadar({
  intScores,
  physScores,
  theme,
}: {
  intScores: Record<string, number>
  physScores: Record<string, number>
  theme: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const id = `mermaid-radar-${Date.now()}`
    mermaid
      .render(id, buildRadarDiagram(intScores, physScores))
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
  }, [intScores, physScores, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Learning profile radar chart'
      className='w-full h-full flex items-center justify-center p-4'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading your profile…</p>
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

function Dashboard() {
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
    () => (intScores ? topN(intScores, 3) : []),
    [intScores]
  )
  const topPhysical = useMemo(
    () => (physScores ? topN(physScores, 3) : []),
    [physScores]
  )

  const isLoading = intQuery.isLoading || physQuery.isLoading
  const hasError = intQuery.isError || physQuery.isError
  const errorMessage =
    intQuery.error?.message ||
    physQuery.error?.message ||
    'Failed to load profile data'

  const handleRetry = useCallback(() => {
    if (intQuery.isError) intQuery.refetch()
    if (physQuery.isError) physQuery.refetch()
  }, [intQuery, physQuery])

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, zone, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan')
        else if (index === 2) toggleTheme()
      } else if (section === 'content' && zone === 'panel') {
        const routes = [
          '/pehachan/dashboard/stats',
          '/pehachan/dashboard/careers',
          '/pehachan/dashboard/plan',
        ]
        if (routes[index]) navigate(routes[index])
      } else if (section === 'footer') {
        const routes = ['/pehachan/intelligence', '/pehachan/physical']
        if (routes[index]) navigate(routes[index])
      }
    },
    [navigate, toggleTheme]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: 3,
    footerCount: 2,
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
      title: 'Back to Pehchan',
      subtitle: 'Return to Pehchan overview',
      tinyText: 'Back',
      buttonText: 'Go Back',
      onClick: () => navigate('/pehachan'),
      isFocused: isFocused('header', 1),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 2) },
  ]

  const buildLargeText = (): string[] => {
    const parts: string[] = []
    if (topIntelligence.length >= 3) {
      parts.push(
        `Your top intelligence strengths are ${topIntelligence[0]}, ${topIntelligence[1]}, and ${topIntelligence[2]}. These areas represent where you learn most naturally and effectively. Leaning into these strengths can help you tackle new challenges with confidence.`
      )
    }
    if (topPhysical.length >= 3) {
      parts.push(
        `On the physical side, your strongest areas are ${topPhysical[0]}, ${topPhysical[1]}, and ${topPhysical[2]}. These skills form the foundation of your physical development and can be further strengthened through targeted activities.`
      )
    }
    parts.push(
      'The radar chart shows your complete profile across both domains. Use it to identify areas of strength and opportunities for growth.'
    )
    return parts
  }

  const dashboardContent: DotData = {
    id: 'dashboard-overview',
    icon: LayoutDashboard,
    label: 'Dashboard',
    title: 'Your Learning Profile',
    subtitle:
      'A snapshot of your strengths across intelligence and physical domains',
    largeText: isLoading || hasError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : hasError ? (
      <ErrorContent message={errorMessage} onRetry={handleRetry} />
    ) : intScores && physScores ? (
      <MermaidRadar
        intScores={intScores}
        physScores={physScores}
        theme={theme}
      />
    ) : (
      <LoadingContent />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
  }

  const panelItems: DotData[] = [
    {
      id: 'stats',
      icon: BarChart3,
      label:
        'View statistics for the different assessments and activities that you have completed over time',
      title: 'Statistics',
      tinyText: 'Stats',
      smallText: 'View detailed scores and performance trends.',
      onClick: () => navigate('/pehachan/dashboard/stats'),
      isFocused: isFocused('content', 0, 'panel'),
    },
    {
      id: 'careers',
      icon: Target,
      label:
        'View career recommendations based on your unique profile and strengths',
      title: 'Careers',
      tinyText: 'Careers',
      smallText: 'Explore career paths that align with your unique profile.',
      onClick: () => navigate('/pehachan/dashboard/careers'),
      isFocused: isFocused('content', 1, 'panel'),
    },
    {
      id: 'plan',
      icon: BookOpen,
      label:
        'View customised learning plans based on your abilities found with the assessments',
      title: 'Learning Plan',
      tinyText: 'Plan',
      smallText: 'Your personalised learning plan and recommendations.',
      onClick: () => navigate('/pehachan/dashboard/plan'),
      isFocused: isFocused('content', 2, 'panel'),
    },
  ]

  const footerItems: DotData[] = [
    {
      id: 'intelligence',
      icon: Brain,
      label: 'View Profile',
      title: 'Intelligence',
      subtitle: 'View intelligence profile',
      tinyText: 'Intelligence',
      buttonText: 'Intelligence',
      onClick: () => navigate('/pehachan/intelligence'),
      isFocused: isFocused('footer', 0),
    },
    {
      id: 'physical',
      icon: Dumbbell,
      label: 'View Profile',
      title: 'Physical',
      subtitle: 'View physical development',
      tinyText: 'Physical',
      buttonText: 'Physical',
      onClick: () => navigate('/pehachan/physical'),
      isFocused: isFocused('footer', 1),
    },
  ]

  return (
    <FluidLayout
      layoutId='pehchan-dashboard'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId='pehchan-dashboard'
        content={
          <main
            aria-label='Dashboard'
            className='h-full w-full overflow-hidden'
          >
            <Dot data={dashboardContent} />
          </main>
        }
        panel={<Panel items={panelItems} />}
      />
    </FluidLayout>
  )
}

export default Dashboard
