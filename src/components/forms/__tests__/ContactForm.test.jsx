import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../test/utils.jsx'
import ContactForm from '../ContactForm'

describe('ContactForm', () => {
  it('renders contact form with all fields', () => {
    render(<ContactForm />)

    expect(
      screen.getByRole('heading', { name: /contact form/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 2 characters/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/subject must be at least 5 characters/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/message must be at least 10 characters/i)
      ).toBeInTheDocument()
    })
  })

  it('shows validation error for short name', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'A')
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 2 characters/i)
      ).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(emailInput, 'invalid-email')
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

    render(<ContactForm />)

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const subjectInput = screen.getByLabelText(/subject/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(subjectInput, 'Test Subject')
    await user.type(
      messageInput,
      'This is a test message for the contact form.'
    )
    await user.click(submitButton)

    // Check that submit button shows loading state
    expect(screen.getByText(/submitting.../i)).toBeInTheDocument()

    // Wait for form submission to complete
    await waitFor(
      () => {
        expect(alertSpy).toHaveBeenCalledWith('Form submitted successfully!')
      },
      { timeout: 2000 }
    )

    // Check that form is reset after successful submission
    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(subjectInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })

    alertSpy.mockRestore()
  })
})
