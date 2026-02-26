// Activity Types

export interface ActivityOption {
  value: number
  label: string
  emoji: string
  scoreAdjustment: number
}

export interface ActivityMetadata {
  questionId?: number
  text?: string
  domainDisplayName?: string
  options?: ActivityOption[]
  key?: string
  label?: string
  icon?: string
  title?: string
  subtitle?: string
  snippet?: string
  description?: string
  paragraph1?: string
  paragraph2?: string
  media?: string
  [extra: string]: unknown
}

export interface Activity {
  id: string
  assessmentId?: string
  type?: string
  domain: string
  attribute?: string
  metadata: ActivityMetadata
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
  personId?: string
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
