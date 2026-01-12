import { useState, useEffect, useMemo } from 'react'
import { Briefcase, Users, Award, Target, TrendingUp, BarChart3 } from 'lucide-react'
import { activitiesApi } from '../services/activitiesApi'
import { getTopIntelligences } from '../lib/mi-scoring'
import { getIntelligenceSkillMapping } from '../lib/intelligence-skill-mapping'
import {
  getSkillsVocationalMapping,
  deriveHybridRoles,
  getInclusiveDesignInfo,
  getVocationalPathsForSkill,
} from '../lib/skills-vocational-mapping'
import {
  mapRolesToNSQF,
  mapHybridRolesToNSQF,
  getNSQFLevelForRole,
} from '../lib/nsqf-role-mapping'
import { getIntelligenceIcon } from '../lib/intelligence-icons'

function Sajag() {
  const [intelligenceScores, setIntelligenceScores] = useState(null)
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

  // Get top 3 intelligences
  const topIntelligences = useMemo(() => {
    if (!intelligenceScores) return null
    return getTopIntelligences(intelligenceScores, 3)
  }, [intelligenceScores])

  // Get intelligence-skill mapping for top intelligences
  const intelligenceSkillMapping = useMemo(() => {
    if (!intelligenceScores) return []
    return getIntelligenceSkillMapping(intelligenceScores, 3)
  }, [intelligenceScores])

  // Get skills-vocational mapping (top 8 only)
  const skillsVocationalMapping = useMemo(() => {
    if (!intelligenceSkillMapping || intelligenceSkillMapping.length === 0)
      return []
    const allSkills = getSkillsVocationalMapping(intelligenceSkillMapping)
    return allSkills.slice(0, 8)
  }, [intelligenceSkillMapping])

  // Extract roles by intelligence domain from skills-vocational mapping
  const rolesByIntelligence = useMemo(() => {
    if (!intelligenceSkillMapping || intelligenceSkillMapping.length === 0)
      return {}

    // Map domain codes to display names
    const domainNameMap = {
      INTERPERSONAL: 'Interpersonal',
      BODILY_KINESTHETIC: 'Bodily-Kinesthetic',
      LOGICAL_MATHEMATICAL: 'Logical-Mathematical',
      LINGUISTIC: 'Linguistic',
      MUSICAL: 'Musical',
      SPATIAL: 'Spatial',
      NATURALISTIC: 'Naturalistic',
      INTRAPERSONAL: 'Intrapersonal',
    }

    const rolesByIntelligenceMap = {}

    // For each intelligence domain, collect roles from its skills
    intelligenceSkillMapping.forEach(({ domain, skills }) => {
      const intelligenceName = domainNameMap[domain] || domain
      if (!rolesByIntelligenceMap[intelligenceName]) {
        rolesByIntelligenceMap[intelligenceName] = []
      }

      // Find roles for skills in this domain by looking up directly in skillVocationalMapping
      skills.forEach(skill => {
        const vocationalPaths = getVocationalPathsForSkill(skill)
        if (vocationalPaths && vocationalPaths.length > 0) {
          vocationalPaths.forEach(role => {
            if (!rolesByIntelligenceMap[intelligenceName].includes(role)) {
              rolesByIntelligenceMap[intelligenceName].push(role)
            }
          })
        }
      })
    })

    // Limit to top 5 roles per intelligence domain
    Object.keys(rolesByIntelligenceMap).forEach(intelligence => {
      rolesByIntelligenceMap[intelligence] = rolesByIntelligenceMap[
        intelligence
      ].slice(0, 5)
    })

    return rolesByIntelligenceMap
  }, [intelligenceSkillMapping])

  // Map roles to NSQF levels by intelligence domain
  const nsqfRolesByIntelligence = useMemo(() => {
    if (!rolesByIntelligence || Object.keys(rolesByIntelligence).length === 0)
      return {}
    return mapRolesToNSQF(rolesByIntelligence)
  }, [rolesByIntelligence])

  // Get hybrid roles based on top intelligences
  const hybridRoles = useMemo(() => {
    if (!topIntelligences || topIntelligences.length < 2) return []
    const topDomains = topIntelligences.map(item => item.domain)
    return deriveHybridRoles(topDomains)
  }, [topIntelligences])

  // Map hybrid roles to NSQF levels
  const nsqfHybridRoles = useMemo(() => {
    if (!hybridRoles || hybridRoles.length === 0) return []
    const allHybridRoles = hybridRoles.flatMap(hybrid => hybrid.roles || [])
    return mapHybridRolesToNSQF(allHybridRoles)
  }, [hybridRoles])

  // Get inclusive design info
  const inclusiveDesignInfo = useMemo(() => {
    return getInclusiveDesignInfo()
  }, [])

  // Get domain display names for chart
  const domainDisplayNames = useMemo(() => {
    if (!metadata || !activities.length) return {}
    const domainNameMap = {
      INTERPERSONAL: 'Interpersonal Intelligence',
      BODILY_KINESTHETIC: 'Bodily-Kinesthetic Intelligence',
      LOGICAL_MATHEMATICAL: 'Logical-Mathematical Intelligence',
      LINGUISTIC: 'Linguistic Intelligence',
      MUSICAL: 'Musical Intelligence',
      SPATIAL: 'Spatial Intelligence',
      NATURALISTIC: 'Naturalistic Intelligence',
      INTRAPERSONAL: 'Intrapersonal Intelligence',
    }
    return Object.fromEntries(
      Object.keys(intelligenceScores || {}).map(domain => [
        domain,
        getDomainDisplayName(domain),
      ])
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, activities, intelligenceScores])

  // Prepare all NSQF roles for chart (combining regular and hybrid)
  const allNSQFRoles = useMemo(() => {
    const regularRoles = Object.values(nsqfRolesByIntelligence).flat()
    const hybridRoles = nsqfHybridRoles
    return [...regularRoles, ...hybridRoles]
  }, [nsqfRolesByIntelligence, nsqfHybridRoles])

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
        padding: '24px',
        maxWidth: '1800px',
        margin: '60px auto 0',
        backgroundColor: '#f9fafb',
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '32px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            borderTop: '4px solid #1e40af',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Briefcase size={24} color='#1e40af' />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '26px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Career Pathways & Vocational Opportunities Analysis
                </h1>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Comprehensive assessment report based on multiple intelligence analysis
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: '#e5e7eb',
              marginTop: '16px',
            }}
          />
        </div>

        {/* Intelligence Profile Data Table */}
        {intelligenceScores && Object.keys(intelligenceScores).length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Intelligence Profile Assessment
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Comprehensive scoring analysis across all intelligence domains
                </p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Intelligence Domain
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Rank
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Classification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const sortedScores = Object.entries(intelligenceScores)
                      .map(([domain, score]) => ({
                        domain,
                        score,
                        displayName: getDomainDisplayName(domain),
                      }))
                      .sort((a, b) => b.score - a.score)
                    const maxScore = Math.max(...sortedScores.map(s => s.score))
                    
                    return sortedScores.map((item, index) => {
                      const percentage = maxScore > 0 ? Math.round((item.score / maxScore) * 100) : 0
                      const classification = percentage >= 80 ? 'High' : percentage >= 60 ? 'Moderate' : percentage >= 40 ? 'Average' : 'Developing'
                      const rank = index + 1
                      
                      return (
                        <tr
                          key={item.domain}
                          style={{
                            borderBottom: '1px solid #f3f4f6',
                            backgroundColor: index < 3 ? '#f0f9ff' : 'transparent',
                          }}
                        >
                          <td
                            style={{
                              padding: '14px 16px',
                              fontWeight: index < 3 ? '600' : '400',
                              color: '#111827',
                            }}
                          >
                            {item.displayName}
                          </td>
                          <td
                            style={{
                              padding: '14px 16px',
                              textAlign: 'right',
                              fontFamily: 'monospace',
                              color: '#374151',
                            }}
                          >
                            {item.score.toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: '14px 16px',
                              textAlign: 'center',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                backgroundColor: rank <= 3 ? '#dbeafe' : '#f3f4f6',
                                color: rank <= 3 ? '#1e40af' : '#6b7280',
                              }}
                            >
                              #{rank}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '14px 16px',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor:
                                  classification === 'High'
                                    ? '#dcfce7'
                                    : classification === 'Moderate'
                                    ? '#fef3c7'
                                    : classification === 'Average'
                                    ? '#fef3c7'
                                    : '#fee2e2',
                                color:
                                  classification === 'High'
                                    ? '#166534'
                                    : classification === 'Moderate'
                                    ? '#92400e'
                                    : classification === 'Average'
                                    ? '#92400e'
                                    : '#991b1b',
                              }}
                            >
                              {classification}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Skills to Vocational Mapping - Data Table */}
        {skillsVocationalMapping.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Skills to Career Pathways Mapping
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Comprehensive mapping of identified skills to available vocational career paths
                </p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Skill
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Available Career Paths
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {skillsVocationalMapping
                    .sort((a, b) => b.vocationalPaths.length - a.vocationalPaths.length)
                    .map((item, index) => (
                      <tr
                        key={item.skill}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        <td
                          style={{
                            padding: '14px 16px',
                            fontWeight: '500',
                            color: '#111827',
                          }}
                        >
                          {item.skill}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#374151',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                            }}
                          >
                            {item.vocationalPaths.map((path, pathIndex) => (
                              <span
                                key={pathIndex}
                                style={{
                                  fontSize: '12px',
                                  color: '#4b5563',
                                  backgroundColor: '#f3f4f6',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  border: '1px solid #e5e7eb',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {path}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#6b7280',
                }}
              >
                <BarChart3 size={16} />
                <span>
                  <strong>Total Skills Analyzed:</strong> {skillsVocationalMapping.length} |{' '}
                  <strong>Total Career Paths:</strong>{' '}
                  {skillsVocationalMapping.reduce(
                    (sum, item) => sum + item.vocationalPaths.length,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Roles by Intelligence - Data Table */}
        {Object.keys(rolesByIntelligence).length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Career Roles by Intelligence Domain
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Detailed breakdown of career roles aligned with each intelligence domain
                </p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Intelligence Domain
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Career Roles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rolesByIntelligence)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([intelligence, roles]) => (
                      <tr
                        key={intelligence}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        <td
                          style={{
                            padding: '14px 16px',
                            fontWeight: '500',
                            color: '#111827',
                          }}
                        >
                          {intelligence} Intelligence
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#374151',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                            }}
                          >
                            {roles.map((role, roleIndex) => (
                              <span
                                key={roleIndex}
                                style={{
                                  fontSize: '12px',
                                  color: '#4b5563',
                                  backgroundColor: '#f3f4f6',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  border: '1px solid #e5e7eb',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hybrid Role Mapping - Data Table */}
        {hybridRoles.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Hybrid Intelligence Combinations
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Career opportunities derived from combined intelligence strengths
                </p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Intelligence Combination
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Available Roles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hybridRoles
                    .sort((a, b) => b.roles.length - a.roles.length)
                    .map((hybrid, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                        }}
                      >
                        <td
                          style={{
                            padding: '14px 16px',
                            fontWeight: '600',
                            color: '#111827',
                          }}
                        >
                          {hybrid.combination}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#6b7280',
                            fontSize: '13px',
                            maxWidth: '300px',
                          }}
                        >
                          {hybrid.description}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#374151',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                            }}
                          >
                            {hybrid.roles.map((role, roleIndex) => {
                              const nsqfLevel = getNSQFLevelForRole(role)
                              return (
                                <span
                                  key={roleIndex}
                                  style={{
                                    fontSize: '12px',
                                    color: '#4b5563',
                                    backgroundColor: '#ede9fe',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #c4b5fd',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  {role}
                                  {nsqfLevel !== null && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        color: '#8b5cf6',
                                        backgroundColor: '#ddd6fe',
                                        padding: '2px 5px',
                                        borderRadius: '3px',
                                      }}
                                    >
                                      L{nsqfLevel}
                                    </span>
                                  )}
                                </span>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inclusive Design Notes */}
        {inclusiveDesignInfo && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  Inclusive Design & Training Recommendations
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Recommended training modalities and accessibility considerations
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
                gridTemplateColumns: '1fr',
                gap: '16px',
              }}
            >
              {/* Training Modes */}
              <div
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    marginBottom: '16px',
                  }}
                >
                  Recommended Training Modes
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '8px',
                  }}
                >
                  {inclusiveDesignInfo.trainingModes.map((mode, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        backgroundColor: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        borderLeft: '3px solid #1e40af',
                      }}
                    >
                      {mode}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NSQF Levels Distribution - Data Table */}
        {allNSQFRoles.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  NSQF Skill Levels & Qualifications
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  National Skills Qualification Framework (NSQF) - Distribution of roles across qualification levels
                </p>
              </div>
            </div>
            
            {/* NSQF Level Distribution Summary */}
            {(() => {
              const levelCounts = {}
              allNSQFRoles.forEach(role => {
                const level = role.nsqf_level !== null ? `Level ${role.nsqf_level}` : 'Not Mapped'
                levelCounts[level] = (levelCounts[level] || 0) + 1
              })
              
              return (
                <div
                  style={{
                    marginBottom: '32px',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0,
                      marginBottom: '16px',
                    }}
                  >
                    NSQF Level Distribution Summary
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                      gap: '12px',
                    }}
                  >
                    {Object.entries(levelCounts)
                      .sort((a, b) => {
                        const aLevel = a[0].match(/\d+/)?.[0] || '999'
                        const bLevel = b[0].match(/\d+/)?.[0] || '999'
                        return aLevel.localeCompare(bLevel)
                      })
                      .map(([level, count]) => (
                        <div
                          key={level}
                          style={{
                            padding: '12px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#1e40af',
                              fontFamily: 'monospace',
                            }}
                          >
                            {count}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              marginTop: '4px',
                            }}
                          >
                            {level}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })()}

            {/* NSQF Roles by Intelligence */}
            {Object.keys(nsqfRolesByIntelligence).length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '20px',
                  }}
                >
                  Roles by Learning Strength
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  {Object.entries(nsqfRolesByIntelligence).map(
                    ([intelligence, roles]) => {
                      const IconComponent = getIntelligenceIcon(
                        Object.keys(intelligenceScores || {}).find(
                          domain => getDomainDisplayName(domain).includes(intelligence)
                        ) || ''
                      )
                      return (
                        <div
                          key={intelligence}
                          style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '16px',
                            }}
                          >
                            {IconComponent && (
                              <IconComponent size={24} color='#3b82f6' />
                            )}
                            <h3
                              style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                flex: 1,
                                margin: 0,
                              }}
                            >
                              {intelligence} Intelligence
                            </h3>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#3b82f6',
                                backgroundColor: '#dbeafe',
                                padding: '4px 12px',
                                borderRadius: '6px',
                              }}
                            >
                              {roles.length} roles
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                              gap: '8px',
                            }}
                          >
                            {roles.map((roleEntry, roleIndex) => (
                              <div
                                key={roleIndex}
                                style={{
                                  fontSize: '13px',
                                  color: '#1f2937',
                                  backgroundColor: '#ffffff',
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  border: '1px solid #dbeafe',
                                  borderLeft: '4px solid #3b82f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span>{roleEntry.role}</span>
                                {roleEntry.nsqf_level !== null ? (
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      color: '#3b82f6',
                                      backgroundColor: '#dbeafe',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      flexShrink: 0,
                                      marginLeft: '12px',
                                    }}
                                  >
                                    L{roleEntry.nsqf_level}
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      color: '#9ca3af',
                                      fontStyle: 'italic',
                                      flexShrink: 0,
                                      marginLeft: '12px',
                                    }}
                                  >
                                    Not Mapped
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}

            {/* Hybrid Roles NSQF Mapping */}
            {nsqfHybridRoles.length > 0 && (
              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '2px solid #e5e7eb',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Users size={20} color='#8b5cf6' />
                  Combined Strengths Roles
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '8px',
                  }}
                >
                  {nsqfHybridRoles.map((roleEntry, roleIndex) => (
                    <div
                      key={roleIndex}
                      style={{
                        fontSize: '13px',
                        color: '#1f2937',
                        backgroundColor: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ede9fe',
                        borderLeft: '4px solid #8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{roleEntry.role}</span>
                      {roleEntry.nsqf_level !== null ? (
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#8b5cf6',
                            backgroundColor: '#ede9fe',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            flexShrink: 0,
                            marginLeft: '12px',
                          }}
                        >
                          L{roleEntry.nsqf_level}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            fontStyle: 'italic',
                            flexShrink: 0,
                            marginLeft: '12px',
                          }}
                        >
                          Not Mapped
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Executive Summary */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '32px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '4px',
                }}
              >
                Executive Summary
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0,
                }}
              >
                Key performance indicators and opportunity metrics
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
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderLeft: '4px solid #1e40af',
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
                <Briefcase size={20} color='#1e40af' />
                <TrendingUp size={16} color='#9ca3af' />
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1e40af',
                  fontFamily: 'monospace',
                  marginBottom: '4px',
                }}
              >
                {skillsVocationalMapping.length}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                Skills Identified
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginTop: '4px',
                }}
              >
                Mapped to vocational paths
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderLeft: '4px solid #059669',
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
                <Users size={20} color='#059669' />
                <TrendingUp size={16} color='#9ca3af' />
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#059669',
                  fontFamily: 'monospace',
                  marginBottom: '4px',
                }}
              >
                {Object.values(rolesByIntelligence).reduce((sum, roles) => sum + (roles?.length || 0), 0)}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                Career Roles Available
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginTop: '4px',
                }}
              >
                Across intelligence domains
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderLeft: '4px solid #7c3aed',
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
                <Target size={20} color='#7c3aed' />
                <TrendingUp size={16} color='#9ca3af' />
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#7c3aed',
                  fontFamily: 'monospace',
                  marginBottom: '4px',
                }}
              >
                {hybridRoles.length}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                Hybrid Combinations
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginTop: '4px',
                }}
              >
                Combined intelligence paths
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderLeft: '4px solid #d97706',
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
                <Award size={20} color='#d97706' />
                <TrendingUp size={16} color='#9ca3af' />
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#d97706',
                  fontFamily: 'monospace',
                  marginBottom: '4px',
                }}
              >
                {allNSQFRoles.length}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                Total Opportunities
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginTop: '4px',
                }}
              >
                NSQF-qualified roles
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sajag

