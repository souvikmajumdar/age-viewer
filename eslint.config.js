import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      'frontend/src/lib/**',
      'backend/src/tools/Agtype*.js',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // Base config for all JS files
  js.configs.recommended,

  // TypeScript files — type-aware linting
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),

  // Backend JS files (Node.js ESM)
  {
    files: ['backend/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_|next' }],
    },
  },

  // Frontend files (React + Browser)
  {
    files: ['frontend/src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },

  // TypeScript-specific rule overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Test files
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/test/**/*.{js,ts}', 'e2e/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Prettier must be last to override formatting rules
  eslintConfigPrettier,
];
