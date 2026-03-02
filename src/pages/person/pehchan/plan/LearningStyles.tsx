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
import { getIntelligenceTeachingStyles } from '@/lib/intelligence-teaching-styles'

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

function buildStylesMindmap(
  teachingStyles: Array<{
    domain: string
    score: number
    teachingStyles: string[]
  }>
) {
  const lines: string[] = ['mindmap', '  root((How You Learn))']

  teachingStyles.forEach(({ domain, teachingStyles: styles }) => {
    const name = DOMAIN_SHORT[domain] || domain
    lines.push(`    ${esc(name)}`)
    // 2 styles per branch keeps it compact
    styles.slice(0, 2).forEach(style => {
      const shortStyle = style.split(' - ')[0]
      lines.push(`      ${esc(shortStyle)}`)
    })
  })

  return lines.join('\n')
}

function StylesChart({
  teachingStyles,
}: {
  teachingStyles: Array<{
    domain: string
    score: number
    teachingStyles: string[]
  }>
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
    if (!ref.current) return
    const diagram = buildStylesMindmap(teachingStyles)
    ref.current.innerHTML = ''
    const id = `mermaid-styles-${Date.now()}`
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
        console.error('Mermaid styles render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [teachingStyles, isSmall])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Learning styles mindmap'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading your learning styles...</p>
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

function LearningStyles() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { data, isLoading, isError, error, refetch } = useIntelligenceScores()

  const scores = data?.intelligences ?? {}
  const teachingStyles = getIntelligenceTeachingStyles(scores, 3)

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(PLAN_ROUTES[3])
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
    if (teachingStyles.length === 0) return []
    const parts: string[] = [
      'Because of your unique strengths, certain teaching approaches will resonate with you more than others. Here are the methods that work best for you.',
    ]
    teachingStyles.forEach(({ domain, teachingStyles: styles }) => {
      const name = DOMAIN_SHORT[domain] || domain
      const topStyles = styles.slice(0, 2).map(s => s.split(' - ')[0]).join(' and ')
      parts.push(
        `For your ${name} strength, try ${topStyles}. ${styles[0].split(' - ')[1] || ''}`
      )
    })
    parts.push(
      'Share these recommendations with your teachers and parents so they can adapt their approach to match how you learn best.'
    )
    return parts
  }

  const content: DotData = {
    id: 'learning-styles',
    icon: BookOpen,
    label: 'Styles',
    title: 'How You Learn Best',
    subtitle: 'Teaching approaches matched to your strengths',
    largeText: isLoading || isError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : isError ? (
      <ErrorContent
        message={error?.message || 'Failed to load learning styles'}
        onRetry={() => refetch()}
      />
    ) : (
      <StylesChart teachingStyles={teachingStyles} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(PLAN_ROUTES[3]),
    buttonText: 'View Full Profile',
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
      layoutId='plan-styles'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='How You Learn Best' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default LearningStyles
