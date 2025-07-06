import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
    const { initialEntries: _initialEntries = ['/'], ...renderOptions } = options

    // Create a new QueryClient for each test
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
                cacheTime: 0,
            },
        },
    })

    function Wrapper({ children }) {
        return (
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </QueryClientProvider>
        )
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        queryClient,
    }
}

// Re-export everything from testing-library/react
export * from '@testing-library/react'

// Override render method
export { renderWithProviders as render }
