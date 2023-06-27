/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getUrlWithDimensions } from '..'

const probeDimensions = { width: '500', height: '300' }

// Mock the external call to get dimensions
jest.mock('probe-image-size', () => {
	return jest.fn(() => {
		return probeDimensions
	})
})

describe('remarkPluginInjectImageDimensions', () => {
	it('does not rewrite if width/ height already defined', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png?width=700&height=700`
		const url = await getUrlWithDimensions(src)

		expect(url).toEqual(src)
	})

	it('adds dimensions to src url', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png`
		const url = await getUrlWithDimensions(src)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
	})

	it('passes through hash to src url', async () => {
		const src = `https://content.hashicorp.com/api/assets/img/themed/test.png#hide-on-dark`
		const url = await getUrlWithDimensions(src)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
		expect(url).toContain(`#hide-on-dark`)
	})
})
