module.exports = {
  extends: ['@hashicorp/platform-cli/config/stylelint.config'],
  rules: {
    'declaration-property-value-disallowed-list': [
      {
        outline: ['none', '/^0/'],
      },
      {
        message:
          'Do not remove outlines. Set them to be transparent instead. Removing outlines makes focus indicators inaccessible in high contrast modes.',
      },
    ],
  },
}
