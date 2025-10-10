/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi } from 'vitest'
import { allDocsFields } from '../sitemap/docs-content-fields'

describe('allDocsFields', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should fetch and return all docs fields from both content API and UDR', async () => {
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

		const result = await allDocsFields(__config)

		expect(fetch).toHaveBeenCalledWith(
			'https://content-api.example.com/api/all-docs-paths?filterOut=repo1&filterOut=repo2'
		)
		expect(fetch).toHaveBeenCalledWith(
			'https://udr-api.example.com/api/all-docs-paths?products=repo1&products=repo2',
			{ headers: new Headers() }
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
