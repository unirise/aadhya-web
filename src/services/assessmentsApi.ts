import { axiosInstance } from '@/lib/axios'

/**
 * Assessments API Service
 * Fetches assessments from the backend API
 */
export const assessmentsApi = {
  /**
   * Fetch all assessments
   * @returns Promise with assessments array
   */
  fetchAssessments: async () => {
    const response = await axiosInstance.get('/v1/assessments')
    return response.data.data
  },

  /**
   * Fetch a single assessment by ID
   * @param assessmentId - The assessment ID
   * @returns Promise with assessment data
   */
  fetchAssessmentById: async (assessmentId: string) => {
    const response = await axiosInstance.get(`/v1/assessments/${assessmentId}`)
    return response.data.data
  },
}
