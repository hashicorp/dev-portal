import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import redirects from 'data/_redirects.generated.json'
import setGeoCookie from '@hashicorp/platform-edge-utils/lib/set-geo-cookie'
import { OptInPlatformOption } from 'components/opt-in-out/types'
import { HOSTNAME_MAP } from 'constants/hostname-map'
import { getEdgeFlags } from 'flags/edge'
import { deleteCookie } from 'lib/middleware-delete-cookie'

const OPT_IN_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

function determineProductSlug(req: NextRequest): string {
	if (process.env.DEV_IO) {
		return process.env.DEV_IO
	}

	// .io preview on dev portal
	const ioPreviewCookie = req.cookies.get('io_preview')
	if (ioPreviewCookie) {
		return ioPreviewCookie
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

function setBetaOptInCookie(
	optInPlatform: OptInPlatformOption | null,
	hasOptedIn: boolean,
	response: NextResponse
): NextResponse {
	if (optInPlatform && !hasOptedIn) {
		response.cookies.set(`${optInPlatform}-beta-opt-in`, 'true', {
			maxAge: OPT_IN_MAX_AGE,
		})
	}

	return response
}

/**
 * Root-level middleware that will process all middleware-capable requests.
 * Currently used to support:
 * - Handling simple one-to-one redirects for .io routes
 * - Handling the opt in for cookie setting
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	let response: NextResponse
	const edgeFlags = await getEdgeFlags({ request: req })
	const { flags, cookie } = edgeFlags

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

		const response = NextResponse.redirect(url)

		deleteCookie(req, response, `${product}-io-beta-opt-in`)

		return response
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

	const hasOptedIn = Boolean(req.cookies[`${optInPlatform}-beta-opt-in`])

	if (product === 'vault' && req.nextUrl.pathname === '/' && flags?.testFlag) {
		const url = req.nextUrl.clone()
		url.pathname = '/_proxied-dot-io/vault/home-test'
		response = NextResponse.rewrite(url)
	}

	// Continue request processing
	return setBetaOptInCookie(
		optInPlatform,
		hasOptedIn,
		setHappyKitCookie(cookie.args, setGeoCookie(req, response))
	)
}
