import { apiRequest } from './apiConfig'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/v1'

/**
 * Questions API Service
 * Fetches questions from the backend API with pagination support
 */
export const questionsApi = {
  /**
   * Fetch random questions
   * @param {number} limit - Number of questions to return (default: 5)
   * @returns {Promise<{questions: Array, pagination: Object}>}
   */
  fetchQuestions: async (limit = 5, page = 1) => {
    const url = `${API_BASE_URL}/questions?limit=${limit}&page=${page}`
    return apiRequest(url)
  },

  /**
   * Fetch questions metadata
   * @returns {Promise<Object>}
   */
  fetchMetadata: async () => {
    const url = `${API_BASE_URL}/questions/metadata`
    return apiRequest(url)
  },

  /**
   * Fetch scoring configuration
   * @returns {Promise<Object>}
   */
  fetchScoring: async () => {
    const url = `${API_BASE_URL}/questions/scoring`
    return apiRequest(url)
  },

  /**
   * Fetch answer options
   * @returns {Promise<Array>}
   */
  fetchAnswerOptions: async () => {
    const url = `${API_BASE_URL}/questions/answer-options`
    return apiRequest(url)
  },

  /**
   * Submit an answer for a question
   * @param {number} questionId - The question ID
   * @param {number} optionValue - The selected option value (1-5)
   * @param {string} personId - The person ID
   * @returns {Promise<Object>}
   */
  submitAnswer: async (questionId, optionValue, personId) => {
    const url = `${API_BASE_URL}/questions/submit-answer`
    return apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        questionId,
        optionValue,
        personId,
      }),
    })
  },

  /**
   * Fetch intelligences for a person
   * @param {string} personId - The person ID
   * @returns {Promise<Object>}
   */
  fetchIntelligences: async personId => {
    const url = `${API_BASE_URL}/questions/intelligences/${personId}`
    return apiRequest(url)
  },
}
