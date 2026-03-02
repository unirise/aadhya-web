import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { Activity, ApiResponse, Assessment } from '@/types'

// Types
export interface AssessmentsResponse {
  assessments: Assessment[]
}

export interface UserResponse {
  id: string
  activityId: string
  personId: string
  domain: string
  attribute?: string
  responseData: unknown
  newScore?: string | number
  scoreChange?: string | number
  createdAt: string
  activity: Activity
}

// Query Keys
const ASSESSMENTS_KEYS = {
  all: ['assessments'] as const,
  lists: () => [...ASSESSMENTS_KEYS.all, 'list'] as const,
  list: () => [...ASSESSMENTS_KEYS.lists()] as const,
  details: () => [...ASSESSMENTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ASSESSMENTS_KEYS.details(), id] as const,
  myResponses: () => ['responses', 'my-responses'] as const,
}

// API Functions
const assessmentsApi = {
  fetchAssessments: async (): Promise<Assessment[]> => {
    const response =
      await axiosInstance.get<ApiResponse<Assessment[]>>('/v1/assessments')
    return response.data.data
  },

  fetchAssessmentById: async (assessmentId: string): Promise<Assessment> => {
    const response = await axiosInstance.get<ApiResponse<Assessment>>(
      `/v1/assessments/${assessmentId}`
    )
    return response.data.data
  },

  fetchMyResponses: async (): Promise<UserResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<UserResponse[]>>(
      '/v1/responses/my-responses'
    )
    return response.data.data
  },
}

// Hooks

/**
 * Hook to fetch all assessments
 * @returns Query result with assessments data
 */
export const useAssessments = (): UseQueryResult<Assessment[], Error> => {
  return useQuery({
    queryKey: ASSESSMENTS_KEYS.list(),
    queryFn: assessmentsApi.fetchAssessments,
  })
}

/**
 * Hook to fetch a single assessment by ID
 * @param assessmentId - The assessment ID
 * @param enabled - Whether the query should run (default: true if assessmentId exists)
 * @returns Query result with assessment data
 */
export const useAssessment = (
  assessmentId: string | undefined,
  enabled = true
): UseQueryResult<Assessment, Error> => {
  return useQuery({
    queryKey: ASSESSMENTS_KEYS.detail(assessmentId || ''),
    queryFn: () => assessmentsApi.fetchAssessmentById(assessmentId!),
    enabled: enabled && !!assessmentId,
  })
}

/**
 * Hook to fetch all responses for the current user
 * @returns Query result with user responses
 */
export const useMyResponses = (): UseQueryResult<UserResponse[], Error> => {
  return useQuery({
    queryKey: ASSESSMENTS_KEYS.myResponses(),
    queryFn: assessmentsApi.fetchMyResponses,
  })
}

// Export query keys for use in other parts of the app if needed
export { ASSESSMENTS_KEYS }
