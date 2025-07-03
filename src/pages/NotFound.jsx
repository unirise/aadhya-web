import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div style={{marginTop: '60px', padding: '32px', textAlign: 'center'}}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/" style={{color: '#1d4ed8', textDecoration: 'none'}}>
                Go back to Home
            </Link>
        </div>
    )
}

export default NotFound