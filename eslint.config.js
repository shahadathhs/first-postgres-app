import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['node_modules/*', 'dist/*']),
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-expressions': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
])
