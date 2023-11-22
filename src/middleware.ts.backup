/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextResponse } from 'next/server'
import { type NextFetchEvent, type NextRequest, userAgent } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import variantRewrites from '.generated/tutorial-variant-map.json'
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import { HOSTNAME_MAP } from 'constants/hostname-map'
import { getEdgeFlags } from 'flags/edge'
import { getVariantParam } from 'views/tutorial-view/utils/variants'

function determineProductSlug(req: NextRequest): string {
	// .io preview on dev portal
	const proxiedSiteCookie = req.cookies.get('hc_dd_proxied_site')?.value
	const proxiedProduct = HOSTNAME_MAP[proxiedSiteCookie]

	if (proxiedProduct) {
		return proxiedProduct
	}

	// .io production deploy
	if (req.nextUrl.hostname in HOSTNAME_MAP) {
		return HOSTNAME_MAP[req.nextUrl.hostname]
	}

	// dev portal / deploy preview and local preview of io sites
	return '*'
}

function setHappyKitCookie(
	cookie: { args: Parameters<NextResponse['cookies']['set']> },
	response: NextResponse
): NextResponse {
	if (cookie) {
		response.cookies.set(...cookie.args)
	}
	return response
}

/**
 * Root-level middleware that will process all middleware-capable requests.
 * Currently used to support:
 * - Handling simple one-to-one redirects for .io routes
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const { geo } = req

	// 07/07/2023 — Simple UA check
	const { ua } = userAgent(req)
	const regexp = /(bytespider|bytedance)/i
	if (regexp.test(ua)) {
		return Response.json(null, { status: 404 })
	}
	// ----------------------

	let response: NextResponse

	// Handle redirects
	const product = determineProductSlug(req)

	if (process.env.DEBUG_REDIRECTS) {
		console.log(`[DEBUG_REDIRECTS] determined product to be: ${product}`)
	}
	if (redirects[product] && req.nextUrl.pathname in redirects[product]) {
		const { destination, permanent } = redirects[product][req.nextUrl.pathname]
		if (process.env.DEBUG_REDIRECTS) {
			console.log(
				`[DEBUG_REDIRECTS] redirecting ${req.nextUrl.pathname} to ${destination}`
			)
		}
		if (destination.startsWith('http')) {
			return NextResponse.redirect(destination, permanent ? 308 : 307)
		}

		// Next.js doesn't support redirecting to a pathname, so we clone the
		// request URL to adjust the pathname in an absolute URL
		const url = req.nextUrl.clone()

		// Simple redirects _can_ contain a hash, which we need to detect and handle
		const [pathname, hash] = destination.split('#')
		url.pathname = pathname
		if (hash) {
			url.hash = hash
		}

		return NextResponse.redirect(url, permanent ? 308 : 307)
	}

	/**
	 * We are running A/B tests on a subset of routes, so we are limiting the call to resolve flags from HappyKit to only those routes. This limits the impact of any additional latency to the routes which need the data.
	 */
	// if (
	// 	geo?.country === 'US' &&
	// 	['vault', 'consul'].includes(product) &&
	// 	['/'].includes(req.nextUrl.pathname)
	// ) {
	// 	try {
	// 		const edgeFlags = await getEdgeFlags({ request: req })
	// 		const { flags, cookie } = edgeFlags
	// 	} catch {
	// 		// Fallback to default URLs
	// 	}
	// }

	// Check if this path is associated with a tutorial variant
	if (variantRewrites[req.nextUrl.pathname]) {
		// check for query param first
		const url = req.nextUrl.clone()
		const tutorialVariant = variantRewrites[req.nextUrl.pathname]

		if (req.nextUrl.searchParams.has('variants')) {
			/**
			 * Detect the variants query param and rewrite to the correct path.
			 * Note: We only support one variant, this is handled in tutorial-view/server
			 *
			 * Request path: /{product}/tutorials/{collection}/{tutorial}?variants={slug:optionSlug}
			 * Rendered path: /{product}/tutorials/{collection}/{tutorial}/{variant}
			 */
			const variantParam = url.searchParams.get('variants')
			const isValidVariantOption = tutorialVariant.options.find(
				(option: string) => variantParam.endsWith(option)
			)

			if (isValidVariantOption) {
				url.searchParams.delete('variants')
				url.pathname = `${url.pathname}/${variantParam}`
			}
		} else if (req.cookies.has('variants')) {
			/**
			 * Otherwise, check for the 'variants' cookie, validate that the path
			 * has an active cookie for the associated variant / option. If so, rewrite
			 * to the variant url.
			 *
			 * Request path: /{product}/tutorials/{collection}/{tutorial}
			 * Rendered path: /{product}/tutorials/{collection}/{tutorial}/{variant}
			 * */
			let variantOptionValue

			try {
				const cookie = req.cookies.get('variants')
				// all variant cookie options are stored in a single object
				const allVariantsCookie = JSON.parse(cookie.value)
				// grab the specific variant slug from the cookie object
				variantOptionValue = allVariantsCookie[tutorialVariant.slug]
			} catch (e) {
				console.log('[middleware] Variant cookie could not be parsed.', e)
			}

			// If the cookie is set with a non-default variant option preference, rewrite
			if (
				variantOptionValue &&
				variantOptionValue !== tutorialVariant.defaultOption
			) {
				url.pathname = `${url.pathname}/${getVariantParam(
					tutorialVariant.slug,
					variantOptionValue
				)}`
			}
		}

		response = NextResponse.rewrite(url)
	}

	if (!response) {
		response = NextResponse.next()
	}

	// Continue request processing
	return setGeoCookie(req, response)
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - /api/ (API routes)
		 * - static (static files)
		 * - _next/ (Next.js files: this is expected to be 'static|image|data')
		 * - img (image assets)
		 * - favicon.ico (favicon file)
		 * - icon (hashicorp logo)
		 */
		'/((?!api\\/|static|_next\\/|img|favicon.ico|icon).*)',
	],
}
