import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Home as HomeIcon,
  Brain,
  Dumbbell,
  BarChart3,
  BookOpen,
  Briefcase,
  Lightbulb,
  GraduationCap,
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

function Careers() {
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
        const routes = ['/pehachan/dashboard/stats', '/pehachan/dashboard/plan']
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
    contentCount: 3,
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
      id: 'recommended',
      icon: Briefcase,
      label: 'Recommended',
      title: 'Recommended Careers',
      subtitle: 'Paths that match your strengths',
      tinyText: 'Top Picks',
      smallText: 'Career suggestions based on your intelligence and physical profile.',
      largeText: [
        'Based on your unique combination of intelligence and physical strengths, these career paths are a strong match for you.',
        'Coming soon: personalised career recommendations with detailed role descriptions.',
      ],
      isFocused: isFocused('content', 0),
    },
    {
      id: 'explore',
      icon: Lightbulb,
      label: 'Explore',
      title: 'Explore Fields',
      subtitle: 'Discover new possibilities',
      tinyText: 'Explore',
      smallText: 'Browse career fields across different industries and domains.',
      largeText: [
        'Explore a wide range of career fields and discover roles you might not have considered before.',
        'Coming soon: interactive career explorer with filters by domain, interest, and skill match.',
      ],
      isFocused: isFocused('content', 1),
    },
    {
      id: 'pathways',
      icon: GraduationCap,
      label: 'Pathways',
      title: 'Learning Pathways',
      subtitle: 'Steps to reach your goals',
      tinyText: 'Pathways',
      smallText: 'Educational pathways that lead to your recommended careers.',
      largeText: [
        'Each career path comes with a learning pathway — the courses, skills, and milestones needed to get there.',
        'Coming soon: step-by-step educational roadmaps tailored to your profile.',
      ],
      isFocused: isFocused('content', 2),
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
      id: 'plan',
      icon: BookOpen,
      label: 'Plan',
      title: 'Learning Plan',
      tinyText: 'Plan',
      smallText: 'Your personalised learning plan and recommendations.',
      onClick: () => navigate('/pehachan/dashboard/plan'),
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
      layoutId='pehchan-careers'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <FluidContentPanel
        layoutId='pehchan-careers'
        content={
          <main aria-label='Careers' className='h-full w-full overflow-hidden'>
            <ContentSection
              title='Careers'
              description='Career paths aligned with your unique profile'
              items={contentItems}
            />
          </main>
        }
        panel={<Panel items={panelItems} />}
      />
    </FluidLayout>
  )
}

export default Careers
