import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

// Types
export interface Assessment {
  id: string
  code: string
  name: string
  description?: string
  introduction?: string
  conclusion?: string
  createdAt?: string
  updatedAt?: string
}

export interface AssessmentsResponse {
  assessments: Assessment[]
}

// Query Keys
const ASSESSMENTS_KEYS = {
  all: ['assessments'] as const,
  lists: () => [...ASSESSMENTS_KEYS.all, 'list'] as const,
  list: () => [...ASSESSMENTS_KEYS.lists()] as const,
  details: () => [...ASSESSMENTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ASSESSMENTS_KEYS.details(), id] as const,
}

// API Functions
const assessmentsApi = {
  fetchAssessments: async (): Promise<Assessment[]> => {
    const response = await axiosInstance.get<Assessment[]>('/assessments')
    // Handle both wrapped and unwrapped responses
    const data = response.data?.data || response.data
    return Array.isArray(data) ? data : []
  },

  fetchAssessmentById: async (assessmentId: string): Promise<Assessment> => {
    const response = await axiosInstance.get<Assessment>(`/assessments/${assessmentId}`)
    return response.data?.data || response.data
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

// Export query keys for use in other parts of the app if needed
export { ASSESSMENTS_KEYS }

