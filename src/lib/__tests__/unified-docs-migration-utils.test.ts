/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

vi.stubEnv('UNIFIED_DOCS_API', 'env-value-UNIFIED_DOCS_API')

import { vi } from 'vitest'
import { getContentApiBaseUrl } from '../unified-docs-migration-utils'

describe('getContentApiBaseUrl', () => {
	it('returns the expected API URL for a non-migrated repo', () => {
		// Stub env
		vi.stubEnv('MKTG_CONTENT_DOCS_API', 'http://www.old-content-api.com')
		// Stub config
		vi.stubGlobal('__config', {
			flags: { unified_docs_migrated_repos: [] },
		})
		// Assert that we get the expected env with the stubbed config
		const result = getContentApiBaseUrl('terraform')
		expect(result).toBe('http://www.old-content-api.com')
		// Cleanup
		vi.unstubAllEnvs()
		vi.unstubAllGlobals()
	})

	it('returns the expected API URL for a migrated repo', () => {
		// Stub env
		vi.stubEnv('UNIFIED_DOCS_API', 'http://www.unified-content-api.com')
		// Stub config
		vi.stubGlobal('__config', {
			flags: { unified_docs_migrated_repos: ['terraform'] },
		})
		// Assert that we get the expected env with the stubbed config
		const result = getContentApiBaseUrl('terraform')
		expect(result).toBe('http://www.unified-content-api.com')
		// Cleanup
		vi.unstubAllEnvs()
		vi.unstubAllGlobals()
	})
})
