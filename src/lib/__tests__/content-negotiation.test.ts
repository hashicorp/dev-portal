/**
 * Copyright IBM Corp. 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	resolveDocsRoute,
	MARKDOWN_DOCS_PREFIXES,
	DOCS_ROUTE_OVERRIDES,
} from 'lib/content-negotiation'

describe('content-negotiation', () => {
	describe('resolveDocsRoute', () => {
		it('returns null for non-docs paths', () => {
			expect(resolveDocsRoute('/sign-up')).toBeNull()
			expect(resolveDocsRoute('/')).toBeNull()
			expect(resolveDocsRoute('/terraform/tutorials/intro')).toEqual({
				apiProductSlug: 'terraform',
				apiBasePath: 'tutorials',
				remainingPath: 'intro',
				urlProductSlug: 'terraform',
			})
		})

		it('resolves default (non-overridden) paths', () => {
			expect(resolveDocsRoute('/consul/commands/agent')).toEqual({
				apiProductSlug: 'consul',
				apiBasePath: 'commands',
				remainingPath: 'agent',
				urlProductSlug: 'consul',
			})
		})

		it('resolves default paths with nested segments', () => {
			expect(resolveDocsRoute('/vault/docs/auth/token')).toEqual({
				apiProductSlug: 'vault',
				apiBasePath: 'docs',
				remainingPath: 'auth/token',
				urlProductSlug: 'vault',
			})
		})

		it('resolves default path with no remaining path', () => {
			expect(resolveDocsRoute('/consul/docs')).toEqual({
				apiProductSlug: 'consul',
				apiBasePath: 'docs',
				remainingPath: '',
				urlProductSlug: 'consul',
			})
		})

		it('resolves terraform overrides to correct API product slug', () => {
			expect(resolveDocsRoute('/terraform/cli/commands/init')).toEqual({
				apiProductSlug: 'terraform',
				apiBasePath: 'cli',
				remainingPath: 'commands/init',
				urlProductSlug: 'terraform',
			})

			expect(resolveDocsRoute('/terraform/cdktf/concepts')).toEqual({
				apiProductSlug: 'terraform-cdk',
				apiBasePath: 'cdktf',
				remainingPath: 'concepts',
				urlProductSlug: 'terraform',
			})

			expect(resolveDocsRoute('/terraform/enterprise/install')).toEqual({
				apiProductSlug: 'terraform-enterprise',
				apiBasePath: 'enterprise',
				remainingPath: 'install',
				urlProductSlug: 'terraform',
			})

			expect(resolveDocsRoute('/terraform/docs/intro')).toEqual({
				apiProductSlug: 'terraform-docs-common',
				apiBasePath: 'docs',
				remainingPath: 'intro',
				urlProductSlug: 'terraform',
			})
		})

		it('resolves terraform/cloud-docs/agents before terraform/cloud-docs', () => {
			expect(resolveDocsRoute('/terraform/cloud-docs/agents/setup')).toEqual({
				apiProductSlug: 'terraform-docs-agents',
				apiBasePath: 'cloud-docs/agents',
				remainingPath: 'setup',
				urlProductSlug: 'terraform',
			})

			expect(
				resolveDocsRoute('/terraform/cloud-docs/workspaces')
			).toEqual({
				apiProductSlug: 'terraform-docs-common',
				apiBasePath: 'cloud-docs',
				remainingPath: 'workspaces',
				urlProductSlug: 'terraform',
			})
		})

		it('resolves terraform/plugin sub-paths before terraform/plugin', () => {
			expect(
				resolveDocsRoute('/terraform/plugin/framework/resources')
			).toEqual({
				apiProductSlug: 'terraform-plugin-framework',
				apiBasePath: 'plugin/framework',
				remainingPath: 'resources',
				urlProductSlug: 'terraform',
			})

			expect(resolveDocsRoute('/terraform/plugin/sdkv2/guides')).toEqual({
				apiProductSlug: 'terraform-plugin-sdk',
				apiBasePath: 'plugin/sdkv2',
				remainingPath: 'guides',
				urlProductSlug: 'terraform',
			})

			expect(resolveDocsRoute('/terraform/plugin/best-practices')).toEqual({
				apiProductSlug: 'terraform-docs-common',
				apiBasePath: 'plugin',
				remainingPath: 'best-practices',
				urlProductSlug: 'terraform',
			})
		})

		it('resolves HCP override', () => {
			expect(resolveDocsRoute('/hcp/docs/get-started')).toEqual({
				apiProductSlug: 'hcp-docs',
				apiBasePath: 'docs',
				remainingPath: 'get-started',
				urlProductSlug: 'hcp',
			})
		})

		it('resolves well-architected-framework with basePath override', () => {
			expect(
				resolveDocsRoute('/well-architected-framework/security')
			).toEqual({
				apiProductSlug: 'well-architected-framework',
				apiBasePath: 'docs',
				remainingPath: 'security',
				urlProductSlug: 'well-architected-framework',
			})
		})

		it('resolves well-architected-framework exact match (index page)', () => {
			expect(resolveDocsRoute('/well-architected-framework')).toEqual({
				apiProductSlug: 'well-architected-framework',
				apiBasePath: 'docs',
				remainingPath: '',
				urlProductSlug: 'well-architected-framework',
			})
		})
	})

	describe('MARKDOWN_DOCS_PREFIXES', () => {
		it('includes all expected product docs paths', () => {
			expect(MARKDOWN_DOCS_PREFIXES).toContain('/terraform/docs')
			expect(MARKDOWN_DOCS_PREFIXES).toContain('/vault/docs')
			expect(MARKDOWN_DOCS_PREFIXES).toContain('/consul/commands')
			expect(MARKDOWN_DOCS_PREFIXES).toContain('/well-architected-framework')
		})

		it('does not include non-docs paths', () => {
			const hasOpenApi = MARKDOWN_DOCS_PREFIXES.some((p) =>
				p.startsWith('/hcp/api-docs/')
			)
			expect(hasOpenApi).toBe(false)

			const hasTutorials = MARKDOWN_DOCS_PREFIXES.some((p) =>
				p.includes('/tutorials')
			)
			expect(hasTutorials).toBe(false)
		})

		it('prefix matching works correctly for middleware use case', () => {
			// Simulates the middleware matching logic
			const matches = (pathname: string) =>
				MARKDOWN_DOCS_PREFIXES.some(
					(prefix) =>
						pathname === prefix || pathname.startsWith(prefix + '/')
				)

			expect(matches('/terraform/docs/intro')).toBe(true)
			expect(matches('/terraform/docs')).toBe(true)
			expect(matches('/terraform/tutorials/intro')).toBe(false)
			expect(matches('/sign-up')).toBe(false)
			// Should not match partial prefix (e.g. /terraform/doc without the s)
			expect(matches('/terraform/doc')).toBe(false)
		})
	})

	describe('DOCS_ROUTE_OVERRIDES ordering', () => {
		it('lists cloud-docs/agents before cloud-docs', () => {
			const agentsIdx = DOCS_ROUTE_OVERRIDES.findIndex(
				(o) => o.urlPrefix === '/terraform/cloud-docs/agents'
			)
			const cloudDocsIdx = DOCS_ROUTE_OVERRIDES.findIndex(
				(o) => o.urlPrefix === '/terraform/cloud-docs'
			)
			expect(agentsIdx).toBeLessThan(cloudDocsIdx)
		})

		it('lists plugin/* sub-paths before plugin', () => {
			const frameworkIdx = DOCS_ROUTE_OVERRIDES.findIndex(
				(o) => o.urlPrefix === '/terraform/plugin/framework'
			)
			const pluginIdx = DOCS_ROUTE_OVERRIDES.findIndex(
				(o) => o.urlPrefix === '/terraform/plugin'
			)
			expect(frameworkIdx).toBeLessThan(pluginIdx)
		})
	})
})
