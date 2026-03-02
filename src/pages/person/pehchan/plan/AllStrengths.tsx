import { useCallback, useEffect, useRef, useState } from 'react'
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

const DOMAIN_GROWTH_TIP: Record<string, string> = {
  INTERPERSONAL: 'Try group projects and peer tutoring',
  BODILY_KINESTHETIC: 'Explore sports, dance, or hands-on crafts',
  LOGICAL_MATHEMATICAL: 'Practice puzzles, coding, or strategy games',
  LINGUISTIC: 'Read more, write stories, or join a debate club',
  MUSICAL: 'Learn an instrument or explore rhythm activities',
  SPATIAL: 'Try drawing, building, or visual design projects',
  NATURALISTIC: 'Spend time outdoors and observe nature patterns',
  INTRAPERSONAL: 'Keep a journal and set personal goals',
}

function buildRankingDiagram(
  allSorted: Array<{ domain: string; score: number }>
) {
  // Show top 3 and bottom 3 only — keeps chart compact
  const top3 = allSorted.slice(0, 3)
  const bottom3 = allSorted.slice(-3)

  const lines: string[] = ['flowchart LR']

  top3.forEach(({ domain, score }, i) => {
    const name = DOMAIN_SHORT[domain] || domain
    lines.push(`  T${i}["#${i + 1} ${name}<br/>${Math.round(score)}"]`)
    if (i > 0) lines.push(`  T${i - 1} --> T${i}`)
    lines.push(`  style T${i} fill:#3b82f6,stroke:#2563eb,color:#fff`)
  })

  // Gap indicator
  lines.push('  T2 -.- GAP["..."]')
  lines.push('  style GAP fill:none,stroke:#94a3b8,color:#94a3b8')

  bottom3.forEach(({ domain, score }, i) => {
    const rank = allSorted.length - 3 + i + 1
    const name = DOMAIN_SHORT[domain] || domain
    lines.push(`  B${i}["#${rank} ${name}<br/>${Math.round(score)}"]`)
    if (i === 0) lines.push(`  GAP -.- B0`)
    else lines.push(`  B${i - 1} -.- B${i}`)
    lines.push(`  style B${i} fill:#f1f5f9,stroke:#94a3b8,color:#334155`)
  })

  return lines.join('\n')
}

function RankingChart({
  allSorted,
}: {
  allSorted: Array<{ domain: string; score: number }>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setIsSmall(entry.contentRect.width < 640)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!ref.current || allSorted.length === 0) return
    const diagram = buildRankingDiagram(allSorted)
    ref.current.innerHTML = ''
    const id = `mermaid-ranking-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
          const svgEl = ref.current.querySelector('svg')
          if (svgEl) {
            if (isSmall) {
              svgEl.style.maxWidth = '100%'
              svgEl.style.height = 'auto'
            } else {
              svgEl.style.maxHeight = '100%'
              svgEl.style.width = 'auto'
            }
          }
        }
      })
      .catch(err => {
        console.error('Mermaid ranking render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [allSorted, isSmall])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='All intelligences ranked'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading all your strengths...</p>
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

function AllStrengths() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { data, isLoading, isError, error, refetch } = useIntelligenceScores()

  const scores = data?.intelligences ?? {}
  const allSorted = getTopIntelligences(scores, 8)

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(PLAN_ROUTES[0])
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
    if (allSorted.length === 0) return []
    const top = allSorted[0]
    const topName = DOMAIN_SHORT[top.domain] || top.domain
    const growthAreas = allSorted.slice(-3)
    const parts: string[] = [
      `Here are all eight of your intelligences, ranked from strongest to developing. Your top area is ${topName} with a score of ${Math.round(top.score)}.`,
    ]
    parts.push(
      'Your top 3 are highlighted in blue — these are your natural strengths. The areas below are not weaknesses, they are simply where you have the most room to grow.'
    )
    growthAreas.forEach(({ domain }) => {
      const name = DOMAIN_SHORT[domain] || domain
      const tip = DOMAIN_GROWTH_TIP[domain] || ''
      parts.push(`To build your ${name} intelligence: ${tip}.`)
    })
    parts.push(
      'Remember, this is your starting point. With focused practice, any of these areas can become a new strength.'
    )
    return parts
  }

  const content: DotData = {
    id: 'all-strengths',
    icon: TrendingUp,
    label: 'Growth',
    title: 'All Your Strengths',
    subtitle: 'Every intelligence ranked, with tips for growth',
    largeText: isLoading || isError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : isError ? (
      <ErrorContent
        message={error?.message || 'Failed to load strengths data'}
        onRetry={() => refetch()}
      />
    ) : (
      <RankingChart allSorted={allSorted} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(PLAN_ROUTES[0]),
    buttonText: 'Back to Overview',
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
      layoutId='plan-growth'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='All Your Strengths' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default AllStrengths
