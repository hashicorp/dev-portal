/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, type MockedFunction } from 'vitest'
import { getValidVersions } from '../get-valid-versions'
import type { VersionSelectItem } from '../../loaders/remote-content'

// Mock fetch
global.fetch = vi.fn() as typeof fetch

describe('getValidVersions', () => {
	const versions: VersionSelectItem[] = [
		{
			version: '1.0.0',
			label: 'v1.0.0',
			name: 'v1.0.0',
			isLatest: false,
			releaseStage: 'stable',
		},
		{
			version: '2.0.0',
			label: 'v2.0.0',
			name: 'v2.0.0',
			isLatest: true,
			releaseStage: 'stable',
		},
	]
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

	it('should return filtered versions based on known versions from API', async () => {
		const knownVersions = ['1.0.0']
		;(fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => ({ versions: knownVersions }),
		} as unknown as Response)

		const result = await getValidVersions(
			versions,
			fullPath,
			productSlugForLoader
		)
		expect(result).toEqual([
			{
				isLatest: false,
				label: 'v1.0.0',
				name: 'v1.0.0',
				releaseStage: 'stable',
				version: '1.0.0',
			},
		])
	})

	it('should return all versions if API call fails', async () => {
		// Temporarily mock console.error
		const originalConsoleError = console.error
		console.error = vi.fn()

		try {
			;(fetch as MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API error'))

			const result = await getValidVersions(
				versions,
				fullPath,
				productSlugForLoader
			)
			expect(result).toEqual(versions)
		} finally {
			// Restore console.error after the test
			console.error = originalConsoleError
		}
	})

	it('should log an error if API call fails', async () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {})
		;(fetch as MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API error'))

		await getValidVersions(versions, fullPath, productSlugForLoader)
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			`[docs-view/server] error fetching known versions for "${productSlugForLoader}" document "${fullPath}". Falling back to showing all versions.`,
			expect.any(Error)
		)

		consoleErrorSpy.mockRestore()
	})
})
