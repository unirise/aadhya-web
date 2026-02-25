import { axiosInstance } from '@/lib/axios'

/**
 * Activities API Service
 * Fetches activities from the backend API with pagination support
 */
export const activitiesApi = {
  /**
   * Fetch activities
   * @param limit - Number of activities to return (default: 5) - only used when no assessmentId
   * @param page - Page number (default: 1) - only used when no assessmentId
   * @param assessmentId - Optional assessment ID to filter activities
   * @returns Promise with activities and pagination info
   */
  fetchActivities: async (limit = 5, page = 1, assessmentId?: string) => {
    // If assessmentId is provided, fetch entity-based activities from database
    if (assessmentId) {
      const response = await axiosInstance.get(
        `/activities/entity?assessmentId=${assessmentId}`
      )
      // Pass DB entities through as-is
      const questions = response.data.data || response.data

      return {
        questions,
        pagination: {
          page: 1,
          limit: questions.length,
          total: questions.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      }
    }

    // Otherwise, fetch random activities from JSON
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
    })
    const response = await axiosInstance.get(`/activities?${params.toString()}`)
    return response.data.data
  },

  /**
   * Submit an answer for an activity
   * @param activityId - The activity ID (UUID or numeric ID)
   * @param optionValue - The selected option value (1-5)
   * @returns Promise with submission response
   */
  submitAnswer: async (activityId: string, optionValue: number) => {
    const response = await axiosInstance.post('/responses/submit-answer', {
      activityId,
      optionValue,
    })
    return response.data.data
  },

  /**
   * Fetch intelligences for the authenticated user
   * @returns Promise with intelligences data
   */
  fetchIntelligences: async (_personId?: string) => {
    const response = await axiosInstance.get('/activities/intelligences')
    return response.data.data
  },

  /**
   * Fetch all responses for the authenticated user
   * @returns Promise with responses data
   */
  fetchMyResponses: async () => {
    const response = await axiosInstance.get('/responses/my-responses')
    return response.data.data || response.data
  },
}
