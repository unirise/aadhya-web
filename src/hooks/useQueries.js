import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'

// Custom hook for fetching users
// Usage: const { data: users, isLoading, error } = useUsers()
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: apiService.fetchUsers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

// Custom hook for fetching posts
// Usage: const { data: posts, isLoading, error } = usePosts()
export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: apiService.fetchPosts,
        staleTime: 3 * 60 * 1000, // 3 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

// Custom hook for fetching statistics
// Usage: const { data: stats, isLoading, error } = useStats()
export const useStats = () => {
    return useQuery({
        queryKey: ['stats'],
        queryFn: apiService.fetchStats,
        staleTime: 1 * 60 * 1000, // 1 minute
        cacheTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
}

// Custom hook for fetching a single user
// Usage: const { data: user, isLoading, error } = useUser(userId)
export const useUser = (userId) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => apiService.fetchUser(userId),
        enabled: !!userId, // Only run if userId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    })
}

// Custom hook for fetching user posts
// Usage: const { data: userPosts, isLoading, error } = useUserPosts(userId)
export const useUserPosts = (userId) => {
    return useQuery({
        queryKey: ['userPosts', userId],
        queryFn: () => apiService.fetchUserPosts(userId),
        enabled: !!userId, // Only run if userId exists
        staleTime: 3 * 60 * 1000, // 3 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    })
}
