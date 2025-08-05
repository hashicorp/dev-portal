/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { describe, it, expect, vi, type MockedFunction, beforeEach, afterEach } from 'vitest'
import { getValidVersions } from '../get-valid-versions'
import type { VersionSelectItem } from '../../loaders/remote-content'
import { vol } from 'memfs'
import { type Redirect } from 'next'
import { resolve } from 'path'
import { pathToRegexp } from 'path-to-regexp'
vi.mock('fs')

// Mock fetch
global.fetch = vi.fn() as typeof fetch

describe('getValidVersions', () => {
	beforeEach(() => {
		const mockRedirectData: Record<'*', Record<string, Redirect>> = {
			"*": {}
		}
		vol.fromJSON({
			[`${resolve('src/data/_redirects.generated.json')}`]: JSON.stringify(mockRedirectData),
		})
	})
	afterEach(() => {
		vol.reset()
		vi.clearAllMocks()
		vi.restoreAllMocks()
	})
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
	const productSlugForLoader = vi.hoisted(() => 'product-slug')

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
		const knownVersions = [versions[0].version]
		;(fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce({
			json: async () => ({ versions: knownVersions }),
		} as unknown as Response)

		const [result] = await getValidVersions(
			versions,
			fullPath,
			productSlugForLoader
		)
		expect(result).toEqual({
			...versions[0],
			href: null,
		})
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

	it('finds additional versions via redirect', async () => {
		const oldUrl = 'docs/platform/aws/run'
		const newUrl = 'docs/deploy/aws/run'
		const mockRedirectData: Record<'*', Record<string, Redirect>> = {
			"*": {
				[`/${productSlugForLoader}/${oldUrl}`]: {
					destination: `/${productSlugForLoader}/${newUrl}`,
					permanent: true
				}
			}
		}
		vol.fromJSON({
			[`${resolve('src/data/_redirects.generated.json')}`]: JSON.stringify(mockRedirectData),
		})

		;(fetch as $TSFixMe)
			.mockImplementation((url: URL) => {
				return Promise.resolve({
					json: async () => {
						const path = url.searchParams.get('fullPath')
						if(path.includes(oldUrl)) {
							return { versions: [versions[0].version] } // Simulate finding the old version
						} else if(path.includes(newUrl)) {
							return { versions: [versions[1].version] } // Simulate finding the new version
						}
						return { versions: [] } // No versions found for this path
					},
				})
			})

		const result = await getValidVersions(
			versions,
			`doc#${newUrl}`,
			productSlugForLoader
		)
		expect(result).toEqual([
			{
				...versions[0],
				href: `/${productSlugForLoader}/${oldUrl}`,
			},
			{
				...versions[1],
				href: null,
			},
		])
	})

	it('only adds paths for versions that were discovered via redirect', async () => {
		const oldUrl = vi.hoisted(() => 'docs/platform/aws/run')
		const newUrl = vi.hoisted(() => 'docs/deploy/aws/run')
		vi.mock('@build-libs/redirects', () => ({
			redirectsConfig: async () => ({
					complexRedirects: [
						{
							source:  `/${productSlugForLoader}/docs/platform/aws/:slug(.*)`,
							destination: `/${productSlugForLoader}/docs/deploy/aws/:slug`,
							permanent: true
						},
					],
			})
		}))
		;(fetch as $TSFixMe)
			.mockImplementation((url: URL) => {
				return Promise.resolve({
					json: async () => {
						const path = url.searchParams.get('fullPath')
						if(path.includes(oldUrl)) {
							return { versions: [versions[0].version] }
						} else if(path.includes(newUrl)) {
							return { versions: [versions[1].version] }
						}
						return { versions: [] }
					},
				})
			})

		const result = await getValidVersions(
			versions,
			`doc#${newUrl}`,
			productSlugForLoader
		)
		// expect(result[0].href).toBe(`/${productSlugForLoader}/${oldUrl}`)
		// expect(result[1].href).toBe(null)
	})
})
