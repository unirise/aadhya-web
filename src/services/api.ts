// API service - Ready for your custom API integration
// Replace these placeholder functions with your actual API calls when ready

import { authService } from './authService'
import type { User, Post, Stats, FetchOptions } from '@/types'

const _API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

// Helper function to make authenticated requests
const fetchWithAuth = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const token = authService.getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expired or invalid, logout
    authService.logout()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export const apiService = {
  // Placeholder for user data fetching
  fetchUsers: async (): Promise<User[]> => {
    // TODO: Replace with your actual API call
    // return await fetch('YOUR_API_ENDPOINT/users').then(res => res.json())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        yob: 1990,
        role: 'user',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        username: 'janesmith',
        yob: 1992,
        role: 'user',
      },
    ]
  },

  // Placeholder for posts data fetching
  fetchPosts: async (): Promise<Post[]> => {
    // TODO: Replace with your actual API call
    // return await fetch('YOUR_API_ENDPOINT/posts').then(res => res.json())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return [
      { id: 1, title: 'First Post', content: 'This is the first post' },
      { id: 2, title: 'Second Post', content: 'This is the second post' },
    ]
  },

  // Placeholder for statistics data fetching
  fetchStats: async (): Promise<Stats> => {
    // TODO: Replace with your actual API call
    // return await fetch('YOUR_API_ENDPOINT/stats').then(res => res.json())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      totalUsers: 150,
      totalPosts: 75,
      totalComments: 300,
    }
  },

  // Placeholder for single user fetching
  fetchUser: async (userId: number): Promise<User> => {
    // TODO: Replace with your actual API call
    // return await fetch(`YOUR_API_ENDPOINT/users/${userId}`).then(res => res.json())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      id: String(userId),
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      yob: 1990,
      role: 'user',
    }
  },

  // Placeholder for user posts fetching
  fetchUserPosts: async (_userId: number): Promise<Post[]> => {
    // TODO: Replace with your actual API call
    // return await fetch(`YOUR_API_ENDPOINT/users/${_userId}/posts`).then(res => res.json())

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return [
      { id: 1, title: 'User Post 1', content: 'Content 1' },
      { id: 2, title: 'User Post 2', content: 'Content 2' },
    ]
  },
}

// Export the fetch helper for use in other services
export { fetchWithAuth }
