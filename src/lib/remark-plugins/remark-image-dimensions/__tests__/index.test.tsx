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
	it('wont add width / height if no protocol in src', async () => {
		const source = `/img/themed/test.png`
		const url = await getUrlWithDimensions(source)

		expect(url).toBe(undefined)
	})

	it('adds dimensions when protocol is in src', async () => {
		const source = `https://content.hashicorp.com/api/assets/img/themed/test-placeholder.png`
		const url = await getUrlWithDimensions(source)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
	})

	it('passes through hash', async () => {
		const source = `https://content.hashicorp.com/api/assets/img/themed/test.png#hide-on-dark`
		const url = await getUrlWithDimensions(source)

		expect(url).toContain(`width=${probeDimensions.width}`)
		expect(url).toContain(`height=${probeDimensions.height}`)
		expect(url).toContain(`#hide-on-dark`)
	})
})
