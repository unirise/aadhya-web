import { useNavigate, useParams } from 'react-router-dom'
import { useAssessment } from '@/hooks/useAssessments'

function AssessmentThankYou() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { data: assessment, isLoading, error } = useAssessment(assessmentId)

  if (isLoading) {
    return (
      <div
        style={{
          marginTop: '60px',
          padding: '32px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</p>
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
      <div
        style={{
          marginTop: '60px',
          padding: '32px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '500px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px',
            }}
          >
            Error Loading Assessment
          </h2>
          <p
            style={{ color: '#ef4444', marginBottom: '24px', fontSize: '16px' }}
          >
            {error?.message || 'Assessment not found'}
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
              transition: 'background-color 0.2s',
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
    <div
      style={{
        marginTop: '60px',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        {/* Main Content Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '64px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Success Icon */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '96px',
                height: '96px',
                backgroundColor: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.2)',
              }}
            >
              <span style={{ fontSize: '48px' }}>✓</span>
            </div>

            <h1
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                lineHeight: '1.2',
              }}
            >
              Thank You!
            </h1>

            <p
              style={{
                fontSize: '20px',
                color: '#6b7280',
                marginBottom: '8px',
              }}
            >
              You have completed
            </p>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#3b82f6',
                marginBottom: '32px',
              }}
            >
              {assessment.name}
            </h2>
          </div>

          {/* Conclusion Section */}
          {assessment.conclusion && (
            <div
              style={{
                backgroundColor: '#f0f9ff',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '12px',
                padding: '28px 32px',
                marginBottom: '48px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    flexShrink: 0,
                  }}
                >
                  🎯
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1e40af',
                      marginBottom: '12px',
                      marginTop: 0,
                    }}
                  >
                    What&apos;s Next?
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#1e40af',
                      lineHeight: '1.7',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {assessment.conclusion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => navigate(`/assessment/${assessmentId}/start`)}
              style={{
                padding: '16px 40px',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '17px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#eff6ff'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '18px' }}>←</span>
              <span>Back to Overview</span>
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '16px 40px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '17px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(59, 130, 246, 0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}
            >
              <span> Home</span>
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssessmentThankYou
