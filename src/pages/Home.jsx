// import { useStats } from '../hooks/useQueries'
// import { ChartWrapper } from '../components/charts'

function Home() {
    // const { data: stats, isLoading, error } = useStats()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>Home</h1>
            <p>Welcome to Aadhya - Your journey starts here!</p>

            {/* TanStack Query integration ready - will show data when API is connected */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Quick Stats</h3>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    Statistics will appear here when you connect your API
                </p>
            </div>

            {/* Sample Charts Section */}
            <div style={{ marginTop: '40px' }}>
                <h2>Data Visualization</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    Charts will appear here when you add your data
                </p>
            </div>
        </div>
    )
}

export default Home