import { getIntelligenceIcon } from '../../lib/intelligence-icons'
import { ActionBlock, ContentBlock } from '../blocks'
import { RadioGroup, RadioGroupOption } from '../ui/radio-group'

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

interface MultipleChoiceQuestionProps {
  activity: Activity
  answerOptions: AnswerOption[]
  selectedAnswer: number | undefined
  onAnswerSelect: (_value: number) => void
  onNext: () => void
  onPrevious: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  currentPosition?: number
  totalActivities?: number
  isFirstQuestion?: boolean
}

function MultipleChoiceQuestion({
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
}: MultipleChoiceQuestionProps) {
  // Determine which options to display
  const optionsToDisplay =
    answerOptions && answerOptions.length > 0
      ? answerOptions
      : activity?.options || []

  // Get the icon for the intelligence domain
  const IconComponent =
    getIntelligenceIcon(activity.intelligenceDomain) ?? undefined

  return (
    <div className='flex flex-1 flex-col min-w-0 max-w-full w-full h-full'>
      {/* Activity Card */}
      <div className='py-8 mb-6 flex-1 flex justify-between min-h-0 gap-8'>
        <div className='flex flex-col gap-3 justify-center flex-wrap items-stretch w-full'>
          <ContentBlock
            type='text'
            label={activity.text}
            icon={IconComponent}
            text={activity.text}
            className='py-6'
          />
        </div>
        {/* Answer Options - Radio Group */}
        {optionsToDisplay && optionsToDisplay.length > 0 ? (
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={value => onAnswerSelect(Number(value))}
            className='flex flex-col gap-3 justify-center w-full'
          >
            {optionsToDisplay.map(option => (
              <RadioGroupOption
                key={option.value}
                value={option.value.toString()}
                emoji={option.emoji}
                label={option.label}
                isSelected={selectedAnswer === option.value}
              />
            ))}
          </RadioGroup>
        ) : (
          <div className='text-center p-5 text-red-500'>
            No answer options available. Please refresh the page.
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className='grid grid-cols-5 lg:grid-cols-9 gap-4 h-16 items-center shrink-0'>
        {/* Previous Button - spans first column */}
        <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
          <ActionBlock
            label={isFirstQuestion ? '🏠 Home' : '← Previous'}
            onClick={canGoPrevious ? onPrevious : undefined}
            className={!canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </div>

        <div className='hidden lg:block' />
        <div />
        <div className='hidden lg:block' />
        {/* Activity Counter - positioned in remaining column */}
        {currentPosition !== undefined && totalActivities !== undefined && (
          <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
            <div className='h-full w-full flex items-center justify-center bg-gray-100 rounded-lg min-w-[80px] h-full'>
              <span className='text-base font-semibold text-gray-700'>
                {currentPosition} / {totalActivities}
              </span>
            </div>
          </div>
        )}
        {/* Next Button - spans last column */}

        <div className='hidden lg:block' />
        <div />
        <div className='hidden lg:block' />

        <div className='col-span-1 flex items-center justify-center h-full w-full p-1'>
          <ActionBlock
            label='Next →'
            onClick={canGoNext ? onNext : undefined}
            className={!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </div>
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
