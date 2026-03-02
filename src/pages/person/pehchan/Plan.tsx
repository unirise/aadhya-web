import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Home as HomeIcon,
  Brain,
  Dumbbell,
  BarChart3,
  Target,
  Sparkles,
  Trophy,
  BookOpen,
  Radar,
  TrendingUp,
} from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import {
  Header,
  Footer,
  ContentSection,
  FluidLayout,
  FluidContentPanel,
  Panel,
} from '@/components/sections'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'

function Plan() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, zone, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) navigate('/pehachan/dashboard')
        else if (index === 2) toggleTheme()
      } else if (section === 'content' && zone === 'panel') {
        const routes = ['/pehachan/dashboard/stats', '/pehachan/dashboard/careers']
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
    contentCount: 5,
    panelCount: 2,
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
      title: 'Back to Dashboard',
      subtitle: 'Return to Pehchan dashboard',
      tinyText: 'Back',
      buttonText: 'Go Back',
      onClick: () => navigate('/pehachan/dashboard'),
      isFocused: isFocused('header', 1),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 2) },
  ]

  const contentItems: DotData[] = [
    {
      id: 'overview',
      icon: Sparkles,
      label: 'Overview',
      title: 'Your Learning Overview',
      subtitle: 'A snapshot of who you are as a learner',
      tinyText: 'Overview',
      smallText: 'See the big picture — your top strengths and how they connect.',
      largeText: [
        'Everyone learns differently. This overview maps out your unique combination of strengths and shows how they work together.',
        'Start here to get a sense of who you are as a learner.',
      ],
      onClick: () => navigate('/pehachan/dashboard/plan/overview'),
      isFocused: isFocused('content', 0),
    },
    {
      id: 'strengths',
      icon: Trophy,
      label: 'Strengths',
      title: 'Your Top Strengths',
      subtitle: "What you're naturally good at",
      tinyText: 'Strengths',
      smallText: 'Discover your top 3 learning strengths and what they mean.',
      largeText: [
        'Your top strengths are the ways of thinking and learning that come most naturally to you.',
        'Understanding them helps you lean into what works best.',
      ],
      onClick: () => navigate('/pehachan/dashboard/plan/strengths'),
      isFocused: isFocused('content', 1),
    },
    {
      id: 'styles',
      icon: BookOpen,
      label: 'Styles',
      title: 'How You Learn',
      subtitle: 'Teaching styles that work for you',
      tinyText: 'Styles',
      smallText: 'Find out which teaching approaches match the way you think.',
      largeText: [
        'Not every teaching method works for every learner. Based on your strengths, certain approaches will click better.',
        'Share these with your teachers and parents to make learning more effective.',
      ],
      onClick: () => navigate('/pehachan/dashboard/plan/styles'),
      isFocused: isFocused('content', 2),
    },
    {
      id: 'profile',
      icon: Radar,
      label: 'Profile',
      title: 'Your Full Profile',
      subtitle: 'See all your intelligences at a glance',
      tinyText: 'Profile',
      smallText: 'A visual map of all eight intelligence areas.',
      largeText: [
        'This chart shows the complete picture — all eight intelligences and how they compare.',
        "Every person has a unique profile. There are no \"bad\" scores, just different strengths.",
      ],
      onClick: () => navigate('/pehachan/dashboard/plan/profile'),
      isFocused: isFocused('content', 3),
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: 'Growth',
      title: 'All Your Strengths',
      subtitle: 'Every intelligence, ranked and explained',
      tinyText: 'Growth',
      smallText: 'See all eight intelligences and where you can grow.',
      largeText: [
        'Here you can see all your intelligences ranked from strongest to developing.',
        'Every area can be strengthened with practice. This is your starting point, not your ceiling.',
      ],
      onClick: () => navigate('/pehachan/dashboard/plan/growth'),
      isFocused: isFocused('content', 4),
    },
  ]

  const panelItems: DotData[] = [
    {
      id: 'stats',
      icon: BarChart3,
      label: 'Stats',
      title: 'Statistics',
      tinyText: 'Stats',
      smallText: 'View detailed scores and performance trends.',
      onClick: () => navigate('/pehachan/dashboard/stats'),
      isFocused: isFocused('content', 0, 'panel'),
    },
    {
      id: 'careers',
      icon: Target,
      label: 'Careers',
      title: 'Careers',
      tinyText: 'Careers',
      smallText: 'Explore career paths that align with your profile.',
      onClick: () => navigate('/pehachan/dashboard/careers'),
      isFocused: isFocused('content', 1, 'panel'),
    },
  ]

  const footerItems: DotData[] = [
    {
      id: 'intelligence',
      icon: Brain,
      label: 'Intelligence',
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
      label: 'Physical',
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
      layoutId='pehchan-plan'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId='pehchan-plan'
        content={
          <main aria-label='Learning Plan' className='h-full w-full overflow-hidden'>
            <ContentSection
              title='Your Learning Plan'
              description='Discover how you learn best and what makes you unique'
              items={contentItems}
            />
          </main>
        }
        panel={<Panel items={panelItems} />}
      />
    </FluidLayout>
  )
}

export default Plan
