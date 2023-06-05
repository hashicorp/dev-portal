/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * An array of objects. Each object has two properties. The `testValue` property
 * is the value to be tested. The `expectedResult` property is an object
 * representing expected results for each test value. The object has an entry
 * for each function defined in `stylelint-rules/lib`.
 */
const TEST_CASES = [
	{
		testValue: true,
		expectedResult: {
			isBoolean: true,
			isString: false,
		},
	},
	{
		testValue: false,
		expectedResult: {
			isBoolean: true,
			isString: false,
		},
	},
	{
		testValue: undefined,
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: null,
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: '',
		expectedResult: {
			isBoolean: false,
			isString: true,
		},
	},
	{
		testValue: 'test',
		expectedResult: {
			isBoolean: false,
			isString: true,
		},
	},
	{
		testValue: 12345,
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: {},
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: { test: 12345 },
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: [],
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
	{
		testValue: [1, 2, 3, 4, 5],
		expectedResult: {
			isBoolean: false,
			isString: false,
		},
	},
]

export default TEST_CASES
