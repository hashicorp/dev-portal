/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { fullPathFromRelativeHref } from '../prepare-nav-data-for-client'

describe('fullPathFromRelativeHref', () => {
	it('handles hrefs where the first path part is the current product', () => {
		const basePaths = ['sentinel', 'docs']
		const href = '/sentinel/something-else'
		const expected = '/sentinel/something-else'
		expect(fullPathFromRelativeHref(href, basePaths)).toEqual(expected)
	})

	it('handles hrefs where the first path part is not exactly the current product', () => {
		const basePaths = ['vagrant', 'docs']
		const href = '/vagrant-cloud'
		const expected = '/vagrant/vagrant-cloud'
		expect(fullPathFromRelativeHref(href, basePaths)).toEqual(expected)
	})

	it('handles hrefs that start a leading slash', () => {
		const basePaths = ['vault', 'docs']
		const href = '/something-else'
		const expected = '/vault/something-else'
		expect(fullPathFromRelativeHref(href, basePaths)).toEqual(expected)
	})

	it('handles hrefs that do not start with a leading slash', () => {
		const basePaths = ['terraform', 'plugin']
		const href = 'sdkv2'
		const expected = '/terraform/plugin/sdkv2'
		expect(fullPathFromRelativeHref(href, basePaths)).toEqual(expected)
	})
})
