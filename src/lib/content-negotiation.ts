/**
 * Copyright IBM Corp. 2026
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * URL path prefixes that serve documentation content (DocsView pages backed
 * by markdown from the unified-docs API). Used by middleware to detect which
 * requests are eligible for content negotiation (Accept: text/markdown).
 *
 * This list covers all catch-all routes using DocsView /
 * getRootDocsPathGenerationFunctions. It intentionally excludes:
 *   - OpenAPI docs (/hcp/api-docs/*) — rendered from OpenAPI specs, not markdown
 *   - Tutorials (/:product/tutorials/*) — different content pipeline
 *   - Non-doc pages (sign-up, certifications, etc.)
 */
export const MARKDOWN_DOCS_PREFIXES: string[] = [
	// Boundary
	'/boundary/docs',
	'/boundary/api-docs',

	// Consul
	'/consul/docs',
	'/consul/api-docs',
	'/consul/commands',

	// HCP
	'/hcp/docs',

	// Nomad
	'/nomad/docs',
	'/nomad/api-docs',
	'/nomad/commands',
	'/nomad/plugins',
	'/nomad/tools',

	// Packer
	'/packer/docs',
	'/packer/guides',

	// Sentinel
	'/sentinel/docs',

	// Terraform
	'/terraform/cdktf',
	'/terraform/cli',
	'/terraform/cloud-docs',
	'/terraform/docs',
	'/terraform/enterprise',
	'/terraform/internals',
	'/terraform/intro',
	'/terraform/language',
	'/terraform/mcp-server',
	'/terraform/migrate',
	'/terraform/plugin',
	'/terraform/registry',

	// Vagrant
	'/vagrant/docs',
	'/vagrant/intro',
	'/vagrant/vagrant-cloud',

	// Vault
	'/vault/docs',
	'/vault/api-docs',

	// Waypoint
	'/waypoint/docs',

	// Well-Architected Framework
	'/well-architected-framework',
]

/**
 * Mapping from URL path segments to unified-docs API parameters.
 *
 * Most routes follow the default convention where:
 *   URL: /{productSlug}/{basePath}/...
 *   API: /api/content/{productSlug}/doc/latest/{basePath}/...
 *
 * Some routes override the product slug or base path used for the API call.
 * For example, /terraform/cloud-docs/... fetches from the
 * "terraform-docs-common" product in the unified-docs API, and
 * /well-architected-framework/... maps to basePath "docs".
 *
 * These overrides mirror the productSlugForLoader / basePathForLoader values
 * defined in the product JSON data files (src/data/*.json).
 */
export interface DocsRouteMapping {
	/** URL prefix to match (e.g., "/terraform/cli") */
	urlPrefix: string
	/** Product slug for the unified-docs API (overrides the URL product slug) */
	apiProductSlug: string
	/** Base path for the unified-docs API (overrides the URL base path) */
	apiBasePath: string
}

/**
 * Route mappings for paths that override the default URL-to-API mapping.
 * Routes NOT listed here use the default convention:
 *   apiProductSlug = first URL segment, apiBasePath = second URL segment
 */
export const DOCS_ROUTE_OVERRIDES: DocsRouteMapping[] = [
	// Terraform overrides (content split across many repos)
	{
		urlPrefix: '/terraform/cdktf',
		apiProductSlug: 'terraform-cdk',
		apiBasePath: 'cdktf',
	},
	{
		urlPrefix: '/terraform/cloud-docs/agents',
		apiProductSlug: 'terraform-docs-agents',
		apiBasePath: 'cloud-docs/agents',
	},
	{
		urlPrefix: '/terraform/cloud-docs',
		apiProductSlug: 'terraform-docs-common',
		apiBasePath: 'cloud-docs',
	},
	{
		urlPrefix: '/terraform/docs',
		apiProductSlug: 'terraform-docs-common',
		apiBasePath: 'docs',
	},
	{
		urlPrefix: '/terraform/enterprise',
		apiProductSlug: 'terraform-enterprise',
		apiBasePath: 'enterprise',
	},
	{
		urlPrefix: '/terraform/mcp-server',
		apiProductSlug: 'terraform-mcp-server',
		apiBasePath: 'mcp-server',
	},
	{
		urlPrefix: '/terraform/migrate',
		apiProductSlug: 'terraform-migrate',
		apiBasePath: 'migrate',
	},
	// plugin/* sub-paths must come before /terraform/plugin
	{
		urlPrefix: '/terraform/plugin/framework',
		apiProductSlug: 'terraform-plugin-framework',
		apiBasePath: 'plugin/framework',
	},
	{
		urlPrefix: '/terraform/plugin/log',
		apiProductSlug: 'terraform-plugin-log',
		apiBasePath: 'plugin/log',
	},
	{
		urlPrefix: '/terraform/plugin/mux',
		apiProductSlug: 'terraform-plugin-mux',
		apiBasePath: 'plugin/mux',
	},
	{
		urlPrefix: '/terraform/plugin/sdkv2',
		apiProductSlug: 'terraform-plugin-sdk',
		apiBasePath: 'plugin/sdkv2',
	},
	{
		urlPrefix: '/terraform/plugin/testing',
		apiProductSlug: 'terraform-plugin-testing',
		apiBasePath: 'plugin/testing',
	},
	{
		urlPrefix: '/terraform/plugin',
		apiProductSlug: 'terraform-docs-common',
		apiBasePath: 'plugin',
	},
	{
		urlPrefix: '/terraform/registry',
		apiProductSlug: 'terraform-docs-common',
		apiBasePath: 'registry',
	},

	// HCP override
	{
		urlPrefix: '/hcp/docs',
		apiProductSlug: 'hcp-docs',
		apiBasePath: 'docs',
	},

	// Well-Architected Framework (URL has no basePath, API uses "docs")
	{
		urlPrefix: '/well-architected-framework',
		apiProductSlug: 'well-architected-framework',
		apiBasePath: 'docs',
	},
]

/**
 * Resolve a URL pathname to the unified-docs API parameters.
 *
 * @returns { apiProductSlug, apiBasePath, remainingPath } or null if the
 *          pathname does not match any known docs route.
 */
export function resolveDocsRoute(pathname: string): {
	apiProductSlug: string
	apiBasePath: string
	remainingPath: string
	urlProductSlug: string
} | null {
	// Check overrides first (sorted so longer prefixes match before shorter ones)
	for (const override of DOCS_ROUTE_OVERRIDES) {
		if (
			pathname === override.urlPrefix ||
			pathname.startsWith(override.urlPrefix + '/')
		) {
			const remainingPath = pathname
				.slice(override.urlPrefix.length)
				.replace(/^\//, '')
			const urlProductSlug = pathname.split('/')[1]
			return {
				apiProductSlug: override.apiProductSlug,
				apiBasePath: override.apiBasePath,
				remainingPath,
				urlProductSlug,
			}
		}
	}

	// Default convention: /{productSlug}/{basePath}/...
	// apiProductSlug = productSlug, apiBasePath = basePath
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length < 2) {
		return null
	}

	const [productSlug, basePath, ...rest] = segments
	return {
		apiProductSlug: productSlug,
		apiBasePath: basePath,
		remainingPath: rest.join('/'),
		urlProductSlug: productSlug,
	}
}
