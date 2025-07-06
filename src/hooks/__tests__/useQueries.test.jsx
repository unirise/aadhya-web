import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers, usePosts, useStats } from '../useQueries'
import { apiService } from '../../services/api'
// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    fetchUsers: vi.fn(),
    fetchPosts: vi.fn(),
    fetchStats: vi.fn(),
  },
}))

describe('TanStack Query Hooks', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    })
    vi.clearAllMocks()
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  describe('useUsers', () => {
    it('should return users data when API call succeeds', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ]

      apiService.fetchUsers.mockResolvedValue(mockUsers)

      const { result } = renderHook(() => useUsers(), { wrapper })

      // Initially loading
      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockUsers)
      expect(apiService.fetchUsers).toHaveBeenCalledTimes(1)
    })

    it('should handle API errors', async () => {
      const mockError = new Error('API Error')
      apiService.fetchUsers.mockRejectedValue(mockError)

      const { result } = renderHook(() => useUsers(), { wrapper })

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true)
        },
        { timeout: 3000 }
      )

      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('usePosts', () => {
    it('should return posts data when API call succeeds', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ]

      apiService.fetchPosts.mockResolvedValue(mockPosts)

      const { result } = renderHook(() => usePosts(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockPosts)
      expect(apiService.fetchPosts).toHaveBeenCalledTimes(1)
    })
  })

  describe('useStats', () => {
    it('should return stats data when API call succeeds', async () => {
      const mockStats = {
        users: 100,
        posts: 50,
        comments: 200,
      }

      apiService.fetchStats.mockResolvedValue(mockStats)

      const { result } = renderHook(() => useStats(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockStats)
      expect(apiService.fetchStats).toHaveBeenCalledTimes(1)
    })
  })
})
