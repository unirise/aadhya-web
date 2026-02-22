import { axiosInstance } from '@/lib/axios'

export interface Child {
  id: string
  name: string
  username: string
  yob: number
  role: string
  createdAt: string
}

export interface ChildStats {
  totalResponses: number
  averageScore: number
  domains: Record<string, number>
}

export const educatorApi = {
  fetchMyChildren: async (): Promise<Child[]> => {
    const response = await axiosInstance.get('/persons/my-children')
    const result = response.data.data ?? response.data
    return Array.isArray(result) ? result : []
  },

  addChild: async (data: { name: string; yob: number }): Promise<Child> => {
    const response = await axiosInstance.post('/persons/add-child', data)
    return response.data.data ?? response.data
  },

  updateChild: async (
    childId: string,
    data: { name?: string; yob?: number }
  ): Promise<Child> => {
    const response = await axiosInstance.put(`/persons/${childId}`, data)
    return response.data.data ?? response.data
  },

  deleteChild: async (childId: string): Promise<void> => {
    await axiosInstance.delete(`/persons/${childId}`)
  },

  fetchChildById: async (childId: string) => {
    const response = await axiosInstance.get(`/persons/${childId}`)
    return response.data.data ?? response.data
  },

  fetchChildStats: async (personId: string): Promise<ChildStats> => {
    const response = await axiosInstance.get(
      `/responses/person/${personId}/stats`
    )
    return response.data.data || response.data
  },

  fetchChildResponses: async (personId: string) => {
    const response = await axiosInstance.get(`/responses/person/${personId}`)
    return response.data.data || response.data
  },

  fetchChildIntelligences: async (personId: string) => {
    const response = await axiosInstance.get(
      `/activities/intelligences/${personId}`
    )
    return response.data.data || response.data
  },

  fetchAssessments: async () => {
    const response = await axiosInstance.get('/assessments')
    return response.data.data || response.data
  },

  fetchAssessmentById: async (assessmentId: string) => {
    const response = await axiosInstance.get(`/assessments/${assessmentId}`)
    return response.data.data || response.data
  },

  createAssessment: async (data: {
    name: string
    description: string
    introduction?: string
    conclusion?: string
  }) => {
    const response = await axiosInstance.post('/assessments', data)
    return response.data.data || response.data
  },

  updateAssessment: async (
    assessmentId: string,
    data: {
      name?: string
      description?: string
      introduction?: string
      conclusion?: string
    }
  ) => {
    const response = await axiosInstance.patch(
      `/assessments/${assessmentId}`,
      data
    )
    return response.data.data || response.data
  },

  deleteAssessment: async (assessmentId: string): Promise<void> => {
    await axiosInstance.delete(`/assessments/${assessmentId}`)
  },

  fetchActivities: async (assessmentId: string) => {
    const response = await axiosInstance.get(
      `/activities/entity?assessmentId=${assessmentId}`
    )
    return response.data.data || response.data
  },

  createActivity: async (data: {
    assessmentId: string
    type: string
    domain: string
    attribute?: string
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
    metadata?: Record<string, unknown>
  }) => {
    const response = await axiosInstance.post('/activities/entity', data)
    return response.data.data || response.data
  },

  updateActivity: async (
    activityId: string,
    data: {
      type?: string
      domain?: string
      attribute?: string
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
      metadata?: Record<string, unknown>
    }
  ) => {
    const response = await axiosInstance.patch(
      `/activities/entity/${activityId}`,
      data
    )
    return response.data.data || response.data
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    await axiosInstance.delete(`/activities/entity/${activityId}`)
  },
}
