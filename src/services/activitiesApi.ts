import { apiRequest } from './apiConfig'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/v1'

interface Activity {
  id: number
  question: string
  domain?: string
  [key: string]: unknown
}

interface ActivitiesResponse {
  questions: Activity[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Metadata {
  [key: string]: unknown
}

interface Scoring {
  [key: string]: unknown
}

interface AnswerOption {
  value: number
  label: string
}

interface SubmitAnswerResponse {
  success: boolean
  message?: string
}

interface IntelligencesResponse {
  [key: string]: unknown
}

/**
 * Activities API Service
 * Fetches activities from the backend API with pagination support
 */
export const activitiesApi = {
  /**
   * Fetch random activities
   * @param limit - Number of activities to return (default: 5)
   * @param page - Page number (default: 1)
   * @returns Promise with activities and pagination info
   */
  fetchActivities: async (limit = 5, page = 1): Promise<ActivitiesResponse> => {
    const url = `${API_BASE_URL}/activities?limit=${limit}&page=${page}`
    return apiRequest<ActivitiesResponse>(url)
  },

  /**
   * Fetch activities metadata
   * @returns Promise with metadata object
   */
  fetchMetadata: async (): Promise<Metadata> => {
    const url = `${API_BASE_URL}/activities/metadata`
    return apiRequest<Metadata>(url)
  },

  /**
   * Fetch scoring configuration
   * @returns Promise with scoring configuration
   */
  fetchScoring: async (): Promise<Scoring> => {
    const url = `${API_BASE_URL}/activities/scoring`
    return apiRequest<Scoring>(url)
  },

  /**
   * Fetch answer options
   * @returns Promise with array of answer options
   */
  fetchAnswerOptions: async (): Promise<AnswerOption[]> => {
    const url = `${API_BASE_URL}/activities/answer-options`
    return apiRequest<AnswerOption[]>(url)
  },

  /**
   * Submit an answer for an activity
   * @param questionId - The activity/question ID
   * @param optionValue - The selected option value (1-5)
   * @param personId - The person ID
   * @returns Promise with submission response
   */
  submitAnswer: async (
    questionId: number,
    optionValue: number,
    personId: string
  ): Promise<SubmitAnswerResponse> => {
    const url = `${API_BASE_URL}/activities/submit-answer`
    return apiRequest<SubmitAnswerResponse>(url, {
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
   * @param personId - The person ID
   * @returns Promise with intelligences data
   */
  fetchIntelligences: async (personId: string): Promise<IntelligencesResponse> => {
    const url = `${API_BASE_URL}/activities/intelligences/${personId}`
    return apiRequest<IntelligencesResponse>(url)
  },
}

