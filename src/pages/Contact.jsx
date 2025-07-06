import { useUsers } from '../hooks/useQueries'
import ContactForm from '../components/forms/ContactForm'

function Contact() {
    const { data: users, isLoading, error } = useUsers()

    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>Contact</h1>
            <p>Get in touch with us!</p>

            {/* Contact Form */}
            <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                <ContactForm />
            </div>

            {/* TanStack Query integration ready - will show data when API is connected */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Our Team</h3>
                {isLoading && <p>Loading team members...</p>}
                {error && <p style={{ color: 'red' }}>Error loading team: {error.message}</p>}
                {users && users.length > 0 ? (
                    <div style={{ marginTop: '12px' }}>
                        {users.map(user => (
                            <div key={user.id} style={{ padding: '12px', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                                <h4 style={{ margin: '0 0 4px 0', color: '#1d4ed8' }}>{user.name}</h4>
                                <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>{user.email}</p>
                                {user.phone && <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>📞 {user.phone}</p>}
                                {user.website && <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>🌐 {user.website}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        Team members will appear here when you connect your API
                    </p>
                )}
            </div>
        </div>
    )
}

export default Contact