/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import TEST_CASES from '../_test-cases'
import isBoolean from '../is-boolean'

describe('stylelint-rules/lib/isBoolean', () => {
	test.each(TEST_CASES)(
		'isString($testValue) returns $expectedResult.isBoolean',
		({ testValue, expectedResult }) => {
			expect(isBoolean(testValue)).toBe(expectedResult.isBoolean)
		}
	)
})
