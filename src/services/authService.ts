// Authentication service
import type { User, AuthResponse, ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Token management
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const authService = {
  // Login
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data: ApiResponse<AuthResponse> = await response.json()

    // Store token and user info
    if (data.data?.access_token) {
      localStorage.setItem(TOKEN_KEY, data.data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name, yob }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const data: ApiResponse<AuthResponse> = await response.json()

    // Store token and user info
    if (data.data?.access_token) {
      localStorage.setItem(TOKEN_KEY, data.data.access_token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
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

