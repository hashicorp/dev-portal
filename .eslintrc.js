module.exports = {
  root: true,
  extends: './node_modules/@hashicorp/platform-cli/config/.eslintrc.js',
  plugins: ['dev-dot'],

  rules: {
    curly: 'error',
    'dev-dot/no-conditional-rendering-on-device-size': 'error',
  },

  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/typedef': [
          'warn',
          {
            arrowParameter: true,
            parameter: true,
          },
        ],
      },
    },
  ],
}
