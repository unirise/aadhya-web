# ESLint Configuration

This project uses ESLint for code linting and maintaining code quality with a comprehensive set of
rules and plugins.

## Setup Overview

### Installed Packages

- **eslint**: Core ESLint package
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier
- **eslint-plugin-react**: React-specific linting rules
- **eslint-plugin-react-hooks**: Rules for React Hooks
- **eslint-plugin-react-refresh**: Rules for React Refresh
- **eslint-plugin-import**: Rules for import/export syntax
- **eslint-plugin-jsx-a11y**: Accessibility rules for JSX
- **eslint-plugin-unused-imports**: Detects and removes unused imports

### Configuration Files

#### `eslint.config.js`

Uses the new ESLint flat config format (ESLint 9+) with the following features:

- Modern flat config structure
- React and JSX support
- Import/export validation
- Accessibility rules
- Comprehensive code quality rules
- Prettier compatibility
- Separate rules for test files

#### `.eslintignore`

Excludes unnecessary files and directories from linting:

- `node_modules/`, `dist/`, `build/`
- IDE and OS files
- Environment files
- Test coverage reports
- Config files

### Available Scripts

```bash
# Check for linting errors without fixing
npm run lint:check

# Fix auto-fixable linting errors
npm run lint:fix

# Basic lint command (same as lint:check)
npm run lint
```

## Rule Categories

### React Rules

- Enforces JSX best practices
- Validates React component patterns
- Ensures proper prop handling
- Enforces React Hooks rules

### Import/Export Rules

- Validates import statements
- Prevents circular dependencies
- Enforces import ordering
- Detects unused imports

### Accessibility Rules

- Ensures proper ARIA attributes
- Validates semantic HTML
- Enforces keyboard navigation support
- Checks for accessibility best practices

### Code Quality Rules

- Enforces consistent code style
- Prevents common JavaScript errors
- Ensures proper variable usage
- Maintains code readability

### Formatting Rules

- Consistent indentation (2 spaces)
- Single quotes preference
- No semicolons
- Proper spacing and line breaks
- Maximum line length: 100 characters

## Integration

### VS Code Integration

ESLint integrates seamlessly with VS Code for real-time linting feedback.

### Pre-commit Hooks

Consider adding ESLint to your pre-commit hooks to ensure code quality:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:check"
    }
  }
}
```

### CI/CD Integration

Add linting to your CI/CD pipeline:

```yaml
- name: Run ESLint
  run: npm run lint:check
```

## Customization

### Adding New Rules

To add custom rules, modify the `rules` section in `eslint.config.js`:

```javascript
rules: {
  // Your custom rules here
  'custom-rule': 'error',
}
```

### Disabling Rules

To disable specific rules for certain files or lines:

```javascript
// Disable for entire file
/* eslint-disable rule-name */

// Disable for next line
// eslint-disable-next-line rule-name

// Disable for specific line
const code = 'example' // eslint-disable-line rule-name
```

### File-specific Configuration

The configuration includes special rules for test files with more relaxed constraints.

## Best Practices

1. **Run linting regularly**: Use `npm run lint:check` before committing
2. **Fix automatically**: Use `npm run lint:fix` to auto-fix issues
3. **Address warnings**: Don't ignore ESLint warnings
4. **Configure your editor**: Enable ESLint integration in your IDE
5. **Team consistency**: Ensure all team members use the same ESLint configuration

## Troubleshooting

### Common Issues

1. **"Parsing error"**: Check that your JavaScript/JSX syntax is valid
2. **"Rule not found"**: Ensure all ESLint plugins are installed
3. **"Config not found"**: Verify `eslint.config.js` exists in project root
4. **Performance issues**: Consider adding more patterns to `.eslintignore`

### Performance Optimization

- Use `.eslintignore` to exclude unnecessary files
- Consider using `--cache` flag for large codebases
- Use `--max-warnings 0` to treat warnings as errors in CI

## Migration Notes

This project uses the new ESLint flat config format. If migrating from the legacy `.eslintrc`
format:

1. Remove old `.eslintrc.*` files
2. Update scripts to remove `--ext` flag
3. Review and update rule configurations
4. Test thoroughly with `npm run lint:check`
