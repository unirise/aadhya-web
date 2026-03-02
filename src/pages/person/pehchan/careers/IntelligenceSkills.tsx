import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import mermaid from 'mermaid'
import {
  ArrowLeft,
  Home as HomeIcon,
  Briefcase,
  Brain,
  Wrench,
  GraduationCap,
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
import { useCareerData } from '@/hooks/useCareerData'


const DOMAIN_SHORT: Record<string, string> = {
  INTERPERSONAL: 'Interpersonal',
  BODILY_KINESTHETIC: 'Bodily-Kinesthetic',
  LOGICAL_MATHEMATICAL: 'Logical-Mathematical',
  LINGUISTIC: 'Linguistic',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  NATURALISTIC: 'Naturalistic',
  INTRAPERSONAL: 'Intrapersonal',
}

function buildMindmap(
  mapping: Array<{ domain: string; score: number; skills: string[] }>
) {
  if (!mapping.length) return null
  const branches = mapping
    .map(({ domain, skills }) => {
      const name = DOMAIN_SHORT[domain] || domain
      const leaves = skills
        .slice(0, 5)
        .map(s => `      ${s}`)
        .join('\n')
      return `    ${name}\n${leaves}`
    })
    .join('\n')

  return `mindmap
  root((Your Strengths))
${branches}`
}

function MindmapChart({
  mapping,
  theme,
}: {
  mapping: Array<{ domain: string; score: number; skills: string[] }>
  theme: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const diagram = buildMindmap(mapping)
    if (!diagram) return
    ref.current.innerHTML = ''
    const id = `mermaid-mindmap-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(() => {
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [mapping, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Intelligence skills mindmap'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading intelligence skills…</p>
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

const CAREER_ROUTES = [
  '/pehachan/dashboard/careers',
  '/pehachan/dashboard/careers/intelligence-skills',
  '/pehachan/dashboard/careers/skills-vocations',
  '/pehachan/dashboard/careers/nsqf-roles',
]

function IntelligenceSkills() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const {
    isLoading,
    hasError,
    errorMessage,
    handleRetry,
    intelligenceSkillMapping,
  } = useCareerData()

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(CAREER_ROUTES[2])
      } else if (section === 'footer') {
        if (CAREER_ROUTES[index]) navigate(CAREER_ROUTES[index])
      }
    },
    [navigate, toggleTheme]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: 1,
    panelCount: 0,
    footerCount: 4,
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
    if (!intelligenceSkillMapping.length) return []
    const parts: string[] = []
    intelligenceSkillMapping.forEach(({ domain, skills }) => {
      const name = DOMAIN_SHORT[domain] || domain
      parts.push(
        `Your ${name} intelligence maps to skills like ${skills.slice(0, 3).join(', ')}. These represent natural abilities that can be developed into vocational competencies.`
      )
    })
    parts.push(
      'The mindmap shows how each of your top intelligence domains branches into specific skills.'
    )
    return parts
  }

  const content: DotData = {
    id: 'intelligence-skills',
    icon: Brain,
    label: 'Intelligence Skills',
    title: 'Intelligence to Skills Mapping',
    subtitle: 'Skills derived from your top intelligence domains',
    largeText: isLoading || hasError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : hasError ? (
      <ErrorContent message={errorMessage} onRetry={handleRetry} />
    ) : (
      <MindmapChart mapping={intelligenceSkillMapping} theme={theme} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(CAREER_ROUTES[2]),
    buttonText: 'View Skills Vocations',
  }

  const footerItems: DotData[] = [
    {
      id: 'overview',
      icon: Briefcase,
      label: 'Overview',
      title: 'Overview',
      subtitle: 'Career pathways overview',
      tinyText: 'Overview',
      buttonText: 'Overview',
      onClick: () => navigate(CAREER_ROUTES[0]),
      isFocused: isFocused('footer', 0),
      ariaCurrent: location.pathname === CAREER_ROUTES[0] ? 'page' : undefined,
    },
    {
      id: 'intelligence-skills',
      icon: Brain,
      label: 'Skills',
      title: 'Intelligence Skills',
      subtitle: 'Skills from your intelligences',
      tinyText: 'Skills',
      buttonText: 'Intelligence Skills',
      onClick: () => navigate(CAREER_ROUTES[1]),
      isFocused: isFocused('footer', 1),
      ariaCurrent: location.pathname === CAREER_ROUTES[1] ? 'page' : undefined,
    },
    {
      id: 'skills-vocations',
      icon: Wrench,
      label: 'Vocations',
      title: 'Skills Vocations',
      subtitle: 'Vocational career paths',
      tinyText: 'Vocations',
      buttonText: 'Skills Vocations',
      onClick: () => navigate(CAREER_ROUTES[2]),
      isFocused: isFocused('footer', 2),
      ariaCurrent: location.pathname === CAREER_ROUTES[2] ? 'page' : undefined,
    },
    {
      id: 'nsqf-roles',
      icon: GraduationCap,
      label: 'NSQF',
      title: 'NSQF Roles',
      subtitle: 'Qualification framework roles',
      tinyText: 'NSQF',
      buttonText: 'NSQF Roles',
      onClick: () => navigate(CAREER_ROUTES[3]),
      isFocused: isFocused('footer', 3),
      ariaCurrent: location.pathname === CAREER_ROUTES[3] ? 'page' : undefined,
    },
  ]

  return (
    <FluidLayout
      layoutId='careers-intelligence-skills'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Intelligence Skills' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default IntelligenceSkills
