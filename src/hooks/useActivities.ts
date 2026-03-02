import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type {
  ActivitiesResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  IntelligencesResponse,
  FetchActivitiesParams,
} from '@/types'

// Query Keys
const ACTIVITIES_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITIES_KEYS.all, 'list'] as const,
  list: (params: FetchActivitiesParams) =>
    [...ACTIVITIES_KEYS.lists(), params] as const,
  intelligences: (personId: string) =>
    [...ACTIVITIES_KEYS.all, 'intelligences', personId] as const,
}

// API Functions
const activitiesApi = {
  fetchActivities: async (
    params: FetchActivitiesParams = {}
  ): Promise<ActivitiesResponse> => {
    const { limit = 5, page = 1 } = params
    const response = await axiosInstance.get<ActivitiesResponse>(
      '/v1/activities',
      {
        params: { limit, page },
      }
    )
    return response.data
  },

  submitAnswer: async (
    data: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> => {
    const response = await axiosInstance.post<SubmitAnswerResponse>(
      '/v1/activities/submit-answer',
      data
    )
    return response.data
  },

  fetchIntelligences: async (
    personId: string
  ): Promise<IntelligencesResponse> => {
    const response = await axiosInstance.get<IntelligencesResponse>(
      `/v1/activities/intelligences/${personId}`
    )
    return response.data
  },
}

// Hooks

/**
 * Hook to fetch activities with pagination
 * @param params - Pagination parameters (limit, page)
 * @returns Query result with activities data
 */
export const useActivities = (
  params: FetchActivitiesParams = {}
): UseQueryResult<ActivitiesResponse, Error> => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.list(params),
    queryFn: () => activitiesApi.fetchActivities(params),
  })
}

/**
 * Hook to submit an answer (mutation)
 * @returns Mutation result for submitting answers
 */
export const useSubmitAnswer = (): UseMutationResult<
  SubmitAnswerResponse,
  Error,
  SubmitAnswerRequest,
  unknown
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activitiesApi.submitAnswer,
    onSuccess: (_, variables) => {
      // Invalidate intelligences query for the person who submitted the answer
      queryClient.invalidateQueries({
        queryKey: ACTIVITIES_KEYS.intelligences(variables.personId ?? ''),
      })
    },
  })
}

/**
 * Hook to fetch intelligences for a person
 * @param personId - The person ID
 * @param enabled - Whether the query should run (default: true if personId exists)
 * @returns Query result with intelligences data
 */
export const useIntelligences = (
  personId: string | undefined,
  enabled = true
): UseQueryResult<IntelligencesResponse, Error> => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.intelligences(personId || ''),
    queryFn: () => activitiesApi.fetchIntelligences(personId!),
    enabled: enabled && !!personId,
  })
}

// Export query keys for use in other parts of the app if needed
export { ACTIVITIES_KEYS }
