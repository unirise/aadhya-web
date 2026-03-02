import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import mermaid from 'mermaid'
import {
  ArrowLeft,
  BarChart3,
  Activity,
  Clock,
  Loader2,
  AlertCircle,
  LayoutGrid,
  HomeIcon,
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
import type { DomainProfileConfig, ScoresQuery } from '@/types/domain-profile'
import { toDisplayScores, topN, displayName } from '@/hooks/useProfileScores'
import { useMyResponses } from '@/hooks/useAssessments'
import {
  extractNewScore,
  buildRadarDiagram,
  buildScoreLineChart,
} from '@/lib/chart-utils'

function MermaidChart({ diagram, theme }: { diagram: string; theme: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const id = `mermaid-domain-${Date.now()}`
    mermaid.render(id, diagram).then(({ svg }) => {
      if (!ref.current) return
      ref.current.innerHTML = svg
      // Remove white background rects injected by mermaid
      ref.current
        .querySelectorAll(
          'rect[fill="#f4f4f4"], rect[fill="white"], rect[fill="#fff"]'
        )
        .forEach(el => el.setAttribute('fill', 'transparent'))
      // Also handle the main SVG background style
      const svgEl = ref.current.querySelector('svg')
      if (svgEl) svgEl.style.backgroundColor = 'transparent'
    })
  }, [diagram, theme])

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Profile chart'
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

export default function DomainProfile({
  config,
  scoresQuery,
}: {
  config: DomainProfileConfig
  scoresQuery: ScoresQuery
}) {
  const navigate = useNavigate()
  const { attribute } = useParams<{ attribute?: string }>()
  const { theme, toggleTheme } = useTheme()

  const scoreQuery = scoresQuery
  const responsesQuery = useMyResponses()

  // Validate attribute param
  const validAttribute = useMemo(
    () =>
      attribute
        ? (config.attributes.find(a => a.value === attribute) ?? null)
        : null,
    [attribute, config.attributes]
  )

  // Redirect invalid attribute to overview
  useEffect(() => {
    if (attribute && !validAttribute) {
      navigate(config.basePath, { replace: true })
    }
  }, [attribute, validAttribute, navigate, config.basePath])

  const displayScores = useMemo(
    () =>
      scoreQuery.data ? toDisplayScores(scoreQuery.data, config.domain) : null,
    [scoreQuery.data, config.domain]
  )

  // Filter responses for this domain
  const domainResponses = useMemo(
    () => responsesQuery.data?.filter(r => r.domain === config.domain) ?? [],
    [responsesQuery.data, config.domain]
  )

  // Filter responses for current attribute
  const attributeResponses = useMemo(
    () =>
      validAttribute
        ? domainResponses.filter(r => r.attribute === validAttribute.value)
        : [],
    [domainResponses, validAttribute]
  )

  const topStrengths = useMemo(
    () => (displayScores ? topN(displayScores, 3) : []),
    [displayScores]
  )

  const isLoading = scoreQuery.isLoading || responsesQuery.isLoading
  const hasError = scoreQuery.isError || responsesQuery.isError
  const errorMessage =
    scoreQuery.error?.message ||
    responsesQuery.error?.message ||
    'Failed to load profile data'

  const handleRetry = useCallback(() => {
    if (scoreQuery.isError) scoreQuery.refetch()
    if (responsesQuery.isError) responsesQuery.refetch()
  }, [scoreQuery, responsesQuery])

  // Cycle to next attribute (overview → attr[0] → attr[1] → ... → overview)
  const { nextPath, nextLabel } = useMemo(() => {
    const attrs = config.attributes
    if (!validAttribute) {
      const first = attrs[0]
      return {
        nextPath: `${config.basePath}/${first.value}`,
        nextLabel: displayName(first.value, config.domain),
      }
    }
    const idx = attrs.findIndex(a => a.value === validAttribute.value)
    if (idx < attrs.length - 1) {
      const next = attrs[idx + 1]
      return {
        nextPath: `${config.basePath}/${next.value}`,
        nextLabel: displayName(next.value, config.domain),
      }
    }
    return { nextPath: config.basePath, nextLabel: 'Overview' }
  }, [config, validAttribute])

  const handleCycle = useCallback(() => {
    navigate(nextPath)
  }, [navigate, nextPath])

  // --- Keyboard navigation (must come BEFORE content/panel/footer construction) ---
  const panelCount = isLoading || hasError ? 0 : 3
  const footerCount = config.attributes.length + 1 // overview + attributes

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/pehachan')
        else if (index === 1) toggleTheme()
      } else if (section === 'content') {
        handleCycle()
      } else if (section === 'footer') {
        if (index === 0) {
          navigate(config.basePath)
        } else {
          const attr = config.attributes[index - 1]
          if (attr) navigate(`${config.basePath}/${attr.value}`)
        }
      }
    },
    [navigate, toggleTheme, handleCycle, config]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 2,
    contentCount: 1,
    panelCount,
    footerCount,
    onActivate: handleActivate,
  })

  // --- Build DotData arrays (now isFocused is available) ---

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
      isFocused: isFocused('header', 0),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 1) },
  ]

  // Content dot
  const contentDot = useMemo((): DotData => {
    if (isLoading || hasError) {
      return {
        id: 'domain-content',
        icon: config.icon,
        label: config.title,
        title: config.title,
        subtitle: 'Loading…',
        largeText: [],
        media: isLoading ? (
          <LoadingContent />
        ) : (
          <ErrorContent message={errorMessage} onRetry={handleRetry} />
        ),
        mediaDefaultSizes: [40, 60],
        isFocused: isFocused('content', 0),
      }
    }

    if (!validAttribute) {
      // Overview view
      const text: string[] = []
      if (topStrengths.length >= 3) {
        text.push(
          `Your top ${config.domain} strengths are ${topStrengths[0]}, ${topStrengths[1]}, and ${topStrengths[2]}. These areas represent where you perform most strongly.`
        )
      }
      text.push(
        `The radar chart shows your complete ${config.domain} profile. Use it to identify areas of strength and opportunities for growth.`
      )

      const diagram =
        displayScores && Object.keys(displayScores).length > 0
          ? buildRadarDiagram(`${config.title} Profile`, displayScores)
          : null

      return {
        id: 'domain-overview',
        icon: config.icon,
        label: config.title,
        title: `Your ${config.title} Profile`,
        subtitle: `A snapshot of your ${config.domain} strengths`,
        largeText: text,
        media: diagram ? (
          <MermaidChart diagram={diagram} theme={theme} />
        ) : (
          <div className='h-full w-full flex items-center justify-center text-muted-foreground text-sm'>
            No score data yet. Complete some activities to see your profile.
          </div>
        ),
        mediaDefaultSizes: [40, 60],
        onClick: handleCycle,
        buttonText: nextLabel,
        isFocused: isFocused('content', 0),
      }
    }

    // Attribute detail view
    const attrDisplayName = displayName(validAttribute.value, config.domain)
    const score = displayScores?.[attrDisplayName] ?? 0
    const count = attributeResponses.length

    const text: string[] = [
      `Your current ${attrDisplayName} score is ${score}. You have completed ${count} ${count === 1 ? 'activity' : 'activities'} in this area.`,
    ]
    if (count > 0) {
      text.push(
        'The chart below shows your score progression over time. Keep practising to improve!'
      )
    } else {
      text.push(
        'Complete some activities in this area to start tracking your progress.'
      )
    }

    // Last 10 responses sorted chronologically
    const recent = [...attributeResponses]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .reverse()

    const chartPoints = recent.map(r => ({
      label: r.activity.metadata.tinyText || r.activityId,
      score: Number(r?.newScore) || extractNewScore(r.responseData),
    }))

    const diagram = buildScoreLineChart(
      `${attrDisplayName} — Last ${chartPoints.length} Activities`,
      chartPoints
    )

    return {
      id: `attr-${validAttribute.value}`,
      icon: validAttribute.icon ?? config.icon,
      label: attrDisplayName,
      title: validAttribute.label,
      subtitle: `Your ${attrDisplayName} development`,
      largeText: text,
      media: diagram ? (
        <MermaidChart diagram={diagram} theme={theme} />
      ) : (
        <div className='h-full w-full flex items-center justify-center text-muted-foreground text-sm'>
          No activity data yet. Complete some {attrDisplayName.toLowerCase()}{' '}
          activities to see your progress.
        </div>
      ),
      mediaDefaultSizes: [40, 60],
      onClick: handleCycle,
      buttonText: nextLabel,
      isFocused: isFocused('content', 0),
    }
  }, [
    isLoading,
    hasError,
    validAttribute,
    displayScores,
    topStrengths,
    attributeResponses,
    config,
    errorMessage,
    handleRetry,
    handleCycle,
    nextLabel,
    isFocused,
    theme,
  ])

  // Panel stats
  const panelItems = useMemo((): DotData[] => {
    if (isLoading || hasError) return []

    if (!validAttribute) {
      const topName = topStrengths[0] ?? '—'
      const totalCount = domainResponses.length
      const avgTime = totalCount > 0 ? Math.round(totalCount * 2.5) : 0
      return [
        {
          id: 'stat-top',
          icon: BarChart3,
          label: 'Top Strength',
          title: 'Top Strength',
          tinyText: topName,
          smallText: `Your strongest area is ${topName}.`,
          isFocused: isFocused('content', 0, 'panel'),
        },
        {
          id: 'stat-count',
          icon: Activity,
          label: 'Activities',
          title: 'Total Activities',
          tinyText: `${totalCount}`,
          smallText: `${totalCount} ${config.domain} activities completed.`,
          isFocused: isFocused('content', 1, 'panel'),
        },
        {
          id: 'stat-time',
          icon: Clock,
          label: 'Time',
          title: 'Time Spent',
          tinyText: `${avgTime}m`,
          smallText: `Approx. ${avgTime} minutes in ${config.domain} activities.`,
          isFocused: isFocused('content', 2, 'panel'),
        },
      ]
    }

    const attrDisplayName = displayName(validAttribute.value, config.domain)
    const score = displayScores?.[attrDisplayName] ?? 0
    const count = attributeResponses.length
    const avgTime = count > 0 ? Math.round(count * 2.5) : 0

    return [
      {
        id: 'stat-score',
        icon: BarChart3,
        label: 'Score',
        title: `${attrDisplayName} Score`,
        tinyText: `${score}`,
        smallText: `Current score: ${score}`,
        isFocused: isFocused('content', 0, 'panel'),
      },
      {
        id: 'stat-count',
        icon: Activity,
        label: 'Activities',
        title: 'Activity Count',
        tinyText: `${count}`,
        smallText: `${count} activities completed.`,
        isFocused: isFocused('content', 1, 'panel'),
      },
      {
        id: 'stat-time',
        icon: Clock,
        label: 'Time',
        title: 'Time Spent',
        tinyText: `${avgTime}m`,
        smallText: `Approx. ${avgTime} minutes spent.`,
        isFocused: isFocused('content', 2, 'panel'),
      },
    ]
  }, [
    isLoading,
    hasError,
    validAttribute,
    displayScores,
    topStrengths,
    domainResponses,
    attributeResponses,
    config,
    isFocused,
  ])

  // Footer: overview dot + 1 dot per attribute
  const footerItems: DotData[] = [
    {
      id: 'overview',
      icon: LayoutGrid,
      label: 'Overview',
      title: `${config.title} Overview`,
      tinyText: 'Overview',
      buttonText: 'Overview',
      isActive: !attribute,
      onClick: () => navigate(config.basePath),
      isFocused: isFocused('footer', 0),
    },
    ...config.attributes.map((attr, i) => ({
      id: attr.value,
      icon: attr.icon ?? config.icon,
      label: displayName(attr.value, config.domain),
      title: attr.label,
      tinyText: displayName(attr.value, config.domain),
      buttonText: displayName(attr.value, config.domain),
      isActive: attribute === attr.value,
      onClick: () => navigate(`${config.basePath}/${attr.value}`),
      isFocused: isFocused('footer', i + 1),
    })),
  ]

  return (
    <FluidLayout
      layoutId={`pehchan-${config.domain}`}
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId={`pehchan-${config.domain}`}
        content={
          <main
            aria-label={`${config.title} Profile`}
            className='h-full w-full overflow-hidden'
          >
            <Dot data={contentDot} />
          </main>
        }
        panel={<Panel items={panelItems} />}
      />
    </FluidLayout>
  )
}
