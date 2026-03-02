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

const DOMAIN_DESCRIPTION: Record<string, string> = {
  INTERPERSONAL: 'You understand people well and thrive in group settings',
  BODILY_KINESTHETIC: 'You learn best through movement and hands-on experience',
  LOGICAL_MATHEMATICAL: 'You think in patterns, logic, and systematic steps',
  LINGUISTIC: 'You have a natural feel for words, reading, and expression',
  MUSICAL: 'You pick up on rhythm, melody, and sound patterns easily',
  SPATIAL: 'You think in images and understand space and design intuitively',
  NATURALISTIC: 'You connect with the natural world and notice patterns in nature',
  INTRAPERSONAL: 'You have strong self-awareness and learn well independently',
}

function buildStrengthsDiagram(
  topIntelligences: Array<{ domain: string; score: number }>
) {
  const lines: string[] = ['flowchart TD']
  lines.push('  title["Your Top 3 Learning Strengths"]')
  lines.push('  style title fill:#eff6ff,stroke:#3b82f6,color:#1e40af,font-size:16px')

  topIntelligences.forEach(({ domain, score }, index) => {
    const name = DOMAIN_SHORT[domain] || domain
    const id = `s${index}`
    const medal = index === 0 ? '#1' : index === 1 ? '#2' : '#3'
    lines.push(`  title --> ${id}["${medal} ${name}<br/>Score: ${Math.round(score)}"]`)
    if (index === 0) {
      lines.push(`  style ${id} fill:#3b82f6,stroke:#2563eb,color:#fff`)
    } else {
      lines.push(`  style ${id} fill:#dbeafe,stroke:#3b82f6,color:#1e40af`)
    }
  })

  return lines.join('\n')
}

function StrengthsChart({
  topIntelligences,
}: {
  topIntelligences: Array<{ domain: string; score: number }>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || topIntelligences.length === 0) return
    const diagram = buildStrengthsDiagram(topIntelligences)
    ref.current.innerHTML = ''
    const id = `mermaid-strengths-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(err => {
        console.error('Mermaid strengths render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [topIntelligences])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Top 3 learning strengths diagram'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading your strengths...</p>
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

function TopStrengths() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { data, isLoading, isError, error, refetch } = useIntelligenceScores()

  const scores = data?.intelligences ?? {}
  const topIntelligences = getTopIntelligences(scores, 3)

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(PLAN_ROUTES[2])
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
    return topIntelligences.map(({ domain, score }, index) => {
      const name = DOMAIN_SHORT[domain] || domain
      const desc = DOMAIN_DESCRIPTION[domain] || ''
      const medal = index === 0 ? 'Your strongest area' : index === 1 ? 'Your second strength' : 'Your third strength'
      return `${medal} is ${name} (score: ${Math.round(score)}). ${desc}.`
    })
  }

  const content: DotData = {
    id: 'top-strengths',
    icon: Trophy,
    label: 'Strengths',
    title: 'Your Top 3 Strengths',
    subtitle: 'These are the ways of learning that come most naturally to you',
    largeText: isLoading || isError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : isError ? (
      <ErrorContent
        message={error?.message || 'Failed to load strengths data'}
        onRetry={() => refetch()}
      />
    ) : (
      <StrengthsChart topIntelligences={topIntelligences} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(PLAN_ROUTES[2]),
    buttonText: 'See How You Learn',
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
      layoutId='plan-strengths'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Your Top Strengths' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default TopStrengths
