module.exports = {
  extends: ['@hashicorp/platform-cli/config/stylelint.config'],
  plugins: ['./stylelint-rules/no-undeclared-tokens.js'],
  rules: {
    'digital-plugin/no-undeclared-hds-color-tokens': true,
  },
}
