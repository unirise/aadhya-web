// API Types
export interface User {
  id: string // UUID from backend
  name: string
  email?: string
  username: string
  yob: number
  role: string
}

export interface Post {
  id: number
  title: string
  content: string
}

export interface Stats {
  totalUsers: number
  totalPosts: number
  totalComments: number
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  statusCode?: number
}

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}
