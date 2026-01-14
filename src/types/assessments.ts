import { Activity } from './activities'

export interface Assessment {
  id: string
  name: string
  description: string
  introduction: string
  conclusion: string
  activities: Activity[]
  createdAt?: string
  updatedAt?: string
}

