// Authentication service using axios
import { axiosInstance } from '@/lib/axios'
import type { User, AuthResponse, ApiResponse } from '@/types'

// Token management
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const authService = {
  // Login
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      {
        username,
        password,
      }
    )

    const data = response.data

    // Store token and user info
    if (data.data?.access_token) {
      localStorage.setItem(TOKEN_KEY, data.data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
      console.log('[Auth] Login successful - Token stored')
    } else {
      console.error('[Auth] No access_token in login response')
    }

    return data.data
  },

  // Register
  register: async (
    username: string,
    password: string,
    name: string,
    yob: number
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      {
        username,
        password,
        name,
        yob,
      }
    )

    const data = response.data

    // Store token and user info
    if (data.data?.access_token) {
      localStorage.setItem(TOKEN_KEY, data.data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
      console.log('[Auth] Registration successful - Token stored')
    } else {
      console.error('[Auth] No access_token in registration response')
    }

    return data.data
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Get user
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
