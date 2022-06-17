module.exports = {
  extends: ['@hashicorp/platform-cli/config/stylelint.config'],
  plugins: [
    './stylelint-rules/no-undeclared-hds-color-tokens.js',
    './stylelint-rules/no-removed-outlines.js',
  ],
  rules: {
    'digital-plugin/no-undeclared-hds-color-tokens': true,
    'digital-plugin/no-removed-outlines': [true, { reportDisables: true }],
    'length-zero-no-unit': true /* needed by digital-plugin/no-removed-outlines */,
  },
}
