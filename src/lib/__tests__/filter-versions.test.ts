/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import '@testing-library/jest-dom/extend-expect'
import terraformVersionsFixture from './__fixtures__/terraform-versions.json'
import filterVersions from '../filter-versions'

describe('Filter versions', () => {
	const correctResultKeys = [
		'1.6.3',
		'1.5.7',
		'1.4.7',
		'1.3.10',
		'1.2.9',
		'1.1.9',
		'1.0.11',
	]
	const versionRange = '>=1.0.11'
	test('terraform versions are in the correct order', () => {
		const results = filterVersions(terraformVersionsFixture, versionRange)
		const resultsKeys = Object.keys(results)
		expect(resultsKeys).toEqual(correctResultKeys)
	})
})
