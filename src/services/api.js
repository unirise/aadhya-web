// API service - Ready for your custom API integration
// Replace these placeholder functions with your actual API calls when ready

export const apiService = {
    // Placeholder for user data fetching
    fetchUsers: async () => {
        // TODO: Replace with your actual API call
        // return await fetch('YOUR_API_ENDPOINT/users').then(res => res.json())

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100))

        return [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ]
    },

    // Placeholder for posts data fetching
    fetchPosts: async () => {
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
    fetchStats: async () => {
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
    fetchUser: async (userId) => {
        // TODO: Replace with your actual API call
        // return await fetch(`YOUR_API_ENDPOINT/users/${userId}`).then(res => res.json())

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100))

        return {
            id: userId,
            name: 'John Doe',
            email: 'john@example.com'
        }
    },

    // Placeholder for user posts fetching
    fetchUserPosts: async (_userId) => {
        // TODO: Replace with your actual API call
        // return await fetch(`YOUR_API_ENDPOINT/users/${_userId}/posts`).then(res => res.json())

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100))

        return [
            { id: 1, title: 'User Post 1', content: 'Content 1' },
            { id: 2, title: 'User Post 2', content: 'Content 2' },
        ]
    }
}
