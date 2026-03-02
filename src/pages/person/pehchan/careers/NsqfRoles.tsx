import { useCallback, useEffect, useRef, useMemo } from 'react'
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


/** Escape characters that break mermaid node labels */
function esc(s: string) {
  return s.replace(/["\(\)]/g, ' ').replace(/\s+/g, ' ').trim()
}

function buildNsqfFlowchart(
  allRoles: Array<{ role: string; nsqf_level: number | null }>
) {
  if (!allRoles.length) return null

  // Group by level
  const byLevel: Record<string, string[]> = {}
  allRoles.forEach(({ role, nsqf_level }) => {
    const key = nsqf_level !== null ? `Level ${nsqf_level}` : 'Not Mapped'
    if (!byLevel[key]) byLevel[key] = []
    if (!byLevel[key].includes(role)) byLevel[key].push(role)
  })

  const lines: string[] = ['flowchart TB']
  let nodeId = 0

  // Sort levels numerically
  const sortedLevels = Object.keys(byLevel).sort((a, b) => {
    const aNum = a.match(/\d+/)?.[0]
    const bNum = b.match(/\d+/)?.[0]
    if (!aNum) return 1
    if (!bNum) return -1
    return Number(aNum) - Number(bNum)
  })

  sortedLevels.forEach(level => {
    const roles = byLevel[level].slice(0, 4) // Max 4 per level
    const subId = `L${nodeId++}`
    lines.push(`  subgraph ${subId}["${esc(level)}"]`)
    roles.forEach(role => {
      const rId = `N${nodeId++}`
      lines.push(`    ${rId}["${esc(role)}"]`)
    })
    lines.push('  end')
  })

  return lines.join('\n')
}

function NsqfChart({
  allRoles,
  theme,
}: {
  allRoles: Array<{ role: string; nsqf_level: number | null }>
  theme: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const diagram = buildNsqfFlowchart(allRoles)
    if (!diagram) return
    ref.current.innerHTML = ''
    const id = `mermaid-nsqf-${Date.now()}`
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(err => {
        console.error('Mermaid NSQF render error:', err)
        if (ref.current)
          ref.current.innerHTML =
            '<p class="text-sm text-muted-foreground p-4">Chart unavailable</p>'
      })
  }, [allRoles, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='NSQF roles distribution chart'
      className='w-full h-full flex items-center justify-center p-4 overflow-auto'
    />
  )
}

function LoadingContent() {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='w-8 h-8 animate-spin' />
      <p className='text-sm'>Loading NSQF data…</p>
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

function NsqfRoles() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const {
    isLoading,
    hasError,
    errorMessage,
    handleRetry,
    allNSQFRoles,
  } = useCareerData()

  const levelDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    allNSQFRoles.forEach(({ nsqf_level }) => {
      const key = nsqf_level !== null ? `Level ${nsqf_level}` : 'Not Mapped'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [allNSQFRoles])

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        navigate(CAREER_ROUTES[0])
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
    const parts: string[] = []
    const mapped = allNSQFRoles.filter(r => r.nsqf_level !== null).length
    parts.push(
      `${allNSQFRoles.length} career roles have been identified, with ${mapped} mapped to NSQF (National Skills Qualification Framework) levels. NSQF levels indicate skill complexity and autonomy — not a ceiling on potential.`
    )
    const levelSummary = Object.entries(levelDistribution)
      .sort((a, b) => {
        const aNum = a[0].match(/\d+/)?.[0] || '999'
        const bNum = b[0].match(/\d+/)?.[0] || '999'
        return Number(aNum) - Number(bNum)
      })
      .map(([level, count]) => `${level}: ${count} roles`)
      .join(', ')
    if (levelSummary) {
      parts.push(`Distribution: ${levelSummary}.`)
    }
    parts.push(
      'The chart groups available roles by their NSQF qualification level.'
    )
    return parts
  }

  const content: DotData = {
    id: 'nsqf-roles',
    icon: GraduationCap,
    label: 'NSQF Roles',
    title: 'NSQF Qualification Levels',
    subtitle: 'Roles mapped to the National Skills Qualification Framework',
    largeText: isLoading || hasError ? [] : buildLargeText(),
    media: isLoading ? (
      <LoadingContent />
    ) : hasError ? (
      <ErrorContent message={errorMessage} onRetry={handleRetry} />
    ) : (
      <NsqfChart allRoles={allNSQFRoles} theme={theme} />
    ),
    mediaDefaultSizes: [40, 60],
    isFocused: isFocused('content', 0),
    onClick: () => navigate(CAREER_ROUTES[0]),
    buttonText: 'Back to Overview',
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
      layoutId='careers-nsqf-roles'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='NSQF Roles' className='h-full w-full overflow-hidden'>
        <Dot data={content} />
      </main>
    </FluidLayout>
  )
}

export default NsqfRoles
