/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const { lint } = require('stylelint')
const { messages, ruleName } = require('../no-undeclared-hds-color-tokens')

const config = {
	plugins: ['./stylelint-rules/no-undeclared-hds-color-tokens.js'],
	rules: {
		[ruleName]: [
			true,
			{
				tokensSource:
					':root { --token-color-not-made-up: red; --token-color-should-be-found: orange; --token-color-one-more: yellow; }',
			},
		],
	},
}

const testCases = [
	['--token-color-this-is-made-up', 2, 0],
	['--token-color-this-is-also-made-up', 2, 0],
	['--token-color-this-is-yet-another-made-up', 2, 0],
	['--token-color-not-made-up', 0, 0],
	['--token-color-should-be-found', 0, 0],
	['--token-color-one-more', 0, 0],
]

describe(ruleName, () => {
	test.each(testCases)(
		'%p gives %p warnings and %p parseErrors',
		async (testCase, expectedWarningsCount, expectedParseErrorsCound) => {
			const testCode = `.test { color: var(${testCase}); border: 1px solid var(${testCase}); }`
			const {
				results: [{ warnings, parseErrors }],
			} = await lint({
				code: testCode,
				config,
			})

			expect(warnings).toHaveLength(expectedWarningsCount)
			expect(parseErrors).toHaveLength(expectedParseErrorsCound)

			if (expectedWarningsCount > 0) {
				const [{ line, column, text }] = warnings
				expect(line).toBe(1)
				expect(column).toBe(testCode.indexOf(testCase) + 1)
				expect(text).toBe(messages.undeclared(testCase))
			}
		}
	)
})
