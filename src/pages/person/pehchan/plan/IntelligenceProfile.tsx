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
import {
  useIntelligenceScores,
  usePhysicalScores,
  displayName,
} from '@/hooks/useProfileScores'
import { getTopIntelligences } from '@/lib/mi-scoring'

const DOMAIN_SHORT: Record<string, string> = {
  INTERPERSONAL: 'Interpersonal',
  BODILY_KINESTHETIC: 'Bodily-Kin.',
  LOGICAL_MATHEMATICAL: 'Logical-Math.',
  LINGUISTIC: 'Linguistic',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  NATURALISTIC: 'Naturalistic',
  INTRAPERSONAL: 'Intrapersonal',
}

function esc(s: string) {
  return s
    .replace(/["\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildProfilePie(
  intelligenceScores: Record<string, number>,
  physicalScores: Record<string, number>
) {
  const intTop3 = Object.entries(intelligenceScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
  const phyTop3 = Object.entries(physicalScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const lines: string[] = ['pie title Your Top Strengths']
  intTop3.forEach(([domain, score]) => {
    const name = DOMAIN_SHORT[domain] || displayName(domain, 'intelligence')
    lines.push(`  "${esc(name)}" : ${Math.round(score)}`)
  })
  phyTop3.forEach(([domain, score]) => {
    const name = displayName(domain, 'physical')
    lines.push(`  "${esc(name)}" : ${Math.round(score)}`)
  })
  return lines.join('\n')
}

function ProfileChart({
  intelligenceScores,
  physicalScores,
}: {
  intelligenceScores: Record<string, number>
  physicalScores: Record<string, number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isSmall, setIsSmall] = useState(false)
  const { theme } = useTheme()

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
    const diagram = buildProfilePie(intelligenceScores, physicalScores)
    ref.current.innerHTML = ''
    const id = `mermaid-profile-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
          // Constrain the SVG to fit the container
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
        console.error('Mermaid profile render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [intelligenceScores, physicalScores, isSmall, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Intelligence and physical profile diagram'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading your profile...</p>
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

function IntelligenceProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const {
    data: intData,
    isLoading: intLoading,
    isError: intError,
    error: intErr,
    refetch: intRefetch,
  } = useIntelligenceScores()
  const {
    data: phyData,
    isLoading: phyLoading,
    isError: phyError,
    error: phyErr,
    refetch: phyRefetch,
  } = usePhysicalScores()

  const isLoading = intLoading || phyLoading
  const isError = intError || phyError
  const errorMessage =
    intErr?.message || phyErr?.message || 'Failed to load profile data'

  const intScores = intData?.intelligences ?? {}
  const phyScores = phyData?.physical ?? {}
  const topIntelligences = getTopIntelligences(intScores, 3)

  const topPhysical = Object.entries(phyScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([domain]) => displayName(domain, 'physical'))

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(PLAN_ROUTES[4])
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
    if (Object.keys(intScores).length === 0) return []
    const topIntNames = topIntelligences.map(
      t => DOMAIN_SHORT[t.domain]?.replace('.', '') || t.domain
    )
    const parts = [
      `This chart maps your complete profile across both intelligence and physical domains. The blue branch shows your eight intelligences, and the green branch shows your physical abilities.`,
      `Your strongest intelligences are ${topIntNames[0]}, ${topIntNames[1]}, and ${topIntNames[2]}. These are the thinking styles that come most naturally to you.`,
    ]
    if (topPhysical.length >= 3) {
      parts.push(
        `On the physical side, your top areas are ${topPhysical[0]}, ${topPhysical[1]}, and ${topPhysical[2]}. Together with your intelligence profile, they paint a complete picture of your capabilities.`
      )
    }
    parts.push(
      `There's no "ideal" profile. The best learners understand their unique shape and use it to their advantage.`
    )
    return parts
  }

  const content: DotData = {
    id: 'intelligence-profile',
    icon: Radar,
    label: 'Profile',
    title: 'Your Complete Profile',
    subtitle: 'Intelligence and physical abilities in one view',
    largeText: isLoading || isError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : isError ? (
      <ErrorContent
        message={errorMessage}
        onRetry={() => {
          intRefetch()
          phyRefetch()
        }}
      />
    ) : (
      <ProfileChart intelligenceScores={intScores} physicalScores={phyScores} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(PLAN_ROUTES[4]),
    buttonText: 'View All Strengths',
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
      layoutId='plan-profile'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main
        aria-label='Complete Profile'
        className='h-full w-full overflow-hidden'
      >
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default IntelligenceProfile
