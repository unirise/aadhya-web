import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../test/utils.jsx'
import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  it('renders login form with all fields', () => {
    render(<LoginForm />)

    expect(
      screen.getByRole('heading', { name: /login form/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(rememberMeCheckbox)
    await user.click(submitButton)

    // Check that submit button shows loading state
    expect(screen.getByText(/logging in.../i)).toBeInTheDocument()

    // Wait for form submission to complete
    await waitFor(
      () => {
        expect(alertSpy).toHaveBeenCalledWith('Login successful!')
      },
      { timeout: 2000 }
    )

    // Check that form is reset after successful submission
    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
      expect(rememberMeCheckbox.checked).toBe(false)
    })

    alertSpy.mockRestore()
  })
})
