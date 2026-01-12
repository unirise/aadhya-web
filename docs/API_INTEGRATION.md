# API Integration Guide

This project is set up with TanStack Query and ready for your API integration. Here's how to add
your API when ready:

## 🚀 Quick Start

### Step 1: Set Your API Base URL

```bash
# Edit .env file
VITE_API_BASE_URL=https://your-api-server.com/api
```

### Step 2: Update API Service Methods

```javascript
// In src/services/api.js
export const apiService = {
  fetchUsers: async () => {
    return withRetry(async () => {
      return await apiRequest(`${API_CONFIG.BASE_URL}/users`)
    })
  },
  // ... other methods
}
```

### Step 3: Test Your Integration

```bash
npm run dev
```

## 📁 File Structure

```
src/
├── services/
│   ├── api.js          # Replace placeholder methods with your API calls
│   └── apiConfig.js    # API configuration (timeout, retry, etc.)
├── hooks/
│   └── useQueries.js   # Ready-to-use TanStack Query hooks
└── pages/
    ├── Home.jsx        # Shows stats when API is connected
    ├── About.jsx       # Shows posts when API is connected
    └── Contact.jsx     # Shows users when API is connected
```

## 🔧 Available Hooks

All hooks are already created and ready to use:

- `useUsers()` - Fetches user list
- `usePosts()` - Fetches post list
- `useStats()` - Fetches statistics
- `useUser(userId)` - Fetches single user
- `useUserPosts(userId)` - Fetches user's posts

## 📝 Example API Response Format

The hooks expect these response formats:

```javascript
// Users
[
  { id: 1, name: "John Doe", email: "john@example.com" }
]

// Posts
[
  { id: 1, title: "Post Title", content: "Post content..." }
]

// Stats
{
  totalUsers: 100,
  totalPosts: 50,
  // ... any other stats
}
```

## 🎯 Current Status

✅ TanStack Query configured ✅ QueryClient set up with optimal defaults ✅ Custom hooks ready ✅
Pages ready to display data ✅ Error handling implemented ✅ Loading states implemented ⏳ Waiting
for your API integration

Just add your API endpoint and update the service methods when ready!
