# Testing Guide

This project uses **Vitest** for unit and component testing with React Testing Library.

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
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import LoginForm from "../components/forms/LoginForm";

describe("LoginForm", () => {
  it("renders login form", () => {
    render(<LoginForm />);
    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });
});
```

### Schema Testing

```javascript
import { loginFormSchema } from "../schemas/formSchemas";

describe("loginFormSchema", () => {
  it("validates correct data", () => {
    const result = loginFormSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});
```

### Testing with Providers

For components that use React Router or TanStack Query:

```javascript
const renderWithProviders = (component) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};
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
