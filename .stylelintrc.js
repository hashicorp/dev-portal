/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fs = require('fs')

const tokensFileName =
	'@hashicorp/design-system-tokens/dist/devdot/css/tokens.css'
const tokensFile = require.resolve(tokensFileName)
const tokensFileContent = fs.readFileSync(tokensFile).toString()

const hdsplusTokensFileName =
	'@hashicorp/react-design-system-tokens/dist/css/tokens.css'
const hdsplusTokensFile = require.resolve(hdsplusTokensFileName)
const hdsplusTokensFileContent = fs.readFileSync(hdsplusTokensFile).toString()

module.exports = {
	extends: ['@hashicorp/platform-cli/config/stylelint.config'],
	plugins: [
		'./stylelint-rules/no-undeclared-hds-color-tokens.js',
		'./stylelint-rules/no-magic-nums.js',
		'./stylelint-rules/no-removed-outlines.js',
	],
	rules: {
		'digital-plugin/no-undeclared-hds-color-tokens': [
			true,
			{ tokensSource: tokensFileContent },
		],
		'digital-plugin/no-magic-nums': [
			true,
			{ tokensSource: hdsplusTokensFileContent },
		],
		'digital-plugin/no-removed-outlines': [true, { reportDisables: true }],
		'length-zero-no-unit': true /* needed by digital-plugin/no-removed-outlines */,
	},
}
