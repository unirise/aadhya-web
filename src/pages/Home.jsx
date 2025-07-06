import { useStats } from '../hooks/useQueries'

function Home() {
    const { data: stats, isLoading, error } = useStats()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>Home</h1>
            <p>Welcome to Aadhya - Your journey starts here!</p>

            {/* TanStack Query integration ready - will show data when API is connected */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Quick Stats</h3>
                {isLoading && <p>Loading statistics...</p>}
                {error && <p style={{ color: 'red' }}>Error loading stats: {error.message}</p>}
                {stats && Object.keys(stats).length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
                        {Object.entries(stats).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        Statistics will appear here when you connect your API
                    </p>
                )}
            </div>
        </div>
    )
}

export default Home