import LoginForm from '../components/forms/LoginForm'

function Login() {
    return (
        <div style={{ marginTop: '60px', padding: '32px' }}>
            <h1>Login</h1>
            <p>Access your account</p>

            {/* Login Form */}
            <div style={{ marginTop: '20px' }}>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login
