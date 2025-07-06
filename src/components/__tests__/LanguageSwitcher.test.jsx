import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher'

// Mock i18n for testing
const mockI18n = {
    language: 'en',
    changeLanguage: vi.fn(),
    t: (key) => key,
    use: vi.fn(),
    init: vi.fn(),
}

const renderWithProviders = (component) => {
    return render(
        <BrowserRouter>
            <I18nextProvider i18n={mockI18n}>
                {component}
            </I18nextProvider>
        </BrowserRouter>
    )
}

describe('LanguageSwitcher', () => {
    it('renders language switcher component', () => {
        renderWithProviders(<LanguageSwitcher />)

        expect(screen.getByText('languageSwitcher.title')).toBeInTheDocument()
        expect(screen.getByText('languageSwitcher.description')).toBeInTheDocument()
    })

    it('displays language options', () => {
        renderWithProviders(<LanguageSwitcher />)

        expect(screen.getByText('English')).toBeInTheDocument()
        expect(screen.getByText('Español')).toBeInTheDocument()
        expect(screen.getByText('Français')).toBeInTheDocument()
        expect(screen.getByText('हिन्दी')).toBeInTheDocument()
    })

    it('calls changeLanguage when language button is clicked', () => {
        renderWithProviders(<LanguageSwitcher />)

        const spanishButton = screen.getByText('Español')
        fireEvent.click(spanishButton)

        expect(mockI18n.changeLanguage).toHaveBeenCalledWith('es')
    })
})
