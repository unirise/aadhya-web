import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { activitiesApi } from '../services/activitiesApi'
import MultipleChoiceQuestion from '../components/activity-components/MCQ'
import Navigation from '../components/Navigation'

type Activity = {
  id: string
  text: string
  intelligenceDomain: string
  domainDisplayName: string
  options?: AnswerOption[]
}

type AnswerOption = {
  value: number
  label: string
  emoji: string
}

function Activities() {
  const { assessmentId, activityId } = useParams<{
    assessmentId: string
    activityId: string
  }>()
  const navigate = useNavigate()

  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [answers, setAnswers] = useState<Record<string, number>>({})

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!assessmentId) {
        setError('Assessment ID is required')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Load activities and saved responses in parallel
        const [activitiesResponse, responsesResponse] = await Promise.all([
          activitiesApi.fetchActivities(100, 1, assessmentId), // Load all activities for the assessment
          activitiesApi.fetchMyResponses(), // Fetch saved responses
        ])

        // Unwrap responses (backend wraps them in { status, message, data, stack })
        const activitiesData = activitiesResponse.data || activitiesResponse
        const responsesData = responsesResponse.data || responsesResponse

        const loadedActivities =
          activitiesData.questions || activitiesData || []
        setActivities(loadedActivities)

        // Pre-populate answers from saved responses
        if (Array.isArray(responsesData) && responsesData.length > 0) {
          const savedAnswers: Record<string, number> = {}
          responsesData.forEach((response: any) => {
            if (
              response.activityId &&
              response.responseData?.optionValue !== undefined
            ) {
              savedAnswers[response.activityId] =
                response.responseData.optionValue
            }
          })
          setAnswers(savedAnswers)
        }

        // If no activityId in URL, navigate to first activity
        if (!activityId && loadedActivities.length > 0) {
          navigate(
            `/assessment/${assessmentId}/activity/${loadedActivities[0].id}`,
            { replace: true }
          )
        }
      } catch (err) {
        console.error('Error loading activities:', err)
        setError(
          (err as Error).message ||
            'Failed to load activities. Please try again later.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [assessmentId, navigate, activityId])

  // Calculate current step from activityId in URL
  const currentStep = useMemo(() => {
    if (!activityId || activities.length === 0) return 0
    const index = activities.findIndex(a => a.id === activityId)
    return index >= 0 ? index : 0
  }, [activityId, activities])

  // Loading state
  if (isLoading && activities.length === 0) {
    return (
      <div style={{ padding: '20px', marginTop: '60px', textAlign: 'center' }}>
        <p>Loading activities...</p>
      </div>
    )
  }

  // Error state
  if (error && activities.length === 0) {
    return (
      <div style={{ padding: '20px', marginTop: '60px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  // Safety check
  if (activities.length === 0) {
    return (
      <div style={{ padding: '20px', marginTop: '60px', textAlign: 'center' }}>
        <p>No activities available.</p>
      </div>
    )
  }

  // Ensure we don't access out-of-bounds, but allow currentStep to advance
  // The useEffect will load more activities when needed
  const safeCurrentStep = Math.min(currentStep, activities.length - 1)
  const currentActivity = activities[safeCurrentStep]

  const handleAnswerSelect = async (value: number) => {
    // Update local state immediately
    setAnswers({
      ...answers,
      [currentActivity.id]: value,
    })

    // Submit answer to API
    try {
      await activitiesApi.submitAnswer(currentActivity.id, value)
    } catch (error) {
      console.error('Error submitting answer:', error)
      // Optionally show error feedback to user
      // You could add a toast notification here
    }
  }

  const handleNext = () => {
    if (!assessmentId || !answers[currentActivity.id]) return

    // Navigate to next activity
    const nextIndex = currentStep + 1
    if (nextIndex < activities.length) {
      const nextActivity = activities[nextIndex]
      navigate(`/assessment/${assessmentId}/activity/${nextActivity.id}`)
    } else {
      // Last activity completed - navigate to thank you page
      navigate(`/assessment/${assessmentId}/thank-you`)
    }
  }

  const handlePrevious = () => {
    if (!assessmentId) return

    // If on first question, go to assessment start page
    if (currentStep === 0) {
      navigate(`/assessment/${assessmentId}/start`)
      return
    }

    // Otherwise go to previous question
    const previousIndex = currentStep - 1
    if (previousIndex >= 0) {
      const previousActivity = activities[previousIndex]
      navigate(`/assessment/${assessmentId}/activity/${previousActivity.id}`)
    }
  }

  return (
    <div className='min-h-screen flex flex-col h-full'>
      <div className='max-w-7xl mx-auto py-8 flex flex-col flex-1'>
        <Navigation />
        {/* Main Content Area with MCQ Component */}
        <MultipleChoiceQuestion
          activity={currentActivity}
          answerOptions={[]}
          selectedAnswer={answers[currentActivity.id]}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoPrevious={true}
          canGoNext={!!answers[currentActivity.id]}
          currentPosition={currentStep + 1}
          totalActivities={activities.length}
          isFirstQuestion={currentStep === 0}
        />
      </div>
    </div>
  )
}

export default Activities
