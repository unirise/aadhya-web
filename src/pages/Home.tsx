import { useNavigate } from 'react-router-dom'
import { useAssessments, Assessment } from '../hooks/useAssessments'

function Home() {
  const navigate = useNavigate()
  const { data: assessments, isLoading, error } = useAssessments()

  // Hardcoded person ID (same as in Activities)
  const PERSON_ID = '2cdaa500-7daf-44cd-a1bc-50fb77e86bd4'

  const handleAssessmentClick = (assessment: Assessment) => {
    // Navigate to the assessment start page which shows overview
    navigate(`/assessment/${assessment.id}/start`)
  }

  if (isLoading) {
    return (
      <div style={{ marginTop: '60px', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading assessments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ marginTop: '60px', padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '16px' }}>
          Error loading assessments: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '60px', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
          Welcome to Aadhya
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px' }}>
          Select an assessment to begin your journey of self-discovery
        </p>

        {/* Assessments Grid */}
        {assessments && assessments.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {assessments.map(assessment => (
              <div
                key={assessment.id}
                onClick={() => handleAssessmentClick(assessment)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '12px',
                  }}
                >
                  {assessment.name}
                </h2>
                {assessment.description && (
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}
                  >
                    {assessment.description}
                  </p>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {assessment.code}
                  </span>
                  <button
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#2563eb'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#3b82f6'
                    }}
                  >
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f9fafb',
              borderRadius: '16px',
              border: '2px dashed #d1d5db',
            }}
          >
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              No assessments available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
