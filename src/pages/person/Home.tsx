import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  Home as HomeIcon,
  User,
  Shuffle,
  LogOut,
  BookOpen,
  ZapIcon,
  Sparkles,
} from 'lucide-react'
import {
  Header,
  Footer,
  ContentSection,
  FluidLayout,
} from '@/components/sections'
import { useTheme } from '@/contexts/ThemeContext'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import type { FocusPosition } from '@/hooks/useKeyboardNavigation'
import { assessmentsApi } from '@/services/assessmentsApi'
import { Assessment } from '@/types'
import type { DotData } from '@/types/dot'
import { themeDot } from '@/lib/themeDot'

function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { theme, toggleTheme } = useTheme()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await assessmentsApi.fetchAssessments()
      setAssessments(data)
    } catch (err) {
      setError('Failed to load assessments')
      console.error('Error loading assessments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAssessments()
  }, [loadAssessments])

  const handleReset = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['assessments'] })
    loadAssessments()
  }, [queryClient, loadAssessments])

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}/start`)
  }

  const handleRandomAssessment = () => {
    if (assessments.length > 0) {
      const randomIndex = Math.floor(Math.random() * assessments.length)
      const randomAssessment = assessments[randomIndex]
      navigate(`/assessment/${randomAssessment.id}/start`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    sessionStorage.clear()
    navigate('/login')
  }

  const handleActivate = useCallback(
    (position: FocusPosition) => {
      const { section, index } = position
      if (section === 'header') {
        if (index === 1) handleReset()
        else if (index === 2) toggleTheme()
      } else if (section === 'content') {
        if (index === 0) {
          navigate('/vision')
          return
        }
        const assessment = assessments[index - 1]
        if (assessment) navigate(`/assessment/${assessment.id}/start`)
      } else if (section === 'footer') {
        if (index === 0) navigate('/pehachan')
        else if (index === 1) {
          if (assessments.length > 0) {
            const ri = Math.floor(Math.random() * assessments.length)
            navigate(`/assessment/${assessments[ri].id}/start`)
          }
        } else if (index === 2) {
          localStorage.removeItem('authToken')
          sessionStorage.clear()
          navigate('/login')
        }
      }
    },
    [assessments, navigate, toggleTheme, handleReset]
  )

  const { isFocused } = useKeyboardNavigation({
    headerCount: 3,
    contentCount: assessments.length + 1,
    panelCount: 0,
    footerCount: 3,
    onActivate: handleActivate,
  })

  const navigationItems: DotData[] = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      title: 'Welcome Home',
      subtitle: 'Your personal dashboard',
      tinyText: 'Home',
      smallText:
        'Navigate back to your main dashboard and see recent activity.',
      largeText: [
        'This is the home screen where you can access all your assessments, track your progress, and manage your learning journey.',
        'Use the navigation below to explore different sections of the application.',
      ],
      buttonText: 'Go Home',
      onClick: () => {},
      isFocused: isFocused('header', 0),
    },
    {
      id: 'logo',
      icon: ZapIcon,
      label: 'Reset',
      title: 'Reset Dots',
      subtitle: 'This button will Reset the content you have in front of you',
      tinyText: 'Reset',
      buttonText: 'Reset',
      onClick: handleReset,
      isFocused: isFocused('header', 1),
    },
    {
      ...themeDot(theme, toggleTheme),
      isFocused: isFocused('header', 2),
    },
  ]

  const footerItems: DotData[] = [
    {
      id: 'pehchan',
      icon: User,
      label: 'Pehachan',
      title: 'Pehachan',
      subtitle: 'Your personalised learning plan',
      tinyText: 'Pehachan',
      smallText:
        'View your customised learning plan based on your assessment performance.',
      largeText: [
        'Pehachan builds a personalised learning plan tailored to your strengths and areas for growth, drawn from your assessment results.',
        'Track your progress over time and see recommendations for what to focus on next.',
      ],
      buttonText: 'View Plan',
      onClick: () => navigate('/pehachan'),
      isFocused: isFocused('footer', 0),
    },
    {
      id: 'random',
      icon: Shuffle,
      label: 'Random',
      title: 'Random Path',
      subtitle: 'Try something unexpected',
      tinyText: 'Shuffle',
      smallText:
        'Jump into a randomly selected assessment for a surprise challenge.',
      largeText:
        'Not sure where to start? Let us pick an assessment for you at random. A great way to explore topics you might not have tried yet.',
      buttonText: 'Surprise Me',
      onClick: handleRandomAssessment,
      isFocused: isFocused('footer', 1),
    },
    {
      id: 'logout',
      icon: LogOut,
      label: 'Logout',
      title: 'Leave',
      subtitle: 'End your current session',
      tinyText: 'Leave',
      smallText: 'Sign out and return to the login screen.',
      largeText:
        'Logging out will clear your session. You will need to sign in again to access your assessments and learning plan.',
      buttonText: 'Log Out',
      onClick: handleLogout,
      isFocused: isFocused('footer', 2),
    },
  ]

  const visionDot: DotData = {
    id: 'vision',
    icon: Sparkles,
    label: 'Showcase',
    title: 'Vision',
    largeText: 'Explore what Aadhya wants to become — a walkthrough of every capability we are building.',
    ariaLabel: 'Vision Showcase',
    isFocused: isFocused('content', 0),
    onClick: () => navigate('/vision'),
  }

  const contentItems: DotData[] = [
    visionDot,
    ...assessments.map((assessment, index) => ({
      id: assessment.id,
      icon: BookOpen,
      label: assessment.introduction,
      title: assessment.name,
      largeText: assessment.description,
      ariaLabel: assessment.name,
      isFocused: isFocused('content', index + 1),
      onClick: () => handleAssessmentClick(assessment.id),
    })),
  ]

  return (
    <FluidLayout
      layoutId='home'
      defaultSizes={[10, 80, 10]}
      header={<Header items={navigationItems} />}
      footer={<Footer items={footerItems} />}
      className='p-2 sm:p-4'
    >
      <main aria-label='Assessments' className='h-full w-full overflow-hidden'>
        {loading && (
          <div role='status' aria-live='polite' className='flex items-center justify-center h-full'>
            <p className='text-muted-foreground'>Loading assessments...</p>
          </div>
        )}

        {error && (
          <div role='alert' className='flex items-center justify-center h-full'>
            <p className='text-destructive font-medium'>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ContentSection
            title='Explore'
            description='Choose an assessment to begin'
            items={contentItems}
          />
        )}
      </main>
    </FluidLayout>
  )
}

export default Home
