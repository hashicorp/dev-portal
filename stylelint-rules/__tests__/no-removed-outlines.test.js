/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const { lint } = require('stylelint')
const { messages, ruleName } = require('../no-removed-outlines')

const config = {
	plugins: ['./stylelint-rules/no-removed-outlines.js'],
	rules: {
		[ruleName]: true,
	},
}

const testCases = [
	'.test { outline: none; }',
	'.test { outline: 0; }',
	'.test { outline: magenta none; }', // color | style
	'.test { outline: none magenta; }', // style | color
	'.test { outline: none none; }', // style | width
	'.test { outline: magenta none none; }', // color | style | width
	'.test { outline: none magenta none; }', // style | color | width
	'.test { outline: none none magenta; }', // style | width | color
	'.test { outline-style: none; }',
	'.test { outline-style: 0; }',
	'.test { outline-width: none; }',
	'.test { outline-width: 0; }',
]

describe(ruleName, () => {
	test.each(testCases)('%p is invalid', async (testCase) => {
		const {
			results: [{ warnings, parseErrors }],
		} = await lint({
			code: testCase,
			config,
		})

		expect(warnings).toHaveLength(1)
		expect(parseErrors).toHaveLength(0)

		const [{ line, column, text }] = warnings
		expect(line).toBe(1)
		expect(column).toBe(testCase.indexOf('outline') + 1)
		expect(text).toBe(messages.error)
	})
})
