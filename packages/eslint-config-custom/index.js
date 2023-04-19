module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:functional/external-recommended',
    'plugin:functional/no-mutations',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'next',
    'turbo',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'functional', 'import'],
  rules: {
    // Disable readonly since its tedious
    '@typescript-eslint/prefer-readonly': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    'functional/prefer-readonly-type': 'off',
    // Error unused vars
    '@typescript-eslint/no-unused-vars': 'error',
    // No any
    '@typescript-eslint/no-explicit-any': 'error',
    // Disable immutable data
    'functional/immutable-data': [
      'error',
      {
        // React ref is mutable
        ignoreAccessorPattern: ['ref.current*.**', '**Ref.current*.**'],
        ignorePattern: ['document.title', 'module.exports'],
      },
    ],
    // Auto order imports
    'import/order': 'error',
    // Default from turborepo
    '@next/next/no-html-link-for-pages': 'off',
    // React hook dependencies
    'react-hooks/exhaustive-deps': 'error',
  },
  // This causes problem with linting in VSCode.
  // We may need to use this in the future.
  // * See: https://github.com/vercel/next.js/issues/40687
  // parserOptions: {
  //   babelOptions: {
  //     presets: [require.resolve('next/babel')],
  //   },
  // },
};
