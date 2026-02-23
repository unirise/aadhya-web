/**
 * Multiple Intelligences Scoring Utility
 *
 * This utility provides functions to calculate intelligence domain scores
 * based on Howard Gardner's Theory of Multiple Intelligences.
 *
 * Scoring Logic:
 * - Each domain starts at a base score (default: 50)
 * - Scores are adjusted based on answer values
 * - Default adjustments: 1=+5, 2=+2, 3=0, 4=-2, 5=-5
 */

/**
 * Calculate intelligence domain scores from answers
 *
 * @param {Object} questionsData - The questions data object from JSON
 * @param {Object} answers - Object mapping question IDs to answer values (e.g., {1: 1, 2: 3, ...})
 * @param {Object} customScoring - Optional custom scoring configuration
 * @returns {Object} Object mapping intelligence domains to their calculated scores
 */
export function calculateMIScores(
  questionsData,
  answers,
  customScoring = null
) {
  const scoring = customScoring || questionsData.scoring
  const baseScore = scoring.baseScore || 50
  const scoreAdjustments = scoring.scoreAdjustments || {
    1: 5,
    2: 2,
    3: 0,
    4: -2,
    5: -5,
  }

  // Initialize all domains with base score
  const domainScores = {}
  questionsData.metadata.intelligenceDomains.forEach(domain => {
    domainScores[domain] = baseScore
  })

  // Process each answer
  questionsData.questions.forEach(question => {
    const answerValue = answers[question.id]
    if (answerValue !== undefined && answerValue !== null) {
      const domain = question.intelligenceDomain
      const adjustment = scoreAdjustments[String(answerValue)] || 0
      domainScores[domain] += adjustment
    }
  })

  return domainScores
}

/**
 * Get top N intelligence domains by score
 *
 * @param {Object} domainScores - Object mapping domains to scores
 * @param {number} topN - Number of top domains to return (default: 3)
 * @returns {Array} Array of {domain, score} objects sorted by score (descending)
 */
export function getTopIntelligences(domainScores, topN = 3) {
  return Object.entries(domainScores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}

/**
 * Get question statistics by domain
 *
 * @param {Object} questionsData - The questions data object from JSON
 * @param {Object} answers - Object mapping question IDs to answer values
 * @returns {Object} Statistics for each domain
 */
export function getDomainStatistics(questionsData, answers) {
  const stats = {}

  questionsData.metadata.intelligenceDomains.forEach(domain => {
    const domainQuestions = questionsData.questions.filter(
      q => q.intelligenceDomain === domain
    )
    const answeredQuestions = domainQuestions.filter(
      q => answers[q.id] !== undefined && answers[q.id] !== null
    )

    stats[domain] = {
      totalQuestions: domainQuestions.length,
      answeredQuestions: answeredQuestions.length,
      averageAnswer:
        answeredQuestions.length > 0
          ? answeredQuestions.reduce((sum, q) => sum + answers[q.id], 0) /
            answeredQuestions.length
          : null,
    }
  })

  return stats
}

/**
 * Validate answers against questions data
 *
 * @param {Object} questionsData - The questions data object from JSON
 * @param {Object} answers - Object mapping question IDs to answer values
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateAnswers(questionsData, answers) {
  const errors = []
  const validAnswerValues = questionsData.answerOptions.map(opt => opt.value)

  // Check for invalid answer values
  Object.entries(answers).forEach(([questionId, answerValue]) => {
    const questionIdNum = parseInt(questionId)
    const question = questionsData.questions.find(q => q.id === questionIdNum)

    if (!question) {
      errors.push(`Question ID ${questionId} does not exist`)
    } else if (!validAnswerValues.includes(answerValue)) {
      errors.push(
        `Invalid answer value ${answerValue} for question ${questionId}`
      )
    }
  })

  // Check for missing required answers (optional - can be customized)
  const answeredQuestionIds = Object.keys(answers).map(id => parseInt(id))
  const allQuestionIds = questionsData.questions.map(q => q.id)
  const missingQuestions = allQuestionIds.filter(
    id => !answeredQuestionIds.includes(id)
  )

  return {
    isValid: errors.length === 0,
    errors,
    missingQuestions,
    answeredCount: answeredQuestionIds.length,
    totalQuestions: allQuestionIds.length,
  }
}
