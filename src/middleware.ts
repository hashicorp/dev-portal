import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import optInRedirectChecks from '.generated/opt-in-redirect-checks'
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import { OptInPlatformOption } from 'components/opt-in-out/types'
import { HOSTNAME_MAP } from 'constants/hostname-map'
import { getEdgeFlags } from 'flags/edge'
import { deleteCookie } from 'lib/middleware-delete-cookie'

const OPT_IN_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

function determineProductSlug(req: NextRequest): string {
	// .io preview on dev portal
	const proxiedSiteCookie = req.cookies.get('hc_dd_proxied_site')
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
	cookie: Parameters<NextResponse['cookies']['set']>,
	response: NextResponse
): NextResponse {
	response.cookies.set(...cookie)
	return response
}

/**
 * Root-level middleware that will process all middleware-capable requests.
 * Currently used to support:
 * - Handling simple one-to-one redirects for .io routes
 * - Handling the opt in for cookie setting
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
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
		url.pathname = destination
		console.timeEnd(label)
		return NextResponse.redirect(url, permanent ? 308 : 307)
	}

	const params = req.nextUrl.searchParams

	/**
	 * If we're serving a beta product's io site and the betaOptOut query param exists,
	 * clear it and redirect back to the current URL without the betaOptOut query param
	 */
	if (params.get('betaOptOut') === 'true') {
		const url = req.nextUrl.clone()
		url.searchParams.delete('betaOptOut')

		const response = NextResponse.redirect(url)

		deleteCookie(req, response, `${product}-io-beta-opt-in`)

		console.timeEnd(label)
		return response
	}

	/**
	 * Handle opt-in redirects if the cookie is present and we're serving a specific product site
	 */
	const hasProductOptInCookie =
		product !== '*' && Boolean(req.cookies.get(`${product}-io-beta-opt-in`))

	const isBetaProduct =
		product !== '*' && __config.dev_dot.beta_product_slugs.includes(product)

	/**
	 * If the product is not a beta product, treat it as GA and apply the redirect without the cookie condition, in production only.
	 */
	const shouldApplyGARedirect =
		!isBetaProduct && process.env.HASHI_ENV === 'production'

	if (hasProductOptInCookie || shouldApplyGARedirect) {
		const url = req.nextUrl.clone()

		if (optInRedirectChecks[product]?.test(url.pathname)) {
			const redirectUrl = new URL(__config.dev_dot.canonical_base_url)
			redirectUrl.pathname = `${product}${url.pathname}`
			redirectUrl.search = url.search

			// The GA redirects should be permanent, so we explicitly set a 308 status if this is the case
			const redirectStatus = shouldApplyGARedirect ? 308 : 307

			const response = NextResponse.redirect(redirectUrl, redirectStatus)

			console.timeEnd(label)
			return response
		}
	}

	/**
	 * We are running A/B tests on a subset of routes, so we are limiting the call to resolve flags from HappyKit to only those routes. This limits the impact of any additional latency to the routes which need the data.
	 */
	if (
		['vault', 'packer', 'consul'].includes(product) &&
		['/'].includes(req.nextUrl.pathname)
	) {
		try {
			const edgeFlags = await getEdgeFlags({ request: req })
			const { flags, cookie } = edgeFlags
			if (
				product === 'vault' &&
				req.nextUrl.pathname === '/' &&
				flags?.ioHomeHeroCtas
			) {
				const url = req.nextUrl.clone()
				url.pathname = '/_proxied-dot-io/vault/without-cta-links'
				response = setHappyKitCookie(cookie.args, NextResponse.rewrite(url))
			}

			if (
				product === 'packer' &&
				req.nextUrl.pathname === '/' &&
				flags?.ioHomeHeroCtas
			) {
				const url = req.nextUrl.clone()
				url.pathname = '/_proxied-dot-io/packer/without-cta-links'
				response = setHappyKitCookie(cookie.args, NextResponse.rewrite(url))
			}

			if (
				product === 'consul' &&
				req.nextUrl.pathname === '/' &&
				flags?.ioHomeHeroCtas
			) {
				const url = req.nextUrl.clone()
				url.pathname = '/_proxied-dot-io/consul/without-cta-links'
				response = setHappyKitCookie(cookie.args, NextResponse.rewrite(url))
			}
		} catch {
			// Fallback to default URLs
		}
	}

	// Handle Opt-in cookies
	let optInPlatform = params.get('optInFrom') as OptInPlatformOption

	// This handles a bug when we rolled out terraform to the beta where opt-out wasn't working, so users have no way to opt-out if they previously opted-in and attempted to opt-out before the bug was fixed.
	let isFromTerraform = false
	try {
		const refererUrl = new URL(req.headers.get('referer'))
		isFromTerraform = refererUrl.hostname.endsWith('terraform.io')

		if (isFromTerraform) {
			optInPlatform = 'terraform-io'
		}
	} catch {
		// Unable to determine the referer, do nothing
	}

	if (!response) {
		response = NextResponse.next()
	}

	const hasOptedIn = Boolean(req.cookies.get(`${optInPlatform}-beta-opt-in`))

	if (optInPlatform && !hasOptedIn) {
		response.cookies.set(`${optInPlatform}-beta-opt-in`, 'true', {
			maxAge: OPT_IN_MAX_AGE,
		})
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
