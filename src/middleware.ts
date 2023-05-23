/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import variantRewrites from 'data/_variant-rewrites.generated.json'
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import { HOSTNAME_MAP } from 'constants/hostname-map'
import { getEdgeFlags } from 'flags/edge'
import optInRedirectChecks from '.generated/opt-in-redirect-checks'
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
	 * DO NOT REMOVE THIS BLOCK
	 *
	 * Redirect product site docs paths to the relevant developer paths in production.
	 */
	if (process.env.HASHI_ENV === 'production') {
		const url = req.nextUrl.clone()

		if (optInRedirectChecks[product]?.test(url.pathname)) {
			const redirectUrl = new URL(__config.dev_dot.canonical_base_url)
			redirectUrl.pathname = `${product}${url.pathname}`
			redirectUrl.search = url.search

			// The GA redirects should be permanent
			const response = NextResponse.redirect(redirectUrl, 308)

			return response
		}
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

	/**
	 * Detect the variants query param and rewrite to the correct path.
	 *
	 * Request path: /{product}/tutorials/{collection}/{tutorial}?variants={slug:optionSlug}
	 * Rendered path: /{product}/tutorials/{collection}/{tutorial}/{variant}
	 *
	 *
	 * Check for the `variants` cookie
	 * Check if the current tutorial path is on the variant rewrites sheet
	 * If so, check for the variant object
	 * If present, redirect to the option
	 */

	// potentially check for the variantRewrites[req.nextUrl.pathname] instead of just includes /tutorials
	if (
		req.nextUrl.pathname.includes('/tutorials') &&
		req.nextUrl.searchParams.has('variants')
	) {
		const url = req.nextUrl.clone()
		// We only support one variant per tutorial now, in the future this will support an array of variant options
		const variant = url.searchParams.get('variants')

		url.searchParams.delete('variants')
		// rewrite to the static route
		url.pathname = `${url.pathname}/${variant}`
		response = NextResponse.rewrite(url)
	}

	// Check for the `variants` cookie
	//  * Check if the current tutorial path is on the variant rewrites sheet
	//  * If so, check for the variant object
	//  * If present, redirect to the option

	// if the pathname includes tutorials,
	// the path is included in variants data as having a variant
	// the cookie exists and has the associated value

	if (req.cookies.get('variants') && variantRewrites[req.nextUrl.pathname]) {
		const url = req.nextUrl.clone()
		const tutorialVariant = variantRewrites[req.nextUrl.pathname]
		let variantOption

		try {
			const cookie = req.cookies.get('variants')
			const allVariantsCookie = JSON.parse(cookie.value)
			variantOption = allVariantsCookie[tutorialVariant.slug]
		} catch (e) {
			console.log(e)
		}

		// rewrite to the static route
		url.pathname = `${url.pathname}/${getVariantParam(
			tutorialVariant.slug,
			variantOption
		)}`
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
