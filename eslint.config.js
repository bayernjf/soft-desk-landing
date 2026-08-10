import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  eslint.configs.recommended,
  ...astro.configs.recommended,

  // TypeScript files: use TS parser + browser globals
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // TypeScript handles scope/undef checking; disable base rule
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Only keep stable react-hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Astro files: browser + node globals (frontmatter runs on server)
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Config / Node files. The build pipeline scripts under scripts/ also run
  // browser-side callbacks via Playwright's page.evaluate, so they need both
  // node and browser globals in scope.
  {
    files: ['*.config.{js,mjs}', 'src/pages/robots.txt.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // Global rules
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
