/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import TEST_CASES from '../_test-cases'
import isString from '../is-string'

describe('stylelint-rules/lib/isString', () => {
	test.each(TEST_CASES)(
		'isString($testValue) returns $expectedResult.isString',
		({ testValue, expectedResult }) => {
			expect(isString(testValue)).toBe(expectedResult.isString)
		}
	)
})
