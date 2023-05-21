module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  overrides: [
    {
      files: ['*.stories.{ts, tsx}'],
      rules: {
        // https://github.com/storybookjs/storybook/discussions/17664
        '@typescript-eslint/await-thenable': 'off',
      },
    },
  ],
};
