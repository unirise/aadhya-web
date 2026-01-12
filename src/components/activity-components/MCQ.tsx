import { getIntelligenceIcon } from '../../lib/intelligence-icons'

interface AnswerOption {
  value: number
  label: string
  emoji: string
}

interface Activity {
  id: string
  text: string
  intelligenceDomain: string
  domainDisplayName?: string
  options?: AnswerOption[]
}

interface MCQProps {
  activity: Activity
  answerOptions: AnswerOption[]
  selectedAnswer: number | undefined
  onAnswerSelect: (value: number) => void
  onNext: () => void
  onPrevious: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  currentPosition?: number
  totalActivities?: number
  isFirstQuestion?: boolean
}

function MCQ({
  activity,
  answerOptions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoPrevious,
  canGoNext,
  currentPosition,
  totalActivities,
  isFirstQuestion = false,
}: MCQProps) {
  // Determine which options to display
  const optionsToDisplay =
    answerOptions && answerOptions.length > 0
      ? answerOptions
      : activity?.options || []

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        padding: '20px',
        maxWidth: '100%',
        margin: '0 auto',
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
          const IconComponent = getIntelligenceIcon(activity.intelligenceDomain)
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
          {activity.text}
        </h2>

        {/* Answer Options - Horizontal */}
        {optionsToDisplay && optionsToDisplay.length > 0 ? (
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
              const isSelected = selectedAnswer === option.value
              return (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => onAnswerSelect(option.value)}
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
                      e.currentTarget.style.backgroundColor = '#e5e7eb'
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }
                  }}
                  onMouseOut={e => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                      e.currentTarget.style.borderColor = '#e5e7eb'
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
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              color: '#ef4444',
            }}
          >
            No answer options available. Please refresh the page.
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        <button
          type='button'
          onClick={onPrevious}
          disabled={!canGoPrevious}
          style={{
            padding: '14px 28px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: !canGoPrevious ? '#e5e7eb' : isFirstQuestion ? '#3b82f6' : '#6b7280',
            color: !canGoPrevious ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: !canGoPrevious ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: !canGoPrevious ? 0.5 : 1,
          }}
          onMouseOver={e => {
            if (canGoPrevious && isFirstQuestion) {
              e.currentTarget.style.backgroundColor = '#2563eb'
            } else if (canGoPrevious) {
              e.currentTarget.style.backgroundColor = '#4b5563'
            }
          }}
          onMouseOut={e => {
            if (canGoPrevious && isFirstQuestion) {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            } else if (canGoPrevious) {
              e.currentTarget.style.backgroundColor = '#6b7280'
            }
          }}
        >
          {isFirstQuestion ? '🏠 Home' : '← Previous'}
        </button>

        {/* Activity Counter */}
        {currentPosition !== undefined && totalActivities !== undefined && (
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            {currentPosition} / {totalActivities}
          </div>
        )}

        <button
          type='button'
          onClick={onNext}
          disabled={!canGoNext}
          style={{
            padding: '14px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: canGoNext ? '#10b981' : '#e5e7eb',
            color: canGoNext ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '12px',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            opacity: canGoNext ? 1 : 0.5,
          }}
          onMouseOver={e => {
            if (canGoNext) {
              e.currentTarget.style.backgroundColor = '#059669'
            }
          }}
          onMouseOut={e => {
            if (canGoNext) {
              e.currentTarget.style.backgroundColor = '#10b981'
            }
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default MCQ

