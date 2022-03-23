module.exports = {
  root: true,
  extends: './node_modules/@hashicorp/platform-cli/config/.eslintrc.js',
  rules: {
    curly: 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrowParameter: true,
        parameter: true,
      },
    ],
  },
}
