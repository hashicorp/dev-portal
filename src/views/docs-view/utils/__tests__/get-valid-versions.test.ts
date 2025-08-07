/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi } from 'vitest'
import { getValidVersions } from '../get-valid-versions'

// Mock fetch
global.fetch = vi.fn() as typeof fetch

describe('getValidVersions', () => {
	const fullPath = 'doc#/path/to/document'
	const productSlugForLoader = 'product-slug'

	it('should return an empty array if versions are falsy or empty', async () => {
		expect(await getValidVersions([], fullPath, productSlugForLoader)).toEqual(
			[]
		)
		expect(
			await getValidVersions(
				undefined,
				fullPath,
				productSlugForLoader
			)
		).toEqual([])
	})
})
