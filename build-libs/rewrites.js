//@ts-check

const proxySettings = require('./proxy-settings')
const { getProxiedProductSlug, isPreview } = require('../src/lib/env-checks')

/** @typedef { import("next/dist/lib/load-custom-routes").Redirect } Redirect  */

const PROXIED_PRODUCT = getProxiedProductSlug()

/**
 * # Some notes on rewrites
 *
 * ## Why this approach works
 *
 * ### "beforeFiles"
 *
 * We run our rewrites "beforeFile". This makes it so
 * NextJS does the rewrite even if it has a page file to serve.
 * We do this because we have conflicting pages, such as:
 * - "/" (should show eg /_proxied-dot-io/waypoint/, even though there may be a dev-portal landing page defined at this route)
 * - "/security" (should show eg /proxied-dot-io/waypoint/security, even though there may be a dev-portal security page defined at this route)
 *
 * ref: https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * ## Explicit rewrites
 *
 * We current have explicit rewrites for all
 * proxied dot-io pages.
 *
 * The reason for this is that regex approaches seemed
 * to consistently cause problems. Specifically:
 *
 * - Using "/:path*" without "beforeFiles"
 *   (ie default "afterFiles") means we don't
 *   resolve the conflicts mentioned above,
 *   in the "beforeFiles" section, as expected.
 *
 * - Using "/:path*" or "/:path+" with "beforeFiles"
 *   end up rewriting all `/_next/` assets.
 *   This breaks the page.
 *
 */
const productsToProxy = Object.keys(proxySettings)
/** @type {Redirect[]} */
const dotIoRewrites = productsToProxy.reduce((acc, slug) => {
	const routesToProxy = proxySettings[slug].routesToProxy
	// If we're trying to test this product in dev,
	// then we'll apply the rewrites without a host condition
	const proxyRewrites = routesToProxy.map(({ proxiedRoute, localRoute }) => {
		const rewrite = {
			source: proxiedRoute,
			destination: localRoute,
		}
		if (slug !== PROXIED_PRODUCT) {
			rewrite.has = [
				{
					type: 'host',
					value: proxySettings[slug].host,
				},
			]
		}

		// To enable previewing of .io sites, we accept an hc_dd_proxied_site cookie which must have a value matching a product slug
		if (isPreview()) {
			rewrite.has = [
				{
					type: 'cookie',
					key: 'hc_dd_proxied_site',
					value: proxySettings[slug].host,
				},
			]
		}

		return rewrite
	})
	return acc.concat(proxyRewrites)
}, [])

async function rewritesConfig() {
	return {
		beforeFiles: [...dotIoRewrites],
	}
}

module.exports = rewritesConfig
