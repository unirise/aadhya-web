import { useState, useEffect, useMemo } from 'react'
import { Share2, Sparkles } from 'lucide-react'
import { activitiesApi } from '../services/activitiesApi'
import { getTopIntelligences } from '../lib/mi-scoring'
import { getIntelligenceSkillMapping } from '../lib/intelligence-skill-mapping'
import { getIntelligenceTeachingStyles } from '../lib/intelligence-teaching-styles'
import IntelligenceRadarChart from '../components/charts/IntelligenceRadarChart'
import { getIntelligenceIcon } from '../lib/intelligence-icons'

function Pehchan() {
  const [intelligenceScores, setIntelligenceScores] = useState(null)
  const [intelligencesData, setIntelligencesData] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Hardcoded person ID (same as Questionnaire)
  const PERSON_ID = '2cdaa500-7daf-44cd-a1bc-50fb77e86bd4'

  // Domain display name mapping
  const domainDisplayNameMap = {
    INTRAPERSONAL: 'Intrapersonal Intelligence',
    BODILY_KINESTHETIC: 'Bodily-Kinesthetic Intelligence',
    LOGICAL_MATHEMATICAL: 'Logical-Mathematical Intelligence',
    LINGUISTIC: 'Linguistic Intelligence',
    MUSICAL: 'Musical Intelligence',
    SPATIAL: 'Spatial Intelligence',
    NATURALISTIC: 'Naturalistic Intelligence',
    INTERPERSONAL: 'Interpersonal Intelligence',
  }

  // Track window size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load intelligence scores and metadata
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load metadata and activities to get domain display names
        const [metadataResponse, intelligencesResponse, firstPageResponse] =
          await Promise.all([
            activitiesApi.fetchMetadata(),
            activitiesApi.fetchIntelligences(PERSON_ID),
            activitiesApi.fetchActivities(100), // Get enough activities to find all domains
          ])

        const metadataData = metadataResponse.data || metadataResponse
        const intelligencesData =
          intelligencesResponse.data || intelligencesResponse
        const firstPageData = firstPageResponse.data || firstPageResponse

        setMetadata(metadataData)
        setIntelligencesData(intelligencesData)
        setIntelligenceScores(intelligencesData.intelligences || {})
        setActivities(firstPageData.questions || [])
      } catch (err) {
        console.error('Error loading profile data:', err)
        setError(
          err.message || 'Failed to load profile data. Please try again later.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Get domain display name
  const getDomainDisplayName = domainCode => {
    const activity = activities.find(a => a.intelligenceDomain === domainCode)
    return activity
      ? activity.domainDisplayName
      : domainDisplayNameMap[domainCode] || domainCode
  }

  // Get domain display names for chart
  const domainDisplayNames = useMemo(() => {
    if (!metadata || !activities.length) return {}
    return Object.fromEntries(
      (metadata.intelligenceDomains || []).map(domain => [
        domain,
        getDomainDisplayName(domain),
      ])
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, activities])

  // Get top 3 intelligences
  const topIntelligences = useMemo(() => {
    if (!intelligenceScores) return null
    return getTopIntelligences(intelligenceScores, 3)
  }, [intelligenceScores])

  // Sort all domains by score for display
  const allDomainsSorted = useMemo(() => {
    if (!intelligenceScores) return []
    return Object.entries(intelligenceScores)
      .map(([domain, score]) => ({
        domain,
        displayName: getDomainDisplayName(domain),
        score,
      }))
      .sort((a, b) => b.score - a.score)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intelligenceScores, activities])

  // Get intelligence-skill mapping for top intelligences
  const intelligenceSkillMapping = useMemo(() => {
    if (!intelligenceScores) return []
    return getIntelligenceSkillMapping(intelligenceScores, 3)
  }, [intelligenceScores])

  // Get teaching styles for top intelligences
  const teachingStylesMapping = useMemo(() => {
    if (!intelligenceScores) return []
    return getIntelligenceTeachingStyles(intelligenceScores, 3)
  }, [intelligenceScores])

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          marginTop: '60px',
          padding: '32px',
          maxWidth: '1200px',
          margin: '60px auto 0',
          textAlign: 'center',
        }}
      >
        <p>Loading profile data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          marginTop: '60px',
          padding: '32px',
          maxWidth: '1200px',
          margin: '60px auto 0',
          textAlign: 'center',
        }}
      >
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

  return (
    <div
      style={{
        marginTop: '60px',
        padding: '20px',
        maxWidth: '1800px',
        margin: '60px auto 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={28} color='#3b82f6' />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0,
                  marginBottom: '4px',
                }}
              >
                Personalised Learning Plan
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: 0,
                }}
              >
                Discover how you learn best and what teaching styles work for you
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Intelligences - Large Cards */}
        {topIntelligences && topIntelligences.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Your Top Learning Strengths
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  These are your strongest ways of learning
                </p>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e5e7eb',
                marginBottom: '24px',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '20px',
              }}
            >
              {topIntelligences.map((item, index) => {
                const IconComponent = getIntelligenceIcon(item.domain)
                const displayName = getDomainDisplayName(item.domain)
                const shortName = displayName.replace(' Intelligence', '')
                return (
                  <div
                    key={item.domain}
                    style={{
                      backgroundColor: index === 0 ? '#eff6ff' : '#f9fafb',
                      borderRadius: '16px',
                      padding: '24px',
                      border: index === 0 ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                      position: 'relative',
                    }}
                  >
                    {index === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        #1
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      {IconComponent && (
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            backgroundColor: index === 0 ? '#3b82f6' : '#dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent
                            size={32}
                            color={index === 0 ? '#ffffff' : '#3b82f6'}
                          />
                        </div>
                      )}
                      <div
                        style={{
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            margin: 0,
                            marginBottom: '8px',
                          }}
                        >
                          {shortName}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '12px',
                          }}
                        >
                          <div
                            style={{
                              width: '120px',
                              height: '12px',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '6px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, ((item.score - 10) / 80) * 100)}%`,
                                height: '100%',
                                backgroundColor: '#3b82f6',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#3b82f6',
                              minWidth: '45px',
                            }}
                          >
                            {Math.round(item.score)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Teaching Styles Section */}
        {teachingStylesMapping.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Recommended Teaching Styles
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  Teaching approaches that work best for this learner based on their top strengths
                </p>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e5e7eb',
                marginBottom: '24px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {teachingStylesMapping.map((item, index) => {
                const IconComponent = getIntelligenceIcon(item.domain)
                const displayName = getDomainDisplayName(item.domain)
                const shortName = displayName.replace(' Intelligence', '')
                return (
                  <div
                    key={item.domain}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: '#dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {IconComponent && (
                          <IconComponent size={24} color='#3b82f6' />
                        )}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            margin: 0,
                            marginBottom: '4px',
                          }}
                        >
                          {shortName} Learning Style
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: 0,
                          }}
                        >
                          Score: {Math.round(item.score)} | Rank: #{index + 1}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {item.teachingStyles.map((style, styleIndex) => (
                        <div
                          key={styleIndex}
                          style={{
                            fontSize: '15px',
                            color: '#4b5563',
                            backgroundColor: '#ffffff',
                            padding: '14px 18px',
                            borderRadius: '8px',
                            border: '1px solid #dbeafe',
                            borderLeft: '4px solid #3b82f6',
                            lineHeight: '1.6',
                          }}
                        >
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Intelligence Profile Chart */}
        {intelligenceScores && Object.keys(intelligenceScores).length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Complete Intelligence Profile
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  Visual overview of all learning strengths
                </p>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e5e7eb',
                marginBottom: '24px',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
              }}
            >
              <IntelligenceRadarChart
                scores={intelligenceScores}
                domainDisplayNames={domainDisplayNames}
                height={isMobile ? 400 : 500}
              />
            </div>
          </div>
        )}

        {/* All Intelligences - Simple List */}
        {allDomainsSorted.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
                marginBottom: '24px',
              }}
            >
              All Learning Strengths
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {allDomainsSorted.map(item => {
                const isTop3 = topIntelligences?.some(
                  top => top.domain === item.domain
                )
                const IconComponent = getIntelligenceIcon(item.domain)
                return (
                  <div
                    key={item.domain}
                    style={{
                      backgroundColor: isTop3 ? '#eff6ff' : '#f9fafb',
                      borderRadius: '12px',
                      padding: '16px',
                      border: isTop3
                        ? '2px solid #3b82f6'
                        : '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flex: 1,
                        }}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={20}
                            color={isTop3 ? '#3b82f6' : '#6b7280'}
                          />
                        )}
                        <h3
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1f2937',
                            flex: 1,
                            margin: 0,
                          }}
                        >
                          {item.displayName}
                        </h3>
                      </div>
                      {isTop3 && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                            backgroundColor: '#dbeafe',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            flexShrink: 0,
                          }}
                        >
                          TOP 3
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, ((item.score - 10) / 80) * 100)}%`,
                            height: '100%',
                            backgroundColor: isTop3 ? '#3b82f6' : '#6b7280',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: isTop3 ? '#3b82f6' : '#1f2937',
                          minWidth: '40px',
                          textAlign: 'right',
                        }}
                      >
                        {Math.round(item.score)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pehchan

