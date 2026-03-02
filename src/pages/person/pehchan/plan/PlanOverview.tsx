import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import mermaid from 'mermaid'
import {
  ArrowLeft,
  Home as HomeIcon,
  Sparkles,
  Trophy,
  BookOpen,
  Radar,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import { Header, Footer, FluidLayout } from '@/components/sections'
import { Dot } from '@/components/dots/Dot'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'
import { useIntelligenceScores } from '@/hooks/useProfileScores'
import { getTopIntelligences } from '@/lib/mi-scoring'
import { getIntelligenceSkillMapping } from '@/lib/intelligence-skill-mapping'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#e2e8f0',
  },
})

const DOMAIN_SHORT: Record<string, string> = {
  INTERPERSONAL: 'Interpersonal',
  BODILY_KINESTHETIC: 'Bodily Kinesthetic',
  LOGICAL_MATHEMATICAL: 'Logical Mathematical',
  LINGUISTIC: 'Linguistic',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  NATURALISTIC: 'Naturalistic',
  INTRAPERSONAL: 'Intrapersonal',
}

function esc(s: string) {
  return s.replace(/["\(\)]/g, ' ').replace(/\s+/g, ' ').trim()
}

function buildMindmap(
  topIntelligences: Array<{ domain: string; score: number }>,
  skillMapping: Array<{ domain: string; skills: string[] }>
) {
  const lines: string[] = ['mindmap', '  root((Your Learning Profile))']
  const skillMap = new Map(skillMapping.map(s => [s.domain, s.skills]))

  topIntelligences.forEach(({ domain }) => {
    const name = DOMAIN_SHORT[domain] || domain
    lines.push(`    ${esc(name)}`)
    const skills = skillMap.get(domain) || []
    skills.slice(0, 3).forEach(skill => {
      lines.push(`      ${esc(skill)}`)
    })
  })

  return lines.join('\n')
}

function OverviewChart({
  topIntelligences,
  skillMapping,
}: {
  topIntelligences: Array<{ domain: string; score: number }>
  skillMapping: Array<{ domain: string; skills: string[] }>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const diagram = buildMindmap(topIntelligences, skillMapping)
    ref.current.innerHTML = ''
    const id = `mermaid-plan-overview-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(err => {
        console.error('Mermaid plan overview render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [topIntelligences, skillMapping])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Learning profile mindmap'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading your learning profile...</p>
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

const PLAN_ROUTES = [
  '/pehachan/dashboard/plan',
  '/pehachan/dashboard/plan/strengths',
  '/pehachan/dashboard/plan/styles',
  '/pehachan/dashboard/plan/profile',
  '/pehachan/dashboard/plan/growth',
]

function PlanOverview() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { data, isLoading, isError, error, refetch } = useIntelligenceScores()

  const scores = data?.intelligences ?? {}
  const topIntelligences = getTopIntelligences(scores, 3)
  const skillMapping = getIntelligenceSkillMapping(scores, 3)

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(PLAN_ROUTES[1])
      } else if (section === 'footer') {
        if (PLAN_ROUTES[index]) navigate(PLAN_ROUTES[index])
      }
    },
    [navigate, toggleTheme]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: 0,
    footerCount: 5,
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
    if (topIntelligences.length === 0) return []
    const names = topIntelligences.map(t => DOMAIN_SHORT[t.domain] || t.domain)
    return [
      `Here's a snapshot of your learning profile. You're strongest in ${names[0]}, ${names[1]}, and ${names[2]} — and each of these strengths opens up different skills and ways of thinking.`,
      'The mindmap shows how your top intelligences branch out into the skills that come naturally to you. These are the areas where learning feels easiest and most rewarding.',
      'Use this as your starting point to explore teaching styles, career paths, and growth opportunities that are a natural fit.',
    ]
  }

  const content: DotData = {
    id: 'plan-overview',
    icon: Sparkles,
    label: 'Overview',
    title: 'Your Learning Profile',
    subtitle: 'How your strengths connect to skills and opportunities',
    largeText: isLoading || isError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : isError ? (
      <ErrorContent
        message={error?.message || 'Failed to load profile data'}
        onRetry={() => refetch()}
      />
    ) : (
      <OverviewChart topIntelligences={topIntelligences} skillMapping={skillMapping} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(PLAN_ROUTES[1]),
    buttonText: 'View Your Top Strengths',
  }

  const footerItems: DotData[] = [
    {
      id: 'overview',
      icon: Sparkles,
      label: 'Overview',
      title: 'Overview',
      subtitle: 'Your learning profile overview',
      tinyText: 'Overview',
      buttonText: 'Overview',
      onClick: () => navigate(PLAN_ROUTES[0]),
      isFocused: isFocused('footer', 0),
      ariaCurrent: location.pathname === PLAN_ROUTES[0] ? 'page' : undefined,
    },
    {
      id: 'strengths',
      icon: Trophy,
      label: 'Strengths',
      title: 'Top Strengths',
      subtitle: 'Your strongest intelligences',
      tinyText: 'Strengths',
      buttonText: 'Top Strengths',
      onClick: () => navigate(PLAN_ROUTES[1]),
      isFocused: isFocused('footer', 1),
      ariaCurrent: location.pathname === PLAN_ROUTES[1] ? 'page' : undefined,
    },
    {
      id: 'styles',
      icon: BookOpen,
      label: 'Styles',
      title: 'Learning Styles',
      subtitle: 'How you learn best',
      tinyText: 'Styles',
      buttonText: 'Learning Styles',
      onClick: () => navigate(PLAN_ROUTES[2]),
      isFocused: isFocused('footer', 2),
      ariaCurrent: location.pathname === PLAN_ROUTES[2] ? 'page' : undefined,
    },
    {
      id: 'profile',
      icon: Radar,
      label: 'Profile',
      title: 'Full Profile',
      subtitle: 'All intelligences visualised',
      tinyText: 'Profile',
      buttonText: 'Full Profile',
      onClick: () => navigate(PLAN_ROUTES[3]),
      isFocused: isFocused('footer', 3),
      ariaCurrent: location.pathname === PLAN_ROUTES[3] ? 'page' : undefined,
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: 'Growth',
      title: 'All Strengths',
      subtitle: 'Every intelligence ranked',
      tinyText: 'Growth',
      buttonText: 'All Strengths',
      onClick: () => navigate(PLAN_ROUTES[4]),
      isFocused: isFocused('footer', 4),
      ariaCurrent: location.pathname === PLAN_ROUTES[4] ? 'page' : undefined,
    },
  ]

  return (
    <FluidLayout
      layoutId='plan-overview'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Learning Profile Overview' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default PlanOverview
