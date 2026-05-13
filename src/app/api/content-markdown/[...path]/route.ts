/**
 * Copyright IBM Corp. 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { resolveMarkdownContentRoute } from 'lib/content-negotiation'
import { getContentApiBaseUrl } from 'lib/unified-docs-migration-utils'

/**
 * Route handler that serves documentation content as plain markdown.
 *
 * This is the target of the middleware rewrite when a request includes
 * `Accept: text/markdown`. The middleware rewrites e.g.
 *   /terraform/cli/commands/init
 * to:
 *   /api/content-markdown/terraform/cli/commands/init
 *
 * The handler then:
 *   1. Resolves the URL to the correct unified-docs API call (accounting
 *      for product slug and base path overrides)
 *   2. Fetches the document JSON from the unified-docs API
 *   3. Returns the raw markdown with YAML frontmatter containing metadata
 *      that would otherwise only be visible on the HTML page (title,
 *      description, product, version)
 *
 * CDN caching: The `Vary: Accept` response header ensures that Vercel's
 * edge cache (and any upstream CDN) stores separate entries for HTML
 * and markdown responses to the same URL. Without this header, a cached
 * markdown response could be served to a browser requesting HTML, or
 * vice versa.
 *
 * MDX component tags (e.g. <Tabs>, <Note>, <CodeBlockConfig>) are left
 * intact in the markdown output. Agents generally handle these well, and
 * the content within them remains readable as plain text.
 */
export async function GET(
	_req: Request,
	{ params }: { params: { path: string[] } }
) {
	const { path: pathSegments } = params
	const pathname = '/' + pathSegments.join('/')

	// Resolve the URL pathname to unified-docs API parameters
	const route = resolveMarkdownContentRoute(pathname)
	if (!route) {
		return new Response('Not found', { status: 404 })
	}

	const { apiProductSlug, apiBasePath, remainingPath, urlProductSlug } = route

	// Build the unified-docs API URL.
	// The API supports "latest" as a version alias, which resolves server-side
	// to the concrete latest version (e.g. "v1.15.x").
	const contentApiBaseUrl = getContentApiBaseUrl(apiProductSlug)
	const fullDocPath = remainingPath
		? `doc/latest/${apiBasePath}/${remainingPath}`
		: `doc/latest/${apiBasePath}`
	const apiUrl = `${contentApiBaseUrl}/api/content/${apiProductSlug}/${fullDocPath}`

	const headers: Record<string, string> = {}
	if (process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN) {
		headers['x-vercel-protection-bypass'] =
			process.env.UDR_VERCEL_AUTH_BYPASS_TOKEN
	}

	let apiResponse: Response
	try {
		apiResponse = await fetch(apiUrl, { headers })
	} catch (error) {
		console.error(
			`[content-markdown] Failed to fetch from unified-docs API: ${apiUrl}`,
			error
		)
		return new Response('Internal server error', { status: 502 })
	}

	if (apiResponse.status === 404) {
		return new Response('Not found', { status: 404 })
	}

	if (apiResponse.status !== 200) {
		console.error(
			`[content-markdown] Unexpected status ${apiResponse.status} from: ${apiUrl}`
		)
		return new Response('Internal server error', { status: 502 })
	}

	let result: {
		markdownSource: string
		metadata: Record<string, unknown>
		version: string
		product: string
		fullPath: string
	}

	try {
		const json = await apiResponse.json()
		result = json.result
	} catch (error) {
		console.error(
			`[content-markdown] Failed to parse API response from: ${apiUrl}`,
			error
		)
		return new Response('Internal server error', { status: 502 })
	}

	// Build the markdown response with YAML frontmatter.
	// The frontmatter includes metadata that provides context an agent would
	// otherwise get from the HTML page (page title, description, which product
	// and version this applies to, and the canonical URL).
	const title = result.metadata?.page_title || result.metadata?.title || ''
	const description = result.metadata?.description || ''
	const canonicalUrl = `https://developer.hashicorp.com${pathname}`

	const frontmatter = [
		'---',
		`title: ${JSON.stringify(String(title))}`,
		description ? `description: ${JSON.stringify(String(description))}` : null,
		`product: ${JSON.stringify(urlProductSlug)}`,
		`version: ${JSON.stringify(result.version)}`,
		`source_url: ${JSON.stringify(canonicalUrl)}`,
		'---',
	]
		.filter(Boolean)
		.join('\n')

	const markdown = `${frontmatter}\n\n${result.markdownSource}`

	return new Response(markdown, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			// Vary: Accept ensures edge caches (Vercel CDN) maintain separate
			// cache entries for HTML vs markdown responses to the same URL.
			'Vary': 'Accept',
			// TODO: Determine appropriate Cache-Control headers for markdown
			// responses. HTML pages inherit caching from Next.js/Vercel defaults,
			// but this API route does not. Consider aligning with the HTML page
			// caching strategy.
		},
	})
}
