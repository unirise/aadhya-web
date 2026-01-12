// Activity Types

export interface Activity {
  id: number
  question: string
  domain?: string
  [key: string]: unknown
}

export interface ActivitiesResponse {
  questions: Activity[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SubmitAnswerRequest {
  activityId: string
  optionValue: number
}

export interface SubmitAnswerResponse {
  success: boolean
  message?: string
}

export interface IntelligencesResponse {
  [key: string]: unknown
}

export interface FetchActivitiesParams {
  limit?: number
  page?: number
}

