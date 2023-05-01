/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import { HOSTNAME_MAP } from 'constants/hostname-map'
import { getEdgeFlags } from 'flags/edge'
import optInRedirectChecks from '.generated/opt-in-redirect-checks'

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

	const label = `[middleware] ${req.nextUrl.pathname}`
	console.time(label)

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
			console.timeEnd(label)
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

		console.timeEnd(label)
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

			console.timeEnd(label)
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
	 * Detect a variant query param and rewrite to the correct path. This would ultimately be driven by detecting a tutorial route
	 * and the existence of a pre-defined variant key. For demonstration, this is hard-coded to checking for ?variant=
	 */
	if (
		req.nextUrl.pathname == '/variants' &&
		req.nextUrl.searchParams.has('variant')
	) {
		const url = req.nextUrl.clone()
		const variant = url.searchParams.get('variant')

		url.searchParams.delete('variant')
		url.pathname = `${url.pathname}/${variant}`

		response = NextResponse.rewrite(url)
	}

	if (!response) {
		response = NextResponse.next()
	}

	console.timeEnd(label)

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
