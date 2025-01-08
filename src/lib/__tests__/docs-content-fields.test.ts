import { describe, it, expect, vi } from 'vitest'
import { allDocsFields } from '../sitemap/docs-content-fields'

// vi.mock('../sitemap/helpers', () => ({
// 	makeSitemapField: vi.fn((args) => args),
// }))

describe('allDocsFields', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should fetch and return all docs fields from content API when unified-docs-sandbox is not set', async () => {
		process.env.HASHI_ENV = 'production'
		process.env.MKTG_CONTENT_DOCS_API = 'https://content-api.example.com'
		const mockContentAPIDocsResult = [
			{ path: 'doc1', created_at: '2025-01-07T18:44:51.431Z' },
			{ path: 'doc2', created_at: '2025-01-07T18:44:51.431Z' },
		]
		global.fetch = vi.fn().mockResolvedValue({
			json: vi.fn().mockResolvedValue({ result: mockContentAPIDocsResult }),
		})

		const result = await allDocsFields()

		expect(fetch).toHaveBeenCalledWith(
			'https://content-api.example.com/api/all-docs-paths'
		)
		expect(result).toEqual(
			mockContentAPIDocsResult.map((page) => ({
				loc: `https://developer.hashicorp.com/${page.path}`,
				lastmod: page.created_at,
				priority: 1,
				changefreq: 'daily',
			}))
		)
	})

	it('should fetch and return all docs fields from both content API and UDR when unified-docs-sandbox is set', async () => {
		process.env.HASHI_ENV = 'unified-docs-sandbox'
		process.env.MKTG_CONTENT_DOCS_API = 'https://content-api.example.com'
		process.env.UNIFIED_DOCS_API = 'https://udr-api.example.com'
		__config.flags = {
			enable_datadog: false,
			enable_io_beta_cta: false,
			enable_hvd_on_preview_branch: false,
			unified_docs_migrated_repos: ['repo1', 'repo2'],
		}
		const mockContentAPIDocsResult = [
			{ path: 'doc1', created_at: '2025-01-07T18:44:51.431Z' },
			{ path: 'doc2', created_at: '2025-01-07T18:44:51.431Z' },
		]
		const mockUDRDocsResult = [
			{ path: 'udr-doc1', created_at: '2025-01-07T18:44:51.431Z' },
			{ path: 'udr-doc2', created_at: '2023-01-04' },
		]
		global.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				json: vi.fn().mockResolvedValue({ result: mockContentAPIDocsResult }),
			})
			.mockResolvedValueOnce({
				json: vi.fn().mockResolvedValue({ result: mockUDRDocsResult }),
			})

		const result = await allDocsFields()

		expect(fetch).toHaveBeenCalledWith(
			'https://content-api.example.com/api/all-docs-paths?filterOut=repo1&filterOut=repo2'
		)
		expect(fetch).toHaveBeenCalledWith(
			'https://udr-api.example.com/api/all-docs-paths?products=repo1&products=repo2'
		)
		expect(result).toEqual(
			[...mockContentAPIDocsResult, ...mockUDRDocsResult].map((page) => ({
				loc: `https://developer.hashicorp.com/${page.path}`,
				lastmod: page.created_at,
				priority: 1,
				changefreq: 'daily',
			}))
		)
	})
})
