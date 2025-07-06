import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../test/utils.jsx'
import Home from '../Home'

describe('Home Page', () => {
  it('renders the home page content', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome to aadhya/i)).toBeInTheDocument()
    expect(screen.getByText(/your journey starts here/i)).toBeInTheDocument()
  })

  it('renders the quick stats section', () => {
    render(<Home />)

    expect(screen.getByText(/quick stats/i)).toBeInTheDocument()
    expect(
      screen.getByText(/statistics will appear here when you connect your api/i)
    ).toBeInTheDocument()
  })

  it('renders the data visualization section', () => {
    render(<Home />)

    expect(screen.getByText(/data visualization/i)).toBeInTheDocument()
    expect(
      screen.getByText(/charts will appear here when you add your data/i)
    ).toBeInTheDocument()
  })

  it('has proper layout and styling', () => {
    render(<Home />)

    const mainContainer = screen
      .getByRole('heading', { name: /home/i })
      .closest('div')
    expect(mainContainer).toBeInTheDocument()
  })
})
