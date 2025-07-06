# Testing Guide

This project uses **Vitest** for unit and component testing with React Testing Library, and
**ESLint** for code quality and linting.

## 🧪 Test Setup

### Dependencies

- `vitest` - Fast unit test framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for testing

### Configuration

- `vitest.config.js` - Vitest configuration
- `src/test/setup.js` - Global test setup
- `src/test/utils.js` - Custom testing utilities

## 🔍 Code Quality & Linting

### ESLint Configuration

This project uses ESLint with a comprehensive set of rules and plugins:

- **eslint-config-prettier**: Prettier compatibility
- **eslint-plugin-react**: React-specific rules
- **eslint-plugin-react-hooks**: React Hooks rules
- **eslint-plugin-import**: Import/export validation
- **eslint-plugin-jsx-a11y**: Accessibility rules
- **eslint-plugin-unused-imports**: Unused imports detection

### Linting Scripts

```bash
# Check for linting errors
npm run lint:check

# Fix auto-fixable linting errors
npm run lint:fix

# Basic lint command
npm run lint
```

### ESLint Features

- Modern flat config format (ESLint 9+)
- React and JSX support with latest best practices
- Import/export validation and ordering
- Accessibility rules for inclusive development
- Comprehensive code quality rules
- Automatic unused import removal
- Prettier integration for consistent formatting

See `ESLINT_SETUP.md` for detailed configuration information.

### Prettier Configuration

This project uses Prettier for consistent code formatting:

- **prettier**: Core code formatting engine
- **eslint-plugin-prettier**: ESLint integration
- **eslint-config-prettier**: Prevents ESLint/Prettier conflicts

### Formatting Scripts

```bash
# Check formatting without fixing
npm run format:check

# Fix formatting issues
npm run format:fix

# Combined check
npm run lint:check && npm run format:check
```

### Prettier Features

- Consistent code style across the entire project
- Integration with ESLint for seamless workflow
- Support for JavaScript, JSX, JSON, Markdown, and more
- Automatic formatting on save (with proper editor setup)
- No semicolons, single quotes, 2-space indentation
- 80-character line length limit

See `PRETTIER_SETUP.md` for detailed configuration information.

## 🎯 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

- **jsdom** - DOM environment for testing

## 📋 Available Scripts

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## 🗂️ Test Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── LoginForm.jsx
│   │   └── LoginForm.test.jsx
│   ├── Navigation.jsx
│   └── Navigation.test.jsx
├── lib/
│   ├── utils.js
│   └── utils.test.js
├── pages/
│   ├── Home.jsx
│   └── Home.test.jsx
├── schemas/
│   ├── formSchemas.js
│   └── formSchemas.test.js
└── test/
    └── setup.js
```

## 📝 Test Examples

### Component Testing

```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/forms/LoginForm'

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />)
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })
})
```

### Schema Testing

```javascript
import { loginFormSchema } from '../schemas/formSchemas'

describe('loginFormSchema', () => {
  it('validates correct data', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })
})
```

### Testing with Providers

For components that use React Router or TanStack Query:

```javascript
const renderWithProviders = component => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}
```

## 🛠️ Configuration

### vitest.config.js

- Environment: jsdom
- Setup file: `src/test/setup.js`
- Coverage reporting
- Global test functions

### Test Setup

- Auto-cleanup after each test
- Jest-DOM matchers
- Window mocks (matchMedia, alert)

## 📊 Coverage

Run `npm run test:coverage` to generate coverage reports in:

- Terminal (text format)
- `coverage/` directory (HTML format)

## 🔧 Best Practices

1. **Test file naming**: `Component.test.jsx` or `utils.test.js`
2. **Use describe blocks** for grouping related tests
3. **Clear test names** that describe what is being tested
4. **Render with providers** when components need React Router or TanStack Query
5. **Mock external dependencies** when needed
6. **Test user interactions** with `@testing-library/user-event`
7. **Use `screen` queries** for finding elements

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
