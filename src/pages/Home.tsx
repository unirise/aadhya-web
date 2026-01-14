import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentBlock } from '../components/blocks'
import Navigation from '@/components/Navigation'
import { assessmentsApi } from '@/services/assessmentsApi'
import { Assessment } from '@/types'

function Home() {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAssessments = async () => {
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
    }

    loadAssessments()
  }, [])

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}/start`)
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Navigation />

        {/* Header */}
        <div className='my-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Pehchan Assessments
          </h1>
          <p className='text-lg text-gray-600'>
            Please select one of the assessments below to get started
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='text-center py-12'>
            <p className='text-gray-600'>Loading assessments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='text-center py-12'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {/* Assessments Grid */}
        {!loading && !error && (
          <div className='mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr'>
              {assessments.map(assessment => (
                <ContentBlock
                  key={assessment.id}
                  type='list'
                  label={assessment.name}
                  description={assessment.description}
                  onClick={() => handleAssessmentClick(assessment.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && assessments.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600'>No assessments available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
