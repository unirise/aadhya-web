import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginFormSchema } from '../../schemas/formSchemas'

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    const onSubmit = async (data) => {
        try {
            console.log('Login Data:', data)
            // TODO: Add your login logic here
            // Example: await apiService.login(data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert('Login successful!')
            reset()
        } catch (error) {
            console.error('Login error:', error)
            alert('Login failed. Please try again.')
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Login Form</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Sample login form with validation
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email Field */}
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                        Password *
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        id="rememberMe"
                        type="checkbox"
                        {...register('rememberMe')}
                        style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="rememberMe" style={{ fontSize: '14px', cursor: 'pointer' }}>
                        Remember me
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: isSubmitting ? '#9ca3af' : '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm
