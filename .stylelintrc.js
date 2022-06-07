module.exports = {
  extends: ['@hashicorp/platform-cli/config/stylelint.config'],
  plugins: ['./stylelint-rules/no-undeclared-tokens.js'],
  rules: {
    'digital-plugin/no-undeclared-hds-color-tokens': true,
    'declaration-property-value-disallowed-list': [
      {
        outline: ['none', '/^0/'],
      },
      {
        disableFix: true,
        message:
          'Do not remove outlines. Set them to be transparent instead. Removing outlines makes focus indicators inaccessible in high contrast modes.',
        reportDisables: true,
      },
    ],
  },
}
