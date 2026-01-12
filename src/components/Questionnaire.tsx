import { useState, useEffect, useMemo, useCallback } from 'react'
import { activitiesApi } from '../services/activitiesApi'
import { getTopIntelligences } from '../lib/mi-scoring'
import { getIntelligenceIcon } from '../lib/intelligence-icons'
import IntelligenceRadarChart from './charts/IntelligenceRadarChart'

function Questionnaire() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [_hasMorePages, setHasMorePages] = useState(true)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [intelligenceScores, setIntelligenceScores] = useState(null)
  // Hardcoded person ID
  const PERSON_ID = '2cdaa500-7daf-44cd-a1bc-50fb77e86bd4'

  // Fetch intelligence scores from DB
  const fetchIntelligenceScores = useCallback(async () => {
    try {
      const intelligencesResponse =
        await activitiesApi.fetchIntelligences(PERSON_ID)
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
      try {
        setIsLoading(true)
        setError(null)

        // Load activities and intelligence scores in parallel
        const [firstPageResponse, intelligencesResponse] = await Promise.all([
          activitiesApi.fetchActivities(5),
          activitiesApi.fetchIntelligences(PERSON_ID),
        ])

        // Unwrap responses (backend wraps them in { status, message, data, stack })
        const firstPageData = firstPageResponse.data || firstPageResponse
        const intelligencesData =
          intelligencesResponse.data || intelligencesResponse

        setActivities(firstPageData.questions || [])
        setHasMorePages(firstPageData.pagination?.hasNext || false)
        setIntelligenceScores(intelligencesData.intelligences || {})
      } catch (err) {
        console.error('Error loading activities:', err)
        setError(
          err.message || 'Failed to load activities. Please try again later.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Load more activities when needed
  const loadMoreActivities = useCallback(async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const nextPage = currentPage + 1
      const pageResponse = await activitiesApi.fetchActivities(5, nextPage)

      // Unwrap response (backend wraps it in { status, message, data, stack })
      const pageData = pageResponse.data || pageResponse

      const newActivities = pageData.questions || []
      if (newActivities.length > 0) {
        setActivities(prev => [...prev, ...newActivities])
        setCurrentPage(nextPage)
        // Backend returns random activities, so always allow loading more
        // Only stop if we get no activities back
        setHasMorePages(true)
      } else {
        // No more activities available
        setHasMorePages(false)
      }
    } catch (err) {
      console.error('Error loading more activities:', err)
      setError(err.message || 'Failed to load more activities.')
      setHasMorePages(false)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, isLoading])

  // Load more activities when approaching the end (infinite scroll)
  useEffect(() => {
    // Load more when we're at or past the last activity, or when we have 2 or fewer remaining
    const needsMoreActivities =
      currentStep >= activities.length - 1 ||
      activities.length - currentStep <= 2
    if (needsMoreActivities && !isLoading) {
      loadMoreActivities()
    }
  }, [currentStep, activities.length, isLoading, loadMoreActivities])

  // Track window size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
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
  const realTimeTop3 = useMemo(() => {
    return getTopIntelligences(realTimeScores, 3)
  }, [realTimeScores])

  // Loading state
  if (isLoading && activities.length === 0) {
    return (
      <div style={{ padding: '20px', marginTop: '60px', textAlign: 'center' }}>
        <p>Loading questions...</p>
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
  // The useEffect will load more questions when needed
  const safeCurrentStep = Math.min(currentStep, activities.length - 1)
  const currentActivity = activities[safeCurrentStep]

  const handleAnswerSelect = async value => {
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
          value,
          PERSON_ID
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

  const handleNext = async () => {
    if (answers[currentActivity.id]) {
      // If we're at the last activity, try to load more first
      if (currentStep >= activities.length - 1 && !isLoading) {
        await loadMoreActivities()
      }
      // Always advance to next activity (safety check will prevent out-of-bounds)
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper function to get domain display name
  const getDomainDisplayName = domainCode => {
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
        gap: '20px',
        padding: '20px',
        maxWidth: '1800px',
        margin: '60px auto 0',
        boxSizing: 'border-box',
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Activity Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 0,
          }}
        >
          {/* Intelligence Domain Icon */}
          {(() => {
            const IconComponent = getIntelligenceIcon(
              currentActivity.intelligenceDomain
            )
            return IconComponent ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: '#eff6ff',
                    border: '2px solid #3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={48} color='#3b82f6' />
                </div>
              </div>
            ) : null
          })()}

          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '32px',
              lineHeight: '1.3',
              textAlign: 'center',
            }}
          >
            {currentActivity.text}
          </h2>

          {/* Answer Options - Horizontal */}
          {(() => {
            const optionsToDisplay = currentActivity?.options || []

            if (!optionsToDisplay || optionsToDisplay.length === 0) {
              return (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#ef4444',
                  }}
                >
                  No answer options available. Please refresh the page.
                </div>
              )
            }

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  alignItems: 'stretch',
                }}
              >
                {optionsToDisplay.map(option => {
                  const isSelected =
                    answers[currentActivity.id] === option.value
                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleAnswerSelect(option.value)}
                      style={{
                        flex: '1 1 0',
                        minWidth: '140px',
                        maxWidth: '200px',
                        padding: '20px 16px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
                        color: isSelected ? 'white' : '#1f2937',
                        border: isSelected
                          ? '3px solid #2563eb'
                          : '3px solid #e5e7eb',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textAlign: 'center',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                      }}
                      onMouseOver={e => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = '#e5e7eb'
                          e.target.style.borderColor = '#d1d5db'
                        }
                      }}
                      onMouseOut={e => {
                        if (!isSelected) {
                          e.target.style.backgroundColor = '#f3f4f6'
                          e.target.style.borderColor = '#e5e7eb'
                        }
                      }}
                    >
                      <span
                        style={{
                          fontSize: '36px',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          backgroundColor: 'transparent',
                          pointerEvents: 'none',
                        }}
                      >
                        {option.emoji}
                      </span>
                      <span
                        style={{
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          backgroundColor: 'transparent',
                          pointerEvents: 'none',
                        }}
                      >
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          <button
            type='button'
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              padding: '14px 28px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: currentStep === 0 ? '#e5e7eb' : '#6b7280',
              color: currentStep === 0 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: currentStep === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <button
            type='button'
            onClick={handleNext}
            disabled={!answers[currentActivity.id]}
            style={{
              padding: '14px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: answers[currentActivity.id]
                ? '#10b981'
                : '#e5e7eb',
              color: answers[currentActivity.id] ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '12px',
              cursor: answers[currentActivity.id] ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              opacity: answers[currentActivity.id] ? 1 : 0.5,
            }}
            onMouseOver={e => {
              if (answers[currentActivity.id]) {
                e.target.style.backgroundColor = '#059669'
              }
            }}
            onMouseOut={e => {
              if (answers[currentActivity.id]) {
                e.target.style.backgroundColor = '#10b981'
              }
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Real-time Scores Sidebar - Radar Chart */}
      <div
        style={{
          width: isMobile ? '100%' : '400px',
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: 'fit-content',
          maxHeight: isMobile ? 'none' : 'calc(100vh - 100px)',
          overflowY: 'auto',
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 'auto' : '80px',
        }}
      >
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

        {/* Radar Chart */}
        <div style={{ marginBottom: '20px' }}>
          <IntelligenceRadarChart
            scores={realTimeScores}
            domainDisplayNames={Object.fromEntries(
              Object.keys(intelligenceScores || {}).map(domain => {
                const activity = activities.find(
                  a => a.intelligenceDomain === domain
                )
                return [domain, activity ? activity.domainDisplayName : domain]
              })
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
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
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
  )
}

export default Questionnaire
