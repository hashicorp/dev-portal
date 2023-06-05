# Custom Stylelint Rules

HashiCorp Developer leverages some custom Stylelint rules for linting CSS. Each is documented below. See [`.stylelintrc.js`](/.stylelintrc.js) for the current Stylelint configuration.

## Table of Contents

- [`no-removed-outlines`](#no-removed-outlines)
- [`no-undeclared-hds-color-tokens`](#no-undeclared-hds-color-tokens)

## `no-removed-outlines`

The `no-removed-outlines` rule checks for outlines that have been removed using the `outline`, `outline-style`, or `outline-width` properties. Completely removing outlines can lead to no focus indicators in Window High Contrast Mode (WHCM). Setting `outline: transparent` is one easy way to visually remove the default `outline` but still have it present in WHCM.

To simplify its checks, it depends on the [`length-zero-no-unit`](https://stylelint.io/user-guide/rules/list/length-zero-no-unit/) rule to also be used.

Example usage:

```js
module.exports = {
	plugins: ['./stylelint-rules/no-removed-outlines.js'],
	rules: {
		'digital-plugin/no-removed-outlines': [true, { reportDisables: true }],
		'length-zero-no-unit': true /* needed by digital-plugin/no-removed-outlines */,
	},
}
```

Related resources:

- [Styling for Windows high contrast with new standards for forced colors](https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/), Microsoft Edge Team
- [Quick Tips for High Contrast Mode](https://sarahmhigley.com/writing/whcm-quick-tips), Sarah Higley
- [Maintaining Focus Outlines for Windows High Contrast Mode](https://benmyers.dev/blog/whcm-outlines/), Ben Myers
- [Use transparent borders and outlines to assist with high contrast mode](https://piccalil.li/quick-tip/use-transparent-borders-and-outlines-to-assist-with-high-contrast-mode/), Andy Bell
- [The Guide To Windows High Contrast Mode](https://www.smashingmagazine.com/2022/06/guide-windows-high-contrast-mode/), Cristian Díaz on Smashing Magazine

## `no-undeclared-hds-color-tokens`

The `no-undeclared-hds-color-tokens` rule checks for references to custom CSS properties that start with `--token-color`. This is the prefix of custom CSS properties defined in the HashiCorp Design System that are intended to be used as color tokens. This rule gives more confidence that when tokens are removed or renamed at the source, they will no longer be referenced in the app. It also helps catch typos in token names.

This rule requires one option:

- `tokensSource`: a string of the source that defines the custom CSS properties

Example usage:

```js
const fs = require('fs')

const tokensFileName =
	'@hashicorp/design-system-tokens/dist/devdot/css/tokens.css'
const tokensFile = require.resolve(tokensFileName)
const tokensFileContent = fs.readFileSync(tokensFile).toString()

module.exports = {
	plugins: ['./stylelint-rules/no-undeclared-hds-color-tokens.js'],
	rules: {
		'digital-plugin/no-undeclared-hds-color-tokens': [
			true,
			{ tokensSource: tokensFileContent },
		],
	},
}
```
