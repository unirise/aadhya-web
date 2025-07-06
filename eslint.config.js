import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unusedImports from 'eslint-plugin-unused-imports'
import prettierPlugin from 'eslint-plugin-prettier'
import prettier from 'eslint-config-prettier'

export default [
    {
        ignores: [
            'dist',
            'node_modules',
            'coverage',
            '.env*',
            '*.config.js',
            '*.config.ts',
            '*.config.mjs',
            '*.config.cjs',
            'vite.config.js',
            'vite.config.ts',
            'vitest.config.js',
            'vitest.config.ts',
            'postcss.config.js',
            'postcss.config.ts',
            'tailwind.config.js',
            'tailwind.config.ts',
        ]
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: {
            react: { version: '18.2' },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx'],
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'import': importPlugin,
            'jsx-a11y': jsxA11y,
            'unused-imports': unusedImports,
            'prettier': prettierPlugin,
        },
        rules: {
            // ESLint recommended rules
            ...js.configs.recommended.rules,

            // React recommended rules
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,

            // Import/export rules
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/namespace': 'error',
            'import/no-absolute-path': 'error',
            'import/no-dynamic-require': 'error',
            'import/no-self-import': 'error',
            'import/no-cycle': 'error',
            'import/no-useless-path-segments': 'error',
            'import/newline-after-import': 'warn',
            'import/no-duplicates': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'never',
                },
            ],

            // Accessibility rules
            'jsx-a11y/alt-text': 'error',
            'jsx-a11y/anchor-has-content': 'error',
            'jsx-a11y/anchor-is-valid': 'error',
            'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
            'jsx-a11y/aria-props': 'error',
            'jsx-a11y/aria-proptypes': 'error',
            'jsx-a11y/aria-role': 'error',
            'jsx-a11y/aria-unsupported-elements': 'error',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/heading-has-content': 'error',
            'jsx-a11y/html-has-lang': 'error',
            'jsx-a11y/img-redundant-alt': 'error',
            'jsx-a11y/interactive-supports-focus': 'error',
            'jsx-a11y/label-has-associated-control': 'error',
            'jsx-a11y/no-access-key': 'error',
            'jsx-a11y/no-autofocus': 'warn',
            'jsx-a11y/no-distracting-elements': 'error',
            'jsx-a11y/no-redundant-roles': 'error',
            'jsx-a11y/role-has-required-aria-props': 'error',
            'jsx-a11y/role-supports-aria-props': 'error',
            'jsx-a11y/scope': 'error',

            // React specific rules
            'react/jsx-no-target-blank': 'off',
            'react/prop-types': 'off', // Using TypeScript/Zod for prop validation
            'react/jsx-uses-react': 'off', // Not needed with JSX transform
            'react/react-in-jsx-scope': 'off', // Not needed with JSX transform
            'react/jsx-uses-vars': 'error',
            'react/no-unused-state': 'error',
            'react/no-direct-mutation-state': 'error',
            'react/jsx-key': 'error',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-pascal-case': 'error',
            'react/no-danger': 'warn',
            'react/no-deprecated': 'error',
            'react/no-did-mount-set-state': 'error',
            'react/no-did-update-set-state': 'error',
            'react/no-find-dom-node': 'error',
            'react/no-is-mounted': 'error',
            'react/no-render-return-value': 'error',
            'react/no-string-refs': 'error',
            'react/no-unescaped-entities': 'error',
            'react/no-unknown-property': 'error',
            'react/self-closing-comp': 'error',
            'react/jsx-wrap-multilines': ['error', {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'parens-new-line',
            }],

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // React Refresh rules
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // General JavaScript rules
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-unused-vars': 'off', // Replaced by unused-imports plugin
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    ignoreRestSiblings: false,
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'brace-style': ['error', '1tbs'],
            'comma-dangle': ['error', 'always-multiline'],
            'semi': ['error', 'never'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'indent': ['error', 2, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            'max-len': ['error', {
                code: 100,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            }],
            'no-trailing-spaces': 'error',
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-blocks': 'error',
            'keyword-spacing': 'error',
            'space-infix-ops': 'error',
            'comma-spacing': 'error',
            'no-multi-spaces': 'error',
            'key-spacing': 'error',

            // Prettier integration
            'prettier/prettier': 'error',
        },
    },
    // Test files configuration
    {
        files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}', '**/test/**/*.{js,jsx}', 'src/test/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-console': 'off',
            'max-len': 'off',
            'import/no-unresolved': 'off',
            'import/named': 'off',
            'import/default': 'off',
            'import/namespace': 'off',
            'react-refresh/only-export-components': 'off',
        },
    },
    // Prettier compatibility (must be last)
    prettier,
]
