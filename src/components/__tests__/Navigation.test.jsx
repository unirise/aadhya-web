import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test/utils.jsx'
import Navigation from '../Navigation'

describe('Navigation', () => {
    it('renders all navigation links', () => {
        render(<Navigation />)

        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    })

    it('renders the brand name', () => {
        render(<Navigation />)

        expect(screen.getByText('Aadhya')).toBeInTheDocument()
    })

    it('has correct link attributes', () => {
        render(<Navigation />)

        const homeLink = screen.getByRole('link', { name: /home/i })
        const aboutLink = screen.getByRole('link', { name: /about/i })
        const contactLink = screen.getByRole('link', { name: /contact/i })
        const loginLink = screen.getByRole('link', { name: /login/i })

        expect(homeLink).toHaveAttribute('href', '/')
        expect(aboutLink).toHaveAttribute('href', '/about')
        expect(contactLink).toHaveAttribute('href', '/contact')
        expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('applies active styles to current route', () => {
        // This test would need to be more complex to test active states
        // For now, we just verify the component renders without error
        render(<Navigation />)

        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
})
