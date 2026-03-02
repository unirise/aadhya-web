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
  BODILY_KINESTHETIC: 'Bodily Kinesthetic',
  LOGICAL_MATHEMATICAL: 'Logical Mathematical',
  LINGUISTIC: 'Linguistic',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  NATURALISTIC: 'Naturalistic',
  INTRAPERSONAL: 'Intrapersonal',
}

/** Escape characters that break mermaid node labels */
function esc(s: string) {
  return s.replace(/["\(\)]/g, ' ').replace(/\s+/g, ' ').trim()
}

function buildOverviewFlowchart(
  intelligenceSkillMapping: Array<{ domain: string; skills: string[] }>,
  skillsVocationalMapping: Array<{ skill: string; vocationalPaths: string[] }>
) {
  // Build a set of skills that have vocational paths
  const vocSkills = new Set(skillsVocationalMapping.map(s => s.skill))
  const vocMap = new Map(
    skillsVocationalMapping.map(s => [s.skill, s.vocationalPaths])
  )

  const lines: string[] = ['flowchart LR']
  let nid = 0

  intelligenceSkillMapping.forEach(({ domain, skills }) => {
    const dName = DOMAIN_SHORT[domain] || domain
    const dId = `D${nid++}`
    lines.push(`  ${dId}["${esc(dName)}"]`)

    // Pick skills that have vocational paths first, then fill up to 2
    const matched = skills.filter(s => vocSkills.has(s)).slice(0, 2)
    const picked = matched.length >= 2 ? matched : [
      ...matched,
      ...skills.filter(s => !vocSkills.has(s)).slice(0, 2 - matched.length),
    ]

    picked.forEach(skill => {
      const sId = `S${nid++}`
      lines.push(`  ${dId} --> ${sId}["${esc(skill)}"]`)

      // Add vocational path if available
      const paths = vocMap.get(skill)
      if (paths && paths.length > 0) {
        const rId = `R${nid++}`
        lines.push(`  ${sId} --> ${rId}["${esc(paths[0])}"]`)
      }
    })
  })

  return lines.length > 1 ? lines.join('\n') : null
}

function OverviewChart({
  intelligenceSkillMapping,
  skillsVocationalMapping,
  theme,
}: {
  intelligenceSkillMapping: Array<{ domain: string; skills: string[] }>
  skillsVocationalMapping: Array<{ skill: string; vocationalPaths: string[] }>
  theme: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const diagram = buildOverviewFlowchart(
      intelligenceSkillMapping,
      skillsVocationalMapping
    )
    if (!diagram) return
    ref.current.innerHTML = ''
    const id = `mermaid-overview-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(err => {
        console.error('Mermaid overview render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [intelligenceSkillMapping, skillsVocationalMapping, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Career pathways overview diagram'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading career data…</p>
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

function CareersOverview() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const {
    isLoading,
    hasError,
    errorMessage,
    handleRetry,
    intelligenceSkillMapping,
    skillsVocationalMapping,
    rolesByIntelligence,
    allNSQFRoles,
  } = useCareerData()

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(CAREER_ROUTES[1])
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

  const totalRoles = Object.values(rolesByIntelligence).reduce(
    (sum, roles) => sum + roles.length,
    0
  )

  const buildLargeText = (): string[] => {
    const parts: string[] = []
    parts.push(
      `Your career analysis has identified ${skillsVocationalMapping.length} key skills mapped to vocational career paths across ${Object.keys(rolesByIntelligence).length} intelligence domains.`
    )
    parts.push(
      `A total of ${totalRoles} career roles are available, with ${allNSQFRoles.length} mapped to NSQF qualification levels.`
    )
    parts.push(
      'The diagram shows how your intelligence strengths flow through skills into career opportunities.'
    )
    return parts
  }

  const content: DotData = {
    id: 'careers-overview',
    icon: Briefcase,
    label: 'Careers',
    title: 'Career Pathways Overview',
    subtitle: 'How your intelligences connect to career opportunities',
    largeText: isLoading || hasError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : hasError ? (
      <ErrorContent message={errorMessage} onRetry={handleRetry} />
    ) : (
      <OverviewChart
        intelligenceSkillMapping={intelligenceSkillMapping}
        skillsVocationalMapping={skillsVocationalMapping}
        theme={theme}
      />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(CAREER_ROUTES[1]),
    buttonText: 'View Intelligence Skills',
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
      layoutId='careers-overview'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Career Pathways Overview' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default CareersOverview
