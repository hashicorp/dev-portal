import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import { OptInPlatformOption } from 'components/opt-in-out/types'
import { HOSTNAME_MAP } from 'constants/hostname-map'

const OPT_IN_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

function determineProductSlug(req: NextRequest): string {
	// .io preview on dev portal
	if (req.cookies.io_preview) {
		return req.cookies.io_preview
	}

	// .io production deploy
	if (req.nextUrl.hostname in HOSTNAME_MAP) {
		return HOSTNAME_MAP[req.nextUrl.hostname]
	}

	// dev portal / deploy preview and local preview of io sites
	return '*'
}

/**
 * Root-level middleware that will process all middleware-capable requests.
 * Currently used to support:
 * - Handling simple one-to-one redirects for .io routes
 * - Handling the opt in for cookie setting
 */
export function middleware(req: NextRequest, ev: NextFetchEvent) {
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
		url.pathname = destination
		return NextResponse.redirect(url, permanent ? 308 : 307)
	}

	const params = req.nextUrl.searchParams

	/**
	 * If we're serving a beta product's io site and the betaOptOut query param exists,
	 * clear it and redirect back to the current URL without the betaOptOut query param
	 */
	if (
		__config.dev_dot.beta_product_slugs.includes(product) &&
		params.get('betaOptOut') === 'true'
	) {
		const url = req.nextUrl.clone()
		url.searchParams.delete('betaOptOut')
		return NextResponse.redirect(url).clearCookie(`${product}-io-beta-opt-in`)
	}

	// Handle Opt-in cookies
	const optInPlatform = params.get('optInFrom') as OptInPlatformOption
	const hasOptedIn = Boolean(req.cookies[`${optInPlatform}-beta-opt-in`])
	const response = NextResponse.next()

	if (optInPlatform && !hasOptedIn) {
		response.cookie(`${optInPlatform}-beta-opt-in`, 'true', {
			// Next.js pre 12.2 assumes maxAge is in ms, not seconds
			// TODO: update this when we upgrade to 12.2
			maxAge: OPT_IN_MAX_AGE * 1000,
		})
	}

	// Continue request processing
	return response
}
