import axios from 'axios'

// Token storage key (must match authService)
const TOKEN_KEY = 'auth_token'

// Get base URL from environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  config => {
    // Get token directly from localStorage to avoid circular dependency
    const token = localStorage.getItem(TOKEN_KEY)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      // eslint-disable-next-line no-console
      console.log(
        `[Auth] Token added to request: ${config.method?.toUpperCase()} ${config.url}`
      )
    } else if (!config.url?.includes('/auth/')) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Auth] No token found for request: ${config.method?.toUpperCase()} ${config.url}`
      )
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Handle 401 Unauthorized - logout and redirect
    if (error.response?.status === 401) {
      // Clear auth data directly to avoid circular dependency
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(errorMessage))
  }
)

export default axiosInstance
