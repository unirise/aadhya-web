import { usePosts } from '../hooks/useQueries'
import LoginForm from '../components/forms/LoginForm'

function About() {
    const { data: posts, isLoading, error } = usePosts()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>About</h1>
            <p>Learn more about our mission and values.</p>

            {/* Login Form Demo */}
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                <LoginForm />
            </div>

            {/* TanStack Query integration ready - will show data when API is connected */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Recent Posts</h3>
                {isLoading && <p>Loading posts...</p>}
                {error && <p style={{ color: 'red' }}>Error loading posts: {error.message}</p>}
                {posts && posts.length > 0 ? (
                    <div style={{ marginTop: '12px' }}>
                        {posts.map(post => (
                            <div key={post.id} style={{ padding: '12px', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#1d4ed8' }}>{post.title}</h4>
                                <p style={{ margin: '0', color: '#6b7280' }}>{post.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        Posts will appear here when you connect your API
                    </p>
                )}
            </div>
        </div>
    )
}

export default About