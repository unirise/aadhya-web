import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  LayoutDashboard,
  Brain,
  Dumbbell,
  ArrowLeft,
} from 'lucide-react'
import { themeDot } from '@/lib/themeDot'
import {
  Header,
  Footer,
  ContentSection,
  FluidLayout,
} from '@/components/sections'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import type { DotData } from '@/types/dot'

type IntelligenceScores = Record<string, number>

type ActivityDomainInfo = {
  intelligenceDomain: string
  domainDisplayName: string
}

function Pehchan() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 0) navigate('/')
        else if (index === 1) toggleTheme()
      } else if (section === 'content') {
        const routes = ['/pehachan/dashboard', '/pehachan/intelligence', '/pehachan/physical']
        if (routes[index]) navigate(routes[index])
      } else if (section === 'footer') {
        if (index === 0) navigate('/')
      }
    },
    [navigate, toggleTheme]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 2,
    contentCount: 3,
    panelCount: 0,
    footerCount: 1,
    onActivate: handleActivate,
  })

  const navigationItems: DotData[] = [
    {
      id: 'back',
      icon: ArrowLeft,
      label: 'Back',
      title: 'Back to Home',
      subtitle: 'Return to main dashboard',
      tinyText: 'Back',
      smallText: 'Go back to the home screen.',
      buttonText: 'Go Back',
      onClick: () => navigate('/'),
      isFocused: isFocused('header', 0),
    },
    { ...themeDot(theme, toggleTheme), isFocused: isFocused('header', 1) },
  ]

  const contentItems: DotData[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      title: 'Dashboard',
      subtitle: 'Overview of your learning profile',
      tinyText: 'Dashboard',
      smallText: 'See a summary of your learning strengths and progress.',
      largeText: [
        'Your personal dashboard brings together all aspects of your learning profile in one place.',
        'View your overall progress, recent activity, and key insights at a glance.',
      ],
      buttonText: 'Open Dashboard',
      onClick: () => navigate('/pehachan/dashboard'),
      isFocused: isFocused('content', 0),
    },
    {
      id: 'intelligence',
      icon: Brain,
      label: 'Intelligence',
      title: 'Intelligence Profile',
      subtitle: 'Your multiple intelligences breakdown',
      tinyText: 'Intelligence',
      smallText: 'Explore your multiple intelligence scores and learning styles.',
      largeText: [
        'Discover your unique intelligence profile based on Howard Gardner\'s theory of multiple intelligences.',
        'See your strengths across linguistic, logical, spatial, musical, bodily-kinesthetic, interpersonal, intrapersonal, and naturalistic domains.',
      ],
      buttonText: 'View Intelligence',
      onClick: () => navigate('/pehachan/intelligence'),
      isFocused: isFocused('content', 1),
    },
    {
      id: 'physical',
      icon: Dumbbell,
      label: 'Physical',
      title: 'Physical Development',
      subtitle: 'Motor skills and physical milestones',
      tinyText: 'Physical',
      smallText: 'Track physical development and motor skill progress.',
      largeText: [
        'Monitor physical development milestones including gross motor, fine motor, and coordination skills.',
        'Get recommendations for activities that support physical growth and development.',
      ],
      buttonText: 'View Physical',
      onClick: () => navigate('/pehachan/physical'),
      isFocused: isFocused('content', 2),
    },
  ]

  const footerItems: DotData[] = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Home',
      subtitle: 'Return to the main screen',
      tinyText: 'Home',
      smallText: 'Navigate back to your main dashboard.',
      buttonText: 'Go Home',
      onClick: () => navigate('/'),
      isFocused: isFocused('footer', 0),
    },
  ]

  return (
    <FluidLayout
      layoutId='pehchan'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Pehchan' className='h-full w-full overflow-hidden'>
        <ContentSection
          title='Pehchan'
          description='Your personalised learning identity'
          items={contentItems}
        />
      </main>
    </FluidLayout>
  )
}

export default Pehchan
