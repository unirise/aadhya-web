import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAssessment } from '../hooks/useAssessments'
import { activitiesApi } from '../services/activitiesApi'

function AssessmentStart() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { data: assessment, isLoading: isLoadingAssessment, error: assessmentError } = useAssessment(assessmentId)
  
  const [activities, setActivities] = useState([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [activitiesError, setActivitiesError] = useState(null)

  // Fetch activities for this assessment
  useEffect(() => {
    const loadActivities = async () => {
      if (!assessmentId) return

      try {
        setIsLoadingActivities(true)
        setActivitiesError(null)
        
        const response = await activitiesApi.fetchActivities(100, 1, assessmentId)
        const activitiesData = response.data || response
        const loadedActivities = activitiesData.questions || activitiesData || []
        
        setActivities(loadedActivities)
      } catch (err) {
        console.error('Error loading activities:', err)
        setActivitiesError(err?.message || 'Failed to load activities')
      } finally {
        setIsLoadingActivities(false)
      }
    }

    loadActivities()
  }, [assessmentId])

  const handleStart = () => {
    if (activities.length > 0 && assessmentId) {
      navigate(`/assessment/${assessmentId}/activity/${activities[0].id}`)
    }
  }

  const isLoading = isLoadingAssessment || isLoadingActivities
  const error = assessmentError?.message || activitiesError

  if (isLoading) {
    return (
      <div style={{ 
        marginTop: '60px', 
        padding: '32px', 
        textAlign: 'center',
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading assessment...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div style={{ 
        marginTop: '60px', 
        padding: '32px', 
        textAlign: 'center',
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span style={{ fontSize: '32px', color: '#ef4444' }}>⚠️</span>
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '12px'
          }}>
            Error Loading Assessment
          </h2>
          <p style={{ color: '#ef4444', marginBottom: '24px', fontSize: '16px' }}>
            {error || 'Assessment not found'}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      marginTop: '60px', 
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        {/* Main Content Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '64px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            {/* Assessment Code Badge */}
            {assessment.code && (
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '24px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {assessment.code}
              </div>
            )}

            {/* Assessment Name */}
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              {assessment.name}
            </h1>

            {/* Assessment Description */}
            {assessment.description && (
              <p style={{ 
                fontSize: '18px', 
                color: '#6b7280',
                lineHeight: '1.7',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                {assessment.description}
              </p>
            )}
          </div>

          {/* Introduction Section */}
          {assessment.introduction && (
            <div style={{
              backgroundColor: '#f0f9ff',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '12px',
              padding: '24px 28px',
              marginBottom: '40px'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <span style={{ 
                  fontSize: '24px',
                  flexShrink: 0
                }}>💡</span>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#1e40af',
                  lineHeight: '1.7',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {assessment.introduction}
                </p>
              </div>
            </div>
          )}

          {/* Activities Count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '32px',
            backgroundColor: '#fafbfc',
            borderRadius: '16px',
            marginBottom: '48px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eff6ff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
            }}>
              <span style={{ fontSize: '32px' }}>📝</span>
            </div>
            <div>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                fontWeight: '600'
              }}>
                Total Activities
              </p>
              <p style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>
                {activities.length}
              </p>
            </div>
          </div>

          {/* Action Button - Centered */}
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleStart}
              disabled={activities.length === 0}
              style={{
                padding: '18px 48px',
                backgroundColor: activities.length === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: activities.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: activities.length === 0 ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}
              onMouseEnter={e => {
                if (activities.length > 0) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)'
                }
              }}
              onMouseLeave={e => {
                if (activities.length > 0) {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.2)'
                }
              }}
            >
              <span>Begin Assessment</span>
              <span style={{ fontSize: '20px' }}>→</span>
            </button>
          </div>

          {/* No activities warning */}
          {activities.length === 0 && (
            <div style={{
              marginTop: '32px',
              padding: '20px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #fcd34d',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#92400e', 
                fontSize: '15px',
                margin: 0,
                fontWeight: '500'
              }}>
                ⚠️ This assessment has no activities yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssessmentStart

