import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, Clock, FileText, Lightbulb, Target } from 'lucide-react'
import { useAssessment } from '../hooks/useAssessments'
import Navigation from '@/components/Navigation'
import { ActionBlock, ContentBlock } from '@/components/blocks'
import { Activity, Assessment } from '@/types'

const AssessmentContent = ({
  assessment,
  activities,
}: {
  assessment: Assessment
  activities: Activity[]
}) => {
  // Calculate metrics
  const activityCount = activities.length
  const uniqueAttributes = new Set(
    activities.map(a => a.attribute).filter(Boolean)
  ).size
  const totalSeconds = activityCount * 10
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const timeEstimate = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Header */}
      <div className='my-8 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          {assessment.name}
        </h1>
        {assessment.description && (
          <p className='text-lg text-gray-600 mx-auto'>
            {assessment.description}
          </p>
        )}
      </div>

      {/* Introduction Section */}
      {assessment.introduction && (
        <div className='mb-8 mx-auto'>
          <div className='bg-gray-300 rounded-lg p-6'>
            <div className='flex gap-3 items-start'>
              <Lightbulb className='text-yellow-500 flex-shrink-0' size={24} />
              <p className='text-black text-base leading-relaxed font-medium'>
                {assessment.introduction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className='mb-8 max-w-4xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Activities Card */}
          <div className='rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex flex-col items-center text-center'>
              <FileText className='text-blue-500 mb-3' size={40} />
              <div className='text-4xl font-bold text-gray-900 mb-2'>
                {activityCount}
              </div>
              <div className='text-sm text-gray-600 font-medium'>
                {activityCount === 1 ? 'Activity' : 'Activities'}
              </div>
            </div>
          </div>

          {/* Unique Attributes Card */}
          <div className='rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex flex-col items-center text-center'>
              <Target className='text-purple-500 mb-3' size={40} />
              <div className='text-4xl font-bold text-gray-900 mb-2'>
                {uniqueAttributes}
              </div>
              <div className='text-sm text-gray-600 font-medium'>
                {uniqueAttributes === 1 ? 'Attribute' : 'Attributes'}
              </div>
            </div>
          </div>

          {/* Time Estimate Card */}
          <div className='rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex flex-col items-center text-center'>
              <Clock className='text-green-500 mb-3' size={40} />
              <div className='text-4xl font-bold text-gray-900 mb-2'>
                {timeEstimate}
              </div>
              <div className='text-sm text-gray-600 font-medium'>
                Est. Completion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssessmentStart() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const {
    data: assessment,
    isLoading,
    error: assessmentError,
  } = useAssessment(assessmentId)

  const activities = assessment?.activities || []

  const handleStart = () => {
    if (activities.length > 0 && assessmentId) {
      navigate(`/assessment/${assessmentId}/activity/${activities[0].id}`)
    }
  }

  const error = assessmentError?.message

  if (isLoading) {
    return (
      <div className='min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Navigation />
          <div className='text-center py-12'>
            <p className='text-gray-600'>Loading assessment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className='min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Navigation />
          <div className='text-center py-12'>
            <p className='text-red-600'>{error || 'Assessment not found'}</p>
            <button
              onClick={() => navigate('/')}
              className='mt-4 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Navigation />

        <ContentBlock
          component={AssessmentContent}
          label={assessment.name}
          componentProps={{ assessment, activities }}
        />

        {/* Navigation Footer */}
        <div className='grid grid-cols-5 lg:grid-cols-9 gap-4 h-16 items-center shrink-0 mt-8'>
          {/* Previous Button - spans first column */}
          <div />

          <div className='hidden lg:block' />
          <div />
          <div className='hidden lg:block' />

          {/* Next Button - spans last column */}
          <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
            <ActionBlock label='Begin →' onClick={handleStart} />
          </div>
          <div />
          <div className='hidden lg:block' />
          <div />
          <div className='hidden lg:block' />
        </div>

        {/* No activities warning */}
        {activities.length === 0 && (
          <div className='mx-auto mt-8'>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-5'>
              <div className='flex items-center justify-center gap-2'>
                <AlertCircle className='text-yellow-600' size={20} />
                <p className='text-yellow-800 text-sm font-medium'>
                  This assessment has no activities yet. Please check back
                  later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssessmentStart
