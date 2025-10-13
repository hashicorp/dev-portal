/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import '@testing-library/jest-dom/vitest'
import { unflatten } from 'flat'
import { loadHashiConfigForEnvironment } from '../config'

// Mock the unified docs supported-products API
const originalFetch = global.fetch
vi.spyOn(global, 'fetch').mockImplementation((url) => {
	if (url.includes(`${process.env.UNIFIED_DOCS_API}/api/supported-products`)) {
		return Promise.resolve({
			ok: true,
			json: async () => {
				const config = await import('../config/production.json',
					{ assert: { type: 'json' } }
				)

				return Promise.resolve({
					result: config.flags.unified_docs_migrated_repos
				})
			},
		})
	}

	return originalFetch(url)
})

global.__config = unflatten(await loadHashiConfigForEnvironment())

// Mock HTMLCanvasElement.getContext to prevent jsdom errors in tests
if (typeof HTMLCanvasElement !== 'undefined') {
	HTMLCanvasElement.prototype.getContext = () => {
		return {}
	}
}
