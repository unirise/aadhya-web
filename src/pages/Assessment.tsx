import React, { useState, useEffect, useMemo } from 'react'
import { activitiesApi } from '../services/activitiesApi'
import { getTopIntelligences } from '../lib/mi-scoring'
import { getIntelligenceIcon } from '../lib/intelligence-icons'
import IntelligenceRadarChart from '../components/charts/IntelligenceRadarChart'
import Navigation from '../components/Navigation'
import type { Activity } from '../types/activities'

interface MIQuestion {
  id: number
  text: string
  intelligenceDomain: string
  domainDisplayName: string
  options: Activity['metadata']['options']
}

interface IntelligenceScores {
  [domain: string]: number
}

function Assessment() {
  const [activities, setActivities] = useState<MIQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isMobile, setIsMobile] = useState(false)
  const [intelligenceScores, setIntelligenceScores] =
    useState<IntelligenceScores | null>(null)

  // Load all activities and intelligence scores on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [activitiesResponse, intelligencesResponse] = await Promise.all([
          activitiesApi.fetchActivities(),
          activitiesApi.fetchIntelligences(),
        ])

        const activitiesData = activitiesResponse.data || activitiesResponse
        const intelligencesData =
          intelligencesResponse.data || intelligencesResponse

        setActivities(activitiesData.questions || [])
        setIntelligenceScores(intelligencesData.intelligences || {})
      } catch (err) {
        console.error('Error loading data:', err)
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load activities. Please try again.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Track window size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use intelligence scores from DB
  const realTimeScores = useMemo(
    () => intelligenceScores || {},
    [intelligenceScores]
  )

  // Get top 3 intelligences
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

  const currentActivity = activities[currentStep]

  const handleAnswerSelect = async (value: number) => {
    const activityId = currentActivity.id

    // Update local state immediately
    setAnswers(prev => ({
      ...prev,
      [activityId]: value,
    }))

    // Submit answer to API and update intelligence scores
    try {
      const response = await activitiesApi.submitAnswer(
        String(activityId),
        value
      )
      const responseData = response.data || response
      if (responseData.intelligences) {
        setIntelligenceScores(responseData.intelligences)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleNext = () => {
    if (answers[currentActivity.id] && currentStep < activities.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper function to get domain display name
  const getDomainDisplayName = (domainCode: string) => {
    const activity = activities.find(a => a.intelligenceDomain === domainCode)
    return activity ? activity.domainDisplayName : domainCode
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Navigation />
        <div
          style={{
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              height: 'calc(100vh - 64px)',
              marginTop: '64px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              padding: '16px',
              maxWidth: '1800px',
              margin: '64px auto 0',
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Main Content Area */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {/* Activity Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '12px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: 0,
                  overflow: 'hidden',
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
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          backgroundColor: '#eff6ff',
                          border: '2px solid #3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent size={40} color='#3b82f6' />
                      </div>
                    </div>
                  ) : null
                })()}

                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '24px',
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
                        gap: '10px',
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
                              minWidth: '120px',
                              maxWidth: '180px',
                              padding: '16px 12px',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              backgroundColor: isSelected
                                ? '#3b82f6'
                                : '#f3f4f6',
                              color: isSelected ? 'white' : '#1f2937',
                              border: isSelected
                                ? '2px solid #2563eb'
                                : '2px solid #e5e7eb',
                              borderRadius: '10px',
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
                            onMouseOver={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  '#e5e7eb'
                                e.currentTarget.style.borderColor = '#d1d5db'
                              }
                            }}
                            onMouseOut={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  '#f3f4f6'
                                e.currentTarget.style.borderColor = '#e5e7eb'
                              }
                            }}
                          >
                            <span
                              style={{
                                fontSize: '30px',
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
                  gap: '12px',
                  flexShrink: 0,
                }}
              >
                <button
                  type='button'
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: currentStep === 0 ? '#e5e7eb' : '#6b7280',
                    color: currentStep === 0 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '10px',
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
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: answers[currentActivity.id]
                      ? '#10b981'
                      : '#e5e7eb',
                    color: answers[currentActivity.id] ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: answers[currentActivity.id]
                      ? 'pointer'
                      : 'not-allowed',
                    transition: 'background-color 0.2s',
                    opacity: answers[currentActivity.id] ? 1 : 0.5,
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (answers[currentActivity.id]) {
                      e.currentTarget.style.backgroundColor = '#059669'
                    }
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (answers[currentActivity.id]) {
                      e.currentTarget.style.backgroundColor = '#10b981'
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
                width: isMobile ? '100%' : '380px',
                flexShrink: 0,
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '16px',
                  textAlign: 'center',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '10px',
                }}
              >
                Intelligence Profile
              </h3>

              {/* Radar Chart */}
              <div style={{ marginBottom: '16px', flex: 1, minHeight: 0 }}>
                <IntelligenceRadarChart
                  scores={realTimeScores}
                  domainDisplayNames={Object.fromEntries(
                    Object.keys(intelligenceScores || {}).map(domain => {
                      const activity = activities.find(
                        a => a.intelligenceDomain === domain
                      )
                      return [
                        domain,
                        activity ? activity.domainDisplayName : domain,
                      ]
                    })
                  )}
                  height={isMobile ? 280 : 300}
                />
              </div>

              {/* Top 3 Quick View */}
              {realTimeTop3 && realTimeTop3.length > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <h4
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '10px',
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
                      gap: '6px',
                    }}
                  >
                    {realTimeTop3.map((item, index) => (
                      <div
                        key={item.domain}
                        style={{
                          backgroundColor: '#eff6ff',
                          borderRadius: '6px',
                          padding: '8px 10px',
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
                          {Math.round(Number(item.score))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assessment
