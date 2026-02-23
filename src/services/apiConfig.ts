// API configuration and utilities
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1 second
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

// Generic fetch wrapper with error handling
export const apiRequest = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }

    throw error
  }
}

// Retry wrapper for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG.RETRY_COUNT
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY))
      return withRetry(fn, retries - 1)
    }
    throw error
  }
}
