# Prettier Configuration

This project uses Prettier for consistent code formatting across the entire codebase.

## Setup Overview

### Installed Packages

- **prettier**: Core Prettier package for code formatting
- **eslint-plugin-prettier**: Integrates Prettier with ESLint
- **eslint-config-prettier**: Disables conflicting ESLint rules

### Configuration Files

#### `.prettierrc`

Main Prettier configuration with the following settings:

- **Semi**: false (no semicolons)
- **Single Quotes**: true (use single quotes)
- **Tab Width**: 2 (2 spaces for indentation)
- **Trailing Commas**: es5 (trailing commas where valid in ES5)
- **Bracket Spacing**: true (spaces in object literals)
- **Arrow Parens**: always (always wrap arrow function params)
- **Print Width**: 80 (max line length)
- **End of Line**: lf (Unix line endings)

#### `.prettierignore`

Excludes files and directories from formatting:

- `node_modules/`, `dist/`, `build/`
- Package lock files
- Generated files and documentation
- Environment and config files

### Available Scripts

```bash
# Check formatting without fixing
npm run format:check

# Fix formatting issues
npm run format:fix

# Combined linting and formatting check
npm run lint:check && npm run format:check
```

## Integration

### ESLint Integration

Prettier is fully integrated with ESLint:

- Uses `eslint-config-prettier` to disable conflicting rules
- Uses `eslint-plugin-prettier` to run Prettier as an ESLint rule
- Both tools work together without conflicts

### VS Code Integration

For automatic formatting on save, add to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Pre-commit Hooks

Consider adding Prettier to your pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:check && npm run format:check"
    }
  }
}
```

## Usage

### Formatting Files

```bash
# Format all files
npm run format:fix

# Format specific files
npx prettier --write src/components/MyComponent.jsx

# Format specific patterns
npx prettier --write "src/**/*.{js,jsx}"
```

### Checking Formatting

```bash
# Check all files
npm run format:check

# Check specific files
npx prettier --check src/components/MyComponent.jsx
```

### Integration with Development Workflow

```bash
# Before committing
npm run lint:check && npm run format:check

# Fix issues
npm run lint:fix && npm run format:fix
```

## Configuration Details

### Prettier Rules Explanation

- **`semi: false`**: No semicolons at the end of statements
- **`singleQuote: true`**: Use single quotes instead of double quotes
- **`tabWidth: 2`**: Use 2 spaces for indentation
- **`trailingComma: 'es5'`**: Add trailing commas where valid in ES5
- **`bracketSpacing: true`**: Add spaces inside object literals
- **`arrowParens: 'always'`**: Always wrap arrow function parameters
- **`printWidth: 80`**: Maximum line length before wrapping
- **`endOfLine: 'lf'`**: Use Unix line endings

### File Extensions Supported

- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- JSON (`.json`)
- Markdown (`.md`)
- HTML (`.html`)
- CSS (`.css`)
- YAML (`.yml`, `.yaml`)

## Best Practices

1. **Format before committing**: Always run `npm run format:fix` before committing
2. **Use editor integration**: Install Prettier extension in your editor
3. **Format on save**: Enable automatic formatting in your editor
4. **Check in CI**: Include formatting checks in your CI pipeline
5. **Team consistency**: Ensure all team members use the same Prettier configuration

## Troubleshooting

### Common Issues

1. **Conflicts with ESLint**: Make sure `eslint-config-prettier` is last in your ESLint config
2. **Editor not formatting**: Check that Prettier is set as the default formatter
3. **Large files**: Prettier might be slow on very large files
4. **Ignored files**: Check `.prettierignore` if files aren't being formatted

### Performance Tips

- Use `.prettierignore` to exclude unnecessary files
- Consider using `--cache` flag for large projects
- Use specific file patterns when possible

### Debugging

```bash
# Check what files Prettier will format
npx prettier --find-config-path src/components/MyComponent.jsx

# See effective configuration
npx prettier --show-config src/components/MyComponent.jsx

# Debug formatting
npx prettier --debug-check src/components/MyComponent.jsx
```

## Migration Notes

When migrating to Prettier:

1. Run `npm run format:fix` to format existing code
2. Update any custom formatting rules in ESLint
3. Train team members on new formatting standards
4. Consider gradual migration for large codebases

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Check Prettier formatting
  run: npm run format:check

- name: Check ESLint
  run: npm run lint:check
```

This ensures code quality and formatting consistency across all environments.
