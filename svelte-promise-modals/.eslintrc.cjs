module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: {
          ts: '@typescript-eslint/parser',
          js: 'espree',
          typescript: '@typescript-eslint/parser',
        },
      },
    },
  ],
  settings: {
    ignoreWarnings: [],
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/indent': ['error', 2],
    'prefer-const': 'off',
    'no-undef': 'off',

    // TODO
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
