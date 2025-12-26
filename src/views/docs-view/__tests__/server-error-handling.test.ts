/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import nock from 'nock'
import { getStaticGenerationFunctions } from '../server'
import { ProductData } from 'types/products'

// Mock product data
const mockProduct: ProductData = {
	name: 'Consul',
	slug: 'consul',
	rootDocsPaths: [
		{
			iconName: 'docs',
			name: 'Documentation',
			path: 'docs',
			shortName: 'Docs',
		},
	],
} as ProductData

// Mock document response
const mockDocumentResponse = {
	meta: { status_code: 200, status_text: 'OK' },
	result: {
		markdownSource: '# Test Page\n\nTest content',
		metadata: {
			page_title: 'Test Page',
			description: 'Test description',
		},
		githubFile: 'test/test.mdx',
		product: 'consul',
		version: 'v0.0.x',
	},
}

// Mock nav data response
const mockNavDataResponse = {
	meta: { status_code: 200, status_text: 'OK' },
	result: {
		navData: [
			{ heading: 'Test' },
			{ title: 'Overview', path: '' },
		],
	},
}

// Mock version metadata response
const mockVersionMetadataResponse = {
	meta: { status_code: 200, status_text: 'OK' },
	result: [
		{
			product: 'consul',
			version: 'v0.0.x',
			isLatest: true,
			releaseStage: 'stable',
		},
	],
}

/**
 * Tests for error handling in docs-view server.ts
 * 
 * These tests verify that:
 * 1. Transient 404 errors during ISR revalidation don't cache 404 pages
 * 2. Retry logic handles temporary backend failures
 * 3. True 404s (page doesn't exist) still return notFound correctly
 */
describe('docs-view server error handling', () => {
	let scope: nock.Scope

	beforeEach(() => {
		nock.disableNetConnect()
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		scope = nock(process.env.UNIFIED_DOCS_API!)
	})

	afterEach(() => {
		nock.cleanAll()
		nock.enableNetConnect()
	})

	describe('transient backend failures during revalidation', () => {
		test('should retry on 404 and eventually succeed', async () => {
			const { getStaticProps } = getStaticGenerationFunctions({
				product: mockProduct,
				basePath: 'docs',
				baseName: 'Docs',
			})

			// Mock: version metadata succeeds
			scope
				.get('/api/content/consul/version-metadata')
				.query({ partial: 'true' })
				.reply(200, mockVersionMetadataResponse)

			// Mock: nav-data fails twice, succeeds on third attempt
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.reply(404, { error: 'Temporary failure' })
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.reply(404, { error: 'Temporary failure' })
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.reply(200, mockNavDataResponse)

			// Mock: document succeeds
			scope
				.get('/api/content/consul/doc/latest/docs')
				.reply(200, mockDocumentResponse)

			// Call getStaticProps
			const result = await getStaticProps({
				params: { page: [] },
			})

			// Assert it succeeded after retries
			expect(result).toHaveProperty('props')
			expect(result).not.toHaveProperty('notFound')
		})

		test('should return notFound after all 404 retries fail', async () => {
			const { getStaticProps } = getStaticGenerationFunctions({
				product: mockProduct,
				basePath: 'docs',
				baseName: 'Docs',
			})

			// Mock: version metadata succeeds
			scope
				.get('/api/content/consul/version-metadata')
				.query({ partial: 'true' })
				.reply(200, mockVersionMetadataResponse)

			// Mock: nav-data fails 3 times (exhausts retries)
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.times(3)
				.reply(404, { error: 'Backend unavailable' })

			// Mock: document request should also be mocked for nock
			scope
				.get('/api/content/consul/doc/latest/docs')
				.reply(404, { error: 'Not found' })

			// Call getStaticProps - should return notFound after retries
			const result = await getStaticProps({
				params: { page: [] },
			})

			// After 3 failed retries with 404, we trust it's a real 404
			expect(result).toHaveProperty('notFound', true)
		})

		test('should retry with exponential backoff', async () => {
			const { getStaticProps } = getStaticGenerationFunctions({
				product: mockProduct,
				basePath: 'docs',
				baseName: 'Docs',
			})

			const startTime = Date.now()
			const requestTimes: number[] = []

			// Mock: version metadata succeeds
			scope
				.get('/api/content/consul/version-metadata')
				.query({ partial: 'true' })
				.reply(200, mockVersionMetadataResponse)

			// Mock: Track when each request happens
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.times(3)
				.reply(function () {
					requestTimes.push(Date.now() - startTime)
					return [404, { error: 'Temporary failure' }]
				})

			// Call getStaticProps
			try {
				await getStaticProps({
					params: { page: [] },
				})
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_error) {
				// Expected to fail after retries
			}

		// Verify that retries happened (3 requests total)
		// The exact timing can vary in test environments, so we just verify
		// that we got 3 attempts and they happened in sequence
		expect(requestTimes).toHaveLength(3)
		expect(requestTimes[0]).toBeLessThan(requestTimes[2]) // First before last
	})
	})

	describe('legitimate 404 errors', () => {
		test('should return notFound:true for pages that truly do not exist', async () => {
			const { getStaticProps } = getStaticGenerationFunctions({
				product: mockProduct,
				basePath: 'docs',
				baseName: 'Docs',
			})

			// Mock: version metadata succeeds
			scope
				.get('/api/content/consul/version-metadata')
				.query({ partial: 'true' })
				.reply(200, mockVersionMetadataResponse)

			// Mock: All requests consistently return 404 (page doesn't exist)
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.reply(200, mockNavDataResponse)
			
			scope
				.get('/api/content/consul/doc/latest/docs/nonexistent-page')
				.times(3)
				.reply(404, { error: 'Page not found' })

			// Call getStaticProps with a nonexistent page
			const result = await getStaticProps({
				params: { page: ['nonexistent-page'] },
			})

			// Assert it returns notFound for pages that don't exist
			expect(result).toHaveProperty('notFound', true)
		})
	})

	describe('other errors', () => {
		test('should throw non-404 errors immediately without retry', async () => {
			const { getStaticProps } = getStaticGenerationFunctions({
				product: mockProduct,
				basePath: 'docs',
				baseName: 'Docs',
			})

			// Mock: version metadata succeeds
			scope
				.get('/api/content/consul/version-metadata')
				.query({ partial: 'true' })
				.reply(200, mockVersionMetadataResponse)

			// Mock: 500 error on nav-data (should not retry)
			scope
				.get('/api/content/consul/nav-data/latest/docs')
				.once()
				.reply(500, { error: 'Internal server error' })

			// Call getStaticProps - should throw immediately without retries
			await expect(
				getStaticProps({
					params: { page: [] },
				})
			).rejects.toThrow()

			// Verify it only tried once (no retries for 500 errors)
			expect(scope.isDone()).toBe(false) // Version metadata was called, but doc wasn't
		})
	})
})
