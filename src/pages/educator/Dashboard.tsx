import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ClipboardList, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { educatorApi, type Child } from '@/services/educatorApi'
import type { Assessment } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const [children, setChildren] = useState<Child[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [childrenData, assessmentsData] = await Promise.all([
          educatorApi.fetchMyChildren(),
          educatorApi.fetchAssessments(),
        ])
        setChildren(childrenData)
        setAssessments(assessmentsData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground'>Loading dashboard...</p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Children',
      value: children.length,
      icon: Users,
      href: '/dashboard/children',
    },
    {
      title: 'Assessments',
      value: assessments.length,
      icon: ClipboardList,
      href: '/dashboard/assessments',
    },
    {
      title: 'Total Activities',
      value: assessments.reduce(
        (sum, a) => sum + (a.activities?.length || 0),
        0
      ),
      icon: TrendingUp,
      href: '/dashboard/assessments',
    },
  ]

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground mt-1'>
          Overview of your children and assessments.
        </p>
      </div>

      {/* Stats cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {stats.map(stat => (
          <Card
            key={stat.title}
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {stat.title}
              </CardTitle>
              <stat.icon className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent children */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Recent Children</CardTitle>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No children added yet.
              </p>
            ) : (
              <div className='space-y-3'>
                {children.slice(0, 5).map(child => (
                  <div
                    key={child.id}
                    className='flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors'
                    onClick={() => navigate(`/dashboard/children/${child.id}`)}
                  >
                    <div>
                      <p className='text-sm font-medium'>{child.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        Born {child.yob}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No assessments available.
              </p>
            ) : (
              <div className='space-y-3'>
                {assessments.slice(0, 5).map(assessment => (
                  <div
                    key={assessment.id}
                    className='flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors'
                    onClick={() =>
                      navigate(
                        `/dashboard/assessments/${assessment.id}/activities`
                      )
                    }
                  >
                    <div>
                      <p className='text-sm font-medium'>{assessment.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {assessment.activities?.length || 0} activities
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
