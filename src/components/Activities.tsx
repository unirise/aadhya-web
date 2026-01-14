import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { activitiesApi } from '../services/activitiesApi'
import { getTopIntelligences } from '../lib/mi-scoring'
import IntelligenceRadarChart from './charts/IntelligenceRadarChart'
import MultipleChoiceQuestion from './activity-components/MCQ'

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

type IntelligenceScores = {
  [key: string]: number
}

type TopIntelligence = {
  domain: string
  score: number
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
  const [isMobile, setIsMobile] = useState(false)
  const [intelligenceScores, setIntelligenceScores] =
    useState<IntelligenceScores | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch intelligence scores from DB
  const fetchIntelligenceScores = useCallback(async () => {
    try {
      const intelligencesResponse = await activitiesApi.fetchIntelligences()
      const intelligencesData =
        intelligencesResponse.data || intelligencesResponse
      setIntelligenceScores(intelligencesData.intelligences || {})
    } catch (err) {
      console.error('Error fetching intelligence scores:', err)
      // Don't set error state here, just log - scores will show base values
    }
  }, [])

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

        // Load activities, intelligence scores, and saved responses in parallel
        const [activitiesResponse, intelligencesResponse, responsesResponse] =
          await Promise.all([
            activitiesApi.fetchActivities(100, 1, assessmentId), // Load all activities for the assessment
            activitiesApi.fetchIntelligences(),
            activitiesApi.fetchMyResponses(), // Fetch saved responses
          ])

        // Unwrap responses (backend wraps them in { status, message, data, stack })
        const activitiesData = activitiesResponse.data || activitiesResponse
        const intelligencesData =
          intelligencesResponse.data || intelligencesResponse
        const responsesData = responsesResponse.data || responsesResponse

        const loadedActivities =
          activitiesData.questions || activitiesData || []
        setActivities(loadedActivities)
        setIntelligenceScores(intelligencesData.intelligences || {})

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

  // Track window size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use intelligence scores from DB, fallback to base scores if not loaded yet
  const realTimeScores = useMemo(() => {
    if (intelligenceScores && Object.keys(intelligenceScores).length > 0) {
      return intelligenceScores
    }
    // Return base scores if no DB scores available yet
    // Base score is 50 for all domains
    return {}
  }, [intelligenceScores])

  // Get top intelligences from DB scores
  const realTimeTop3 = useMemo<TopIntelligence[]>(() => {
    return getTopIntelligences(realTimeScores, 3) as TopIntelligence[]
  }, [realTimeScores])

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
      if (activitiesApi.submitAnswer) {
        const response = await activitiesApi.submitAnswer(
          currentActivity.id,
          value
        )
        // Update intelligence scores from the response
        const responseData = response.data || response
        if (responseData.intelligences) {
          setIntelligenceScores(responseData.intelligences)
        } else {
          // If response doesn't include intelligences, fetch them
          await fetchIntelligenceScores()
        }
      } else {
        console.warn(
          'submitAnswer function not available. Please refresh the page.'
        )
      }
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

  // Helper function to get domain display name
  const getDomainDisplayName = (domainCode: string) => {
    const activity = activities.find(a => a.intelligenceDomain === domainCode)
    return activity ? activity.domainDisplayName : domainCode
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '0',
        padding: '0',
        margin: '60px 0 0',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Sidebar Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            left: sidebarOpen ? '420px' : '0',
            top: '80px',
            zIndex: 1001,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            padding: '12px 8px',
            cursor: 'pointer',
            transition: 'left 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{
              transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path
              d='M12 5L7 10L12 15'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}

      {/* Collapsible Intelligence Profile Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <div
          style={{
            width: isMobile ? '100%' : sidebarOpen ? '400px' : '0',
            flexShrink: 0,
            backgroundColor: '#ffffff',
            borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            display: isMobile && !sidebarOpen ? 'none' : 'block',
            height: isMobile ? 'auto' : 'calc(100vh - 60px)',
            overflowY: 'auto',
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 'auto' : '60px',
            alignSelf: isMobile ? 'stretch' : 'flex-start',
          }}
        >
          <div style={{ padding: '24px' }}>
            {/* Mobile close button */}
            {isMobile && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  Intelligence Profile
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px 8px',
                  }}
                  aria-label='Close sidebar'
                >
                  ×
                </button>
              </div>
            )}

            {!isMobile && (
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '20px',
                  textAlign: 'center',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '12px',
                }}
              >
                Intelligence Profile
              </h3>
            )}

            {/* Radar Chart */}
            <div style={{ marginBottom: '20px' }}>
              <IntelligenceRadarChart
                scores={realTimeScores}
                domainDisplayNames={Object.fromEntries(
                  Object.keys(intelligenceScores || {}).map(
                    (domain: string) => {
                      const activity = activities.find(
                        a => a.intelligenceDomain === domain
                      )
                      return [
                        domain,
                        activity ? activity.domainDisplayName : domain,
                      ]
                    }
                  )
                )}
                height={isMobile ? 350 : 400}
              />
            </div>

            {/* Top 3 Quick View */}
            {realTimeTop3 && realTimeTop3.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Top 3 Intelligences
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {realTimeTop3.map((item, index) => (
                    <div
                      key={item.domain}
                      style={{
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        border: '1px solid #3b82f6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#3b82f6',
                            fontWeight: 'bold',
                            minWidth: '20px',
                          }}
                        >
                          #{index + 1}
                        </span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1f2937',
                          }}
                        >
                          {getDomainDisplayName(item.domain).split(' ')[0]}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                        }}
                      >
                        {Math.round(item.score)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile sidebar toggle button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1001,
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
          aria-label='Show intelligence profile'
        >
          📊
        </button>
      )}

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
  )
}

export default Activities
